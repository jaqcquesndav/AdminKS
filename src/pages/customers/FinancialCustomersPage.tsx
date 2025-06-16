import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight, Landmark } from 'lucide-react';
import { FinancialCustomerFormModal } from '../../components/customers/FinancialCustomerFormModal';
import { useToastContext } from '../../contexts/ToastContext';
import { customersApi } from '../../services/customers/customersApiService';
import type { Customer, CustomerStatus, CustomerFilterParams, CustomerFormData } from '../../types/customer';
import { ConnectionError, BackendError } from '../../components/common/ConnectionError';
import { isNetworkError, isServerError } from '../../utils/errorUtils';

export function FinancialCustomersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: CustomerFilterParams = {
        type: 'financial',
        page,
        limit: 10,
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (filterStatus !== 'all') {
        params.status = filterStatus as CustomerStatus;
      }
      
      const response = await customersApi.getFinancialCustomers(params); 
      setCustomers(response.customers);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error(t('customers.errors.loadFailed'), err);
      showToast('error', t('customers.financial.errors.loadFailed', 'Échec du chargement des institutions financières. Veuillez réessayer.'));
      setError(err as Error);
      setCustomers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [showToast, page, filterStatus, searchQuery, t]);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCustomers();
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchQuery, fetchCustomers]);

  useEffect(() => {
    fetchCustomers();
  }, [page, filterStatus, fetchCustomers]);

  const initialFinancialCustomerData: CustomerFormData = {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    billingContactName: '',
    billingContactEmail: '',
    tokenAllocation: 0,
    accountType: 'freemium',
    type: 'financial',
    status: 'pending',
  };

  const handleCreateCustomer = async (data: CustomerFormData) => {
    try {
      const newCustomerData: CustomerFormData = {
        ...data,
        type: 'financial',
      };
      
      await customersApi.create(newCustomerData); 
      showToast('success', t('customers.notifications.created', 'Client créé avec succès.'));
      setShowModal(false);
      fetchCustomers(); 
    } catch (error) {
      console.error('Error creating customer:', error);
      showToast('error', t('customers.errors.createFailed', 'Échec de la création du client. Veuillez réessayer.'));
    }
  };

  const handleViewCustomer = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const handleDeleteCustomer = async (id: string) => {
    if (window.confirm(t('customers.confirmDelete', 'Êtes-vous sûr de vouloir supprimer ce client ?'))) {
        try {
          await customersApi.delete(id);
          showToast('success', t('customers.notifications.deleted', 'Client supprimé avec succès.'));
          fetchCustomers();
        } catch (error) {
          console.error('Error deleting customer:', error);
          showToast('error', t('customers.errors.deleteFailed', 'Échec de la suppression du client. Veuillez réessayer.'));
        }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('customers.financial.title', 'Institutions Financières')}</h1>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-md flex items-center hover:bg-primary-dark"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('customers.addCustomer', 'Ajouter un client')}
        </button>
      </div>

      {loading && !error && (
        <div className="p-6 flex justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">{t('common.loading', 'Chargement...')}</p>
          </div>
        </div>
      )}

      {error && isNetworkError(error) ? (
        <ConnectionError 
          message={t('customers.errors.networkError', 'Impossible de charger la liste des clients. Vérifiez votre connexion réseau.')}
          retry={fetchCustomers}
          className="mt-4"
        />
      ) : error && isServerError(error) ? (
        <BackendError
          message={t('customers.errors.serverError', 'Le serveur a rencontré une erreur lors du chargement des clients.')}
          retry={fetchCustomers}
          className="mt-4"
        />
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder={t('common.search', 'Rechercher...') as string}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <div className="relative inline-block text-left">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-400" />
                  <select
                    className="block w-full py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                  >
                    <option value="all">{t('common.allStatuses', 'Tous les statuts')}</option>
                    <option value="active">{t('customers.status.active', 'Actif')}</option>
                    <option value="pending">{t('customers.status.pending', 'En attente')}</option>
                    <option value="suspended">{t('customers.status.suspended', 'Suspendu')}</option>
                    <option value="inactive">{t('customers.status.inactive', 'Inactif')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {!loading && customers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Landmark className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-200">{t('customers.financial.noCustomersFound', 'Aucune institution financière trouvée')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('customers.financial.getStarted', 'Commencez par ajouter une nouvelle institution financière.')}</p>
              <div className="mt-6">
                <button
                  onClick={() => setShowModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  {t('customers.addFinancialInstitution', 'Ajouter une institution financière')}
                </button>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('customers.table.name', 'Nom')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('customers.table.status', 'Statut')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('customers.table.email', 'Email')}</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('customers.table.phone', 'Téléphone')}</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">{t('common.actions', 'Actions')}</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.status)}`}>
                        {t(`customers.status.${customer.status}`, customer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customer.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-4">
                        <button onClick={() => handleViewCustomer(customer.id!)} className="text-primary hover:text-primary-dark"><Eye className="h-5 w-5" /></button>
                        <button onClick={() => { /* Edit logic here */ }} className="text-gray-400 hover:text-gray-600"><Edit className="h-5 w-5" /></button>
                        <button onClick={() => handleDeleteCustomer(customer.id!)} className="text-red-600 hover:text-red-800"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading && customers.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Précédent</button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">Suivant</button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Page <span className="font-medium">{page}</span> sur <span className="font-medium">{totalPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Précédent</span>
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Suivant</span>
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <FinancialCustomerFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateCustomer}
          initialData={initialFinancialCustomerData}
        />
      )}
    </div>
  );
}
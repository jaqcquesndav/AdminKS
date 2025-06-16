import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { CustomerFormModal } from '../../components/customers/CustomerFormModal';
import { useToastContext } from '../../contexts/ToastContext';
import { customersApi } from '../../services/customers/customersApiService';
import type { Customer, CustomerStatus, CustomerFilterParams, CustomerFormData } from '../../types/customer';
import { ConnectionError, BackendError } from '../../components/common/ConnectionError';
import { isNetworkError, isServerError } from '../../utils/errorUtils';

export function PmeCustomersPage() {
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
        type: 'pme',
        page,
        limit: 10
      };
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      if (filterStatus !== 'all') {
        params.status = filterStatus as CustomerStatus;
      }
      
      const response = await customersApi.getCorporateCustomers(params);
      setCustomers(response.customers);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error(t('customers.errors.loadFailed'), error);
      showToast('error', t('customers.pme.errors.loadFailed', 'Échec du chargement des clients PME. Veuillez réessayer.'));
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }, [showToast, page, filterStatus, searchQuery, t]);
  
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);
  
  // Debounce pour la recherche
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchCustomers();
    }, 500);
    
    return () => clearTimeout(handler);
  }, [searchQuery, fetchCustomers]);

  const handleCreateCustomer = async (customerData: CustomerFormData) => {
    try {
      await customersApi.create(customerData);
      showToast('success', t('customers.notifications.created', 'Client créé avec succès'));
      fetchCustomers(); // Rafraîchir la liste après création
      setShowModal(false);
    } catch (error) {
      console.error(t('customers.errors.createFailed'), error);
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
        setCustomers(prev => prev.filter(customer => customer.id !== id));
        showToast('success', t('customers.notifications.deleted', 'Client supprimé avec succès'));
      } catch (error) {
        console.error(t('customers.errors.deleteFailed'), error);
        showToast('error', t('customers.errors.deleteFailed', 'Échec de la suppression du client. Veuillez réessayer.'));
      }
    }
  };

  const filteredCustomers = customers
    .filter(customer => customer.type === 'pme')
    .filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .filter(customer => filterStatus === 'all' ? true : customer.status === filterStatus);

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

  const initialPmeCustomerData: CustomerFormData = {
    name: '',
    type: 'pme',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'RDC',
    status: 'pending',
    billingContactName: '',
    billingContactEmail: '',
    tokenAllocation: 0,
    accountType: 'standard',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('customers.pme.title', 'Clients PME')}</h1>
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
          message={t('customers.errors.networkError', 'Impossible de charger la liste des clients PME. Vérifiez votre connexion réseau.')}
          retry={fetchCustomers}
          className="mt-4"
        />
      ) : error && isServerError(error) ? (
        <BackendError
          message={t('customers.errors.serverError', 'Le serveur a rencontré une erreur lors du chargement des clients PME.')}
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
                    onChange={(e) => setFilterStatus(e.target.value)}
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

          {!loading && filteredCustomers.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">{t('customers.pme.noCustomersFound', 'Aucun client PME trouvé')}</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-md inline-flex items-center hover:bg-primary-dark"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('customers.addCustomer', 'Ajouter un client')}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gamma-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('customers.columns.name', 'Nom')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('customers.columns.email', 'Email')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('customers.columns.location', 'Localisation')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('customers.columns.status', 'Statut')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('customers.columns.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {customer.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {customer.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {customer.city ? `${customer.city}, ${customer.country}` : customer.country}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                          {t(`customers.status.${customer.status}`, customer.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => handleViewCustomer(customer.id!)}
                            className="text-blue-600 hover:text-blue-800"
                            title={t('customers.actions.view', 'Voir') as string}
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              // Dans une vraie application, vous implémenteriez l'édition ici
                              showToast('info', t('customers.actions.editNotImplemented', 'Fonctionnalité d\'édition à implémenter'));
                            }}
                            className="text-yellow-600 hover:text-yellow-800"
                            title={t('customers.actions.edit', 'Modifier') as string}
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(customer.id!)}
                            className="text-red-600 hover:text-red-800"
                            title={t('customers.actions.delete', 'Supprimer') as string}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {!loading && totalPages > 1 && (
            <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
                    ${page === 1 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  {t('common.previous', 'Précédent')}
                </button>
                <button
                  onClick={() => setPage(prev => prev < totalPages ? prev + 1 : prev)}
                  disabled={page >= totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md 
                    ${page >= totalPages 
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' 
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {t('common.next', 'Suivant')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {t('common.paginationShowing', 'Affichage de')} <span className="font-medium">{filteredCustomers.length}</span>{' '}
                    {t('common.results', 'résultats')}
                    {totalPages > 1 && (
                      <>
                        {' '}{t('common.page', 'Page')}{' '}
                        <span className="font-medium">{page}</span> {t('common.of', 'sur')}{' '}
                        <span className="font-medium">{totalPages}</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium 
                        ${page === 1 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <span className="sr-only">{t('common.previous', 'Précédent')}</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <button
                      onClick={() => setPage(prev => prev < totalPages ? prev + 1 : prev)}
                      disabled={page >= totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium 
                        ${page >= totalPages 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                      <span className="sr-only">{t('common.next', 'Suivant')}</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      )}      {showModal && (
        <CustomerFormModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateCustomer}
          initialData={initialPmeCustomerData}
        />
      )}
    </div>
  );
}

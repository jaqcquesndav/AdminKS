import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, Edit, Trash2, Eye, Landmark } from 'lucide-react';
import { CustomerFormModal } from '../../components/customers/CustomerFormModal';
import { useToastContext } from '../../contexts/ToastContext';
import { customersApi } from '../../services/customers/customersApiService';
import type { Customer, CustomerType, CustomerStatus, CustomerFilterParams } from '../../types/customer';

// Define a type for the form data that allows 'pme' and 'financial' types
interface ExtendedCustomerFormData extends Omit<Customer, 'type'> {
  type: CustomerType | 'pme' | 'financial';
}

export function FinancialCustomersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params: CustomerFilterParams = {
        type: 'financial',
        page,
        limit: 10
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
    } catch (error) {
      console.error('Erreur lors du chargement des institutions financières:', error);
      showToast('error', 'Erreur lors du chargement des institutions financières');
      
      // Fallback vers des données mockées en cas d'échec de l'API (pour le développement)
      const mockCustomers: Customer[] = [
        {
          id: 'fin-1',
          name: 'Banque Centrale du Congo',
          type: 'financial',
          email: 'contact@bcc.cd',
          phone: '+243 123 456 789',
          address: '263 Avenue Kasavubu',
          city: 'Kinshasa',
          country: 'RDC',
          status: 'active',
          billingContactName: 'Jean-Claude Masangu',
          billingContactEmail: 'jc.masangu@bcc.cd',
          tokenAllocation: 10000000,
          accountType: 'premium'
        },
        // ...autres institutions mockées...
      ];
      
      setCustomers(mockCustomers);
    } finally {
      setLoading(false);
    }
  }, [showToast, page, filterStatus, searchQuery]);
  
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

  const handleCreateCustomer = async (customer: ExtendedCustomerFormData) => {
    try {
      // Map extended form data to proper Customer type
      const customerData: Customer = {
        ...customer,
        type: customer.type === 'pme' ? 'financial' : customer.type as CustomerType
      };
      
      await customersApi.create(customerData);
      showToast('success', 'Institution financière créée avec succès');
      setShowModal(false);
      fetchCustomers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la création de l\'institution:', error);
      showToast('error', 'Erreur lors de la création de l\'institution financière');
    }
  };

  const handleViewCustomer = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customersApi.delete(id);
      showToast('success', 'Institution financière supprimée avec succès');
      fetchCustomers(); // Recharger la liste
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      showToast('error', 'Erreur lors de la suppression de l\'institution financière');
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
          {t('customers.addFinancial', 'Ajouter une institution')}
        </button>
      </div>

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
                  <option value="all">{t('customers.status.all', 'Tous les statuts')}</option>
                  <option value="active">{t('customers.status.active', 'Actif')}</option>
                  <option value="pending">{t('customers.status.pending', 'En attente')}</option>
                  <option value="suspended">{t('customers.status.suspended', 'Suspendu')}</option>
                  <option value="inactive">{t('customers.status.inactive', 'Inactif')}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="inline-block mx-auto animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-500">{t('common.loading', 'Chargement...')}</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">{t('customers.noFinancialFound', 'Aucune institution financière trouvée')}</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-md inline-flex items-center hover:bg-primary-dark"
            >
              <Plus className="mr-2 h-4 w-4" />
              {t('customers.addFinancial', 'Ajouter une institution')}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
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
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <Landmark className="h-5 w-5 text-blue-500 mr-2" />
                        {customer.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {customer.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {customer.city ? `${customer.city}, ${customer.country}` : customer.country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(customer.status)}`}>
                        {customer.status === 'active' ? 'Actif' :
                         customer.status === 'pending' ? 'En attente' :
                         customer.status === 'suspended' ? 'Suspendu' : 'Inactif'}
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
                            // Navigation vers la page d'édition
                            navigate(`/customers/${customer.id}/edit`);
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
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Page <span className="font-medium">{page}</span> sur{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create Customer Modal */}
      <CustomerFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateCustomer}
        title={t('customers.create.financial', 'Créer une institution financière')}
        customer={{
          name: '',
          type: 'financial', // Prédéfinir le type comme 'financial'
          email: '',
          phone: '',
          address: '',
          city: '',
          country: 'France',
          status: 'pending',
          billingContactName: '',
          billingContactEmail: '',
          tokenAllocation: 10000000, // Default for financial institutions
          accountType: 'freemium' as const // Start with freemium
        }}
      />
    </div>
  );
}
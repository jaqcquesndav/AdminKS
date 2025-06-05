import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlusCircle, Search, Filter, MoreHorizontal, Building, Users, Mail, Phone, CalendarClock, Check, X, AlertCircle } from 'lucide-react';
import { CustomerFormModal, CustomerFormData } from '../../components/customers/CustomerFormModal';
import { useToastContext } from '../../contexts/ToastContext';

// Types pour la liste des clients
interface CustomerListItem {
  id: string;
  name: string;
  type: 'pme' | 'financial';
  email: string;
  phone?: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  createdAt: string;
  usersCount: number;
}

export function CustomerListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [customers, setCustomers] = useState<CustomerListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    // Simuler un appel API pour récupérer la liste des clients
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Simule une requête API avec données mockées
        await new Promise(resolve => setTimeout(resolve, 800));
          const mockCustomers: CustomerListItem[] = [
          {
            id: '123',
            name: 'Wanzo Tech',
            type: 'pme',
            email: 'contact@wanzo.tech',
            phone: '+33 1 23 45 67 89',
            status: 'active',
            createdAt: '2023-01-15',
            usersCount: 12
          },
          {
            id: '456',
            name: 'Exoscode',
            type: 'pme',
            email: 'info@exoscode.com',
            phone: '+33 9 87 65 43 21',
            status: 'active',
            createdAt: '2023-02-22',
            usersCount: 5
          },
          {
            id: '789',
            name: 'Banque Centrale',
            type: 'financial',
            email: 'contact@banquecentrale.fr',
            phone: '+33 1 45 67 89 10',
            status: 'pending',
            createdAt: '2023-03-10',
            usersCount: 25
          },
          {
            id: '101',
            name: 'Startup Innovation',
            type: 'pme',
            email: 'hello@startup-innovation.com',
            status: 'inactive',
            createdAt: '2023-01-05',
            usersCount: 0
          },
          {
            id: '112',
            name: 'Crédit Mutuel',
            type: 'financial',
            email: 'entreprise@creditmutuel.fr',
            phone: '+33 3 88 12 34 56',
            status: 'suspended',
            createdAt: '2023-02-28',
            usersCount: 8
          }
        ];
        
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Erreur lors du chargement des clients:', error);
        showToast('error', 'Erreur lors du chargement des clients');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [showToast]);

  const handleAddCustomer = (data: CustomerFormData) => {
    // Simuler l'ajout d'un client
    const newCustomer: CustomerListItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      type: data.type,
      email: data.email,
      phone: data.phone,
      status: data.status,
      createdAt: new Date().toISOString().split('T')[0],
      usersCount: 0
    };
    
    setCustomers([newCustomer, ...customers]);
    setIsAddModalOpen(false);
    showToast('success', 'Client ajouté avec succès');
  };

  const filteredCustomers = customers.filter(customer => {
    // Filtre par terme de recherche
    const matchesSearch = 
      searchTerm === '' || 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par statut
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus;
    
    // Filtre par type
    const matchesType = filterType === 'all' || customer.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const statusBadgeClass = (status: string) => {
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

  const statusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Check className="w-3 h-3 mr-1" />;
      case 'pending':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'suspended':
        return <X className="w-3 h-3 mr-1" />;
      case 'inactive':
        return <X className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-6">        {/* Header with search and filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">{t('customers.title', 'Clients')}</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder={t('customers.search.placeholder', 'Rechercher un client...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
              />
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('customers.actions.add', 'Ajouter un client')}
            </button>
          </div>
        </div>        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center">
            <Filter className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{t('customers.filters.title', 'Filtres:')}</span>
          </div>
          
          <div className="space-x-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
            >
              <option value="all">{t('customers.filters.status.all', 'Tous les statuts')}</option>
              <option value="active">{t('customers.filters.status.active', 'Actif')}</option>
              <option value="pending">{t('customers.filters.status.pending', 'En attente')}</option>
              <option value="suspended">{t('customers.filters.status.suspended', 'Suspendu')}</option>
              <option value="inactive">{t('customers.filters.status.inactive', 'Inactif')}</option>
            </select>
            
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
            >
              <option value="all">{t('customers.filters.type.all', 'Tous les types')}</option>
              <option value="pme">{t('customers.filters.type.pme', 'PME')}</option>
              <option value="financial">{t('customers.filters.type.financial', 'Institution Financière')}</option>
            </select>
          </div>
        </div>

        {/* Customers table */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2" />
                        {t('customers.table.client', 'Client')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {t('customers.table.users', 'Utilisateurs')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        {t('customers.table.email', 'Email')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        {t('customers.table.phone', 'Téléphone')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      <div className="flex items-center">
                        <CalendarClock className="w-4 h-4 mr-2" />
                        {t('customers.table.createdAt', 'Date de création')}
                      </div>
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('customers.table.status', 'Statut')}
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">{t('customers.table.actions', 'Actions')}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredCustomers.map((customer) => (
                    <tr 
                      key={customer.id} 
                      className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => handleCustomerClick(customer.id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center">
                            <span className="font-medium text-gray-600 dark:text-gray-300">
                              {customer.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
                            <div className="text-sm text-gray-500">
                              {customer.type === 'pme' ? 'PME' : 'Institution Financière'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{customer.usersCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{customer.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{customer.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-gray-100">{customer.createdAt}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(customer.status)}`}>
                          {statusIcon(customer.status)}
                          {customer.status === 'active' ? 'Actif' :
                           customer.status === 'pending' ? 'En attente' :
                           customer.status === 'suspended' ? 'Suspendu' : 'Inactif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Menu d'actions (à implémenter)
                          }}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('customers.empty.title', 'Aucun client trouvé')}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || filterStatus !== 'all' || filterType !== 'all'
                  ? t('customers.empty.filtered', "Aucun client ne correspond à vos critères de recherche.")
                  : t('customers.empty.default', "Commencez par ajouter un nouveau client.")}
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t('customers.actions.add', 'Ajouter un client')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>      {/* Add Customer Modal */}
      {isAddModalOpen && (
        <CustomerFormModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddCustomer}
          title={t('customers.modal.add.title', 'Ajouter un client')}
        />
      )}
    </>
  );
}
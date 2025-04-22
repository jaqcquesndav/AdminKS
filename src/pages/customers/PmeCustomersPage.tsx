import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, Edit, Trash2, Eye } from 'lucide-react';
import { CustomerFormModal, CustomerFormData } from '../../components/customers/CustomerFormModal';
import { useToastContext } from '../../contexts/ToastContext';

export function PmeCustomersPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [customers, setCustomers] = useState<CustomerFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Simuler une requête API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Données mockées
        const mockCustomers: CustomerFormData[] = [
          {
            id: '123',
            name: 'Kiota Tech',
            type: 'pme',
            email: 'contact@kiota.tech',
            phone: '+33 1 23 45 67 89',
            address: '123 Rue de l\'Innovation',
            city: 'Paris',
            country: 'France',
            status: 'active',
            billingContactName: 'John Doe',
            billingContactEmail: 'billing@kiota.tech',
          },
          {
            id: '456',
            name: 'Exoscode',
            type: 'pme',
            email: 'info@exoscode.com',
            phone: '+33 9 87 65 43 21',
            address: '456 Avenue du Code',
            city: 'Lyon',
            country: 'France',
            status: 'active',
            billingContactName: 'Jane Smith',
            billingContactEmail: 'finance@exoscode.com',
          },
          {
            id: '789',
            name: 'TechSolutions',
            type: 'pme',
            email: 'contact@techsolutions.fr',
            phone: '+33 7 65 43 21 09',
            address: '789 Boulevard Technologique',
            city: 'Bordeaux',
            country: 'France',
            status: 'pending',
            billingContactName: 'Robert Johnson',
            billingContactEmail: 'accounts@techsolutions.fr',
          },
          {
            id: '101',
            name: 'DataCorp',
            type: 'pme',
            email: 'hello@datacorp.io',
            phone: '+33 6 12 34 56 78',
            address: '101 Rue des Données',
            city: 'Nantes',
            country: 'France',
            status: 'suspended',
            billingContactName: 'Alice Dupont',
            billingContactEmail: 'finance@datacorp.io',
          },
          {
            id: '202',
            name: 'InnovateSAS',
            type: 'pme',
            email: 'support@innovate.fr',
            phone: '+33 5 55 55 55 55',
            address: '202 Avenue de l\'Innovation',
            city: 'Toulouse',
            country: 'France',
            status: 'inactive',
            billingContactName: 'Marc Martin',
            billingContactEmail: 'billing@innovate.fr',
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

  const handleCreateCustomer = (customer: CustomerFormData) => {
    setCustomers(prev => [...prev, { ...customer, id: Date.now().toString() }]);
    setShowModal(false);
    showToast('success', 'Client PME créé avec succès');
  };

  const handleViewCustomer = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    showToast('success', 'Client supprimé avec succès');
  };

  const filteredCustomers = customers
    .filter(customer => customer.type === 'pme')
    .filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customer.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        ) : filteredCustomers.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-gray-500">{t('customers.noCustomersFound', 'Aucun client PME trouvé')}</p>
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
                            // Dans une vraie application, vous implémenteriez l'édition ici
                            showToast('info', 'Fonctionnalité d\'édition à implémenter');
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
      </div>

      {/* Create Customer Modal */}
      <CustomerFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreateCustomer}
        title={t('customers.create.title', 'Créer un client PME')}
      />
    </div>
  );
}
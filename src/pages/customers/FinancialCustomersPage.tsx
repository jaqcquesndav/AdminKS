import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Plus, Filter, Edit, Trash2, Eye, Landmark } from 'lucide-react';
import { CustomerFormModal, CustomerFormData } from '../../components/customers/CustomerFormModal';
import { useToastContext } from '../../contexts/ToastContext';

export function FinancialCustomersPage() {
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
        
        // Données mockées pour les institutions financières
        const mockCustomers: CustomerFormData[] = [
          {
            id: '201',
            name: 'Banque Nationale de Paris',
            type: 'financial',
            email: 'contact@bnp.fr',
            phone: '+33 1 40 14 45 46',
            address: '16 Boulevard des Italiens',
            city: 'Paris',
            country: 'France',
            status: 'active',
            billingContactName: 'Jean Dupont',
            billingContactEmail: 'j.dupont@bnp.fr',
          },
          {
            id: '202',
            name: 'Crédit Agricole',
            type: 'financial',
            email: 'contact@ca.fr',
            phone: '+33 1 43 23 52 02',
            address: '12 Place des États-Unis',
            city: 'Paris',
            country: 'France',
            status: 'active',
            billingContactName: 'Marie Laurent',
            billingContactEmail: 'marie.laurent@ca.fr',
          },
          {
            id: '203',
            name: 'Société Générale',
            type: 'financial',
            email: 'contact@societegenerale.fr',
            phone: '+33 1 42 14 20 00',
            address: '29 Boulevard Haussmann',
            city: 'Paris',
            country: 'France',
            status: 'active',
            billingContactName: 'Pierre Martin',
            billingContactEmail: 'p.martin@socgen.fr',
          },
          {
            id: '204',
            name: 'HSBC France',
            type: 'financial',
            email: 'info@hsbc.fr',
            phone: '+33 1 40 70 70 40',
            address: '103 Avenue des Champs-Élysées',
            city: 'Paris',
            country: 'France',
            status: 'suspended',
            billingContactName: 'Sophie Bernard',
            billingContactEmail: 'sophie.bernard@hsbc.fr',
          },
          {
            id: '205',
            name: 'Crédit Mutuel',
            type: 'financial',
            email: 'contact@creditmutuel.fr',
            phone: '+33 3 88 14 88 14',
            address: '4 Rue Frédéric-Guillaume Raiffeisen',
            city: 'Strasbourg',
            country: 'France',
            status: 'inactive',
            billingContactName: 'Thomas Petit',
            billingContactEmail: 'thomas.petit@cm.fr',
          }
        ];
        
        setCustomers(mockCustomers);
      } catch (error) {
        console.error('Erreur lors du chargement des institutions financières:', error);
        showToast('error', 'Erreur lors du chargement des institutions financières');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [showToast]);

  const handleCreateCustomer = (customer: CustomerFormData) => {
    setCustomers(prev => [...prev, { ...customer, id: Date.now().toString() }]);
    setShowModal(false);
    showToast('success', 'Institution financière créée avec succès');
  };

  const handleViewCustomer = (id: string) => {
    navigate(`/customers/${id}`);
  };

  const handleDeleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(customer => customer.id !== id));
    showToast('success', 'Institution financière supprimée avec succès');
  };

  const filteredCustomers = customers
    .filter(customer => customer.type === 'financial')
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
        ) : filteredCustomers.length === 0 ? (
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
                {filteredCustomers.map((customer) => (
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
        }}
      />
    </div>
  );
}
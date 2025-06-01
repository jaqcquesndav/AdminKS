import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, MoreHorizontal, AlertCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import type { SubscriptionPlanDefinition } from '../../types/subscription';

export function PlansConfigPage() {
  const { t } = useTranslation();
  const { availablePlans, loading: plansLoading, fetchAvailablePlans, customerType, setActiveCustomerType } = useSubscription({initialCustomerType: 'pme'});

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanDefinition | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  
  useEffect(() => {
    // fetchAvailablePlans(customerType); // Or rely on the hook's internal useEffect if it fetches on customerType change
  }, [customerType, fetchAvailablePlans]);


  const handleEditPlan = (plan: SubscriptionPlanDefinition) => {
    setCurrentPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleCreatePlan = () => {
    setCurrentPlan(null);
    setIsEditModalOpen(true);
  };

  const handleDeletePrompt = (id: string) => {
    setPlanToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePlan = () => {
    if (planToDelete) {
      // TODO: Implement actual delete logic via service
      console.log("Deleting plan:", planToDelete);
      // setPlans(plans.filter(p => p.id !== planToDelete)); // Update local state after successful deletion
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleSavePlan = (updatedPlan: SubscriptionPlanDefinition) => {
    // TODO: Implement actual save/create logic via service
    if (currentPlan) {
      console.log("Updating plan:", updatedPlan);
      // setPlans(plans.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
    } else {
      console.log("Creating plan:", { ...updatedPlan, id: `plan-${Date.now()}` });
      // setPlans([...plans, { ...updatedPlan, id: `plan-${Date.now()}` }]);
    }
    setIsEditModalOpen(false);
    // fetchAvailablePlans(customerType); // Refresh plans list
  };

  const filteredPlans = availablePlans.filter(plan => {
    const matchesTab = activeTab === 'active' ? !plan.isHidden : plan.isHidden;
    return matchesTab;
  });

  if (plansLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{t('configuration.plans.title', 'Plans & Tarifs')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t('configuration.plans.subtitle', 'Gérez les offres disponibles pour vos clients')}</p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={customerType || 'pme'} 
            onChange={(e) => setActiveCustomerType(e.target.value as 'pme' | 'financial')} 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="pme">PME Plans</option>
            <option value="financial">Financial Institution Plans</option>
          </select>
          <button 
            onClick={handleCreatePlan}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('configuration.plans.create', 'Créer un plan')}
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'active'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('configuration.plans.tabs.active', 'Plans Publics')}
              <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                {availablePlans.filter(plan => !plan.isHidden).length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-6 py-3 font-medium ${
                activeTab === 'draft'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {t('configuration.plans.tabs.draft', 'Brouillons (Cachés)')}
              <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                {availablePlans.filter(plan => plan.isHidden).length}
              </span>
            </button>
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.name', 'Nom du Plan')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.price', 'Prix (USD)')}
                </th>
                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.category', 'Catégorie')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.users', 'Utilisateurs Max')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.tokens', 'Tokens Alloués')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.customerTypes', 'Types Client Cibles')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.status', 'Statut Public')}
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.actions', 'Actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredPlans.map((plan) => (
                <tr key={plan.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.name}
                          {plan.isPromoted && (
                            <span className="ml-2 px-2 py-0.5 bg-primary bg-opacity-10 text-primary dark:text-primary-light rounded-full text-xs">
                              Populaire
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {plan.basePriceUSD} USD
                    </div>
                    {plan.localCurrency && plan.basePriceLocal !== undefined && (
                       <div className="text-sm text-gray-500 dark:text-gray-400">
                         ({plan.basePriceLocal} {plan.localCurrency})
                       </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {plan.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {plan.maxUsers === undefined || plan.maxUsers === null ? 'N/A' : plan.maxUsers === 0 ? 'Illimité' : `${plan.maxUsers} max.`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {`${plan.tokenAllocation.toLocaleString()}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {plan.targetCustomerTypes.join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {!plan.isHidden ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Public
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Caché (Brouillon)
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePrompt(plan.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="relative group">
                        <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 hidden group-hover:block">
                          <div className="py-1">
                            <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                              {!plan.isHidden ? 'Désactiver' : 'Activer'}
                            </button>
                            <button className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left">
                              Dupliquer
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
                      <h3 className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        Aucun plan {activeTab === 'active' ? 'public' : 'en brouillon'} trouvé pour le type de client '{customerType || "N/A"}'.
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mt-1">
                        {activeTab === 'active'
                          ? 'Créez un nouveau plan ou rendez public un brouillon existant.'
                          : 'Vos plans en cours de préparation apparaîtront ici.'}
                      </p>
                      {activeTab === 'draft' && (
                        <button 
                          onClick={handleCreatePlan}
                          className="mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Créer un plan
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {currentPlan ? 'Modifier le plan' : 'Créer un nouveau plan'}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {/* TODO: Implement a proper form for plan editing/creation */}
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                L'interface de modification/création de plan sera implémentée ici. 
                Pour l'instant, seules les valeurs de base sont utilisées pour la simulation.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    const planToSave: SubscriptionPlanDefinition = currentPlan || {
                      id: '', // Backend should generate ID for new plans
                      name: 'Nouveau Plan (Exemple)',
                      description: 'Description détaillée du nouveau plan.',
                      category: 'starter', // Default category
                      features: ['basic_support'], // Default features
                      targetCustomerTypes: [customerType || 'pme'],
                      basePriceUSD: 10, // Default price
                      tokenAllocation: 100000, // Default tokens
                      billingCycles: ['monthly'],
                      discountPercentage: { quarterly: 0, yearly: 0 },
                      customerTypeSpecific: [],
                      isCustomizablePlan: false,
                      isHidden: true, // New plans default to hidden/draft
                      maxUsers: 1, // Default max users
                    };
                    handleSavePlan(planToSave);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                >
                  {currentPlan ? 'Sauvegarder les modifications' : 'Créer le Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 mx-auto mb-4">
                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center mb-2">
                Confirmer la suppression
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                Êtes-vous sûr de vouloir supprimer le plan "{availablePlans.find(p => p.id === planToDelete)?.name || planToDelete}" ? Cette action est irréversible.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDeletePlan}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
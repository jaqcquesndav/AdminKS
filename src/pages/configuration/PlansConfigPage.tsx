import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, MoreHorizontal, AlertCircle } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  features: string[];
  maxUsers: number;
  tokensIncluded: number;
  isPopular: boolean;
  isPublic: boolean;
  isEnterprise: boolean;
  sortOrder: number;
}

export function PlansConfigPage() {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('active');
  
  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true);
      setTimeout(() => {
        setPlans([
          {
            id: 'starter',
            name: 'Starter',
            description: 'Idéal pour les petites équipes',
            monthlyPrice: 49,
            yearlyPrice: 490,
            currency: 'EUR',
            features: [
              'Jusqu\'à 5 utilisateurs',
              '5 000 tokens par mois',
              'Support par email',
              'Fonctionnalités de base'
            ],
            maxUsers: 5,
            tokensIncluded: 5000,
            isPopular: false,
            isPublic: true,
            isEnterprise: false,
            sortOrder: 1
          },
          {
            id: 'business',
            name: 'Business',
            description: 'Pour les entreprises en croissance',
            monthlyPrice: 99,
            yearlyPrice: 990,
            currency: 'EUR',
            features: [
              'Jusqu\'à 15 utilisateurs',
              '20 000 tokens par mois',
              'Support prioritaire',
              'Toutes les fonctionnalités avancées'
            ],
            maxUsers: 15,
            tokensIncluded: 20000,
            isPopular: true,
            isPublic: true,
            isEnterprise: false,
            sortOrder: 2
          },
          {
            id: 'premium',
            name: 'Premium',
            description: 'Solutions avancées',
            monthlyPrice: 299,
            yearlyPrice: 2990,
            currency: 'EUR',
            features: [
              'Jusqu\'à 50 utilisateurs',
              '100 000 tokens par mois',
              'Support dédié',
              'Intégrations avancées',
              'Analytics personnalisés'
            ],
            maxUsers: 50,
            tokensIncluded: 100000,
            isPopular: false,
            isPublic: true,
            isEnterprise: false,
            sortOrder: 3
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            description: 'Solutions sur mesure',
            monthlyPrice: 0,
            yearlyPrice: 0,
            currency: 'EUR',
            features: [
              'Utilisateurs illimités',
              'Tokens personnalisés',
              'Gestionnaire de compte',
              'Infrastructure dédiée',
              'SLA personnalisé'
            ],
            maxUsers: 999,
            tokensIncluded: 500000,
            isPopular: false,
            isPublic: true,
            isEnterprise: true,
            sortOrder: 4
          }
        ]);
        setLoading(false);
      }, 800);
    };
    
    loadPlans();
  }, []);

  const handleEditPlan = (plan: PricingPlan) => {
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
      setPlans(plans.filter(p => p.id !== planToDelete));
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleSavePlan = (updatedPlan: PricingPlan) => {
    if (currentPlan) {
      setPlans(plans.map(p => (p.id === updatedPlan.id ? updatedPlan : p)));
    } else {
      setPlans([...plans, { ...updatedPlan, id: `plan-${Date.now()}` }]);
    }
    setIsEditModalOpen(false);
  };

  const filteredPlans = activeTab === 'active' 
    ? plans.filter(plan => plan.isPublic) 
    : plans.filter(plan => !plan.isPublic);

  if (loading) {
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
        <button 
          onClick={handleCreatePlan}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('configuration.plans.create', 'Créer un plan')}
        </button>
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
              {t('configuration.plans.tabs.active', 'Plans actifs')}
              <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                {plans.filter(plan => plan.isPublic).length}
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
              {t('configuration.plans.tabs.draft', 'Brouillons')}
              <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs">
                {plans.filter(plan => !plan.isPublic).length}
              </span>
            </button>
          </nav>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.name', 'Nom')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.price', 'Prix')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.users', 'Utilisateurs')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.tokens', 'Tokens')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  {t('configuration.plans.table.status', 'Statut')}
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
                          {plan.isPopular && (
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
                    {plan.isEnterprise ? (
                      <span className="text-sm text-gray-900 dark:text-white">Sur devis</span>
                    ) : (
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {plan.monthlyPrice} {plan.currency}/mois
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {plan.yearlyPrice} {plan.currency}/an
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {plan.maxUsers === 999 ? 'Illimité' : `${plan.maxUsers} max.`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {plan.isEnterprise ? 'Personnalisé' : `${plan.tokensIncluded.toLocaleString()}/mois`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {plan.isPublic ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Actif
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                        Brouillon
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
                              {plan.isPublic ? 'Désactiver' : 'Activer'}
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
                  <td colSpan={6} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
                      <h3 className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        Aucun plan {activeTab === 'active' ? 'actif' : 'en brouillon'} trouvé
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mt-1">
                        {activeTab === 'active'
                          ? 'Créez un nouveau plan ou activez un brouillon existant.'
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
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
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Cette interface de modification de plan sera implémentée dans une prochaine version.
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
                    // Simulating saving a plan with minimal data
                    const dummyPlan: PricingPlan = currentPlan || {
                      id: '',
                      name: 'Nouveau Plan',
                      description: 'Description du plan',
                      monthlyPrice: 0,
                      yearlyPrice: 0,
                      currency: 'USD',
                      features: [],
                      maxUsers: 0,
                      tokensIncluded: 0,
                      isPopular: false,
                      isPublic: false,
                      isEnterprise: false,
                      sortOrder: plans.length + 1
                    };
                    handleSavePlan(dummyPlan);
                  }}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                >
                  {currentPlan ? 'Sauvegarder' : 'Créer'}
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
                Êtes-vous sûr de vouloir supprimer ce plan ? Cette action est irréversible et pourrait affecter les clients qui utilisent actuellement ce plan.
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
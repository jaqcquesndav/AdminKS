import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit2, Trash2, MoreHorizontal, AlertCircle } from 'lucide-react';
import { useSubscription } from '../../hooks/useSubscription';
import type { SubscriptionPlanDefinition, PlanBillingCycle, PlanCategory, PlanFeature } from '../../types/subscription'; 
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { SupportedCurrency } from '../../types/currency';
import { CustomerType } from '../../types/customer';

export function PlansConfigPage() {
  const { t } = useTranslation();
  const { 
    availablePlans, 
    loading: plansLoading, 
    customerType, 
    setActiveCustomerType, 
    createPlan, 
    updatePlan, 
    deletePlan 
  } = useSubscription({initialCustomerType: 'pme'});
  
  const { activeCurrency, formatInCurrency, convert, supportedCurrencies, baseCurrency } = useCurrencySettings();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<SubscriptionPlanDefinition | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<SubscriptionPlanDefinition | null>(null); // Store the full plan object
  const [activeTab, setActiveTab] = useState('active');
  
  const initialFormState: Partial<SubscriptionPlanDefinition> = {
    name: '',
    description: '',
    category: 'starter' as PlanCategory, // Ensure initial category is valid
    features: ['basic_support'],
    targetCustomerTypes: [customerType || 'pme'],
    basePriceUSD: 0,
    localCurrency: undefined,
    basePriceLocal: undefined,
    tokenAllocation: 100000,
    billingCycles: ['monthly' as PlanBillingCycle], // Ensure initial billing cycle is valid
    isHidden: true,
    maxUsers: 1,
    isPromoted: false,
    isCustomizablePlan: false,
    discountPercentage: { quarterly: 0, yearly: 0 },
    customerTypeSpecific: [],
  };

  const [formState, setFormState] = useState<Partial<SubscriptionPlanDefinition>>(initialFormState);

  useEffect(() => {
    // No-op, useSubscription hook handles fetching based on its own dependencies (like customerType)
  }, [customerType]);

  useEffect(() => {
    if (isEditModalOpen) {
      if (currentPlan) {
        setFormState({
          ...currentPlan,
          // Ensure array fields are always arrays for controlled inputs
          features: currentPlan.features || [],
          targetCustomerTypes: currentPlan.targetCustomerTypes || [customerType || 'pme'],
          billingCycles: currentPlan.billingCycles || ['monthly' as PlanBillingCycle],
        });
      } else {
        // Initialize for new plan, ensuring targetCustomerTypes is updated if customerType changed
        setFormState({...initialFormState, targetCustomerTypes: [customerType || 'pme'] });
      }
    } else {
      // Reset form when modal closes
      setFormState(initialFormState);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlan, customerType, isEditModalOpen]); // initialFormState is stable if defined outside


  const handleEditPlan = (plan: SubscriptionPlanDefinition) => {
    setCurrentPlan(plan);
    setIsEditModalOpen(true);
  };

  const handleCreatePlan = () => {
    setCurrentPlan(null);
    // Ensure targetCustomerTypes is set based on the current global customerType
    setFormState({...initialFormState, targetCustomerTypes: [customerType || 'pme'] }); 
    setIsEditModalOpen(true);
  };

  const handleDeletePrompt = (plan: SubscriptionPlanDefinition) => { // Pass the full plan object
    setPlanToDelete(plan);
    setIsDeleteModalOpen(true);
  };

  const handleDeletePlan = async () => { 
    if (planToDelete && planToDelete.id) {
      try {
        await deletePlan(planToDelete.id, customerType || 'pme'); // Pass customerType
        // The useSubscription hook should update availablePlans automatically
      } catch (error) {
        console.error("Failed to delete plan:", error);
        // TODO: Show error notification to user
      }
      setIsDeleteModalOpen(false);
      setPlanToDelete(null);
    }
  };

  const handleSavePlan = async (planToSave: Partial<SubscriptionPlanDefinition>) => {
    // Ensure targetCustomerTypes and billingCycles are correctly typed and not empty
    const targetTypes = (planToSave.targetCustomerTypes && planToSave.targetCustomerTypes.length > 0 
                        ? planToSave.targetCustomerTypes 
                        : [customerType || 'pme']) as CustomerType[];

    const billingCycles = (planToSave.billingCycles && planToSave.billingCycles.length > 0 
                          ? planToSave.billingCycles 
                          : ['monthly']) as PlanBillingCycle[];

    const completePlanData: SubscriptionPlanDefinition = {
        id: currentPlan?.id || `plan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // More robust temp ID
        name: planToSave.name || t('configuration.plans.form.defaultName', 'Default Plan Name'),
        description: planToSave.description || '',
        category: planToSave.category || 'base', // Use 'base' as a valid fallback
        features: planToSave.features || [],
        targetCustomerTypes: targetTypes,
        basePriceUSD: planToSave.basePriceUSD || 0,
        localCurrency: planToSave.localCurrency || undefined, // Ensure undefined if empty string
        basePriceLocal: planToSave.localCurrency ? (planToSave.basePriceLocal || 0) : undefined, // Only set if localCurrency is present
        tokenAllocation: planToSave.tokenAllocation || 0,
        billingCycles: billingCycles,
        discountPercentage: planToSave.discountPercentage || { quarterly: 0, yearly: 0 },
        customerTypeSpecific: planToSave.customerTypeSpecific || [],
        isCustomizablePlan: planToSave.isCustomizablePlan || false,
        isHidden: planToSave.isHidden === undefined ? true : planToSave.isHidden,
        isPromoted: planToSave.isPromoted || false,
        maxUsers: planToSave.maxUsers === undefined ? 1 : planToSave.maxUsers,
        // createdAt and updatedAt should be handled by the backend or service layer
    };

    try {
      if (currentPlan) {
        await updatePlan(completePlanData, customerType || 'pme'); // Pass customerType
      } else {
        await createPlan(completePlanData, customerType || 'pme'); // Pass customerType
      }
      // The useSubscription hook should update availablePlans automatically
    } catch (error) {
      console.error("Failed to save plan:", error);
      // TODO: Show error notification to user
    }
    setIsEditModalOpen(false);
  };
  
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let processedValue: string | number | boolean | string[] | undefined | PlanCategory | SupportedCurrency | PlanBillingCycle[] | CustomerType[] | PlanFeature[];

    if (type === 'number') {
      processedValue = value === '' ? undefined : parseFloat(value);
    } else if (name === 'features') {
      processedValue = value.split(',').map(s => s.trim()).filter(s => s) as PlanFeature[];
    } else if (name === 'targetCustomerTypes') {
      processedValue = value.split(',').map(s => s.trim().toLowerCase()).filter(s => s) as CustomerType[];
    } else if (name === 'billingCycles') {
      processedValue = value.split(',').map(s => s.trim().toLowerCase()).filter(s => s) as PlanBillingCycle[];
    } else if (type === 'checkbox') { 
      processedValue = (e.target as HTMLInputElement).checked;
    } else if (name === 'localCurrency') {
        processedValue = value === '' ? undefined : value as SupportedCurrency;
    } else if (name === 'category') {
        processedValue = value as PlanCategory;
    } else {
      processedValue = value;
    }

    setFormState(prev => ({ ...prev, [name]: processedValue }));
  };

  const filteredPlans = availablePlans.filter(plan => {
    const matchesTab = activeTab === 'active' ? !plan.isHidden : plan.isHidden;
    const currentEffectiveCustomerType = customerType || 'pme';
    // Ensure plan.targetCustomerTypes is an array before calling .includes()
    const matchesCustomerType = Array.isArray(plan.targetCustomerTypes) && 
                                plan.targetCustomerTypes.includes(currentEffectiveCustomerType);
    return matchesTab && matchesCustomerType;
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
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('configuration.plans.subtitle', 'Gérez les offres disponibles pour vos clients ({customerType})', { customerType: t(`customerTypes.${customerType || 'pme'}`, customerType || 'PME') })}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select 
            value={customerType || 'pme'} 
            onChange={(e) => setActiveCustomerType(e.target.value as CustomerType)} 
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            <option value="pme">{t('customerTypes.pme', 'PME')}</option>
            <option value="financial">{t('customerTypes.financial', 'Financial Institution')}</option>
            {/* Add other customer types if they exist */}
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
                  {t('configuration.plans.table.price', 'Prix')} ({baseCurrency})
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
              {filteredPlans.map((plan) => {
                // const displayCurrency = plan.localCurrency || activeCurrency; // This was unused
                const priceInUSD = plan.basePriceUSD;
                // Convert USD base price to the active currency for consistent display comparison if no local price is set
                const priceInActiveCurrency = convert(priceInUSD, 'USD', activeCurrency);
                
                // Determine the primary price to show: local if available, otherwise USD converted to activeCurrency
                let primaryPriceToShow = priceInActiveCurrency;
                let primaryCurrencyToShow = activeCurrency;

                if (plan.localCurrency && plan.basePriceLocal !== undefined) {
                    primaryPriceToShow = plan.basePriceLocal;
                    primaryCurrencyToShow = plan.localCurrency as SupportedCurrency;
                }

                return (
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
                        {formatInCurrency(primaryPriceToShow, primaryCurrencyToShow)}
                      </div>
                      {/* Show USD equivalent if the primary display is a local currency OR if activeCurrency is not USD and no local price is set */}
                      {(plan.localCurrency && plan.localCurrency !== 'USD') || (activeCurrency !== 'USD' && !plan.localCurrency) ? (
                         <div className="text-sm text-gray-500 dark:text-gray-400">
                           ({t('common.equivalentShort')} {formatInCurrency(plan.basePriceUSD, 'USD')})
                         </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {plan.category ? t(`planCategories.${plan.category}`, plan.category) : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {plan.maxUsers === undefined || plan.maxUsers === null ? t('common.notApplicableShort', 'N/A') : plan.maxUsers === 0 ? t('common.unlimited', 'Illimité') : `${plan.maxUsers} max.`}
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
                          onClick={() => handleDeletePrompt(plan)}
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
                );
              })}
              {filteredPlans.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="h-10 w-10 text-gray-400 mb-3" />
                      <h3 className="text-gray-500 dark:text-gray-400 text-lg font-medium">
                        {t('configuration.plans.emptyState.noPlansFound', 'Aucun plan {tabStatus} trouvé pour le type de client "{clientType}".', {
                          tabStatus: activeTab === 'active' ? t('configuration.plans.emptyState.public', 'public') : t('configuration.plans.emptyState.draft', 'en brouillon'),
                          clientType: t(`customerTypes.${customerType || 'pme'}`, customerType || 'N/A')
                        })}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 max-w-md mt-1">
                        {activeTab === 'active'
                          ? t('configuration.plans.emptyState.createOrPublishActive', 'Créez un nouveau plan ou rendez public un brouillon existant.')
                          : t('configuration.plans.emptyState.draftsAppearHere', 'Vos plans en cours de préparation apparaîtront ici.')}
                      </p>
                      {activeTab === 'draft' && (
                        <button 
                          onClick={handleCreatePlan}
                          className="mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t('configuration.plans.create', 'Créer un plan')}
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
                {currentPlan ? t('configuration.plans.modal.editTitle', 'Modifier le plan') : t('configuration.plans.modal.createTitle', 'Créer un nouveau plan')}
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
              <form onSubmit={(e) => { e.preventDefault(); handleSavePlan(formState); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.name', 'Nom du Plan')}</label>
                    <input type="text" name="name" id="name" value={formState.name || ''} onChange={handleFormChange} required className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.category', 'Catégorie')}</label>
                    <select 
                        name="category" 
                        id="category" 
                        value={formState.category || ''} 
                        onChange={handleFormChange} 
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                        <option value="starter">{t('planCategories.starter', 'Starter')}</option>
                        <option value="premium">{t('planCategories.premium', 'Premium')}</option>
                        <option value="enterprise">{t('planCategories.enterprise', 'Enterprise')}</option>
                        <option value="base">{t('planCategories.base', 'Base')}</option>
                        <option value="custom">{t('planCategories.custom', 'Custom')}</option>
                        <option value="freemium">{t('planCategories.freemium', 'Freemium')}</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.description', 'Description')}</label>
                  <textarea name="description" id="description" value={formState.description || ''} onChange={handleFormChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"></textarea>
                </div>
                
                <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{t('configuration.plans.form.pricingTitle', 'Tarification')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="basePriceUSD" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.basePriceUSD', 'Prix de Base (USD)')}</label>
                      <input type="number" name="basePriceUSD" id="basePriceUSD" value={formState.basePriceUSD === undefined ? '' : formState.basePriceUSD} onChange={handleFormChange} required min="0" step="any" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                    </div>
                    <div>
                      <label htmlFor="localCurrency" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.localCurrency', 'Devise Locale (Optionnel)')}</label>
                      <select name="localCurrency" id="localCurrency" value={formState.localCurrency || ''} onChange={handleFormChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                        <option value="">{t('configuration.plans.form.noLocalCurrency', 'Aucune')}</option>
                        {supportedCurrencies.filter(c => c !== 'USD').map(currency => (
                          <option key={currency} value={currency}>{currency}</option>
                        ))}
                      </select>
                    </div>
                    {formState.localCurrency && (
                      <div>
                        <label htmlFor="basePriceLocal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.priceInCurrency', {currency: formState.localCurrency})}</label>
                        <input type="number" name="basePriceLocal" id="basePriceLocal" value={formState.basePriceLocal === undefined ? '' : formState.basePriceLocal} onChange={handleFormChange} min="0" step="any" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                      </div>
                    )}
                  </div>
                  {(formState.basePriceUSD !== undefined && formState.basePriceUSD > 0) && (
                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {t('configuration.plans.form.referencePriceActive', 'Prix de référence en {currency}', {currency: activeCurrency})}: 
                      {formatInCurrency(convert(formState.basePriceUSD || 0, 'USD', activeCurrency), activeCurrency)}
                      {formState.localCurrency && formState.basePriceLocal !== undefined && formState.localCurrency !== activeCurrency && (
                        <span> / {formatInCurrency(formState.basePriceLocal || 0, formState.localCurrency as SupportedCurrency)}</span>
                      )}
                       {formState.localCurrency && formState.localCurrency === activeCurrency && formState.basePriceLocal !== undefined && (
                        <span> ({t('configuration.plans.form.localPriceSet', 'Prix local défini')})</span>
                      )}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="tokenAllocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.tokenAllocation', 'Tokens Alloués')}</label>
                    <input type="number" name="tokenAllocation" id="tokenAllocation" value={formState.tokenAllocation === undefined ? '' : formState.tokenAllocation} onChange={handleFormChange} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label htmlFor="maxUsers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.maxUsers', 'Utilisateurs Max (0 pour illimité)')}</label>
                    <input type="number" name="maxUsers" id="maxUsers" value={formState.maxUsers === undefined ? '' : formState.maxUsers} onChange={handleFormChange} min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                  <div>
                    <label htmlFor="targetCustomerTypes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.targetCustomerTypes', 'Types Client Cibles (séparés par virgule)')}</label>
                    <input 
                        type="text" 
                        name="targetCustomerTypes" 
                        id="targetCustomerTypes" 
                        value={(formState.targetCustomerTypes || []).join(', ')} 
                        onChange={handleFormChange} 
                        placeholder={t('configuration.plans.form.targetCustomerTypesPlaceholder', 'Ex: pme, financial')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                   <div>
                    <label htmlFor="billingCycles" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.billingCycles', 'Cycles de Facturation (séparés par virgule)')}</label>
                    <input 
                        type="text" 
                        name="billingCycles" 
                        id="billingCycles" 
                        value={(formState.billingCycles || []).join(', ')} 
                        onChange={handleFormChange} 
                        placeholder={t('configuration.plans.form.billingCyclesPlaceholder', 'Ex: monthly, yearly')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
                  </div>
                </div>

                <div className="mb-6">
                    <label htmlFor="features" className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('configuration.plans.form.features', 'Fonctionnalités (séparées par virgule)')}</label>
                    <textarea 
                        name="features" 
                        id="features" 
                        value={(formState.features || []).join(', ')} 
                        onChange={handleFormChange} 
                        rows={3} 
                        placeholder={t('configuration.plans.form.featuresPlaceholder', 'Ex: basic_support, api_access')}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"></textarea>
                </div>

                <div className="flex items-center space-x-6 mb-6">
                    <div className="flex items-center">
                        <input id="isHidden" name="isHidden" type="checkbox" checked={formState.isHidden || false} onChange={handleFormChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                        <label htmlFor="isHidden" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t('configuration.plans.form.isHidden', 'Caché (Brouillon)')}</label>
                    </div>
                     <div className="flex items-center">
                        <input id="isPromoted" name="isPromoted" type="checkbox" checked={formState.isPromoted || false} onChange={handleFormChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                        <label htmlFor="isPromoted" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t('configuration.plans.form.isPromoted', 'Promu (Populaire)')}</label>
                    </div>
                     <div className="flex items-center">
                        <input id="isCustomizablePlan" name="isCustomizablePlan" type="checkbox" checked={formState.isCustomizablePlan || false} onChange={handleFormChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700" />
                        <label htmlFor="isCustomizablePlan" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">{t('configuration.plans.form.isCustomizable', 'Personnalisable')}</label>
                    </div>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {t('common.cancel', 'Annuler')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
                  >
                    {currentPlan ? t('common.saveChanges', 'Sauvegarder les modifications') : t('common.create', 'Créer le Plan')}
                  </button>
                </div>
              </form>
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
                {t('configuration.plans.deleteModal.title', 'Confirmer la suppression')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                {t('configuration.plans.deleteModal.message', 
                  'Êtes-vous sûr de vouloir supprimer le plan "{{planName}}"? Cette action est irréversible.',
                  { planName: planToDelete?.name || planToDelete?.id || t('common.unknown', 'Inconnu') }
                )}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  {t('common.cancel', 'Annuler')}
                </button>
                <button
                  onClick={handleDeletePlan} 
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  {t('common.delete', 'Supprimer')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
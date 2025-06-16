import { useState, useEffect, useMemo, useCallback } from 'react'; // Added useCallback
import { Search, Filter, Calendar, AlertCircle, RefreshCcw, CheckCircle, XCircle, MoreHorizontal, Building, CreditCard, PlusCircle } from 'lucide-react';
// import { useSubscription } from '../../hooks/useSubscription'; // Old hook
import { useSubscriptions } from '../../hooks/useSubscriptions'; // New hook
import { useSubscriptionPlans } from '../../hooks/useSubscriptionPlans'; // Corrected path based on file search if different, assuming this is correct
import type { Subscription, SubscriptionPlan, SubscriptionStatus as PlanStatus, BillingCycle as PlanBillingCycle, SubscriptionFilterParams } from '../../types/finance'; // Updated types
// import { CustomerType } from '../../types/customer'; // CustomerType might not be needed if filtering is by customerId or general
import { useToast } from '../../hooks/useToast';
import { useCurrency } from '../../hooks/useCurrency'; // Updated currency hook
// import { SupportedCurrency } from '../../types/currency'; // Not directly used
// import { SUPPORTED_CURRENCIES } from '../../constants/currencyConstants'; // Not directly used

const planStatuses: PlanStatus[] = ['active', 'pending_activation', 'canceled', 'expired', 'paused', 'trial', 'payment_failed'];

export function SubscriptionsPage() {
  const { showToast } = useToast();
  const { formatInCurrency } = useCurrency(); // Using formatInCurrency and removed unused convertCurrency

  // State for filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PlanStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Or from a config/state

  // Hook for subscription plans
  const {
    plans: availablePlans,
    isLoading: isLoadingPlans,
    // error: errorPlans, // Optional: handle plan loading errors
  } = useSubscriptionPlans();

  // Hook for subscriptions
  const {
    subscriptions: customerSubscriptions,
    isLoading: isLoadingSubscriptions,
    // error: errorSubscriptions, // Commented out as unused
    pagination,
    fetchSubscriptions,
    // getSubscriptionById, // If needed for a detail view/modal
    // createSubscription, // Commented out as unused, will be used by handleAddSubscription
    updateSubscription, // For actions like changing plan
    cancelSubscription,
    // getSubscriptionPlans, // This is now in useSubscriptionPlans
  } = useSubscriptions();

  useEffect(() => {
    const params: SubscriptionFilterParams = {
      page: currentPage,
      limit: itemsPerPage,
      status: filterStatus === 'all' ? undefined : filterStatus,
      search: searchTerm || undefined, // Add search term to API query if supported
    };
    fetchSubscriptions(params);
  }, [fetchSubscriptions, currentPage, itemsPerPage, filterStatus, searchTerm]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await cancelSubscription(subscriptionId, 'Cancelled by admin'); // Provide a reason if API supports it
      showToast('success', 'Subscription cancelled successfully.');
      // fetchSubscriptions will be called due to state change if cancellation affects list
    } catch (error) {
      const e = error as Error;
      showToast('error', `Error cancelling subscription: ${e.message}`);
      console.error("Error cancelling subscription from page:", error);
    }
  };
  
  // Placeholder for reactivating a subscription - might involve creating a new one or a specific endpoint
  const handleReactivateSubscription = async (subscriptionId: string) => {
    try {
      // Assuming updateSubscription can change status from 'canceled' to 'active'
      // Or a dedicated endpoint: await financeService.reactivateSubscription(subscriptionId);
      const subToReactivate = customerSubscriptions.find(s => s.id === subscriptionId);
      if (subToReactivate && subToReactivate.status === 'canceled') {
         await updateSubscription(subscriptionId, { status: 'active' });
         showToast('success', 'Subscription reactivated successfully.');
      } else {
        showToast('info', 'Only cancelled subscriptions can be reactivated this way.');
      }
    } catch (error) {
      const e = error as Error;
      showToast('error', `Error reactivating subscription: ${e.message}`);
      console.error("Error reactivating subscription:", e);
    }
  };

  const getStatusLabel = (status: PlanStatus): string => {
    // This can be mapped to i18n keys
    switch (status) {
      case 'active': return 'Actif';
      case 'pending_activation': return 'Activation en attente';
      case 'canceled': return 'Annulé';
      case 'expired': return 'Expiré';
      case 'paused': return 'En pause';
      case 'trial': return 'Essai';
      case 'payment_failed': return 'Paiement échoué';
      default: return status as string;
    }
  };

  const statusBadgeClass = (status: PlanStatus) => {
    switch (status) {
      case 'active':
      case 'trial':
        return 'bg-green-100 text-green-800';
      case 'pending_activation':
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
      case 'payment_failed':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusIcon = (status: PlanStatus) => {
    switch (status) {
      case 'active':
      case 'trial':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending_activation':
      case 'paused':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'canceled':
      case 'payment_failed':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'expired':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getPlanBillingCycleLabel = (cycle: PlanBillingCycle): string => {
    switch (cycle) {
      case 'monthly': return 'Mensuel';
      case 'quarterly': return 'Trimestriel';
      case 'annually': return 'Annuel';
      case 'biennially': return 'Bi-annuel';
      case 'one_time': return 'Unique';
      default: return cycle;
    }
  };

  const getDisplayBillingCycleForPlanCard = (plan?: SubscriptionPlan): string => {
    if (!plan) return 'N/A';
    return getPlanBillingCycleLabel(plan.billingCycle);
  };
  
  const getPlanById = useCallback((planId: string): SubscriptionPlan | undefined => {
    return availablePlans.find((p: SubscriptionPlan) => p.id === planId);
  }, [availablePlans]); // Added useCallback and type for p

  const getRenewalStatusLabel = (subscription: Subscription) => {
    if (subscription.status === 'canceled' || subscription.status === 'expired' || subscription.status === 'payment_failed') {
      return 'Non renouvelable';
    }
    return subscription.autoRenew ? 'Renouvellement auto.' : 'Renouvellement manuel'; 
  };

  // const handleCustomerTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   // If customer type filtering is still needed, it should be passed to fetchSubscriptions
  //   // setActiveCustomerType(event.target.value as CustomerType);
  //   setCurrentPage(1);
  // };

  const handleFilterStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as PlanStatus | 'all');
    setCurrentPage(1);
  };
  
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // The filteredSubscriptions logic is now handled by the backend via API params (searchTerm)
  // If client-side filtering is still desired for some reason (e.g. on already fetched small dataset):
  const clientSideFilteredSubscriptions = useMemo(() => {
    // if (!searchTerm) return customerSubscriptions; // This logic is fine if API doesn't support search
    // The primary filtering should be done by the API via fetchSubscriptions(params)
    // This client-side filter can act as a secondary refinement or if API search is limited.
    // For now, assuming API handles search, so this might be redundant or for specific UI needs.
    // If API search is comprehensive, this can be simplified to just `customerSubscriptions`.
    // Let's keep it for now, but ensure dependencies are correct.
    if (!searchTerm && customerSubscriptions) return customerSubscriptions;
    if (!customerSubscriptions) return [];


    return customerSubscriptions.filter(sub => {
      const planDetails = getPlanById(sub.planId);
      const planName = planDetails?.name || sub.planName || 'N/A';
      return sub.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [customerSubscriptions, searchTerm, getPlanById]); // Removed availablePlans, getPlanById is now memoized

  // TODO: Implement Add Subscription Modal and Logic
  const handleAddSubscription = () => {
    // Example: Open a modal and then call createSubscription
    // const newSubData: CreateSubscriptionPayload = { customerId: '...', planId: '...' };
    // createSubscription(newSubData); // createSubscription would be used here
    showToast('info', 'Add subscription functionality to be implemented.');
  };

  const isLoading = isLoadingSubscriptions || isLoadingPlans;

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Abonnements</h1>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {/* Customer Type filter - remove if not used or handled by API search by customerId */}
          {/* <select
            // value={activeCustomerType}
            // onChange={handleCustomerTypeChange}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 h-full"
          >
            <option value='all'>Tous les clients</option> // Example
            <option value='pme'>Client PME</option>
            <option value='financial'>Institution Financière</option>
          </select> */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher client, plan..."
              value={searchTerm}
              onChange={handleSearchChange} // Updated handler
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
            />
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark h-full"
            onClick={handleAddSubscription}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un abonnement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-center">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Filtres:</span>
        </div>
        
        <div className="space-x-2 flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={handleFilterStatusChange}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
          >
            <option value="all">Tous les statuts</option>
            {planStatuses.map(status => (
                <option key={status} value={status}>
                    {getStatusLabel(status)}
                </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plans overview cards - using availablePlans from hook */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {availablePlans.map((plan: SubscriptionPlan) => { // Added type for plan
          // const planDisplayCurrency = getSafeCurrency(plan.currency); // Assuming plan.currency is the display currency
          return (
            <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
              <div className="mb-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h3>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatInCurrency(plan.price, plan.currency)} {/* Use formatInCurrency */}
                  {/* {convertCurrency(plan.price, plan.currency, 'USD')} Example usage of convertCurrency if needed */}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                    /{getDisplayBillingCycleForPlanCard(plan)}
                  </span>
                </div>
                {/* <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">\r
                  Max {plan.maxUsers} Utilisateurs, {plan.tokenAllocation?.toLocaleString()} Tokens // These fields are not in SubscriptionPlan type\r
                </div> */}
              </div>
              <hr className="my-2 border-gray-200 dark:border-gray-700" />
              <ul className="space-y-1 mb-3 h-20 overflow-y-auto">
                {plan.features?.map((featureName: string, index: number) => { // Added types for featureName and index
                  return (
                    <li key={index} className="text-sm flex items-start">\r
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />\r
                      <span className="text-gray-700 dark:text-gray-300">{featureName}</span>\r
                    </li>
                  );
                })}
              </ul>
              <div className="text-xs text-gray-500">\r
                <span className="font-medium">\r
                  {customerSubscriptions.filter(sub => sub.planId === plan.id && sub.status === 'active').length}\r
                </span> clients actifs\r
              </div>
            </div>
          );
        })}
      </div>

      {/* Subscriptions table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {isLoading && clientSideFilteredSubscriptions.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : clientSideFilteredSubscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center"><Building className="w-4 h-4 mr-2" />Client / Plan</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center"><Calendar className="w-4 h-4 mr-2" />Période</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center"><CreditCard className="w-4 h-4 mr-2" />Montant / Cycle</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center"><RefreshCcw className="w-4 h-4 mr-2" />Renouvellement</div>
                  </th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {clientSideFilteredSubscriptions.map((subscription) => {
                  const planDetails = getPlanById(subscription.planId);
                  // const subscriptionDisplayCurrency = getSafeCurrency(subscription.currency); // Use subscription.currency directly
                  return (
                  <tr key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{subscription.customerName || 'N/A'}</div>
                      <div className="text-xs text-gray-500 mt-1">{planDetails?.name || subscription.planName || 'Plan inconnu'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">Début: {new Date(subscription.startDate).toLocaleDateString()}</div>
                      {subscription.endDate && <div className="text-xs text-gray-500 mt-1">Fin: {new Date(subscription.endDate).toLocaleDateString()}</div>}
                      {subscription.currentPeriodEnd && <div className="text-xs text-gray-500 mt-1">Fin période: {new Date(subscription.currentPeriodEnd).toLocaleDateString()}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatInCurrency(subscription.amount, subscription.currency)} / {getPlanBillingCycleLabel(subscription.billingCycle)} {/* Use formatInCurrency */}
                      </div>
                      {/* <div className="text-xs text-gray-500 mt-1">
                        Méthode: {subscription.paymentMethodId ? `ID ${subscription.paymentMethodId}` : 'N/A'} // Display actual payment method if available
                      </div> */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(subscription.status)}`}>
                        {statusIcon(subscription.status)}
                        {getStatusLabel(subscription.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRenewalStatusLabel(subscription)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {subscription.status !== 'canceled' && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                            disabled={isLoadingSubscriptions}
                          >Annuler</button>
                        )}
                        {(subscription.status === 'canceled' || (subscription.status !== 'active' && !subscription.autoRenew)) && (
                          <button
                            onClick={() => handleReactivateSubscription(subscription.id)}
                            className="text-green-600 hover:text-green-800 text-xs"
                            disabled={isLoadingSubscriptions}
                          >Réactiver</button>
                        )}
                        <button className="text-gray-400 hover:text-gray-500 focus:outline-none">
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Aucun abonnement trouvé</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Essayez de modifier vos filtres ou ajoutez un nouvel abonnement.</p>
          </div>
        )}
        {/* Pagination controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Précédent
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages || isLoading}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Page <span className="font-medium">{pagination.page}</span> sur <span className="font-medium">{pagination.totalPages}</span>
                  <span className="ml-2">({pagination.totalCount} résultats)</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">Précédent</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </button>
                  {/* TODO: Add dynamic page numbers if needed */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                    disabled={currentPage === pagination.totalPages || isLoading}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    <span className="sr-only">Suivant</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Ensure all imports are correct and unused ones are removed.
// Check for any remaining mock data or logic that should be replaced by hook functionality.
// The "Ajouter un abonnement" button and "MoreHorizontal" actions are placeholders for now.
// Payment method display in the table is simplified; actual data might be nested.
// Renewal logic is simplified; reactivateSubscription is used for canceled ones. A proper "renew" or "update autoRenew" might be needed.
// Error handling can be further refined.
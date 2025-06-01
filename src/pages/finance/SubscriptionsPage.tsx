import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar, AlertCircle, RefreshCcw, CheckCircle, XCircle, MoreHorizontal, Building, CreditCard, PlusCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { useSubscription } from '../../hooks/useSubscription';
import { SubscriptionPlanDefinition, CustomerSubscription, PlanStatus, PlanBillingCycle } from '../../types/subscription';
import { CustomerType } from '../../types/customer';
import { SupportedCurrency } from '../../types/currency'; // Added import
import { useToast as useAppToast } from '../../hooks/useToast'; // Renamed to avoid conflict if hook also returns one

const planStatuses: PlanStatus[] = ['active', 'expired', 'cancelled', 'pending', 'payment_failed'];

export function SubscriptionsPage() {
  const { 
    showToast: showHookToast, // Use the toast from the hook for hook-related actions
  } = useAppToast(); 

  const {
    subscriptions: customerSubscriptions,
    availablePlans,
    loading,
    fetchSubscriptions,
    fetchAvailablePlans,
    cancelSubscription,
    reactivateSubscription,
    setPage,
    // setPageSize, // Uncomment for pagination UI
    // totalCount,  // Uncomment for pagination UI
    page,
    pageSize,
  } = useSubscription({ initialCustomerType: 'pme' });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PlanStatus | 'all'>('all');
  const [activeCustomerType, setActiveCustomerType] = useState<CustomerType>('pme');

  useEffect(() => {
    fetchAvailablePlans(activeCustomerType);
  }, [fetchAvailablePlans, activeCustomerType]);

  useEffect(() => {
    fetchSubscriptions(page, pageSize, { 
      customerType: activeCustomerType, 
      status: filterStatus === 'all' ? undefined : filterStatus 
    }); 
  }, [fetchSubscriptions, activeCustomerType, page, pageSize, filterStatus]);

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await cancelSubscription(subscriptionId);
      // Toast is shown by the hook
    } catch (error) {
      console.error("Error cancelling subscription from page:", error);
      // Error toast is also shown by the hook
    }
  };

  const getStatusLabel = (status: PlanStatus): string => {
    switch (status) {
      case 'active': return 'Actif';
      case 'pending': return 'En attente';
      case 'cancelled': return 'Annulé';
      case 'expired': return 'Expiré';
      case 'payment_failed': return 'Paiement échoué';
      default: {
        // const _exhaustiveCheck: never = status; // Removed as it's not strictly necessary for runtime and causes lint error
        return status as string;
      }
    }
  };

  const statusBadgeClass = (status: PlanStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      // case 'trialing': // PlanStatus doesn't have 'trialing', it might be an 'active' sub with a trial flag elsewhere
        // return 'bg-blue-100 text-blue-800'; 
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
      case 'payment_failed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusIcon = (status: PlanStatus) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'pending':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'expired':
      case 'payment_failed':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getPlanBillingCycleLabel = (cycle: PlanBillingCycle): string => {
    switch (cycle) {
      case 'monthly': return 'Mensuel';
      case 'quarterly': return 'Trimestriel';
      case 'yearly': return 'Annuel';
      default: return cycle;
    }
  };

  const getDisplayBillingCycleForPlanCard = (plan?: SubscriptionPlanDefinition) => {
    if (!plan || !plan.billingCycles || plan.billingCycles.length === 0) return 'N/A';
    return getPlanBillingCycleLabel(plan.billingCycles[0]); // Display first cycle for simplicity
  };
  
  const getPlanById = (planId: string): SubscriptionPlanDefinition | undefined => {
    return availablePlans.find(p => p.id === planId);
  };

  const getRenewalStatusLabel = (subscription: CustomerSubscription) => {
    if (subscription.status === 'cancelled' || subscription.status === 'expired' || subscription.status === 'payment_failed') {
      return 'Non renouvelable';
    }
    // CustomerSubscription type does not have cancelAtPeriodEnd, using autoRenew
    return subscription.autoRenew ? 'Renouvellement auto.' : 'Renouvellement manuel'; 
  };

  const handleCustomerTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveCustomerType(event.target.value as CustomerType);
    setPage(1);
  };

  const handleFilterStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterStatus(event.target.value as PlanStatus | 'all');
    setPage(1);
  };

  const handleRenewSubscription = async (subscriptionId: string) => {
    try {
      const subToRenew = customerSubscriptions.find(s => s.id === subscriptionId);
      if (subToRenew && subToRenew.status === 'cancelled') { 
        await reactivateSubscription(subscriptionId);
        // Toast is shown by the hook
      } else if (subToRenew) { 
        // If subscription is found but not in 'cancelled' state
        showHookToast('info', `Seuls les abonnements annulés peuvent être réactivés directement. Statut actuel: ${getStatusLabel(subToRenew.status)}.`);
      } else {
        // This case should ideally not be reached if subscriptionId comes from a valid list item
        showHookToast('error', 'Abonnement non trouvé pour la réactivation.');
      }
    } catch (error) {
      console.error("Error reactivating subscription from page:", error);
      // Error toast for reactivateSubscription itself is shown by the hook.
      // This catch block handles errors originating from the page logic itself or unexpected errors from the hook.
    }
  };
  
  const filteredSubscriptions = useMemo(() => {
    return customerSubscriptions.filter(sub => {
      const planDetails = availablePlans.find(p => p.id === sub.planId);
      const planName = planDetails?.name || 'N/A';

      const matchesSearch = searchTerm === '' || 
        sub.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [customerSubscriptions, searchTerm, availablePlans]);

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Abonnements</h1>
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <select
            value={activeCustomerType}
            onChange={handleCustomerTypeChange}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-2 h-full"
          >
            <option value='pme'>Client PME</option>
            <option value='financial'>Institution Financière</option>
          </select>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher client, plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
            />
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark h-full"
            // onClick={() => { /* TODO: Logic for adding a new subscription */ }}
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
        {availablePlans.filter(p => !p.isHidden).map(plan => (
          <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(plan.basePriceUSD, (plan.localCurrency as SupportedCurrency) || 'USD')} 
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{getDisplayBillingCycleForPlanCard(plan)}
                </span>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Max {plan.maxUsers} Utilisateurs, {plan.tokenAllocation?.toLocaleString()} Tokens
              </div>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <ul className="space-y-1 mb-3 h-20 overflow-y-auto">
              {plan.features.map((featureName, index) => { // Assuming plan.features is string[] of feature names/keys
                // If plan.features are objects like { description: string }, adjust accordingly.
                // For now, assuming they are simple strings as per PlanFeature type definition.
                return (
                  <li key={index} className="text-sm flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{featureName}</span>
                  </li>
                );
              })}
            </ul>
            <div className="text-xs text-gray-500">
              <span className="font-medium">
                {customerSubscriptions.filter(sub => sub.planId === plan.id && sub.status === 'active').length}
              </span> clients actifs
            </div>
          </div>
        ))}
      </div>

      {/* Subscriptions table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {loading && customerSubscriptions.length === 0 ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredSubscriptions.length > 0 ? (
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
                    <div className="flex items-center"><CreditCard className="w-4 h-4 mr-2" />Montant / Paiement</div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Statut</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center"><RefreshCcw className="w-4 h-4 mr-2" />Renouvellement</div>
                  </th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubscriptions.map((subscription) => {
                  const planDetails = getPlanById(subscription.planId);
                  return (
                  <tr key={subscription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{subscription.customerName || 'N/A'}</div>
                      <div className="text-xs text-gray-500 mt-1">{planDetails?.name || subscription.planName || 'Plan inconnu'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">Début: {new Date(subscription.startDate).toLocaleDateString()}</div>
                      <div className="text-xs text-gray-500 mt-1">Fin: {new Date(subscription.endDate).toLocaleDateString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(subscription.priceUSD, (subscription.localCurrency as SupportedCurrency) || 'USD')}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {/* CustomerSubscription.paymentMethod is PaymentMethod type, not ID */}
                        Méthode: {subscription.paymentMethod ? subscription.paymentMethod.replace('_',' ') : 'N/A'}
                      </div>
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
                        {subscription.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                            disabled={loading}
                          >Annuler</button>
                        )}
                        {(subscription.status === 'cancelled' || !subscription.autoRenew) && subscription.status !== 'active' && (
                          <button
                            onClick={() => handleRenewSubscription(subscription.id)}
                            className="text-green-600 hover:text-green-800 text-xs"
                            disabled={loading}
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
        {/* TODO: Add Pagination controls here using setPage, pageSize, totalCount, page from useSubscription */}
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
import { useEffect } from 'react'; // Added useEffect
import { Check, Coins } from 'lucide-react';
import { SubscriptionPlanDefinition, PlanBillingCycle } from '../../types/subscription';
import { CustomerType } from '../../types/customer';
import { useSubscription } from '../../hooks/useSubscription';
import { formatCurrency } from '../../utils/currency';
import { SupportedCurrency } from '../../types/currency'; // Added import

interface SubscriptionPlansProps {
  customerType: CustomerType;
  onSelectPlan: (planId: string, billingCycle: PlanBillingCycle) => void;
}

// Helper to get a label for billing cycle
const getBillingCycleLabel = (cycle: PlanBillingCycle) => {
  switch (cycle) {
    case 'monthly': return 'Mensuel';
    case 'quarterly': return 'Trimestriel';
    case 'yearly': return 'Annuel';
    default: return cycle;
  }
};

export function SubscriptionPlans({ customerType, onSelectPlan }: SubscriptionPlansProps) {
  const { availablePlans, loading, fetchAvailablePlans, setActiveCustomerType } = useSubscription();

  useEffect(() => {
    setActiveCustomerType(customerType);
    if (customerType) { // Ensure customerType is defined before fetching
      fetchAvailablePlans(customerType);
    }
  }, [customerType, setActiveCustomerType, fetchAvailablePlans]);

  if (loading) {
    return <div className="text-center py-10">Chargement des plans...</div>;
  }

  if (!availablePlans || availablePlans.length === 0) {
    return <div className="text-center py-10">Aucun plan disponible pour ce type de client.</div>;
  }

  const displayablePlans = availablePlans.filter(plan => !plan.isHidden);

  return (
    <div className="space-y-8">
      {displayablePlans.map((plan: SubscriptionPlanDefinition) => (
        <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{plan.description}</p>
          </div>
          
          <div className="px-6 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {plan.billingCycles.map(cycle => {
                let displayPrice = plan.basePriceUSD;
                const tokenBonus = plan.tokenAllocation; // Changed let to const
                let discountInfo = '';

                // Adjust price and add discount info based on cycle
                // This logic assumes basePriceUSD is monthly. Adjust if it represents annual or other period.
                if (cycle === 'quarterly') {
                  displayPrice = plan.basePriceUSD * 3; // Default quarterly price
                  if (plan.discountPercentage.quarterly > 0) {
                    displayPrice = displayPrice * (1 - plan.discountPercentage.quarterly / 100);
                    discountInfo = ` (Économisez ${plan.discountPercentage.quarterly}%)`;
                  }
                } else if (cycle === 'yearly') {
                  displayPrice = plan.basePriceUSD * 12; // Default yearly price
                  if (plan.discountPercentage.yearly > 0) {
                    displayPrice = displayPrice * (1 - plan.discountPercentage.yearly / 100);
                    discountInfo = ` (Économisez ${plan.discountPercentage.yearly}%)`;
                  }
                }
                // For monthly, price is basePriceUSD, no discount applied here based on current structure

                return (
                  <div key={cycle} className="text-center border dark:border-gray-600 p-4 rounded-md flex flex-col justify-between">
                    <div>
                      <div className="mb-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {getBillingCycleLabel(cycle)}{discountInfo}
                        </span>
                      </div>
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(displayPrice, (plan.localCurrency as SupportedCurrency) || 'USD')}
                      </div>
                      <div className="mt-2 flex items-center justify-center text-sm text-green-500">
                        <Coins className="w-4 h-4 mr-1" />
                        <span>+{tokenBonus.toLocaleString()} tokens</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectPlan(plan.id, cycle)}
                      className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-md w-full"
                    >
                      Choisir ce plan
                    </button>
                  </div>
                );
              })}
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Fonctionnalités incluses :</h4>
              <ul className="space-y-2">
                {plan.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </li>
                ))}
              </ul>
            </div>
            {plan.maxUsers != null && (
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    Utilisateurs max: {plan.maxUsers}
                </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
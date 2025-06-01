import { Check, X, Info } from 'lucide-react';
import type { CustomerSubscription, PlanBillingCycle, PlanStatus } from '../../types/subscription';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../../utils/currency';
import type { TFunction } from 'i18next';
import type { SupportedCurrency } from '../../types/currency';

interface SubscriptionCardProps {
  subscription: CustomerSubscription;
  onRenew?: (subscriptionId: string) => void;
  onCancel?: (subscriptionId: string) => void;
  onViewDetails?: (subscriptionId: string) => void;
}

// Helper function to get status label and color
const getStatusLabelAndColor = (status: PlanStatus | undefined, t: TFunction) => {
  switch (status) {
    case 'active':
      return { label: t('status.active', 'Active'), color: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' };
    case 'cancelled':
      return { label: t('status.cancelled', 'Cancelled'), color: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' };
    case 'expired':
      return { label: t('status.expired', 'Expired'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100' };
    case 'pending':
        return { label: t('status.pending', 'Pending'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100' };
    case 'payment_failed':
        return { label: t('status.payment_failed', 'Payment Failed'), color: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' };
    default:
      return { label: t('status.unknown', 'Unknown'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100' };
  }
};

// Helper function to get billing cycle label
const getBillingCycleLabel = (cycle: PlanBillingCycle | undefined, t: TFunction) => {
    switch (cycle) {
      case 'monthly': return t('billingCycles.monthly', 'Monthly');
      case 'quarterly': return t('billingCycles.quarterly', 'Quarterly');
      case 'yearly': return t('billingCycles.yearly', 'Yearly');
      default: return cycle || t('billingCycles.not_specified', 'Not Specified');
    }
  };

interface CardMetaData {
    nextBillingDate?: string;
    currency?: string;
    accountManager?: string;
    specialConditions?: string;
    notes?: string;
    tags?: string[];
}

export function SubscriptionCard({ subscription, onRenew, onCancel, onViewDetails }: SubscriptionCardProps) {
  const { t } = useTranslation();
  const statusInfo = getStatusLabelAndColor(subscription.status, t);

  const canRenew = subscription.status === 'cancelled' || subscription.status === 'expired' || subscription.status === 'payment_failed';
  const canCancel = subscription.status === 'active' || subscription.status === 'pending';
  
  const meta = subscription.metaData as CardMetaData | undefined;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{subscription.planName || t('subscriptions.planNameUnknown', 'Unnamed Plan')}</h3>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>
      
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
        <p>{t('subscriptions.startDate', 'Start Date')}: {subscription.startDate ? new Date(subscription.startDate).toLocaleDateString() : t('common.notApplicable', 'N/A')}</p>
        <p>{t('subscriptions.endDate', 'End Date')}: {subscription.endDate ? new Date(subscription.endDate).toLocaleDateString() : t('common.notApplicable', 'N/A')}</p>
        {meta?.nextBillingDate && <p>{t('subscriptions.nextBillingDate', 'Next Billing')}: {new Date(meta.nextBillingDate).toLocaleDateString()}</p>}
        <p>
          {t('subscriptions.price', 'Price')}: {formatCurrency(subscription.priceUSD, (meta?.currency as SupportedCurrency) || 'USD')}
          {subscription.billingCycle && ` / ${getBillingCycleLabel(subscription.billingCycle, t)}`}
        </p>
        {subscription.planId && <p className="text-xs text-gray-400 dark:text-gray-500">{t('common.id', 'ID')}: {subscription.planId}</p>}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2 justify-end">
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(subscription.id)}
            className="flex items-center px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
          >
            <Info className="w-4 h-4 mr-1.5" />
            {t('common.details', 'Details')}
          </button>
        )}
        {canRenew && onRenew && (
          <button
            onClick={() => onRenew(subscription.id)} // Pass subscription.id
            className="flex items-center px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            <Check className="w-4 h-4 mr-1.5" />
            {t('common.renew', 'Renew')}
          </button>
        )}
        {canCancel && onCancel && (
          <button
            onClick={() => onCancel(subscription.id)} // Pass subscription.id
            className="flex items-center px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
          >
            <X className="w-4 h-4 mr-1.5" />
            {t('common.cancel', 'Cancel')}
          </button>
        )}
      </div>
    </div>
  );
}
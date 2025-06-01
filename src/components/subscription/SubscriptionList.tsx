import { Info, RefreshCw, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next'; // Import TFunction from i18next
import { CustomerSubscription, PlanBillingCycle, PlanStatus } from '../../types/subscription';
import { SupportedCurrency } from '../../types/currency'; // Ensure SupportedCurrency is imported
import { formatCurrency } from '../../utils/currency';

interface SubscriptionListProps {
  subscriptions: CustomerSubscription[];
  onRenew: (subscriptionId: string) => void;
  onCancel: (subscriptionId: string) => void;
  onViewDetails?: (subscriptionId: string) => void;
}

const getStatusLabelAndColor = (status: PlanStatus | undefined, t: TFunction) => {
  switch (status) {
    case 'active':
      return { label: t('status.active', 'Actif'), color: 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' };
    case 'cancelled':
      return { label: t('status.cancelled', 'Annulé'), color: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' };
    case 'expired':
      return { label: t('status.expired', 'Expiré'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100' };
    case 'pending':
        return { label: t('status.pending', 'En attente'), color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100' };
    case 'payment_failed':
        return { label: t('status.payment_failed', 'Paiement échoué'), color: 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100' };
    default:
      return { label: t('status.unknown', 'Inconnu'), color: 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-100' };
  }
};

const getBillingCycleLabel = (cycle: PlanBillingCycle | undefined, t: TFunction) => {
    switch (cycle) {
      case 'monthly': return t('billingCycles.monthly', 'Mensuel');
      case 'quarterly': return t('billingCycles.quarterly', 'Trimestriel');
      case 'yearly': return t('billingCycles.yearly', 'Annuel');
      default: return cycle || t('billingCycles.not_specified', 'Non spécifié');
    }
  };

// Define an interface for the expected shape of metaData
interface ListMetaData {
    nextBillingDate?: string;
    currency?: string;
    accountManager?: string;
    specialConditions?: string;
    notes?: string;
    tags?: string[];
}

export function SubscriptionList({ subscriptions, onRenew, onCancel, onViewDetails }: SubscriptionListProps) {
  const { t } = useTranslation();

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t('subscriptions.noneActive', 'Aucun abonnement actif')}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {subscriptions.map((sub: CustomerSubscription) => {
        const statusInfo = getStatusLabelAndColor(sub.status, t);
        const canRenew = sub.status === 'cancelled' || sub.status === 'expired' || sub.status === 'payment_failed';
        const canCancel = sub.status === 'active' || sub.status === 'pending' || sub.status === 'payment_failed';
        
        const meta = sub.metaData as ListMetaData | undefined; // Cast metaData

        return (
          <div key={sub.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{sub.planName || t('subscriptions.planNameUnknown', 'Plan sans nom')}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <p>{t('subscriptions.startDate', 'Date de début')}: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : t('common.notApplicable', 'N/A')}</p>
                <p>{t('subscriptions.endDate', 'Date de fin')}: {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : t('common.notApplicable', 'N/A')}</p>
                {/* Use the casted meta object */}
                {meta?.nextBillingDate && <p>{t('subscriptions.nextBillingDate', 'Prochaine facturation')}: {new Date(meta.nextBillingDate).toLocaleDateString()}</p>}
                <p>
                  {/* Use the casted meta object and assert currency type */}
                  {t('subscriptions.price', 'Prix')}: {formatCurrency(sub.priceUSD, (meta?.currency as SupportedCurrency) || 'USD')}
                  {sub.billingCycle && ` / ${getBillingCycleLabel(sub.billingCycle, t)}`}
                </p>
                {sub.planId && <p className="text-xs text-gray-400 dark:text-gray-500">ID: {sub.planId}</p>}
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex flex-wrap gap-2 justify-end">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(sub.id)}
                  className="flex items-center px-3 py-2 text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                >
                  <Info className="w-4 h-4 mr-1.5" />
                  {t('common.details', 'Détails')}
                </button>
              )}
              {canRenew && (
                <button
                  onClick={() => onRenew(sub.id)}
                  className="flex items-center px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md"
                >
                  <RefreshCw className="w-4 h-4 mr-1.5" />
                  {t('common.renew', 'Renouveler')}
                </button>
              )}
              {canCancel && (
                <button
                  onClick={() => onCancel(sub.id)}
                  className="flex items-center px-3 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  {t('common.cancel', 'Annuler')}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
import { useTranslation } from 'react-i18next';
import { BarChart4, CreditCard, CalendarDays, UserCircle, Mail } from 'lucide-react';
import type { CustomerSubscription, PlanStatus } from '../../types/subscription';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import type { SupportedCurrency } from '../../types/currency';
import type { TFunction } from 'i18next';

interface SubscriptionInfoCardProps {
  subscription: CustomerSubscription | null | undefined;
  customerName?: string;
  customerEmail?: string;
  onViewInvoices?: () => void;
  onManageSubscription?: () => void;
}

const getSubscriptionStatusClass = (status: PlanStatus | undefined, t: TFunction) => {
  switch (status) {
    case 'active':
      return { class: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200', label: t('status.active', 'Active') };
    case 'pending':
      return { class: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', label: t('status.pending', 'Pending') };
    case 'expired':
      return { class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: t('status.expired', 'Expired') };
    case 'cancelled':
      return { class: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', label: t('status.cancelled', 'Cancelled') };
    case 'payment_failed':
        return { class: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', label: t('status.payment_failed', 'Payment Failed') };
    default:
      return { class: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300', label: t('status.unknown', 'Unknown') };
  }
};

export function SubscriptionInfoCard({ 
    subscription, 
    customerName,
    customerEmail,
    onViewInvoices, 
    onManageSubscription 
}: SubscriptionInfoCardProps) {
  const { t } = useTranslation();
  const { formatInCurrency } = useCurrencySettings();

  if (!subscription) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400">{t('customers.subscription.noSubscription', 'No subscription data available.')}</p>
        {onManageSubscription && (
             <button
                onClick={onManageSubscription}
                className="mt-4 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {t('customers.subscription.manage', 'Manage Subscription')}
              </button>
        )}
      </div>
    );
  }

  const statusDetails = getSubscriptionStatusClass(subscription.status, t);
  const meta = subscription.metaData as { nextBillingDate?: string; currency?: string; accountManager?: string; specialConditions?: string; notes?: string; tags?: string[]; } | undefined;

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('customers.subscription.title', 'Subscription & Billing')}
        </h3>
        {onManageSubscription && (
            <button
                onClick={onManageSubscription}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
                {t('customers.subscription.manage', 'Manage')}
            </button>
        )}
      </div>
      
      <div className="px-6 py-5">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 flex items-center dark:text-gray-400">
              <BarChart4 className="w-4 h-4 mr-2" />
              {t('customers.subscription.info', 'Subscription Details')}
            </h4>
            <div className="mt-2 flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('customers.subscription.plan', 'Plan')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {subscription.planName || t('customers.subscription.noPlan', 'N/A')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('customers.subscription.status', 'Status')}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.class}`}>
                  {statusDetails.label}
                </span>
              </div>
              
              {subscription.endDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarDays className="w-3 h-3 mr-1.5" /> {t('customers.subscription.expiry', 'Expires On')}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {meta?.nextBillingDate && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <CalendarDays className="w-3 h-3 mr-1.5" /> {t('customers.subscription.nextBilling', 'Next Billing')}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {new Date(meta.nextBillingDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center dark:text-gray-400">
              <CreditCard className="w-4 h-4 mr-2" />
              {t('customers.subscription.billing', 'Billing Information')}
            </h4>
            <div className="mt-2 flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <UserCircle className="w-3 h-3 mr-1.5" /> {t('customers.subscription.contact', 'Contact Name')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {subscription.customerName || customerName || t('common.notApplicable', 'N/A')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Mail className="w-3 h-3 mr-1.5" /> {t('customers.subscription.email', 'Contact Email')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {customerEmail || t('common.notApplicable', 'N/A')}
                </span>
              </div>
              
              {subscription.lastPaymentDate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('customers.subscription.lastPaymentDate', 'Last Payment')}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {new Date(subscription.lastPaymentDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('customers.subscription.amount', 'Amount Paid')}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatInCurrency(subscription.priceUSD, meta?.currency as SupportedCurrency || subscription.localCurrency || 'USD')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {onViewInvoices && (
            <div className="pt-4">
              <button
                onClick={onViewInvoices}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('customers.subscription.viewInvoices', 'View All Invoices')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { useTranslation } from 'react-i18next';
import { CreditCard, AlertTriangle, Users, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrencySettings } from '../../../hooks/useCurrencySettings';
import type { CustomerSubscription, SubscriptionPlanDefinition } from '../../../types/subscription';

interface SubscriptionOverviewProps {
  subscriptions: CustomerSubscription[];
  plans: SubscriptionPlanDefinition[];
  isLoading?: boolean;
}

export function SubscriptionOverview({ 
  subscriptions,
  plans,
  isLoading = false,
}: SubscriptionOverviewProps) {
  const { t } = useTranslation();
  const { format } = useCurrencySettings();

  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const pendingSubscriptions = subscriptions.filter(s => s.status === 'pending').length;
  const expiringSoonCount = subscriptions.filter(s => {
    if (s.status !== 'active' || !s.endDate) return false;
    const endDate = new Date(s.endDate);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    return endDate > today && endDate <= thirtyDaysFromNow;
  }).length;

  const totalMRR = subscriptions.reduce((acc, sub) => {
    if (sub.status === 'active' && sub.billingCycle === 'monthly') {
      return acc + sub.priceUSD;
    }
    if (sub.status === 'active' && sub.billingCycle === 'yearly') {
      return acc + (sub.priceUSD / 12);
    }
    if (sub.status === 'active' && sub.billingCycle === 'quarterly') {
        return acc + (sub.priceUSD / 3);
    }
    return acc;
  }, 0);

  const planCounts = subscriptions.reduce((acc, sub) => {
    acc[sub.planId] = (acc[sub.planId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostPopularPlanId = Object.keys(planCounts).sort((a, b) => planCounts[b] - planCounts[a])[0];
  const mostPopularPlan = plans.find(p => p.id === mostPopularPlanId);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.subscription.title', 'Subscriptions Overview')}</h3>
        <Link 
          to="/finance/subscriptions"
          className="text-sm font-medium text-primary hover:text-primary-dark"
        >
          {t('common.viewAll', 'View All')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <Users className="w-5 h-5 mr-2" />
            <p className="text-sm font-medium">{t('dashboard.subscription.active', 'Active Subscriptions')}</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">{activeSubscriptions}</p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-5 h-5 mr-2" />
            <p className="text-sm font-medium">{t('dashboard.subscription.mrr', 'Estimated MRR')}</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {format(totalMRR)}
          </p>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <CreditCard className="w-5 h-5 mr-2" />
            <p className="text-sm font-medium">{t('dashboard.subscription.mostPopularPlan', 'Most Popular Plan')}</p>
          </div>
          <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1 truncate" title={mostPopularPlan?.name || 'N/A'}>
            {mostPopularPlan?.name || t('common.notApplicable', 'N/A')}
          </p>
          {mostPopularPlan && <p className="text-xs text-gray-500 dark:text-gray-400">{planCounts[mostPopularPlan.id]} {t('dashboard.subscription.subscribers', 'subscribers')}</p>}
        </div>
      </div>

      {(expiringSoonCount > 0 || pendingSubscriptions > 0) && (
        <div className="space-y-3 mb-6">
            {expiringSoonCount > 0 && (
              <Link to="/finance/subscriptions?status=active&expiring=true" className="block p-3 rounded-md bg-amber-50 dark:bg-amber-700 hover:bg-amber-100 dark:hover:bg-amber-600">
                <div className="flex items-center text-amber-700 dark:text-amber-100">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">
                    {t('dashboard.subscription.expiringSoon', { count: expiringSoonCount, defaultValue: '{{count}} subscriptions expiring in next 30 days' })}
                    </span>
                </div>
              </Link>
            )}
            {pendingSubscriptions > 0 && (
              <Link to="/finance/subscriptions?status=pending" className="block p-3 rounded-md bg-blue-50 dark:bg-blue-700 hover:bg-blue-100 dark:hover:bg-blue-600">
                <div className="flex items-center text-blue-700 dark:text-blue-100">
                    <TrendingDown className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">
                    {t('dashboard.subscription.pendingActivation', { count: pendingSubscriptions, defaultValue: '{{count}} subscriptions pending activation' })}
                    </span>
                </div>
              </Link>
            )}
        </div>
      )}

      <Link
        to="/finance/subscriptions"
        className="block w-full text-center py-3 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium"
      >
        {t('dashboard.subscription.manageAll', 'Manage All Subscriptions')}
      </Link>
    </div>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../../utils/currency';

interface SubscriptionOverviewProps {
  activeSubscriptions: number;
  expiringSubscriptions: number;
  revenue: {
    usd: number;
    cdf: number;
  };
}

export function SubscriptionOverview({ 
  activeSubscriptions,
  expiringSubscriptions,
  revenue 
}: SubscriptionOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('dashboard.subscription.title')}</h3>
        <Link 
          to="/subscriptions" 
          className="text-primary hover:text-primary-dark text-sm"
        >
          {t('common.viewAll')}
        </Link>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.subscription.active')}</p>
            <p className="text-lg font-medium">{activeSubscriptions}</p>
          </div>
          <CreditCard className="w-8 h-8 text-primary" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{t('dashboard.subscription.revenue')}</p>
            <p className="text-lg font-medium">
              {formatCurrency(revenue.usd, 'USD')}
              <span className="block text-sm text-gray-500">
                {formatCurrency(revenue.cdf, 'CDF')}
              </span>
            </p>
          </div>
        </div>

        {expiringSubscriptions > 0 && (
          <div className="flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-md">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">
              {t('dashboard.subscription.expiringSoon', { count: expiringSubscriptions })}
            </span>
          </div>
        )}

        <Link
          to="/subscriptions"
          className="block w-full text-center py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {t('dashboard.subscription.manage')}
        </Link>
      </div>
    </div>
  );
}
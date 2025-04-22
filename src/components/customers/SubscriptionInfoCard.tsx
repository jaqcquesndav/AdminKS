import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart4, CreditCard } from 'lucide-react';

export interface SubscriptionInfo {
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'canceled' | 'none';
  subscriptionPlan?: string;
  subscriptionExpiry?: string;
  billingContactName?: string;
  billingContactEmail?: string;
  lastInvoiceAmount?: number;
  lastInvoiceDate?: string;
}

interface SubscriptionInfoCardProps {
  subscription: SubscriptionInfo;
  onViewInvoices?: () => void;
}

export function SubscriptionInfoCard({ subscription, onViewInvoices }: SubscriptionInfoCardProps) {
  const { t } = useTranslation();

  const getSubscriptionStatusClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'canceled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          {t('customers.subscription.title', 'Abonnement & Facturation')}
        </h3>
      </div>
      
      <div className="px-6 py-5">
        <div className="space-y-6">
          {/* Subscription information */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 flex items-center dark:text-gray-400">
              <BarChart4 className="w-4 h-4 mr-2" />
              {t('customers.subscription.info', 'Abonnement')}
            </h4>
            <div className="mt-2 flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('customers.subscription.plan', 'Plan')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {subscription.subscriptionPlan || t('customers.subscription.noPlan', 'Aucun')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('customers.subscription.status', 'Statut')}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubscriptionStatusClass(subscription.subscriptionStatus)}`}>
                  {subscription.subscriptionStatus === 'active' 
                    ? t('status.active', 'Actif')
                    : subscription.subscriptionStatus === 'trial' 
                    ? t('status.trial', 'Essai')
                    : subscription.subscriptionStatus === 'expired' 
                    ? t('status.expired', 'Expiré')
                    : subscription.subscriptionStatus === 'canceled' 
                    ? t('status.canceled', 'Annulé') 
                    : t('status.none', 'Aucun')}
                </span>
              </div>
              
              {subscription.subscriptionExpiry && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {t('customers.subscription.expiry', 'Expiration')}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {subscription.subscriptionExpiry}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-500 flex items-center dark:text-gray-400">
              <CreditCard className="w-4 h-4 mr-2" />
              {t('customers.subscription.billing', 'Facturation')}
            </h4>
            <div className="mt-2 flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('customers.subscription.contact', 'Contact')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {subscription.billingContactName || '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {t('customers.subscription.email', 'Email')}
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {subscription.billingContactEmail || '-'}
                </span>
              </div>
              
              {subscription.lastInvoiceDate && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('customers.subscription.lastInvoice', 'Dernière facture')}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {subscription.lastInvoiceDate}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t('customers.subscription.amount', 'Montant')}
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {subscription.lastInvoiceAmount?.toFixed(2)} €
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
                {t('customers.subscription.viewInvoices', 'Voir toutes les factures')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
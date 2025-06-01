import { useTranslation } from 'react-i18next';
import { Building2, Users, CreditCard, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCurrencySettings } from '../../../hooks/useCurrencySettings';

export function CompanyOverview() {
  const { t } = useTranslation();
  const { format, activeCurrency, convert } = useCurrencySettings();

  // Mock data - replace with real data from API
  const companyStats = {
    employees: 12,
    activeSubscriptions: 2,
    totalRevenue: {
      usd: 1500, // Assuming this is the base amount in USD
    }
  };

  // Calculate revenue in active currency
  const revenueInActiveCurrency = convert(companyStats.totalRevenue.usd, 'USD', activeCurrency);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('dashboard.company.title', 'Aperçu de l\'entreprise')}</h3>
        <Link 
          to="/company/profile" 
          className="text-primary hover:text-primary-dark text-sm flex items-center"
        >
          {t('common.viewAll', 'Voir tout')}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-gray-500">
              {t('dashboard.company.employees', 'Employés')}
            </span>
          </div>
          <p className="text-2xl font-bold">
            {companyStats.employees}
          </p>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-gray-500">
              {t('dashboard.company.subscriptions', 'Abonnements actifs')}
            </span>
          </div>
          <p className="text-2xl font-bold">
            {companyStats.activeSubscriptions}
          </p>
        </div>

        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm text-gray-500">
              {t('dashboard.company.revenue', 'Chiffre d\'affaires')}
            </span>
          </div>
          <p className="text-2xl font-bold">
            {format(revenueInActiveCurrency)} 
          </p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium mb-4">
          {t('dashboard.company.quickActions', 'Actions rapides')}
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/company/profile"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <Building2 className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium">
                {t('dashboard.company.updateProfile', 'Mettre à jour le profil')}
              </p>
              <p className="text-sm text-gray-500">
                {t('dashboard.company.updateProfileDesc', 'Modifier les informations de l\'entreprise')}
              </p>
            </div>
          </Link>

          <Link
            to="/subscriptions"
            className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <CreditCard className="w-5 h-5 text-gray-400 mr-3" />
            <div>
              <p className="font-medium">
                {t('dashboard.company.manageSubscriptions', 'Gérer les abonnements')}
              </p>
              <p className="text-sm text-gray-500">
                {t('dashboard.company.manageSubscriptionsDesc', 'Voir et modifier vos abonnements')}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
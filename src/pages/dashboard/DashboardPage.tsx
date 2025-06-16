import { useMemo } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../hooks/useAuth';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { StatCard } from '../../components/dashboard/stats/StatCard';
import { RevenueChart } from '../../components/dashboard/charts/RevenueChart';
import { TokenUsageChart } from '../../components/dashboard/charts/TokenUsageChart';
import { PageLoader } from '../../components/common/PageLoader';
import { UnifiedDashboardTable } from '../../components/dashboard/UnifiedDashboardTable';
import BlurOverlay from '../../components/common/BlurOverlay';
import { ConnectionError } from '../../components/common/ConnectionError';
import {
  Users,
  CreditCard,
  Activity,
  DollarSign,
  Cpu,
  Building,
  Server,
  ClipboardCheck
} from 'lucide-react';

export function DashboardPage() {
  const { t } = useTranslation(); // Initialize t function
  const { user } = useAuth();
  const { 
    userStats, 
    systemHealth, 
    revenueStats, 
    tokenStats, 
    pendingAccounts,
    pendingPayments,
    isLoading,
    error
  } = useDashboardData(user?.role || '');
  const { format: formatCurrency, convert, activeCurrency } = useCurrencySettings();

  // Calculer la différence en pourcentage pour les tendances
  const userGrowth = useMemo(() => {
    if (!userStats?.userGrowth || userStats.userGrowth.length < 2) return 0;
    const lastIndex = userStats.userGrowth.length - 1;
    const current = userStats.userGrowth[lastIndex].count;
    const previous = userStats.userGrowth[lastIndex - 1].count;
    return ((current - previous) / previous) * 100;
  }, [userStats]);

  // Calculer la différence pour les revenus
  const revenueGrowth = useMemo(() => {
    if (!revenueStats?.revenueTrend || revenueStats.revenueTrend.length < 4) return 0;
    const trend = revenueStats.revenueTrend;
    // Ensure amounts are converted to active currency before comparison if they are not already
    // Assuming revenueTrend amounts are in USD (base currency)
    const convertToActive = (amount: number) => convert(amount, 'USD', activeCurrency);

    const currentMonth = convertToActive(trend[trend.length - 2].amount) + convertToActive(trend[trend.length - 1].amount);
    const previousMonth = convertToActive(trend[trend.length - 4].amount) + convertToActive(trend[trend.length - 3].amount);
    if (previousMonth === 0) return currentMonth > 0 ? Infinity : 0; // Avoid division by zero
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  }, [revenueStats, convert, activeCurrency]);

  // Données pour les graphiques de revenus
  const revenueChartData = useMemo(() => {
    if (!revenueStats?.revenueTrend) return [];
    
    // Grouper les données par date et type
    const groupedData = revenueStats.revenueTrend.reduce((acc: Array<{
      date: string;
      subscription: number;
      token: number;
    }>, item) => {
      const existingItem = acc.find(i => i.date === item.date);
      if (existingItem) {
        if (item.type === 'subscription') {
          existingItem.subscription = item.amount;
        } else {
          existingItem.token = item.amount;
        }
      } else {
        acc.push({
          date: item.date,
          subscription: item.type === 'subscription' ? item.amount : 0,
          token: item.type === 'token' ? item.amount : 0,
        });
      }
      return acc;
    }, [] as Array<{
      date: string;
      subscription: number;
      token: number;
    }>);
    
    return groupedData;
  }, [revenueStats]);

  // Données pour les graphiques d'utilisation de tokens
  const tokenUsageData = useMemo(() => {
    if (!tokenStats?.tokenUsageTrend) return [];
    return tokenStats.tokenUsageTrend.map((item: { date: string; used: number; cost: number; revenue: number }) => ({
      date: item.date,
      used: item.used,
      cost: item.cost,
      revenue: item.revenue
    }));
  }, [tokenStats]);


  // Afficher un loader plein écran lorsque les données sont en cours de chargement
  if (isLoading && !userStats) {
    return <PageLoader />;
  }

  // Meilleure gestion des erreurs - utilisation du composant ConnectionError
  if (error) {
    const errorMessage = typeof error === 'string' ? error : t('dashboard.loadError'); // Translate error message
    return (
      <div className="container mx-auto px-4 py-8">
        <ConnectionError 
          message={errorMessage} 
          retry={() => window.location.reload()} 
          className="mx-auto max-w-lg"
        />
      </div>
    );
  }

  // Adapter le contenu en fonction du rôle de l'utilisateur
  const showFinancialMetrics = ['super_admin', 'growth_finance'].includes(user?.role || '');
  const showSystemMetrics = ['super_admin', 'cto'].includes(user?.role || '');
    return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.title')}</h1> {/* Translate title */}
      
      {/* Utilisation de BlurOverlay uniquement pour les cartes KPI et les graphiques */}
      <BlurOverlay isLoading={isLoading} opacity={0.6}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          <StatCard
            title={t('dashboard.totalUsers')} // Translate card title
            value={userStats.totalUsers.toLocaleString()}
            icon={<Users size={20} />}
            change={{
              value: userGrowth,
              isPositive: userGrowth > 0,
              text: t('dashboard.vsPreviousMonth') // Translate change text
            }}
            color="primary"
          />          {showFinancialMetrics && (
            <StatCard
              title={t('dashboard.monthlyRevenue')} // Translate card title
              value={formatCurrency(revenueStats?.totalRevenue?.usd || 0)}
              trend={revenueGrowth}
              icon={<DollarSign size={20} />}
              color="success"
            />
          )}
            <StatCard
            title={t('dashboard.tokensUsed')} // Translate card title
            value={Math.floor(tokenStats?.totalTokensUsed || 0).toLocaleString()}
            icon={<Cpu size={20} />}
            trend={tokenStats?.tokenUsageGrowth || 0}
            color="info"
          />
          
          {showFinancialMetrics && (
            <StatCard
              title={t('dashboard.tokenCost')} // Translate card title
              value={formatCurrency(tokenStats?.totalTokenCost || 0)}
              icon={<Activity size={20} />}
              color="primary"
            />
          )}
          
          <StatCard
            title={t('dashboard.customerAccounts')} // Translate card title
            value={(userStats.totalUsers - (userStats.usersByRole.admin || 0)).toLocaleString()}
            icon={<Building size={20} />}
            color="primary"
          />
          
          {showSystemMetrics && (
            <StatCard
              title={t('dashboard.systemHealth')} // Translate card title
              value={systemHealth.overallHealth === 'healthy' ? t('dashboard.operational') : t('dashboard.attentionRequired')} // Translate system health status
              icon={<Server size={20} />}
              color={systemHealth.overallHealth === 'healthy' ? 'success' : 'warning'}
            />
          )}
          
          <StatCard
            title={t('dashboard.pendingAccounts')} // Translate card title
            value={pendingAccounts}
            icon={<ClipboardCheck size={20} />}
            color="warning"
          />
          
          {showFinancialMetrics && (
            <StatCard
              title={t('dashboard.paymentsToValidate')} // Translate card title
              value={pendingPayments}
              icon={<CreditCard size={20} />}
              color="warning"
            />
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {showFinancialMetrics && (
            <RevenueChart
              data={revenueChartData}
              title={t('dashboard.revenueEvolution')} // Translate chart title
            />
          )}
          
          <TokenUsageChart
            timeData={tokenUsageData}
            title={t('dashboard.aiTokenUsage')} // Translate chart title
            type="line"
          />
        </div>
      </BlurOverlay>

      {/* Tableau d'activité récente unifié - en dehors du BlurOverlay pour toujours afficher les en-têtes */}
      <div className="mt-8">
        <UnifiedDashboardTable 
          title={t('dashboard.recentActivity')} // Translate table title
          showFilters={true}
          limit={10}
        />
      </div>
    </div>
  );
}

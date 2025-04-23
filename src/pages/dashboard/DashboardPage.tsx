import { useMemo } from 'react';
import { useDashboardData } from '../../hooks/useDashboardData';
import { useAuth } from '../../hooks/useAuth';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { StatCard } from '../../components/dashboard/stats/StatCard';
import { RevenueChart } from '../../components/dashboard/charts/RevenueChart';
import { TokenUsageChart } from '../../components/dashboard/charts/TokenUsageChart';
import { PageLoader } from '../../components/common/PageLoader';
import { UnifiedDashboardTable } from '../../components/dashboard/UnifiedDashboardTable';
import {
  Users,
  CreditCard,
  AlertTriangle,
  Activity,
  DollarSign,
  Cpu,
  Building,
  Server,
  ClipboardCheck
} from 'lucide-react';

export function DashboardPage() {
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
  const { formatCurrency } = useCurrencySettings();

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
    const currentMonth = trend[trend.length - 2].amount + trend[trend.length - 1].amount;
    const previousMonth = trend[trend.length - 4].amount + trend[trend.length - 3].amount;
    return ((currentMonth - previousMonth) / previousMonth) * 100;
  }, [revenueStats]);

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


  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          <AlertTriangle size={48} className="mx-auto mb-4" />
          <h2 className="text-xl font-bold">Erreur lors du chargement du tableau de bord</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Adapter le contenu en fonction du rôle de l'utilisateur
  const showFinancialMetrics = ['super_admin', 'growth_finance'].includes(user?.role || '');
  const showSystemMetrics = ['super_admin', 'cto'].includes(user?.role || '');

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Kiota Suit Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Utilisateurs Totaux"
          value={userStats.totalUsers.toLocaleString()}
          icon={<Users size={20} />}
          change={{
            value: userGrowth,
            isPositive: userGrowth > 0,
            text: "vs mois précédent"
          }}
          color="primary"
        />
        
        <StatCard
          title="Utilisateurs Actifs"
          value={`${userStats.activeUsers.toLocaleString()} (${Math.round(userStats.activeUsers / userStats.totalUsers * 100)}%)`}
          icon={<Activity size={20} />}
          color="success"
        />
        
        {showFinancialMetrics && (
          <StatCard
            title="Revenu Total"
            value={formatCurrency(revenueStats.totalRevenue.usd)}
            icon={<DollarSign size={20} />}
            change={{
              value: revenueGrowth,
              isPositive: revenueGrowth > 0,
              text: "vs mois précédent"
            }}
            color="info"
          />
        )}
        
        {showFinancialMetrics && (
          <StatCard
            title="Revenu Tokens IA"
            value={formatCurrency(revenueStats.tokenRevenue)}
            icon={<Cpu size={20} />}
            color="info"
          />
        )}
        
        <StatCard
          title="Comptes Clients"
          value={(userStats.totalUsers - (userStats.usersByRole.admin || 0)).toLocaleString()}
          icon={<Building size={20} />}
          color="primary"
        />
        
        {showSystemMetrics && (
          <StatCard
            title="Santé Système"
            value={systemHealth.overallHealth === 'healthy' ? 'Opérationnel' : 'Attention Requise'}
            icon={<Server size={20} />}
            color={systemHealth.overallHealth === 'healthy' ? 'success' : 'warning'}
          />
        )}
        
        <StatCard
          title="Comptes en Attente"
          value={pendingAccounts}
          icon={<ClipboardCheck size={20} />}
          color="warning"
        />
        
        {showFinancialMetrics && (
          <StatCard
            title="Paiements à Valider"
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
            title="Évolution des revenus"
          />
        )}
        
        <TokenUsageChart
          timeData={tokenUsageData}
          title="Utilisation des Tokens IA"
          type="line"
        />
      </div>

      {/* Tableau d'activité récente unifié */}
      <div className="mt-8">
        <UnifiedDashboardTable 
          title="Activité récente" 
          showFilters={true}
          limit={10}
        />
      </div>
    </div>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, Clock, CreditCard, Coins } from 'lucide-react';
import { StatCard } from '../../components/dashboard/stats/StatCard';
import { TokenUsageChart } from '../../components/dashboard/charts/TokenUsageChart';
import { RecentActivities } from '../../components/dashboard/activity/RecentActivities';
import { SubscriptionOverview } from '../../components/dashboard/subscription/SubscriptionOverview';
import { SystemOverview } from '../../components/dashboard/system/SystemOverview';
import { PageLoader } from '../../components/common/PageLoader';
import { useDashboardData } from '../../hooks/useDashboardData';

export function DashboardPage() {
  const { t } = useTranslation();
  const { stats, systemStatus, activities, tokenUsage, subscriptionStats, isLoading } = useDashboardData();

  if (isLoading) {
    return <PageLoader />;
  }

  const statCards = [
    {
      name: t('dashboard.stats.activeUsers'),
      value: stats?.activeUsers.toString() || '0',
      icon: Users,
      trend: '+12%',
      trendDirection: 'up' as const
    },
    {
      name: t('dashboard.stats.activeSessions'),
      value: stats?.activeSessions.toString() || '0',
      icon: Clock,
      trend: '+5%',
      trendDirection: 'up' as const
    },
    {
      name: t('dashboard.stats.subscriptions'),
      value: subscriptionStats?.activeSubscriptions.toString() || '0',
      icon: CreditCard,
      trend: '+8%',
      trendDirection: 'up' as const
    },
    {
      name: t('dashboard.stats.revenue'),
      value: `${stats?.revenue.usd.toLocaleString()} USD`,
      secondaryValue: `${stats?.revenue.cdf.toLocaleString()} CDF`,
      icon: Coins,
      trend: '+15%',
      trendDirection: 'up' as const
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
        <div className="flex items-center space-x-4">
          <select className="input w-40">
            <option value="today">{t('dashboard.period.today')}</option>
            <option value="week">{t('dashboard.period.week')}</option>
            <option value="month">{t('dashboard.period.month')}</option>
            <option value="year">{t('dashboard.period.year')}</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            name={stat.name}
            value={stat.value}
            secondaryValue={stat.secondaryValue}
            icon={stat.icon}
            trend={stat.trend}
            trendDirection={stat.trendDirection}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TokenUsageChart data={tokenUsage} />
        </div>
        <div>
          <SubscriptionOverview
            activeSubscriptions={subscriptionStats?.activeSubscriptions || 0}
            expiringSubscriptions={subscriptionStats?.expiringSubscriptions || 0}
            revenue={subscriptionStats?.revenue || { usd: 0, cdf: 0 }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentActivities activities={activities} />
        <SystemOverview status={systemStatus} />
      </div>
    </div>
  );
}
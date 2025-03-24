import { useState, useEffect } from 'react';
import { dashboardApi } from '../services/api/dashboard';
import { useToastStore } from '../components/common/ToastContainer';
import type { ActivityLog } from '../types/activity';
import type { TokenUsage } from '../types/user';

interface DashboardData {
  stats: {
    activeUsers: number;
    activeSessions: number;
    revenue: {
      usd: number;
      cdf: number;
    };
  } | null;
  systemStatus: {
    memory: {
      used: number;
      total: number;
      percentage: number;
    };
    services: {
      api: 'operational' | 'warning' | 'error';
      database: 'operational' | 'warning' | 'error';
    };
  } | null;
  activities: ActivityLog[];
  tokenUsage: TokenUsage[];
  subscriptionStats: {
    activeSubscriptions: number;
    expiringSubscriptions: number;
    revenue: {
      usd: number;
      cdf: number;
    };
  } | null;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: null,
    systemStatus: null,
    activities: [],
    tokenUsage: [],
    subscriptionStats: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const addToast = useToastStore(state => state.addToast);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [
        statsData,
        systemData,
        activitiesData,
        tokenData,
        subscriptionData
      ] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getSystemStatus(),
        dashboardApi.getRecentActivities({ limit: 5 }),
        dashboardApi.getTokenUsage(),
        dashboardApi.getSubscriptionStats()
      ]);

      setData({
        stats: statsData,
        systemStatus: systemData,
        activities: activitiesData,
        tokenUsage: tokenData,
        subscriptionStats: subscriptionData
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard data'));
      addToast('error', 'Erreur lors du chargement des données du tableau de bord');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [addToast]);

  return {
    ...data,
    isLoading,
    error,
    refresh: fetchDashboardData
  };
}
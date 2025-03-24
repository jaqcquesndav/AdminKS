import api from './client';
import type { ActivityLog } from '../../types/activity';
import type { TokenUsage } from '../../types/user';

interface DashboardStats {
  activeUsers: number;
  activeSessions: number;
  revenue: {
    usd: number;
    cdf: number;
  };
}

interface SystemStatus {
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  services: {
    api: 'operational' | 'warning' | 'error';
    database: 'operational' | 'warning' | 'error';
  };
}

// Mock data pour le développement
const MOCK_DATA = {
  stats: {
    activeUsers: 45,
    activeSessions: 12,
    revenue: {
      usd: 1500,
      cdf: 3750000
    }
  },
  systemStatus: {
    memory: {
      used: 6.2,
      total: 8,
      percentage: 77.5
    },
    services: {
      api: 'operational' as const,
      database: 'operational' as const
    }
  },
  activities: [
    {
      id: '1',
      userId: 'user-1',
      userName: 'Jean Dupont',
      applicationId: 'accounting',
      applicationName: 'Comptabilité',
      type: 'login',
      message: 'Connexion au système',
      timestamp: new Date(),
      severity: 'info'
    },
    {
      id: '2',
      userId: 'user-2',
      userName: 'Marie Martin',
      applicationId: 'sales',
      applicationName: 'Ventes',
      type: 'create',
      message: 'Création d\'une nouvelle facture',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      severity: 'info'
    }
  ],
  tokenUsage: [
    { date: new Date('2024-01-01'), used: 100000, remaining: 900000 },
    { date: new Date('2024-02-01'), used: 250000, remaining: 750000 },
    { date: new Date('2024-03-01'), used: 400000, remaining: 600000 },
    { date: new Date('2024-04-01'), used: 550000, remaining: 450000 },
    { date: new Date('2024-05-01'), used: 650000, remaining: 350000 }
  ],
  subscriptionStats: {
    activeSubscriptions: 3,
    expiringSubscriptions: 1,
    revenue: {
      usd: 450,
      cdf: 1125000
    }
  }
};

export const dashboardApi = {
  // Statistiques générales
  getStats: async (): Promise<DashboardStats> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simuler la latence
      return MOCK_DATA.stats;
    }

    try {
      const response = await api.get('/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw new Error('Impossible de récupérer les statistiques du tableau de bord');
    }
  },

  // Activités récentes
  getRecentActivities: async (params?: { limit?: number }): Promise<ActivityLog[]> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.activities.slice(0, params?.limit || 5);
    }

    try {
      const response = await api.get('/dashboard/activities', { params });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent activities:', error);
      throw new Error('Impossible de récupérer les activités récentes');
    }
  },

  // État du système
  getSystemStatus: async (): Promise<SystemStatus> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.systemStatus;
    }

    try {
      const response = await api.get('/dashboard/system/status');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch system status:', error);
      throw new Error('Impossible de récupérer l\'état du système');
    }
  },

  // Utilisation des tokens
  getTokenUsage: async (params?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<TokenUsage[]> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.tokenUsage;
    }

    try {
      const response = await api.get('/dashboard/tokens/usage', {
        params: {
          startDate: params?.startDate?.toISOString(),
          endDate: params?.endDate?.toISOString()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch token usage:', error);
      throw new Error('Impossible de récupérer l\'utilisation des tokens');
    }
  },

  // Statistiques des abonnements
  getSubscriptionStats: async (): Promise<{
    activeSubscriptions: number;
    expiringSubscriptions: number;
    revenue: {
      usd: number;
      cdf: number;
    };
  }> => {
    if (import.meta.env.DEV) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return MOCK_DATA.subscriptionStats;
    }

    try {
      const response = await api.get('/dashboard/subscriptions/stats');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch subscription stats:', error);
      throw new Error('Impossible de récupérer les statistiques des abonnements');
    }
  }
};
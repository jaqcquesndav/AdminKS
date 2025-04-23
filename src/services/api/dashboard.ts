import apiClient from './client';
import { API_ENDPOINTS } from './config';
import type { CustomerStatistics } from '../../types/customer';
import type { FinancialSummary } from '../../types/finance';

interface DashboardSummary {
  activeCustomers: number;
  totalRevenue: number;
  pendingInvoices: number;
  tokenUsage: number;
  recentActivities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
}

interface TokenStats {
  allocated: number;
  used: number;
  available: number;
  usageByPeriod: Record<string, number>;
  usageByCustomerType: {
    financial: number;
    corporate: number;
    individual: number;
  };
}

export const dashboardApi = {
  // Obtenir le résumé du tableau de bord
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.summary);
    return response.data;
  },

  // Obtenir les statistiques des clients
  getCustomerStats: async (): Promise<CustomerStatistics> => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.customerStats);
    return response.data;
  },

  // Obtenir les statistiques financières
  getFinancialStats: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<FinancialSummary> => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.financialStats, { params: { period } });
    return response.data;
  },

  // Obtenir les statistiques des tokens
  getTokenStats: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<TokenStats> => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.tokenStats, { params: { period } });
    return response.data;
  },

  // Obtenir le flux d'activités
  getActivityStream: async (limit: number = 10): Promise<Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
    user?: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>> => {
    const response = await apiClient.get(API_ENDPOINTS.dashboard.activityStream, { params: { limit } });
    return response.data;
  }
};

export default dashboardApi;
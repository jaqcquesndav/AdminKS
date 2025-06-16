import { useState, useEffect } from 'react';
import { useAdminApi } from '../services/api/adminApiService';
import { UserStatistics } from '../types/user';
import { SystemHealthSnapshot, SystemMetrics } from '../types/system'; // Added SystemMetrics
import { RevenueStatistics, TokenStatistics } from '../types/subscription';
// PlanCategory est un type, pas un enum - nous allons créer les clés comme des chaînes de caractères

interface DashboardData {
  userStats: UserStatistics;
  systemHealth: SystemHealthSnapshot;
  revenueStats: RevenueStatistics;
  tokenStats: TokenStatistics;
  recentAlerts: number;
  pendingAccounts: number;
  pendingPayments: number;
  isLoading: boolean;
  error: string | null;
}

// Initial empty states for complex data structures
const initialUserStats: UserStatistics = {
  totalUsers: 0,
  activeUsers: 0,
  newUsersToday: 0,
  usersByRole: {},
  usersByCountry: {},
  userGrowth: [],
};

const initialSystemMetrics: SystemMetrics = {
  serverHealth: { cpuUsage: 0, memoryUsage: 0, diskUsage: 0, uptime: 0, activeConnections: 0, responseTime: 0 },
  databaseMetrics: {
    postgresql: {
      connectionPoolSize: 0,
      activeConnections: 0,
      queryPerformance: 0,
      storageUsage: 0
    },
    neo4j: {
      activeConnections: 0,
      queryPerformance: 0,
      storageUsage: 0
    },
    timescale: {
      activeConnections: 0,
      compressionRatio: 0,
      retentionPeriod: 0,
      storageUsage: 0
    }
  },
  apiMetrics: { totalRequests: 0, requestsPerMinute: 0, averageResponseTime: 0, errorRate: 0, requestsByEndpoint: {} },
  aiServiceMetrics: { totalRequests: 0, tokensProcessed: 0, averageProcessingTime: 0, errorRate: 0, costIncurred: 0, requestsByModel: {} },
};

const initialSystemHealth: SystemHealthSnapshot = {
  timestamp: new Date().toISOString(),
  overallHealth: 'healthy', // Corrected to a valid literal type
  metrics: initialSystemMetrics, // Corrected to use defined initial metrics
  activeAlerts: [],
  serviceStatuses: [],
};

const initialRevenueStats: RevenueStatistics = {
  totalRevenue: { usd: 0 },
  revenueByPeriod: [],
  averageRevenuePerCustomer: 0,
  revenueByCustomerType: {
    pme: 0,
    financial: 0
  },
  revenueByPlan: {
    'freemium': 0,
    'starter': 0,
    'premium': 0,
    'enterprise': 0,
    'custom': 0,
    'base': 0
  },
  revenueByPaymentMethod: {
    'credit_card': 0,
    'bank_transfer': 0,
    'mobile_money': 0,
    'cash': 0,
    'check': 0
  },
  recurringRevenue: 0,
  oneTimeRevenue: 0,
  tokenRevenue: 0,
  revenueTrend: [],
};

const initialTokenStats: TokenStatistics = {
  totalTokensAllocated: 0,
  totalTokensUsed: 0,
  totalTokensPurchased: 0,
  tokenUsageByPeriod: [],
  tokenUsageByCustomerType: {
    pme: 0,
    financial: 0
  },
  averageTokensPerCustomer: 0,
  top10TokenConsumers: [],
  tokenUsageTrend: []
};

export const useDashboardData = (userRole: string) => {
  const [data, setData] = useState<DashboardData>({
    userStats: initialUserStats,
    systemHealth: initialSystemHealth,
    revenueStats: initialRevenueStats,
    tokenStats: initialTokenStats,
    recentAlerts: 0,
    pendingAccounts: 0,
    pendingPayments: 0,
    isLoading: true,
    error: null,
  });
  const adminApi = useAdminApi();

  useEffect(() => {
    const fetchData = async () => {
      setData(prevData => ({ ...prevData, isLoading: true, error: null }));
      try {
        const dashboardStatsResponse = await adminApi.getDashboardStats();
        
        if (dashboardStatsResponse && dashboardStatsResponse.data) {
          const backendStats = dashboardStatsResponse.data;

          setData({
            userStats: {
              ...initialUserStats,
              totalUsers: backendStats.totalUsers || 0,
              activeUsers: backendStats.activeUsers || 0,
            },
            systemHealth: {
              ...initialSystemHealth,
              // Map relevant fields if available, e.g.:
              // overallHealth: backendStats.someHealthIndicator || 'healthy',
            },
            revenueStats: {
              ...initialRevenueStats,
              totalRevenue: { usd: backendStats.revenueCurrentMonth || 0 }, // Example mapping
              // Map other revenue fields if available
            },
            tokenStats: {
              ...initialTokenStats,
              totalTokensUsed: backendStats.tokenUsage?.total || 0,
              // Map other token fields if available
            },
            recentAlerts: 0, 
            pendingAccounts: 0, 
            pendingPayments: 0, 
            isLoading: false,
            error: null,
          });
        } else {
          throw new Error('No data received from dashboard stats API');
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setData({
          userStats: initialUserStats,
          systemHealth: initialSystemHealth,
          revenueStats: initialRevenueStats,
          tokenStats: initialTokenStats,
          recentAlerts: 0,
          pendingAccounts: 0,
          pendingPayments: 0,
          isLoading: false,
          error: err instanceof Error ? err.message : 'An unknown error occurred',
        });
      }
    };

    fetchData();
  }, [adminApi, userRole]);

  return data;
};
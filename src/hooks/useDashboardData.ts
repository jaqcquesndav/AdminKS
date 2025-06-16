import { useState, useEffect } from 'react';
import { useAdminApi } from '../services/api/adminApiService';
import { UserStatistics } from '../types/user';
import { SystemHealthSnapshot, SystemMetrics } from '../types/system'; // Added SystemMetrics
import { RevenueStatistics, TokenStatistics } from '../types/subscription';
import { PlanCategory } from '../types/subscription'; // Assuming PlanCategory is defined elsewhere

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
  databaseMetrics: { /* Define nested defaults as needed */ },
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
  totalRevenue: { usd: 0 }, // Corrected to match type
  subscriptionRevenue: { usd: 0 },
  tokenRevenue: { usd: 0 },
  revenueTrend: [],
  revenueByCountry: {},
  revenueByPlan: {
    [PlanCategory.FREEMIUM]: 0, // Corrected to match type, assuming PlanCategory enum/type exists
    [PlanCategory.STARTER]: 0,
    [PlanCategory.PREMIUM]: 0,
    [PlanCategory.ENTERPRISE]: 0,
    [PlanCategory.PAY_AS_YOU_GO]: 0,
    [PlanCategory.TRIAL]: 0,
  },
  conversionRate: 0,
  churnRate: 0,
  averageRevenuePerUser: 0,
};

const initialTokenStats: TokenStatistics = {
  totalTokensUsed: 0,
  // totalTokensSold: 0, // Removed as it's not in the type definition
  tokensUsedToday: 0,
  tokensCostToday: 0,
  revenueFromTokens: { usd: 0 },
  profitFromTokens: { usd: 0 },
  tokenUsageByApp: {},
  tokenUsageByFeature: {},
  tokenUsageTrend: [],
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
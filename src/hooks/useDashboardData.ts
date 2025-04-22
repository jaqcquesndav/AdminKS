import { useState, useEffect } from 'react';
import { UserStatistics } from '../types/user';
import { SystemHealthSnapshot } from '../types/system';
import { RevenueStatistics, TokenStatistics } from '../types/subscription';

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

// Mock data pour le développement
const mockDashboardData: Omit<DashboardData, 'isLoading' | 'error'> = {
  userStats: {
    totalUsers: 2458,
    activeUsers: 1897,
    newUsersToday: 37,
    usersByRole: {
      admin: 12,
      user: 2446,
    },
    usersByCountry: {
      'RDC': 1856,
      'Rwanda': 342,
      'Burundi': 112,
      'Kenya': 87,
      'Autres': 61,
    },
    userGrowth: [
      { date: '2025-01', count: 2050 },
      { date: '2025-02', count: 2190 },
      { date: '2025-03', count: 2340 },
      { date: '2025-04', count: 2458 },
    ]
  },
  systemHealth: {
    timestamp: new Date().toISOString(),
    overallHealth: 'healthy',
    metrics: {
      serverHealth: {
        cpuUsage: 28,
        memoryUsage: 64,
        diskUsage: 42,
        uptime: 86400 * 15, // 15 jours en secondes
        activeConnections: 156,
        responseTime: 235, // ms
      },
      databaseMetrics: {
        postgresql: {
          connectionPoolSize: 50,
          activeConnections: 32,
          queryPerformance: 45, // ms
          storageUsage: 68, // %
        },
        neo4j: {
          activeConnections: 12,
          queryPerformance: 78, // ms
          storageUsage: 35, // %
        },
        timescale: {
          activeConnections: 8,
          compressionRatio: 5.4, // ratio
          retentionPeriod: 90, // jours
          storageUsage: 41, // %
        },
      },
      apiMetrics: {
        totalRequests: 1458967,
        requestsPerMinute: 48,
        averageResponseTime: 230, // ms
        errorRate: 0.8, // %
        requestsByEndpoint: {
          '/api/auth': 28764,
          '/api/users': 44587,
          '/api/tokens': 75690,
          '/api/accounting': 356478,
          '/api/ai': 245789,
        }
      },
      aiServiceMetrics: {
        totalRequests: 456722,
        tokensProcessed: 24567800,
        averageProcessingTime: 1200, // ms
        errorRate: 1.2, // %
        costIncurred: 367.89, // USD
        requestsByModel: {
          'gpt-4': 126750,
          'gpt-3.5-turbo': 329972,
        }
      }
    },
    activeAlerts: [
      {
        id: 'alert-1',
        timestamp: new Date().toISOString(),
        level: 'warning',
        component: 'Database',
        message: 'PostgreSQL storage utilization above 65%',
        resolved: false,
      },
      {
        id: 'alert-2',
        timestamp: new Date().toISOString(),
        level: 'info',
        component: 'API Gateway',
        message: 'Throttling detected for some users',
        resolved: false,
      }
    ],
    serviceStatuses: [
      {
        name: 'API Gateway',
        status: 'operational',
        uptime: 99.98,
        currentLoad: 42,
        responseTime: 120,
      },
      {
        name: 'Authentication Service',
        status: 'operational',
        uptime: 99.99,
        currentLoad: 35,
        responseTime: 80,
      },
      {
        name: 'AI Processing',
        status: 'operational',
        uptime: 99.87,
        currentLoad: 68,
        responseTime: 350,
      },
      {
        name: 'Database Service',
        status: 'operational',
        uptime: 99.99,
        currentLoad: 55,
        responseTime: 45,
      }
    ]
  },
  revenueStats: {
    totalRevenue: 156890.45,
    subscriptionRevenue: 124567.90,
    tokenRevenue: 32322.55,
    revenueTrend: [
      { date: '2025-01-01', amount: 36789.45, type: 'subscription' },
      { date: '2025-01-01', amount: 7845.65, type: 'token' },
      { date: '2025-02-01', amount: 38967.55, type: 'subscription' },
      { date: '2025-02-01', amount: 8234.70, type: 'token' },
      { date: '2025-03-01', amount: 42345.80, type: 'subscription' },
      { date: '2025-03-01', amount: 11045.32, type: 'token' },
      { date: '2025-04-01', amount: 46465.10, type: 'subscription' },
      { date: '2025-04-01', amount: 13196.88, type: 'token' },
    ],
    revenueByCountry: {
      'RDC': 98675.34,
      'Rwanda': 35790.23,
      'Burundi': 12456.78,
      'Kenya': 7423.56,
      'Autres': 2544.54,
    },
    revenueByPlan: {
      'basic': 25678.90,
      'standard': 75432.12,
      'premium': 42345.67,
      'enterprise': 13433.76,
    },
    conversionRate: 5.6, // %
    churnRate: 2.1, // %
    averageRevenuePerUser: 63.82, // USD
  },
  tokenStats: {
    totalTokensUsed: 468975320,
    totalTokensSold: 750000000,
    tokensUsedToday: 5674390,
    tokensCostToday: 56.74,
    revenueFromTokens: 32322.55,
    profitFromTokens: 14256.78,
    tokenUsageByApp: {
      'accounting_mobile': 256789450,
      'accounting_web': 134567230,
      'portfolio_management': 77618640,
    },
    tokenUsageByFeature: {
      'document_analysis': 155678230,
      'financial_analysis': 134567890,
      'reporting': 89754320,
      'customer_support': 45678910,
      'other': 43295970,
    },
    tokenUsageTrend: [
      { date: '2025-04-01', used: 5678234, cost: 56.78, revenue: 113.56 },
      { date: '2025-04-02', used: 5234567, cost: 52.35, revenue: 104.70 },
      { date: '2025-04-03', used: 4987234, cost: 49.87, revenue: 99.74 },
      { date: '2025-04-04', used: 5346789, cost: 53.47, revenue: 106.94 },
      { date: '2025-04-05', used: 6234567, cost: 62.35, revenue: 124.70 },
      { date: '2025-04-06', used: 5879234, cost: 58.79, revenue: 117.58 },
      { date: '2025-04-07', used: 5674390, cost: 56.74, revenue: 113.48 },
    ],
  },
  recentAlerts: 5,
  pendingAccounts: 12,
  pendingPayments: 8,
};

export const useDashboardData = (role: string): DashboardData => {
  const [data, setData] = useState<DashboardData>({
    ...mockDashboardData,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simuler un appel API avec un délai
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Pour l'instant, utilisons les données mockées
        // Dans une implémentation réelle, on ferait un appel API ici
        setData({
          ...mockDashboardData,
          isLoading: false,
          error: null
        });
      } catch {
        // Supprimer complètement la variable non utilisée
        setData(prevData => ({
          ...prevData,
          isLoading: false,
          error: 'Erreur lors du chargement des données du dashboard'
        }));
      }
    };

    fetchData();
  }, [role]);

  return data;
};
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAdminApi } from '../services/api/adminApiService';
import { UserStatistics } from '../types/user';
import { SystemHealthSnapshot, SystemMetrics } from '../types/system';
import { RevenueStatistics, TokenStatistics } from '../types/subscription';
import { useToastContext } from '../contexts/ToastContext';
import { DashboardStats } from '../types/dashboard';

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
  overallHealth: 'healthy', 
  metrics: initialSystemMetrics,
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
  totalTokenCost: 0, // Ajout du coût total des tokens
  tokenUsageGrowth: 0, // Ajout de la croissance d'utilisation des tokens
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
  const adminApi = useAdminApi();
  const { showToast } = useToastContext();
  const [isRetrying, setIsRetrying] = useState(false);
  const initialLoadPending = useRef(true); // Nouveau ref
  const [userStats, setUserStats] = useState<UserStatistics>(initialUserStats);
  const [systemHealth, setSystemHealth] = useState<SystemHealthSnapshot>(initialSystemHealth);
  const [revenueStats, setRevenueStats] = useState<RevenueStatistics>(initialRevenueStats);
  const [tokenStats, setTokenStats] = useState<TokenStatistics>(initialTokenStats);
  const [recentAlerts] = useState(0);
  const [pendingAccounts] = useState(0);
  const [pendingPayments] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchData = useCallback(async (isRetry = false) => {
    // Vérifier si un chargement initial est déjà en cours et que ce n'est pas un retry
    if (initialLoadPending.current && !isRetry && isLoading) {
      console.log('Dashboard data fetch skipped: initial load already in progress.');
      return;
    }

    if (isRetry) {
      setIsRetrying(true);
    } else {
      setIsLoading(true);
      setError(null);
    }

    try {
      // Si c'est le premier chargement (pas un retry), marquer que le chargement initial n'est plus en attente
      if (!isRetry) {
        initialLoadPending.current = false;
      }
      // Tenter de se connecter au backend, avec un timeout
      let dashboardStatsResponse: { data: DashboardStats };
      try {
        dashboardStatsResponse = await Promise.race([
          adminApi.getDashboardStats(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('La connexion a expiré. Veuillez vérifier votre connexion Internet.')), 30000)
          )
        ]);
      } catch {
        throw new Error('Problème de connexion au serveur. Veuillez vérifier votre connexion Internet.');
      }
      
      if (dashboardStatsResponse && dashboardStatsResponse.data) {
        const backendStats = dashboardStatsResponse.data;

        // Mettre à jour les stats utilisateurs
        setUserStats({
          ...initialUserStats,
          totalUsers: backendStats.totalUsers || 0,
          activeUsers: backendStats.activeUsers || 0,
        });

        // Mettre à jour les stats système
        setSystemHealth({
          ...initialSystemHealth,
        });

        // Mettre à jour les stats de revenus
        setRevenueStats({
          ...initialRevenueStats,
          totalRevenue: { usd: backendStats.revenueCurrentMonth || 0 },
        });

        // Mettre à jour les stats de tokens
        setTokenStats({
          ...initialTokenStats,
          totalTokensUsed: backendStats.tokenUsage?.total || 0,
        });

        // Réinitialiser les erreurs
        setError(null);

        // Indiquer que les données ont été chargées avec succès
        if (isRetry) {
          showToast('success', 'Connexion rétablie. Données mises à jour avec succès.');
        }
      } else {
        throw new Error('Aucune donnée reçue du serveur.');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des données du tableau de bord:', err);      setError(err instanceof Error ? err.message : 'Une erreur inconnue s\'est produite');
      
      if (!isRetry) {
        showToast('error', `Erreur lors du chargement des données: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
    } finally {
      setIsLoading(false);
      setIsRetrying(false);
    }
  }, [adminApi, showToast, isLoading]);

  // Fonction pour réessayer de charger les données
  const retry = useCallback(() => {
    fetchData(true);
  }, [fetchData]);

  // Effet pour charger les données au montage du composant
  useEffect(() => {
    // Ne lance le fetch que si le chargement initial est en attente
    if (initialLoadPending.current) {
      fetchData();
    }
  }, [fetchData, userRole]); // userRole est conservé car les données peuvent dépendre du rôle

  // Retourner les données et fonctions d'accès
  return {
    userStats,
    systemHealth,
    revenueStats,
    tokenStats,
    recentAlerts,
    pendingAccounts,
    pendingPayments,
    isLoading,
    error,
    retry,
    isRetrying
  };
};

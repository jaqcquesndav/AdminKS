// Types pour les métriques et la gestion du système Kiota Suit

export interface ServerHealthMetrics {
  cpuUsage: number;  // pourcentage d'utilisation du CPU
  memoryUsage: number;  // pourcentage d'utilisation de la mémoire
  diskUsage: number;  // pourcentage d'utilisation du disque
  uptime: number;  // temps d'activité en secondes
  activeConnections: number;  // nombre de connexions actives
  responseTime: number;  // temps de réponse moyen en ms
  customMetrics?: Record<string, number | string | boolean>;  // métriques personnalisées
}

export interface SystemMetrics {
  serverHealth: ServerHealthMetrics;
  databaseMetrics: {
    postgresql: {
      connectionPoolSize: number;
      activeConnections: number;
      queryPerformance: number;
      storageUsage: number;
    };
    neo4j: {
      activeConnections: number;
      queryPerformance: number;
      storageUsage: number;
    };
    timescale: {
      activeConnections: number;
      compressionRatio: number;
      retentionPeriod: number;
      storageUsage: number;
    };
  };
  apiMetrics: {
    totalRequests: number;
    requestsPerMinute: number;
    averageResponseTime: number;
    errorRate: number;
    requestsByEndpoint: Record<string, number>;
  };
  aiServiceMetrics: {
    totalRequests: number;
    tokensProcessed: number;
    averageProcessingTime: number;
    errorRate: number;
    costIncurred: number;
    requestsByModel: Record<string, number>;
  };
}

export interface SystemAlert {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  component: string;
  message: string;
  details?: Record<string, number | string | boolean>;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'outage' | 'maintenance';
  uptime: number;
  lastIncident?: string;
  currentLoad: number;
  responseTime: number;
}

export interface MaintenanceSchedule {
  id: string;
  serviceName: string;
  startTime: string;
  endTime: string;
  description: string;
  affectedComponents: string[];
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notificationSent: boolean;
}

export interface ApiEndpoint {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  description: string;
  averageResponseTime: number;
  requestCount: number;
  errorCount: number;
  lastError?: {
    timestamp: string;
    message: string;
    code: number;
  };
}

export interface ApiPerformanceData {
  endpoint: string;
  method: string;
  averageResponseTime: number;  // en ms
  requestCount: number;
  errorRate: number;  // en pourcentage
  metadata?: Record<string, number | string | boolean>;  // métadonnées supplémentaires
}

export interface BackendConfiguration {
  environment: 'development' | 'staging' | 'production';
  dbConnections: {
    postgresql: string;
    neo4j: string;
    timescale: string;
  };
  aiProviders: {
    openai: {
      modelConfiguration: Record<string, {
        enabled: boolean;
        costPerToken: number;
        rateLimit: number;
      }>;
      apiKeys: string[];
    };
    // Autres fournisseurs d'IA si nécessaire
  };
  featureFlags: Record<string, boolean>;
}

export interface DatabaseBackupStatus {
  lastBackupTime: string;
  backupSize: number;
  status: 'success' | 'failed' | 'in_progress';
  location: string;
  retentionDays: number;
}

export interface AIModelUsage {
  model: string;
  provider: string;
  tokensProcessed: number;
  cost: number;
  requests: number;
  averageTokensPerRequest: number;
  usageByApp: Record<string, number>;
}

export interface SystemHealthSnapshot {
  timestamp: string;
  overallHealth: 'healthy' | 'warning' | 'critical';
  metrics: SystemMetrics;
  activeAlerts: SystemAlert[];
  serviceStatuses: ServiceStatus[];
}

// Logs système pour le debugging et l'audit
export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  service: string;
  message: string;
  details?: Record<string, number | string | boolean>;
  userId?: string;
  requestId?: string;
  ipAddress?: string;
}
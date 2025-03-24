import React from 'react';
import { useTranslation } from 'react-i18next';
import { Server, Database, Activity, AlertTriangle } from 'lucide-react';

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

export function SystemOverview() {
  const { t } = useTranslation();

  // Mock data - replace with real data from API
  const systemStatus: SystemStatus = {
    memory: {
      used: 6.2,
      total: 8,
      percentage: 77.5
    },
    services: {
      api: 'operational',
      database: 'operational'
    }
  };

  const getStatusColor = (status: 'operational' | 'warning' | 'error') => {
    switch (status) {
      case 'operational':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
    }
  };

  const getStatusIcon = (status: 'operational' | 'warning' | 'error') => {
    switch (status) {
      case 'operational':
        return <Activity className={`w-5 h-5 ${getStatusColor(status)}`} />;
      case 'warning':
      case 'error':
        return <AlertTriangle className={`w-5 h-5 ${getStatusColor(status)}`} />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium mb-6">
        {t('dashboard.system.title', 'État du système')}
      </h3>

      <div className="space-y-6">
        {/* Memory Usage */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center space-x-2">
              <Server className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">
                {t('dashboard.system.memory', 'Mémoire')}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              {systemStatus.memory.used}GB / {systemStatus.memory.total}GB
            </span>
          </div>
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                systemStatus.memory.percentage > 90
                  ? 'bg-red-500'
                  : systemStatus.memory.percentage > 70
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${systemStatus.memory.percentage}%` }}
            />
          </div>
        </div>

        {/* Services Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Server className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">API</span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.services.api)}
              <span className={`text-sm ${getStatusColor(systemStatus.services.api)}`}>
                {t(`dashboard.system.${systemStatus.services.api}`, 'Opérationnel')}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium">
                {t('dashboard.system.database', 'Base de données')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusIcon(systemStatus.services.database)}
              <span className={`text-sm ${getStatusColor(systemStatus.services.database)}`}>
                {t(`dashboard.system.${systemStatus.services.database}`, 'Opérationnel')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
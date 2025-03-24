import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, Info } from 'lucide-react';
import type { ActivityLog } from '../../../types/activity';

interface UserActivityListProps {
  activities: ActivityLog[];
}

export function UserActivityList({ activities }: UserActivityListProps) {
  const { t } = useTranslation();

  const getSeverityIcon = (severity: ActivityLog['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Activités récentes</h3>
      
      <div className="space-y-2">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm"
          >
            {getSeverityIcon(activity.severity)}
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  {activity.userName}
                </p>
                <span className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 truncate">
                {activity.message}
              </p>
              
              <div className="mt-1 flex items-center space-x-2">
                <span className="text-xs font-medium text-gray-500">
                  {activity.applicationName}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  {activity.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
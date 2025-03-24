import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  time: string;
  type: 'login' | 'update' | 'create' | 'delete';
}

export function RecentActivities() {
  const { t } = useTranslation();

  // Mock data - replace with real data from API
  const activities: ActivityItem[] = [
    { id: '1', user: 'Jean Dupont', action: 'Connexion au système', time: 'il y a 5 min', type: 'login' },
    { id: '2', user: 'Marie Martin', action: 'Mise à jour du profil', time: 'il y a 15 min', type: 'update' },
    { id: '3', user: 'Paul Bernard', action: 'Création d\'une facture', time: 'il y a 1 heure', type: 'create' },
    { id: '4', user: 'Sophie Dubois', action: 'Suppression d\'un document', time: 'il y a 2 heures', type: 'delete' }
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    return <Activity className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('dashboard.activity.title', 'Activités récentes')}</h3>
        <Link 
          to="/activities" 
          className="text-primary hover:text-primary-dark text-sm flex items-center"
        >
          {t('common.viewAll', 'Voir tout')}
          <ChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div 
            key={activity.id}
            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {activity.user}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {activity.action}
              </p>
            </div>
            <div className="flex-shrink-0">
              <p className="text-xs text-gray-500">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-6">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {t('dashboard.activity.empty', 'Aucune activité récente')}
          </p>
        </div>
      )}
    </div>
  );
}
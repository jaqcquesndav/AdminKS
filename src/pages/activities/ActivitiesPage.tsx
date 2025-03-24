import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserActivityList } from '../../components/users/activity/UserActivityList';
import { UserSessionList } from '../../components/users/activity/UserSessionList';
import { PageLoader } from '../../components/common/PageLoader';
import { useAuth } from '../../hooks/useAuth';
import type { ActivityLog, UserSession } from '../../types/activity';

export function ActivitiesPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = React.useState(true);
  const [activities, setActivities] = React.useState<ActivityLog[]>([]);
  const [sessions, setSessions] = React.useState<UserSession[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, fetch from API
        const mockActivities: ActivityLog[] = [
          {
            id: '1',
            userId: user?.id || '',
            userName: user?.name || '',
            applicationId: 'accounting',
            applicationName: 'Comptabilité',
            type: 'login',
            message: 'Connexion au système',
            timestamp: new Date(),
            severity: 'info'
          },
          {
            id: '2',
            userId: user?.id || '',
            userName: user?.name || '',
            applicationId: 'sales',
            applicationName: 'Ventes',
            type: 'create',
            message: 'Création d\'une nouvelle facture',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            severity: 'info'
          }
        ];

        const mockSessions: UserSession[] = [
          {
            id: '1',
            userId: user?.id || '',
            userName: user?.name || '',
            applicationId: 'accounting',
            applicationName: 'Comptabilité',
            ipAddress: '192.168.1.1',
            userAgent: 'Chrome/Windows',
            startedAt: new Date(),
            lastActivityAt: new Date(),
            status: 'active'
          }
        ];

        setActivities(mockActivities);
        setSessions(mockSessions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">{t('activities.title', 'Activités')}</h1>

      <div className="grid gap-8">
        <div className="card">
          <UserActivityList activities={activities} />
        </div>

        <div className="card">
          <UserSessionList
            sessions={sessions}
            onTerminate={async (sessionId) => {
              // In a real app, call API to terminate session
              setSessions(prev => prev.filter(s => s.id !== sessionId));
            }}
          />
        </div>
      </div>
    </div>
  );
}
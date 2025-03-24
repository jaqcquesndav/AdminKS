import React from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../common/Tabs';
import { UserActivityList } from './activity/UserActivityList';
import { UserSessionList } from './activity/UserSessionList';
import { TokenUsageTab } from './TokenUsageTab';
import type { User } from '../../types/user';
import type { ActivityLog, UserSession } from '../../types/activity';

interface UserDetailsModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  activities: ActivityLog[];
  sessions: UserSession[];
  onTerminateSession: (sessionId: string) => void;
}

export function UserDetailsModal({ 
  user, 
  isOpen, 
  onClose,
  activities, 
  sessions, 
  onTerminateSession 
}: UserDetailsModalProps) {
  const { t } = useTranslation();

  // Valeurs par défaut pour les tokens si non définies
  const tokenLimit = user.tokenLimit || {
    monthly: 100000,
    used: 0,
    remaining: 100000
  };

  const tokenUsage = user.tokenUsage || [];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-medium">{user.name}</h2>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              user.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {t(`users.status.${user.status}`)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="activity">
          <TabsList>
            <TabsTrigger value="activity">Activités</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <UserActivityList activities={activities} />
          </TabsContent>

          <TabsContent value="sessions">
            <UserSessionList
              sessions={sessions}
              onTerminate={onTerminateSession}
            />
          </TabsContent>

          <TabsContent value="tokens">
            <TokenUsageTab
              monthlyLimit={tokenLimit.monthly}
              used={tokenLimit.used}
              remaining={tokenLimit.remaining}
              usageHistory={tokenUsage}
            />
          </TabsContent>

          <TabsContent value="permissions">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions par application</h3>
              
              <div className="grid gap-4">
                {user.permissions.map((permission) => (
                  <div
                    key={permission.applicationId}
                    className="p-4 bg-white rounded-lg shadow-sm"
                  >
                    <h4 className="font-medium mb-2">{permission.applicationId}</h4>
                    <div className="flex flex-wrap gap-2">
                      {permission.permissions.map((perm) => (
                        <span
                          key={perm}
                          className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full"
                        >
                          {t(`permissions.${perm}`)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../common/Tabs';
import { UserActivityList } from './activity/UserActivityList';
import { UserSessionList } from './activity/UserSessionList';
import type { User, ApplicationPermission } from '../../types/user';
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

  // Prepare modal title as a string to match the Modal component's props
  const modalTitle = t('users.details.title', { userName: user.name });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="lg"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {user.avatar && <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full" />}
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{user.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <div>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              user.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100'
                : user.status === 'pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100'
                : user.status === 'suspended'
                ? 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {t(`users.statusValues.${user.status}`)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-6">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('users.userForm.roleLabel')}</p>
            <p className="text-gray-900 dark:text-gray-100">{t(`users.roles.${user.role}`)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('users.userForm.userTypeLabel')}</p>
            <p className="text-gray-900 dark:text-gray-100">{t(`users.userType.${user.userType}`)}</p>
          </div>          {user.userType === 'external' && user.customerAccountId && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('users.userForm.customerAccountLabel')}</p>
              <p className="text-gray-900 dark:text-gray-100">{user.customerAccountId}</p>
            </div>
          )}
          {user.userType === 'external' && user.customerName && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('users.table.customer')}</p>
              <p className="text-gray-900 dark:text-gray-100">{user.customerName}</p>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('users.details.createdAt')}</p>
            <p className="text-gray-900 dark:text-gray-100">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : t('common.notAvailable')}</p>
          </div>
          {user.lastLogin && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t('users.table.lastLogin')}</p>
              <p className="text-gray-900 dark:text-gray-100">{new Date(user.lastLogin).toLocaleString()}</p>
            </div>
          )}
        </div>        <Tabs defaultValue="activity">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="activity">{t('users.details.tabs.activityLog')}</TabsTrigger>
            <TabsTrigger value="sessions">{t('users.details.tabs.activeSessions')}</TabsTrigger>
            <TabsTrigger value="permissions">{t('users.details.tabs.permissionsAndRoles')}</TabsTrigger>
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

          <TabsContent value="permissions">
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{t('users.details.permissions.assignedPermissions')}</h3>
              {user.permissions && user.permissions.length > 0 ? (
                <div className="space-y-4">
                  {user.permissions.map((appPerm: ApplicationPermission) => (
                    <div key={appPerm.applicationId} className="border border-gray-200 dark:border-gray-700 rounded-md p-3">
                      <h4 className="font-medium mb-2">{t(`users.details.permissions.applications.${appPerm.applicationId}`, appPerm.applicationId)}</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {appPerm.permissions.map((perm: string) => (
                          <li key={perm}>{t(`users.details.permissions.permissionValues.${perm}`, perm)}</li>
                        ))}
                      </ul>
                    </div>
                  ))}                </div>
              ) : (
                <p>{t('users.details.permissions.noPermissionsAssigned')}</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
}
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2 } from 'lucide-react';
import type { User } from '../../../types/user';
import type { AuthUser } from '../../../types/auth'; // Import AuthUser

export interface UsersTableProps { // Export UsersTableProps
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSelect: (user: User) => void;
  currentUser: AuthUser | null; // Add currentUser to props
}

export function UsersTable({ users, onEdit, onDelete, onSelect, currentUser }: UsersTableProps) {
  const { t } = useTranslation();

  const canEditUser = (userToEdit: User): boolean => {
    if (!currentUser) return false;
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.role === 'company_admin' && 
        userToEdit.userType === 'external' && 
        userToEdit.customerAccountId === currentUser.customerAccountId) {
      return true;
    }
    // Add other role-specific edit permissions if necessary
    return false;
  };

  const canDeleteUser = (userToDelete: User): boolean => {
    if (!currentUser) return false;
    // Prevent users from deleting themselves
    if (currentUser.id === userToDelete.id) return false;
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.role === 'company_admin' &&
        userToDelete.userType === 'external' &&
        userToDelete.customerAccountId === currentUser.customerAccountId) {
      return true;
    }
    // Add other role-specific delete permissions if necessary
    return false;
  };
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              {t('users.table.name')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              {t('users.table.email')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              {t('users.table.role')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              {t('users.table.status')}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
              {t('users.table.lastLogin')}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
              {t('users.table.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">          {users.map((user) => (
            <tr 
              key={user.id} 
              className="hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              onClick={() => onSelect(user)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center max-w-xs">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4 truncate">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 dark:text-gray-100 truncate max-w-xs">{user.email}</div>
              </td>              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                  {t(`users.roles.${user.role}`)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`}>
                  {t(`users.status.${user.status}`)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('common.never')}
              </td>              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  {canEditUser(user) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(user);
                      }}
                      className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1"
                      title={t('users.actions.edit')}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {canDeleteUser(user) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user);
                      }}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1"
                      title={t('users.actions.delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit2, Trash2, Building } from 'lucide-react';
import type { User } from '../../../types/user';
import type { AuthUser } from '../../../types/auth';

export interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSelect: (user: User) => void;
  currentUser: AuthUser | null;
  isLoading?: boolean;
  error?: string | null;
}

// Type pour les groupes d'utilisateurs par client/customer
type CustomerGroup = {
  id: string;
  name: string;
  type: 'pme' | 'financial_institution';
  users: User[];
};

export function UsersTable({ users, onEdit, onDelete, onSelect, currentUser, isLoading = false, error = null }: UsersTableProps) {
  const { t } = useTranslation();
  const [groupByCustomer, setGroupByCustomer] = useState(true);
  
  // Séparer les utilisateurs internes et externes
  const internalUsers = users.filter(user => user.userType === 'internal');
  const externalUsers = users.filter(user => user.userType === 'external');
  
  // Grouper les utilisateurs externes par client (customer)
  const customerGroups: CustomerGroup[] = [];
  
  // Construire les groupes de clients
  externalUsers.forEach(user => {
    if (!user.customerAccountId) return;
    
    // Chercher si le client existe déjà dans les groupes
    const existingGroup = customerGroups.find(group => group.id === user.customerAccountId);
    
    if (existingGroup) {
      existingGroup.users.push(user);
    } else {
      // Si le client n'existe pas, créer un nouveau groupe
      customerGroups.push({
        id: user.customerAccountId,
        name: user.customerName || t('users.table.customerAccount', { accountId: user.customerAccountId }), // Utiliser le nom du client s'il est disponible
        type: user.customerType as 'pme' | 'financial_institution' || 'pme', // Utiliser le type de client s'il est disponible
        users: [user]
      });
    }
  });

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

  // Skeleton loader rows
  const skeletonRows = Array.from({ length: 5 }).map((_, idx) => (
    <tr key={idx}>
      {Array.from({ length: 7 }).map((_, colIdx) => (
        <td key={colIdx} className="px-6 py-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full" />
        </td>
      ))}
    </tr>
  ));

  // Error/empty state row
  const renderStateRow = (message: string) => (
    <tr>
      <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
        {message}
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setGroupByCustomer(!groupByCustomer)}
          className="text-sm flex items-center px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Building className="w-4 h-4 mr-1" />
          {groupByCustomer 
            ? t('users.actions.ungroupByCustomer', 'Ungroup by Customer') 
            : t('users.actions.groupByCustomer', 'Group by Customer')}
        </button>
      </div>

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
                {t('users.table.customer', 'Customer')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                {t('users.table.lastLogin')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-20">
                {t('users.table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading
              ? skeletonRows
              : error
                ? renderStateRow(error)
                : users.length === 0
                  ? renderStateRow(t('users.table.empty', 'No users found'))
                  : groupByCustomer
                    ? customerGroups.map((group) => (
                        <React.Fragment key={group.id}>
                          <tr className="bg-gray-100 dark:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap" colSpan={7}>
                              <div className="flex items-center">
                                <Building className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
                                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                  {group.name} {/* Affiche le nom du client */}
                                </span>
                                <span className="ml-2 text-xs text-gray-500">
                                  {t(`customer.type.${group.type}`, group.type)}
                                </span>
                              </div>
                            </td>
                          </tr>
                          {group.users.map((user: User) => (
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
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
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
                                <span className="text-gray-400">-</span> {/* Dans un groupe, pas besoin d'afficher encore le client */}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('common.never')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                        </React.Fragment>
                      ))
                    : [
                        ...internalUsers.map((user) => (
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
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                              <span className="text-gray-400">{t('users.userType.internal', 'Wanzo (Internal)')}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('common.never')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                        )),
                        ...externalUsers.map((user) => (
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
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
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
                              {user.customerName ? (
                                <span className="flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  {user.customerName}
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <Building className="w-4 h-4 mr-1" />
                                  {user.customerAccountId || t('common.unknown', 'Unknown')}
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : t('common.never')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                        ))
                      ]
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
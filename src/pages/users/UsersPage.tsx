import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { UserForm } from '../../components/users/UserForm';
import { UsersTable } from '../../components/users/table/UsersTable';
import { DeleteUserModal } from '../../components/users/modals/DeleteUserModal';
import { UserDetailsModal } from '../../components/users/UserDetailsModal';
import { useUsers } from '../../hooks/useUsers';
import type { User, UserType } from '../../types/user';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

export function UsersPage() {
  const { t } = useTranslation();
  const {
    users,
    isLoading,
    loadUsers,
    createUser,
    updateUser,
    deleteUser,
    terminateUserSession,
    userActivities,
    userSessions,
    loadUserActivities,
    loadUserSessions,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useUsers();
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);
  const [itemsPerPage] = useState(10);

  // Function to convert AuthUser to User (to fix type error)
  const convertAuthToUser = (authUser: typeof currentUser): User | null => {
    if (!authUser) return null;
    
    return {
      id: authUser.id,
      name: authUser.name,
      email: authUser.email,
      role: authUser.role,
      userType: authUser.userType,
      customerAccountId: authUser.customerAccountId,
      avatar: authUser.picture,
      status: 'active', // Default value
      createdAt: new Date().toISOString(), // Default value
      permissions: [], // Default value
    };
  };

  useEffect(() => {
    if (currentUser) {
      loadUsers(
        currentUser.role,
        currentUser.userType === 'external' ? currentUser.customerAccountId : undefined,
        currentPage,
        itemsPerPage
      );
    }
  }, [loadUsers, currentUser, currentPage, itemsPerPage]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Partial<User> & { password?: string; userType?: UserType; customerAccountId?: string }) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
        showToast('success', t('users.notifications.updated'));
      } else {
        if (!data.name || !data.email || !data.password || !data.role || !data.userType) {
          showToast('error', t('users.errors.missingFields'));
          return;
        }
        await createUser({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          userType: data.userType,
          customerAccountId: data.userType === 'external' ? data.customerAccountId : undefined,
        });
        showToast('success', t('users.notifications.created'));
      }
      setIsFormOpen(false);
    } catch {
      // Error is already handled in useUsers hook with toasts
      // console.error("Error in user form submission:", error);
      // No need to show a generic toast here as useUsers hook handles specific error toasts
    }
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setUserToDelete(null);
        if (selectedUserForDetails?.id === userToDelete.id) {
          setSelectedUserForDetails(null);
        }
        showToast('success', t('users.notifications.deleted'));
      } catch {
        // Error is already handled in useUsers hook with toasts
        // console.error("Error deleting user:", error);
        // No need to show a generic toast here as useUsers hook handles specific error toasts
      }
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    if (selectedUserForDetails) {
      try {
        await terminateUserSession(selectedUserForDetails.id, sessionId);
        showToast('success', t('users.notifications.sessionTerminated'));
        // Optionally, refresh sessions data for the user
        loadUserSessions(selectedUserForDetails.id); // Refresh sessions
      } catch {
        // Error already handled in terminateUserSession with toast
        // console.error("Error terminating session:", error);
        // No need to show a generic toast here as useUsers hook handles specific error toasts
      }
    }
  };
  
  // Handler for viewing user details
  const handleViewUserDetails = async (user: User) => {
    setSelectedUserForDetails(user);
    
    try {
      await loadUserActivities(user.id);
      await loadUserSessions(user.id);
    } catch (error: unknown) { // Changed to (error: unknown)
      console.error('Error loading user details:', error);
      showToast('error', t('users.errors.loadDetailsFailed'));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('users.title')}</h1>
        {(currentUser?.role === 'super_admin' || currentUser?.role === 'company_admin') && (
          <button
            onClick={handleCreateUser}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light dark:bg-primary-dark dark:hover:bg-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('users.actions.create')}
          </button>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('users.search.placeholder') as string}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary dark:focus:border-primary dark:focus:ring-primary-light"
            />
          </div>
        </div>
        <UsersTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={setUserToDelete}
          onSelect={handleViewUserDetails}
          currentUser={currentUser}
          isLoading={isLoading}
          error={null}
        />
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              {t('common.previous', 'Précédent')}
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t('common.page', 'Page')} {currentPage} {t('common.of', 'sur')} {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 disabled:opacity-50"
            >
              {t('common.next', 'Suivant')}
            </button>
          </div>
        )}
      </div>
      {selectedUserForDetails && (
        <UserDetailsModal
          user={selectedUserForDetails}
          isOpen={true}
          onClose={() => setSelectedUserForDetails(null)}
          activities={userActivities}
          sessions={userSessions}
          onTerminateSession={handleTerminateSession}
        />
      )}
      {isFormOpen && (
        <UserForm
          user={selectedUser || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setIsFormOpen(false)}
          currentUser={convertAuthToUser(currentUser)}
        />
      )}
      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          isOpen={true}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
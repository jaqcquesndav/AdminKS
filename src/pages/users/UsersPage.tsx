import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { UserForm } from '../../components/users/forms/UserForm';
import { UsersTable } from '../../components/users/table/UsersTable';
import { DeleteUserModal } from '../../components/users/modals/DeleteUserModal';
// import { UserDetailsModal } from '../../components/users/UserDetailsModal'; // Disabled UserDetailsModal import
import { useUsers } from '../../hooks/useUsers';
import type { User, UserType } from '../../types/user';
// import type { ActivityLog, UserSession } from '../../types/activity'; // Commented out as UserDetailsModal is disabled
import { useAuth } from '../../hooks/useAuth';

// Mock data for demonstration - Commented out as UserDetailsModal is disabled
/*
const mockActivities: ActivityLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Jean Dupont',
    applicationId: 'accounting',
    applicationName: 'Comptabilité',
    type: 'login',
    message: 'Connexion au système',
    timestamp: new Date(),
    severity: 'info'
  },
  {
    id: '2',
    userId: '1',
    userName: 'Jean Dupont',
    applicationId: 'sales',
    applicationName: 'Ventes',
    type: 'create',
    message: 'Création d\'une nouvelle facture',
    timestamp: new Date(),
    severity: 'info'
  }
];

const mockSessions: UserSession[] = [
  {
    id: '1',
    userId: '1',
    userName: 'Jean Dupont',
    applicationId: 'accounting',
    applicationName: 'Comptabilité',
    ipAddress: '192.168.1.1',
    userAgent: 'Chrome/Windows',
    startedAt: new Date(),
    lastActivityAt: new Date(),
    status: 'active'
  }
];
*/

export function UsersPage() {
  const { t } = useTranslation();
  const { users, isLoading, loadUsers, createUser, updateUser, deleteUser } = useUsers();
  const { user: currentUser } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null); // Commented out

  useEffect(() => {
    if (currentUser) {
      loadUsers(currentUser.role, currentUser.userType === 'external' ? currentUser.customerAccountId : undefined);
    }
  }, [loadUsers, currentUser]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Partial<User> & { password?: string; userType?: UserType; customerAccountId?: string }) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data);
    } else {
      if (!data.name || !data.email || !data.password || !data.role || !data.userType) {
        console.error("Missing required fields for user creation");
        // TODO: Show toast message
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
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
      // if (selectedUserForDetails?.id === userToDelete.id) { // Commented out
      //   setSelectedUserForDetails(null);
      // }
    }
  };

  // const handleTerminateSession = async (sessionId: string) => { // Commented out
  //   console.log('Terminate session:', sessionId);
  // };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">{t('common.loading')}</div>
      </div>
    );
  }

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
      </div>      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('users.search.placeholder')}
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
          // onSelect={setSelectedUserForDetails} // Commented out
          onSelect={() => {}} // Temporarily pass an empty function for onSelect
          currentUser={currentUser}
        />
      </div>

      {/* {selectedUserForDetails && ( // Commented out UserDetailsModal section
        <UserDetailsModal
          user={selectedUserForDetails}
          isOpen={true}
          onClose={() => setSelectedUserForDetails(null)}
          activities={mockActivities}
          sessions={mockSessions}
          onTerminateSession={handleTerminateSession}
        />
      )} */}

      {isFormOpen && (
        <UserForm
          user={selectedUser ? selectedUser : undefined}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
          currentUser={currentUser}
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
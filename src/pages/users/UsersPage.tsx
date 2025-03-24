import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import { UserForm } from '../../components/users/forms/UserForm';
import { UsersTable } from '../../components/users/table/UsersTable';
import { DeleteUserModal } from '../../components/users/modals/DeleteUserModal';
import { UserDetailsModal } from '../../components/users/UserDetailsModal';
import { useUsers } from '../../hooks/useUsers';
import type { User } from '../../types/user';
import type { ActivityLog, UserSession } from '../../types/activity';

// Mock data for demonstration
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

export function UsersPage() {
  const { t } = useTranslation();
  const { users, isLoading, loadUsers, createUser, updateUser, deleteUser } = useUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<User | null>(null);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: Partial<User> & { password?: string }) => {
    if (selectedUser) {
      await updateUser(selectedUser.id, data);
    } else {
      await createUser({
        name: data.name!,
        email: data.email!,
        password: data.password!,
        role: data.role!,
        permissions: data.permissions || []
      });
    }
    setIsFormOpen(false);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setUserToDelete(null);
      if (selectedUserForDetails?.id === userToDelete.id) {
        setSelectedUserForDetails(null);
      }
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    // Implement session termination logic
    console.log('Terminate session:', sessionId);
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('users.title')}</h1>
        <button
          onClick={handleCreateUser}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('users.actions.create')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('users.search.placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <UsersTable
          users={filteredUsers}
          onEdit={handleEditUser}
          onDelete={setUserToDelete}
          onSelect={setSelectedUserForDetails}
        />
      </div>

      {selectedUserForDetails && (
        <UserDetailsModal
          user={selectedUserForDetails}
          isOpen={true}
          onClose={() => setSelectedUserForDetails(null)}
          activities={mockActivities}
          sessions={mockSessions}
          onTerminateSession={handleTerminateSession}
        />
      )}

      {isFormOpen && (
        <UserForm
          user={selectedUser}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleSubmit}
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
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditProfileModal } from './modals/EditProfileModal';
import { ProfileDisplay } from './displays/ProfileDisplay';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../common/ToastContainer';
import type { AuthUser } from '../../types/auth';
import type { UserRole, UserType } from '../../types/user';

export function ProfileSettings() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const mockUser: AuthUser = {
    id: 'mock-id',
    email: 'mock@wanzo.com',
    name: 'Utilisateur Démo',
    picture: '',
    role: 'content_manager' as UserRole,
    userType: 'internal' as UserType,
    phoneNumber: '',
    idAgent: 'IKIOTA-0001',
    validityEnd: new Date(Date.now() + 365*24*60*60*1000).toISOString(),
  };

  const displayUser = user || mockUser;

  const handleUpdateProfile = async (data: Partial<AuthUser>) => {
    try {
      updateUser(data);
      addToast('success', t('settings.profile.updateSuccess'));
      setIsEditModalOpen(false);
    } catch (error) {
      addToast('error', t('settings.profile.updateError'));
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">{t('settings.profile.title')}</h2>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          {t('settings.profile.edit.button')}
        </button>
      </div>

      <ProfileDisplay user={displayUser} />

      <EditProfileModal
        user={displayUser}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
}
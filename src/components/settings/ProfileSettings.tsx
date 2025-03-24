import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditProfileModal } from './modals/EditProfileModal';
import { ProfileDisplay } from './displays/ProfileDisplay';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../common/ToastContainer';

export function ProfileSettings() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) return null;

  const handleUpdateProfile = async (data: Partial<typeof user>) => {
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

      <ProfileDisplay user={user} />

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
}
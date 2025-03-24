import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/Tabs';
import { ProfileDisplay } from '../../components/settings/displays/ProfileDisplay';
import { EditProfileModal } from '../../components/settings/modals/EditProfileModal';
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../../components/common/ToastContainer';

export function UserProfilePage() {
  const { t } = useTranslation();
  const { user, updateUser } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) return null;

  const handleUpdateProfile = async (data: Partial<typeof user>) => {
    try {
      await updateUser(data);
      addToast('success', t('settings.profile.updateSuccess'));
      setIsEditModalOpen(false);
    } catch (error) {
      addToast('error', t('settings.profile.updateError'));
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('settings.profile.title')}</h1>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
        >
          {t('settings.profile.edit.button')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Sécurité</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="p-6">
            <ProfileDisplay user={user} />
          </TabsContent>

          <TabsContent value="security" className="p-6">
            {/* Ajouter le contenu de sécurité ici */}
          </TabsContent>

          <TabsContent value="notifications" className="p-6">
            {/* Ajouter le contenu des notifications ici */}
          </TabsContent>
        </Tabs>
      </div>

      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleUpdateProfile}
      />
    </div>
  );
}
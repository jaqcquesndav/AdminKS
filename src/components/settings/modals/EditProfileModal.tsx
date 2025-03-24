import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../../common/Modal';
import { ProfileForm } from '../forms/ProfileForm';
import type { AuthUser } from '../../../types/auth';

interface EditProfileModalProps {
  user: AuthUser;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<AuthUser>) => Promise<void>;
}

export function EditProfileModal({ user, isOpen, onClose, onSubmit }: EditProfileModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: Partial<AuthUser>) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings.profile.edit.title')}
    >
      <div className="p-6">
        <ProfileForm
          user={user}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
}
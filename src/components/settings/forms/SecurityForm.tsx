```tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Key, Smartphone } from 'lucide-react';
import { Button } from '../../common/Button';
import { ChangePasswordModal } from '../modals/ChangePasswordModal';
import { DeleteAccountModal } from '../modals/DeleteAccountModal';

interface SecurityFormProps {
  onPasswordChange: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

export function SecurityForm({ onPasswordChange, onDeleteAccount }: SecurityFormProps) {
  const { t } = useTranslation();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {t('settings.security.password.title')}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t('settings.security.password.description')}
        </p>
        <Button
          variant="outline"
          icon={Key}
          onClick={() => setIsPasswordModalOpen(true)}
        >
          {t('settings.security.password.change')}
        </Button>
      </div>

      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {t('settings.security.twoFactor.title')}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t('settings.security.twoFactor.description')}
        </p>
        <Button
          variant="outline"
          icon={Smartphone}
        >
          {t('settings.security.twoFactor.setup')}
        </Button>
      </div>

      <div className="card border-red-200 dark:border-red-800">
        <h3 className="text-lg font-medium text-red-600 mb-4">
          {t('settings.security.deleteAccount.title')}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t('settings.security.deleteAccount.description')}
        </p>
        <Button
          variant="outline"
          icon={Shield}
          className="text-red-600 border-red-600 hover:bg-red-50"
          onClick={() => setIsDeleteModalOpen(true)}
        >
          {t('settings.security.deleteAccount.button')}
        </Button>
      </div>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={onPasswordChange}
      />

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={onDeleteAccount}
      />
    </div>
  );
}
```
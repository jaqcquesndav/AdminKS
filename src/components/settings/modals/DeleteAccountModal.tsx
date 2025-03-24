import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '../../common/Modal';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmation, setConfirmation] = useState('');

  const handleConfirm = async () => {
    if (confirmation !== 'DELETE') return;
    
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('settings.security.deleteAccount.title')}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-center space-x-3 text-red-600">
          <AlertTriangle className="w-5 h-5" />
          <span className="font-medium">{t('settings.security.deleteAccount.warning')}</span>
        </div>

        <p className="text-sm text-gray-600">
          {t('settings.security.deleteAccount.description')}
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('settings.security.deleteAccount.confirmation')}
          </label>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500"
            placeholder="DELETE"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || confirmation !== 'DELETE'}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50"
          >
            {isLoading ? t('common.deleting') : t('common.delete')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
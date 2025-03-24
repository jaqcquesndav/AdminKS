import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, XCircle } from 'lucide-react';
import { Modal } from '../common/Modal';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'success' | 'error';
  message?: string;
}

export function PaymentConfirmationModal({
  isOpen,
  onClose,
  status,
  message
}: PaymentConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t(`payment.confirmation.${status}Title`)}
    >
      <div className="p-6 text-center">
        {status === 'success' ? (
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
        )}
        
        <h3 className="mt-4 text-lg font-medium">
          {t(`payment.confirmation.${status}Heading`)}
        </h3>
        
        <p className="mt-2 text-sm text-gray-500">
          {message || t(`payment.confirmation.${status}Message`)}
        </p>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {t('common.close')}
          </button>
        </div>
      </div>
    </Modal>
  );
}
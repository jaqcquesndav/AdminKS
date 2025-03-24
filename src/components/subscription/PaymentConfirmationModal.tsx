import React from 'react';
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
  const defaultMessages = {
    success: {
      title: 'Paiement réussi',
      heading: 'Merci pour votre paiement',
      message: 'Votre abonnement a été activé avec succès'
    },
    error: {
      title: 'Échec du paiement',
      heading: 'Le paiement a échoué',
      message: 'Une erreur est survenue lors du paiement'
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={defaultMessages[status].title}
    >
      <div className="p-6 text-center">
        {status === 'success' ? (
          <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
        ) : (
          <XCircle className="mx-auto h-12 w-12 text-red-500" />
        )}
        
        <h3 className="mt-4 text-lg font-medium">
          {defaultMessages[status].heading}
        </h3>
        
        <p className="mt-2 text-sm text-gray-500">
          {message || defaultMessages[status].message}
        </p>

        <div className="mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>
  );
}
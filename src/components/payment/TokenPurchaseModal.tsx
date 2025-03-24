import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { PaymentConfirmationModal } from '../subscription/PaymentConfirmationModal';
import type { PaymentMethod } from '../../types/payment';
import { formatCurrency } from '../../utils/currency';

interface TokenPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  package: {
    tokens: number;
    price: number;
  };
  paymentMethods: PaymentMethod[];
  onSubmit: (data: {
    methodId: string;
    type: PaymentMethod['type'];
    amount: number;
    tokens: number;
  }) => Promise<void>;
}

export function TokenPurchaseModal({
  isOpen,
  onClose,
  package: tokenPackage,
  paymentMethods,
  onSubmit
}: TokenPurchaseModalProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    paymentMethods.find(m => m.isDefault) || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    try {
      await onSubmit({
        methodId: selectedMethod.id,
        type: selectedMethod.type,
        amount: tokenPackage.price,
        tokens: tokenPackage.tokens
      });
      setConfirmationStatus('success');
    } catch (error) {
      setConfirmationStatus('error');
      setConfirmationMessage(error instanceof Error ? error.message : undefined);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationStatus(null);
    if (confirmationStatus === 'success') {
      onClose();
    }
  };

  if (paymentMethods.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Achat de tokens">
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Aucun moyen de paiement enregistré. Veuillez d'abord ajouter un moyen de paiement.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Fermer
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Achat de tokens">
        <div className="p-6">
          <div className="mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {(tokenPackage.tokens / 1_000_000).toFixed(1)}M
                <span className="text-lg font-normal text-gray-500"> tokens</span>
              </p>
              <p className="text-lg font-medium mt-2">
                {formatCurrency(tokenPackage.price, 'USD')}
                <span className="text-sm text-gray-500 ml-1">
                  ({formatCurrency(tokenPackage.price * 2500, 'CDF')})
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Sélectionnez un moyen de paiement
              </h4>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedMethod(method)}
                    className={`
                      w-full flex items-center justify-between p-4 rounded-lg border-2 transition-colors
                      ${method.id === selectedMethod?.id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'}
                    `}
                  >
                    <div>
                      <p className="font-medium">{method.name}</p>
                      {method.isDefault && (
                        <span className="text-sm text-green-600">Par défaut</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing}
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isProcessing ? 'Traitement en cours...' : 'Confirmer l\'achat'}
            </button>
          </div>
        </div>
      </Modal>

      <PaymentConfirmationModal
        isOpen={confirmationStatus !== null}
        onClose={handleConfirmationClose}
        status={confirmationStatus || 'success'}
        message={confirmationMessage}
      />
    </>
  );
}
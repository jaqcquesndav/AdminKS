import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { PaymentConfirmationModal } from './PaymentConfirmationModal';
import type { ApplicationGroup } from '../../types/subscription';
import type { PaymentMethod } from '../../types/payment';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: ApplicationGroup;
  billingCycle: 'monthly' | 'yearly';
  onSubmit: (paymentData: any) => Promise<void>;
  paymentMethods?: PaymentMethod[];
}

export function PaymentModal({
  isOpen,
  onClose,
  plan,
  billingCycle,
  onSubmit,
  paymentMethods = []
}: PaymentModalProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    paymentMethods.find(m => m.isDefault) || null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();

  const amount = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);
    try {
      await onSubmit({ 
        methodId: selectedMethod.id,
        type: selectedMethod.type,
        amount
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
      <Modal isOpen={isOpen} onClose={onClose} title="Paiement">
        <div className="p-6 text-center">
          <p className="text-gray-600 mb-4">
            Aucun moyen de paiement enregistré. Veuillez d'abord ajouter un moyen de paiement dans la section Paiements.
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
      <Modal isOpen={isOpen} onClose={onClose} title="Paiement">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium">{plan.name}</h3>
            <p className="text-gray-500">
              Montant à payer : {amount.usd} USD ({amount.cdf} CDF)
              <br />
              Cycle : {billingCycle === 'monthly' ? 'Mensuel' : 'Annuel'}
            </p>
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
                    <div className="flex items-center">
                      <div>
                        <p className="font-medium">{method.name}</p>
                        {method.isDefault && (
                          <span className="text-sm text-green-600">Par défaut</span>
                        )}
                      </div>
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
              {isProcessing ? 'Traitement en cours...' : 'Confirmer le paiement'}
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
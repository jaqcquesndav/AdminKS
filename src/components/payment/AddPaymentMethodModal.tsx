import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CreditCard, Phone, Building2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { CardPaymentForm } from './CardPaymentForm';
import { MobileMoneyForm } from './MobileMoneyForm';
import type { PaymentMethod } from '../../types/payment';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (method: PaymentMethod) => void;
}

type MethodType = 'card' | 'mobile_money' | 'bank_transfer';

interface MethodOption {
  id: MethodType;
  name: string;
  description: string;
  icon: React.ElementType;
}

const methodOptions: MethodOption[] = [
  {
    id: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, etc.',
    icon: CreditCard
  },
  {
    id: 'mobile_money',
    name: 'Mobile Money',
    description: 'M-PESA, Orange Money, Airtel Money',
    icon: Phone
  },
  {
    id: 'bank_transfer',
    name: 'Virement bancaire',
    description: 'Virement SWIFT, transfert local',
    icon: Building2
  }
];

export function AddPaymentMethodModal({ isOpen, onClose, onAdd }: AddPaymentMethodModalProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<MethodType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsProcessing(true);
    try {
      const newMethod: PaymentMethod = {
        id: `method-${Date.now()}`,
        type: selectedMethod!,
        name: getMethodName(data),
        details: getMethodDetails(data),
        isDefault: false,
        createdAt: new Date()
      };
      
      onAdd(newMethod);
      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  const getMethodName = (data: any): string => {
    switch (selectedMethod) {
      case 'card':
        return `${data.cardType} se terminant par ${data.cardNumber.slice(-4)}`;
      case 'mobile_money':
        return `${data.provider} (${data.phoneNumber})`;
      case 'bank_transfer':
        return `${data.bankName} (${data.accountNumber})`;
      default:
        return '';
    }
  };

  const getMethodDetails = (data: any): PaymentMethod['details'] => {
    switch (selectedMethod) {
      case 'card':
        return {
          lastFour: data.cardNumber.slice(-4),
          expiryDate: data.expiryDate
        };
      case 'mobile_money':
        return {
          provider: data.provider,
          accountNumber: data.phoneNumber
        };
      case 'bank_transfer':
        return {
          bankName: data.bankName,
          accountNumber: data.accountNumber
        };
      default:
        return {};
    }
  };

  const renderMethodSelection = () => (
    <div className="grid gap-4">
      {methodOptions.map((method) => (
        <button
          key={method.id}
          onClick={() => setSelectedMethod(method.id)}
          className={`
            flex items-center p-4 rounded-lg border-2 transition-colors
            ${selectedMethod === method.id
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-primary/50'}
          `}
        >
          <method.icon className="w-6 h-6 text-gray-500" />
          <div className="ml-4 text-left">
            <h3 className="font-medium">{method.name}</h3>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>
        </button>
      ))}
    </div>
  );

  const renderMethodForm = () => {
    switch (selectedMethod) {
      case 'card':
        return <CardPaymentForm onSubmit={handleSubmit} />;
      case 'mobile_money':
        return <MobileMoneyForm onSubmit={handleSubmit} />;
      case 'bank_transfer':
        return (
          <div className="text-center py-8 text-gray-500">
            <Building2 className="w-12 h-12 mx-auto mb-4" />
            <p>La fonctionnalité de virement bancaire sera bientôt disponible.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajouter un moyen de paiement"
    >
      <div className="p-6 space-y-6">
        {!selectedMethod ? (
          renderMethodSelection()
        ) : (
          <div className="space-y-6">
            <button
              onClick={() => setSelectedMethod(null)}
              className="text-sm text-primary hover:text-primary-dark"
            >
              ← Retour aux méthodes de paiement
            </button>
            {renderMethodForm()}
          </div>
        )}
      </div>
    </Modal>
  );
}
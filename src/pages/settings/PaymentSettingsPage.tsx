import React, { useState } from 'react';
import { PaymentMethodList } from '../../components/payment/PaymentMethodList';
import { PaymentHistory } from '../../components/payment/PaymentHistory';
import { TokenPricing } from '../../components/payment/TokenPricing';
import { useToastStore } from '../../components/common/ToastContainer';
import { generateInvoice } from '../../utils/invoice';
import type { PaymentMethod, PaymentHistory as PaymentHistoryType } from '../../types/payment';

// Mock data for demonstration
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Visa',
    type: 'card',
    details: {
      lastFour: '4242',
      expiryDate: '12/24'
    },
    isDefault: true,
    createdAt: new Date()
  },
  {
    id: '2',
    name: 'M-PESA',
    type: 'mobile_money',
    details: {
      provider: 'mpesa',
      accountNumber: '+243999999999'
    },
    isDefault: false,
    createdAt: new Date()
  }
];

const mockPaymentHistory: PaymentHistoryType[] = [
  {
    id: '1',
    amount: { usd: 50, cdf: 125000 },
    method: mockPaymentMethods[0],
    status: 'completed',
    description: 'Abonnement ERP Suite - Mensuel',
    invoiceNumber: 'INV-2024-001',
    createdAt: new Date(),
  },
  {
    id: '2',
    amount: { usd: 25, cdf: 62500 },
    method: mockPaymentMethods[1],
    status: 'completed',
    description: 'Achat de tokens',
    invoiceNumber: 'INV-2024-002',
    createdAt: new Date(),
    tokenConsumption: {
      count: 3000,
      rate: 0.00833
    }
  }
];

export function PaymentSettingsPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [payments] = useState(mockPaymentHistory);
  const addToast = useToastStore(state => state.addToast);

  const handleAddPaymentMethod = () => {
    addToast('info', 'Fonctionnalité à venir');
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(methods => methods.filter(m => m.id !== id));
    addToast('success', 'Moyen de paiement supprimé');
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(m => ({
        ...m,
        isDefault: m.id === id
      }))
    );
    addToast('success', 'Moyen de paiement par défaut mis à jour');
  };

  const handleDownloadInvoice = async (payment: PaymentHistoryType) => {
    try {
      const invoiceDataUri = await generateInvoice(payment);
      const link = document.createElement('a');
      link.href = invoiceDataUri;
      link.download = `${payment.invoiceNumber}.pdf`;
      link.click();
    } catch (error) {
      console.error('Erreur lors de la génération de la facture:', error);
      addToast('error', 'Erreur lors du téléchargement de la facture');
    }
  };

  const handleTokenPurchase = (pricing: any) => {
    addToast('info', `Achat de ${pricing.tokens} tokens pour ${pricing.price} ${pricing.currency}`);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Paiements</h1>

      <div className="space-y-8">
        <div className="card">
          <PaymentMethodList
            methods={paymentMethods}
            onAdd={handleAddPaymentMethod}
            onDelete={handleDeletePaymentMethod}
            onSetDefault={handleSetDefaultPaymentMethod}
          />
        </div>

        <div className="card">
          <TokenPricing onSelect={handleTokenPurchase} />
        </div>

        <div className="card">
          <PaymentHistory
            payments={payments}
            onDownloadInvoice={handleDownloadInvoice}
          />
        </div>
      </div>
    </div>
  );
}
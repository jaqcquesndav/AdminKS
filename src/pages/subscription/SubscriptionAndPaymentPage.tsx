import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/common/Tabs';
import { SubscriptionPlans } from '../../components/subscription/SubscriptionPlans';
import { SubscriptionList } from '../../components/subscription/SubscriptionList';
import { PaymentMethodList } from '../../components/payment/PaymentMethodList';
import { PaymentHistory } from '../../components/payment/PaymentHistory';
import { TokenStats } from '../../components/subscription/TokenStats';
import { TokenPricing } from '../../components/payment/TokenPricing';
import { PaymentModal } from '../../components/subscription/PaymentModal';
import { TokenPurchaseModal } from '../../components/payment/TokenPurchaseModal';
import { AddPaymentMethodModal } from '../../components/payment/AddPaymentMethodModal';
import { useToastStore } from '../../components/common/ToastContainer';
import { ERP_GROUP, FINANCE_GROUP } from '../../types/subscription';
import { TOKEN_PACKAGES } from '../../types/payment';
import type { ApplicationGroup } from '../../types/subscription';
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

// Mock token data
const mockTokenData = {
  totalTokens: 10000,
  usedTokens: 6500,
  remainingTokens: 3500
};

export function SubscriptionAndPaymentPage() {
  const { t } = useTranslation();
  const addToast = useToastStore((state) => state.addToast);
  const [selectedPlan, setSelectedPlan] = useState<{
    plan: ApplicationGroup;
    billingCycle: 'monthly' | 'yearly';
  } | null>(null);
  const [selectedTokenPackage, setSelectedTokenPackage] = useState<typeof TOKEN_PACKAGES[0] | null>(null);
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [isAddPaymentMethodModalOpen, setIsAddPaymentMethodModalOpen] = useState(false);

  const handleSelectPlan = (groupId: string, billingCycle: 'monthly' | 'yearly') => {
    const plan = [ERP_GROUP, FINANCE_GROUP].find(g => g.id === groupId);
    if (plan) {
      setSelectedPlan({ plan, billingCycle });
    }
  };

  const handlePayment = async (paymentData: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast('success', 'Paiement effectué avec succès');
      setSelectedPlan(null);
    } catch (error) {
      addToast('error', 'Échec du paiement');
    }
  };

  const handleTokenPurchase = async (data: {
    methodId: string;
    type: PaymentMethod['type'];
    amount: number;
    tokens: number;
  }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      addToast('success', `${data.tokens.toLocaleString()} tokens achetés avec succès`);
      setSelectedTokenPackage(null);
    } catch (error) {
      addToast('error', 'Échec de l\'achat des tokens');
      throw error;
    }
  };

  const handleRenewSubscription = async (subscriptionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('success', 'Abonnement renouvelé avec succès');
    } catch (error) {
      addToast('error', 'Échec du renouvellement');
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast('success', 'Abonnement annulé avec succès');
    } catch (error) {
      addToast('error', 'Échec de l\'annulation');
    }
  };

  const handleAddPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethods(prev => [...prev, method]);
    addToast('success', 'Moyen de paiement ajouté avec succès');
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

  const handleTokenPackageSelect = (tokenPackage: typeof TOKEN_PACKAGES[0]) => {
    if (paymentMethods.length === 0) {
      addToast('error', 'Veuillez d\'abord ajouter un moyen de paiement');
      return;
    }
    setSelectedTokenPackage(tokenPackage);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Souscriptions</h1>

      <Tabs defaultValue="subscriptions">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscriptions">Abonnements</TabsTrigger>
          <TabsTrigger value="tokens">Tokens & Paiements</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-6">
              Abonnements actuels
            </h2>
            <SubscriptionList
              subscriptions={[]}
              onRenew={handleRenewSubscription}
              onCancel={handleCancelSubscription}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6">
              Plans disponibles
            </h2>
            <SubscriptionPlans
              plans={[ERP_GROUP, FINANCE_GROUP]}
              onSelectPlan={handleSelectPlan}
            />
          </section>
        </TabsContent>

        <TabsContent value="tokens" className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TokenStats {...mockTokenData} />
            <div className="card">
              <TokenPricing onSelect={handleTokenPackageSelect} />
            </div>
          </div>

          <div className="card">
            <PaymentMethodList
              methods={paymentMethods}
              onAdd={() => setIsAddPaymentMethodModalOpen(true)}
              onDelete={handleDeletePaymentMethod}
              onSetDefault={handleSetDefaultPaymentMethod}
            />
          </div>

          <div className="card">
            <PaymentHistory
              payments={mockPaymentHistory}
              onDownloadInvoice={(payment) => {
                addToast('info', 'Téléchargement de la facture...');
              }}
            />
          </div>
        </TabsContent>
      </Tabs>

      {selectedPlan && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan.plan}
          billingCycle={selectedPlan.billingCycle}
          onSubmit={handlePayment}
          paymentMethods={paymentMethods}
        />
      )}

      {selectedTokenPackage && (
        <TokenPurchaseModal
          isOpen={true}
          onClose={() => setSelectedTokenPackage(null)}
          package={selectedTokenPackage}
          paymentMethods={paymentMethods}
          onSubmit={handleTokenPurchase}
        />
      )}

      <AddPaymentMethodModal
        isOpen={isAddPaymentMethodModalOpen}
        onClose={() => setIsAddPaymentMethodModalOpen(false)}
        onAdd={handleAddPaymentMethod}
      />
    </div>
  );
}
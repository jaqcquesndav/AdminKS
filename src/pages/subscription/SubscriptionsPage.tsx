import React, { useState } from 'react';
import { SubscriptionPlans } from '../../components/subscription/SubscriptionPlans';
import { SubscriptionList } from '../../components/subscription/SubscriptionList';
import { PaymentModal } from '../../components/subscription/PaymentModal';
import { useToastStore } from '../../components/common/ToastContainer';
import { ERP_GROUP, FINANCE_GROUP } from '../../types/subscription';
import type { ApplicationGroup } from '../../types/subscription';

export function SubscriptionsPage() {
  const addToast = useToastStore((state) => state.addToast);
  const [selectedPlan, setSelectedPlan] = useState<{
    plan: ApplicationGroup;
    billingCycle: 'monthly' | 'yearly';
  } | null>(null);

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

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Abonnements</h1>

      <div className="space-y-12">
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
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={true}
          onClose={() => setSelectedPlan(null)}
          plan={selectedPlan.plan}
          billingCycle={selectedPlan.billingCycle}
          onSubmit={handlePayment}
        />
      )}
    </div>
  );
}
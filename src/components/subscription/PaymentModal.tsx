import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../common/Modal';
import { PaymentConfirmationModal } from './PaymentConfirmationModal';
import type { SubscriptionPlanDefinition, PlanBillingCycle } from '../../types/subscription';
import type { PaymentMethod } from '../../types/payment';
import { formatCurrency } from '../../utils/currency';
import { SupportedCurrency } from '../../types/currency';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlanDefinition | null;
  billingCycle: PlanBillingCycle | null;
  onSubmit: (paymentData: {
    methodId: string;
    type: PaymentMethod['type'];
    amountUSD: number;
    currency: SupportedCurrency;
    planId: string;
    billingCycle: PlanBillingCycle;
  }) => Promise<void>;
  paymentMethods?: PaymentMethod[];
  customerCurrency?: SupportedCurrency;
}

export function PaymentModal({
  isOpen,
  onClose,
  plan,
  billingCycle,
  onSubmit,
  paymentMethods = [],
  customerCurrency = 'USD'
}: PaymentModalProps) {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmationStatus, setConfirmationStatus] = useState<'success' | 'error' | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string>();
  const [displayAmount, setDisplayAmount] = useState<number>(0);
  const [displayCurrency, setDisplayCurrency] = useState<SupportedCurrency>(customerCurrency);

  useEffect(() => {
    if (plan && billingCycle) {
      let price = plan.basePriceUSD;
      if (billingCycle === 'quarterly') {
        price = plan.basePriceUSD * 3 * (1 - (plan.discountPercentage.quarterly || 0) / 100);
      } else if (billingCycle === 'yearly') {
        price = plan.basePriceUSD * 12 * (1 - (plan.discountPercentage.yearly || 0) / 100);
      }
      setDisplayAmount(price);
      // Ensure that the currency is a valid SupportedCurrency
      const finalCurrency = plan.localCurrency || customerCurrency || 'USD';
      if (['USD', 'CDF', 'FCFA'].includes(finalCurrency)) {
        setDisplayCurrency(finalCurrency as SupportedCurrency);
      } else {
        setDisplayCurrency('USD'); // Fallback to USD if localCurrency is not supported
      }
    }
  }, [plan, billingCycle, customerCurrency]);
  
  useEffect(() => {
    // Pre-select default payment method
    const defaultMethod = paymentMethods.find(m => m.isDefault);
    if (defaultMethod) {
      setSelectedMethod(defaultMethod);
    } else if (paymentMethods.length > 0) {
      setSelectedMethod(paymentMethods[0]); // Or select the first one if no default
    }
  }, [paymentMethods]);


  const handlePayment = async () => {
    if (!selectedMethod || !plan || !billingCycle) return;

    setIsProcessing(true);
    try {
      await onSubmit({ 
        methodId: selectedMethod.id,
        type: selectedMethod.type,
        amountUSD: displayAmount, // Use calculated displayAmount which is in USD
        currency: displayCurrency, // The currency in which amount is displayed/charged
        planId: plan.id,
        billingCycle: billingCycle,
      });
      setConfirmationStatus('success');
    } catch (error) {
      setConfirmationStatus('error');
      setConfirmationMessage(error instanceof Error ? error.message : t('payment.genericError', 'An unexpected error occurred.'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationStatus(null);
    setConfirmationMessage(undefined);
    if (confirmationStatus === 'success') {
      onClose(); // Close main modal on successful payment confirmation
    }
  };

  if (!plan || !billingCycle) {
    // This state should ideally not be reached if the modal is opened with valid plan and cycle
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('payment.title', 'Payment')}>
            <div className="p-6 text-center">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {t('payment.missingPlanInfo', 'Plan information is missing. Please select a plan and try again.')}
                </p>
                <button
                    onClick={onClose}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
                >
                    {t('common.close', 'Close')}
                </button>
            </div>
        </Modal>
    );
}

  if (paymentMethods.length === 0) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title={t('payment.title', 'Payment')}>
        <div className="p-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {t('payment.noPaymentMethods', 'No payment methods found. Please add a payment method first.')}
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            {t('common.close', 'Close')}
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={t('payment.title', 'Payment')}>
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {t('payment.amountToPay', 'Amount to pay')}: {formatCurrency(displayAmount, displayCurrency)}
              <br />
              {t('payment.billingCycle', 'Cycle')}: {t(`billingCycles.${billingCycle}`, billingCycle)}
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                {t('payment.selectPaymentMethod', 'Select a payment method')}
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
                          <span className="text-sm text-green-600">{t('payment.default', 'Default')}</span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={!selectedMethod || isProcessing || !plan} // Added !plan condition
              className="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {isProcessing ? t('payment.processing', 'Processing...') : t('payment.confirmPayment', 'Confirm Payment')}
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
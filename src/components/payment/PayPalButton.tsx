import React from 'react';
import { useTranslation } from 'react-i18next';

interface PayPalButtonProps {
  amount: number;
  currency: string;
  onSuccess: (details: any) => Promise<void>;
}

export function PayPalButton({ amount, currency, onSuccess }: PayPalButtonProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would initialize the PayPal SDK
      // and handle the payment flow
      await new Promise(resolve => setTimeout(resolve, 1000));
      await onSuccess({
        paymentId: `PP-${Date.now()}`,
        status: 'COMPLETED',
        amount,
        currency
      });
    } catch (error) {
      console.error('PayPal payment failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="w-full py-3 px-4 bg-[#0070ba] text-white rounded-md hover:bg-[#003087] disabled:opacity-50 flex items-center justify-center space-x-2"
      >
        <img src="/paypal.svg" alt="PayPal" className="h-5" />
        <span>
          {isLoading ? t('payment.processing') : t('payment.paypal.button')}
        </span>
      </button>

      <p className="mt-4 text-sm text-gray-500">
        {t('payment.paypal.secureNotice')}
      </p>
    </div>
  );
}
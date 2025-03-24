import React from 'react';

interface PayPalButtonProps {
  amount: number;
  currency: string;
  onSuccess: (details: any) => Promise<void>;
}

export function PayPalButton({ amount, currency, onSuccess }: PayPalButtonProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      // Dans une implémentation réelle, ceci initialiserait le SDK PayPal
      // et gérerait le flux de paiement
      await new Promise(resolve => setTimeout(resolve, 1000));
      await onSuccess({
        paymentId: `PP-${Date.now()}`,
        status: 'COMPLETED',
        amount,
        currency
      });
    } catch (error) {
      console.error('Échec du paiement PayPal:', error);
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
        <img 
          src="https://www.paypalobjects.com/webstatic/mktg/Logo/pp-logo-100px.png" 
          alt="PayPal" 
          className="h-5" 
        />
        <span>
          {isLoading ? 'Traitement en cours...' : 'Payer avec PayPal'}
        </span>
      </button>

      <p className="mt-4 text-sm text-gray-500">
        Paiement sécurisé via PayPal
      </p>
    </div>
  );
}
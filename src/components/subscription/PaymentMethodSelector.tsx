import React from 'react';
import { CreditCard, Phone, Wallet } from 'lucide-react';

export type PaymentMethod = 'card' | 'mobile_money' | 'paypal';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

export function PaymentMethodSelector({ selectedMethod, onSelect }: PaymentMethodSelectorProps) {
  const methods = [
    {
      id: 'card' as const,
      name: 'Carte bancaire',
      description: 'Paiement sécurisé par carte Visa ou Mastercard',
      icon: CreditCard,
      logos: [
        'https://www.visa.com/images/visa-logo.svg',
        'https://www.mastercard.com/images/mastercard-logo.svg'
      ]
    },
    {
      id: 'mobile_money' as const,
      name: 'Mobile Money',
      description: 'Paiement via M-PESA, Orange Money ou Airtel Money',
      icon: Phone,
      logos: [
        'https://mpesa.com/images/mpesa-logo.svg',
        'https://orangemoney.com/images/orange-money-logo.svg',
        'https://airtelmoney.com/images/airtel-money-logo.svg'
      ]
    },
    {
      id: 'paypal' as const,
      name: 'PayPal',
      description: 'Paiement sécurisé via PayPal',
      icon: Wallet,
      logos: ['https://www.paypal.com/images/paypal-logo.svg']
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Méthode de paiement</h3>
      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-300 hover:border-indigo-300'
            }`}
            onClick={() => onSelect(method.id)}
          >
            <div className="flex items-center flex-1">
              <method.icon className="w-6 h-6 text-gray-400" />
              <div className="ml-4">
                <h4 className="text-sm font-medium">{method.name}</h4>
                <p className="text-sm text-gray-500">{method.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {method.logos.map((logo, index) => (
                <img
                  key={index}
                  src={logo}
                  alt=""
                  className="h-8 object-contain"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
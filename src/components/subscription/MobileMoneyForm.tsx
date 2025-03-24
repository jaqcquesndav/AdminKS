import React, { useState } from 'react';
import { Phone } from 'lucide-react';
import { PinInput } from './PinInput';

interface MobileMoneyFormProps {
  onSubmit: (data: MobileMoneyData) => Promise<void>;
}

export interface MobileMoneyData {
  provider: 'mpesa' | 'orange' | 'airtel';
  phoneNumber: string;
  pin?: string;
}

export function MobileMoneyForm({ onSubmit }: MobileMoneyFormProps) {
  const [formData, setFormData] = useState<MobileMoneyData>({
    provider: 'mpesa',
    phoneNumber: '',
  });
  const [showPinInput, setShowPinInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowPinInput(true);
  };

  const handlePinSubmit = async (pin: string) => {
    setIsLoading(true);
    try {
      await onSubmit({ ...formData, pin });
    } finally {
      setIsLoading(false);
    }
  };

  const providers = [
    { id: 'mpesa', name: 'M-PESA', logo: '/mpesa.svg' },
    { id: 'orange', name: 'Orange Money', logo: '/orange-money.svg' },
    { id: 'airtel', name: 'Airtel Money', logo: '/airtel-money.svg' },
  ] as const;

  if (showPinInput) {
    return <PinInput onSubmit={handlePinSubmit} />;
  }

  return (
    <form onSubmit={handleInitialSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Opérateur
        </label>
        <div className="grid grid-cols-3 gap-3">
          {providers.map((provider) => (
            <button
              key={provider.id}
              type="button"
              onClick={() => setFormData({ ...formData, provider: provider.id })}
              className={`p-3 border rounded-lg flex items-center justify-center ${
                formData.provider === provider.id
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-300'
              }`}
            >
              <img src={provider.logo} alt={provider.name} className="h-8" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            className="pl-10 w-full border-gray-300 rounded-md"
            placeholder="+243 999 999 999"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {isLoading ? 'Traitement en cours...' : 'Continuer'}
      </button>
    </form>
  );
}
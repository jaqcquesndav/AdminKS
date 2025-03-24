import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

interface PinCodeInputProps {
  onSubmit: (pin: string) => void;
}

export function PinCodeInput({ onSubmit }: PinCodeInputProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pin);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('payment.mobileMoney.pin')}
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="pl-10 w-full border-gray-300 rounded-md"
            placeholder="****"
            maxLength={4}
            required
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {t('payment.mobileMoney.pinDescription')}
        </p>
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        {t('payment.confirm')}
      </button>
    </form>
  );
}
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coins } from 'lucide-react';

interface TokenLimitFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
}

export function TokenLimitField({ value, onChange, error }: TokenLimitFieldProps) {
  const { t } = useTranslation();

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Limite mensuelle de tokens
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Coins className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="number"
          min="0"
          step="1000"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Ex: 100000"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500 sm:text-sm">tokens</span>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      <p className="mt-1 text-sm text-gray-500">
        Définissez la limite de tokens que cet utilisateur peut consommer par mois
      </p>
    </div>
  );
}
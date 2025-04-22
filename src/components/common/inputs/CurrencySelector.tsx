import React from 'react';
import { useCurrency } from '../../../contexts/CurrencyContext';
import { SupportedCurrency, CURRENCIES } from '../../../utils/currency';

interface CurrencySelectorProps {
  className?: string;
  label?: string;
}

export function CurrencySelector({ className = '', label = 'Devise' }: CurrencySelectorProps) {
  const { currency, setCurrency } = useCurrency();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value as SupportedCurrency);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      {label && (
        <label className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <select
        value={currency}
        onChange={handleChange}
        className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="USD">Dollar américain (USD)</option>
        <option value="CDF">Franc congolais (CDF)</option>
        <option value="FCFA">Franc CFA (FCFA)</option>
      </select>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        La devise sélectionnée sera utilisée dans toute l'application
      </p>
    </div>
  );
}
import React from 'react';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { MultiCurrencyPrice } from '../../types/currency';

interface PriceDisplayProps {
  usd: number;
  cdf: number;
  fcfa: number;
  cycle: 'monthly' | 'yearly';
  showAllCurrencies?: boolean;
}

export function PriceDisplay({ 
  usd, 
  cdf, 
  fcfa, 
  cycle, 
  showAllCurrencies = false 
}: PriceDisplayProps) {
  const { currency, formatInCurrency, formatMultiCurrencyPrice } = useCurrencySettings();
  
  // Créer un objet de prix multi-devises
  const price: MultiCurrencyPrice = { usd, cdf, fcfa };
  
  // Si on veut afficher toutes les devises
  if (showAllCurrencies) {
    return (
      <div className="space-y-1">
        <div className="text-2xl font-bold">
          {formatInCurrency(usd, 'USD')}
        </div>
        <div className="text-sm text-gray-600">
          {formatInCurrency(cdf, 'CDF')}
        </div>
        <div className="text-sm text-gray-600">
          {formatInCurrency(fcfa, 'FCFA')}
        </div>
        <div className="text-xs text-gray-500">
          {cycle === 'monthly' ? 'par mois' : 'par an'}
        </div>
      </div>
    );
  }
  
  // Sinon, afficher la devise principale avec une devise secondaire
  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold">
        {formatInCurrency(price[currency.toLowerCase() as keyof MultiCurrencyPrice] as number, currency)}
      </div>
      <div className="text-sm text-gray-600">
        {currency !== 'USD' && formatInCurrency(usd, 'USD')}
        {currency === 'USD' && formatInCurrency(cdf, 'CDF')}
      </div>
      <div className="text-xs text-gray-500">
        {cycle === 'monthly' ? 'par mois' : 'par an'}
      </div>
    </div>
  );
}
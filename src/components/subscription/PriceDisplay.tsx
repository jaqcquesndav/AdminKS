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
  const { currency: activeCurrency, format, formatInCurrency } = useCurrencySettings();
  
  const price: MultiCurrencyPrice = { usd, cdf, fcfa };
  
  if (showAllCurrencies) {
    return (
      <div className="space-y-1">
        <div className="text-2xl font-bold">
          {formatInCurrency(price.usd, 'USD')}
        </div>
        <div className="text-sm text-gray-600">
          {formatInCurrency(price.cdf, 'CDF')}
        </div>
        <div className="text-sm text-gray-600">
          {formatInCurrency(price.fcfa, 'FCFA')}
        </div>
        <div className="text-xs text-gray-500">
          {cycle === 'monthly' ? 'par mois' : 'par an'}
        </div>
      </div>
    );
  }
  
  const activeCurrencyAmount = price[activeCurrency.toLowerCase() as keyof MultiCurrencyPrice] as number;
  
  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold">
        {format(activeCurrencyAmount)}
      </div>
      <div className="text-sm text-gray-600">
        {activeCurrency !== 'USD' && formatInCurrency(price.usd, 'USD')}
        {activeCurrency === 'USD' && formatInCurrency(price.cdf, 'CDF')}
      </div>
      <div className="text-xs text-gray-500">
        {cycle === 'monthly' ? 'par mois' : 'par an'}
      </div>
    </div>
  );
}
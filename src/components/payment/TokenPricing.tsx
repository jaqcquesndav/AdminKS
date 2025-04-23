import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Percent } from 'lucide-react';
import { TOKEN_PACKAGES, TOKEN_RATE, TokenPackage } from '../../types/payment';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { useExchangeRates } from '../../hooks/useExchangeRates';
import { SupportedCurrency } from '../../utils/currency';

interface TokenPricingProps {
  onSelect: (packageId: string) => void;
}

export function TokenPricing({ onSelect }: TokenPricingProps) {
  const { t } = useTranslation();
  const { currency, formatInCurrency } = useCurrencySettings();
  const { getRate } = useExchangeRates();

  const getDiscount = (tokenPackage: TokenPackage) => {
    const normalPrice = tokenPackage.tokens * TOKEN_RATE;
    const discount = ((normalPrice - tokenPackage.price) / normalPrice) * 100;
    return discount > 0 ? Math.round(discount) : 0;
  };

  // Calcule le prix dans chaque devise supportée
  const getPriceInCurrency = (usdPrice: number, targetCurrency: SupportedCurrency): number => {
    return usdPrice * getRate('USD', targetCurrency);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('payment.tokens.buyTokens', 'Acheter des tokens')}</h3>
        <div className="text-sm text-gray-500">
          1M tokens = {formatInCurrency(TOKEN_RATE * 1000000, currency)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOKEN_PACKAGES.map((pkg, index) => {
          const discount = getDiscount(pkg);
          
          return (
            <div
              key={index}
              className="border rounded-lg p-4 hover:border-primary transition-colors cursor-pointer"
              onClick={() => onSelect(pkg.id || index.toString())}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-primary/10 text-primary rounded-full p-2">
                  <Coins className="h-6 w-6" />
                </div>
                {discount > 0 && (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center">
                    <Percent className="h-3 w-3 mr-1" />
                    {discount}% {t('common.discount', 'Réduction')}
                  </div>
                )}
              </div>
              
              <h4 className="font-medium text-lg mb-1">
                {(pkg.tokens / 1000000).toFixed(1)}M tokens
              </h4>
              
              <div className="mt-4">
                <div className="flex items-end">
                  <p className="text-lg font-medium text-primary">
                    {formatInCurrency(pkg.price, currency)}
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-gray-500 line-through ml-2">
                      {formatInCurrency(pkg.tokens * TOKEN_RATE, currency)}
                    </p>
                  )}
                </div>
                
                {/* Afficher le prix dans les autres devises */}
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  {currency !== 'USD' && <p>{formatInCurrency(pkg.price, 'USD')}</p>}
                  {currency !== 'CDF' && <p>{formatInCurrency(getPriceInCurrency(pkg.price, 'CDF'), 'CDF')}</p>}
                  {currency !== 'FCFA' && <p>{formatInCurrency(getPriceInCurrency(pkg.price, 'FCFA'), 'FCFA')}</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {t('payment.tokens.neverExpire', 'Les tokens achetés n\'expirent pas et peuvent être utilisés à tout moment.')}
        {t('payment.tokens.bulkDiscount', 'Plus vous achetez de tokens, plus vous bénéficiez de réductions importantes.')}
      </p>
    </div>
  );
}
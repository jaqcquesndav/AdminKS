import { useTranslation } from 'react-i18next';
import { Coins, Percent } from 'lucide-react';
import { TOKEN_PACKAGES, TOKEN_RATE, TokenPackage } from '../../types/payment';
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { SupportedCurrency } from '../../types/currency';

interface TokenPricingProps {
  onSelect: (packageId: string) => void;
}

export function TokenPricing({ onSelect }: TokenPricingProps) {
  const { t } = useTranslation();
  const { activeCurrency, convert, formatCurrency, baseCurrency, supportedCurrencies } = useCurrencySettings();

  const getDiscount = (tokenPackage: TokenPackage): number => {
    const normalPriceInBase = tokenPackage.tokens * TOKEN_RATE; // Assumed TOKEN_RATE is per token in baseCurrency
    if (normalPriceInBase === 0) return 0;
    // tokenPackage.price is assumed to be in baseCurrency
    const discount = ((normalPriceInBase - tokenPackage.price) / normalPriceInBase) * 100;
    return discount > 0 ? Math.round(discount) : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('payment.tokens.buyTokens', 'Acheter des tokens')}</h3>
        <div className="text-sm text-gray-500">
          1M tokens = {formatCurrency(convert(TOKEN_RATE * 1000000, baseCurrency, activeCurrency), activeCurrency)}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOKEN_PACKAGES.map((pkg, index) => {
          const discount = getDiscount(pkg);
          const priceInActiveCurrency = convert(pkg.price, baseCurrency, activeCurrency);
          const normalPriceForDiscountDisplayInBase = pkg.tokens * TOKEN_RATE;
          const normalPriceInActiveCurrencyForDiscountDisplay = convert(normalPriceForDiscountDisplayInBase, baseCurrency, activeCurrency);
          
          return (
            <div
              key={pkg.id || index.toString()} 
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
                    {formatCurrency(priceInActiveCurrency, activeCurrency)}
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-gray-500 line-through ml-2">
                      {formatCurrency(normalPriceInActiveCurrencyForDiscountDisplay, activeCurrency)}
                    </p>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 mt-1 space-y-1">
                  {supportedCurrencies.map((currencyCode: SupportedCurrency) => { // Explicitly type currencyCode
                    if (currencyCode !== activeCurrency) {
                      const priceInOtherCurrency = convert(pkg.price, baseCurrency, currencyCode);
                      return <p key={currencyCode}>{formatCurrency(priceInOtherCurrency, currencyCode)}</p>;
                    }
                    return null;
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {t('payment.tokens.neverExpire', 'Les tokens achetés n\'expirent pas et peuvent être utilisés à tout moment.')}
        {' '}
        {t('payment.tokens.bulkDiscount', 'Plus vous achetez de tokens, plus vous bénéficiez de réductions importantes.')}
      </p>
    </div>
  );
}
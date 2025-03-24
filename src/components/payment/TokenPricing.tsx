import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, Percent } from 'lucide-react';
import { TOKEN_PACKAGES, TOKEN_RATE } from '../../types/payment';
import { formatCurrency } from '../../utils/currency';

interface TokenPricingProps {
  onSelect: (tokenPackage: typeof TOKEN_PACKAGES[0]) => void;
}

export function TokenPricing({ onSelect }: TokenPricingProps) {
  const { t } = useTranslation();

  const getDiscount = (tokenPackage: typeof TOKEN_PACKAGES[0]) => {
    const normalPrice = tokenPackage.tokens * TOKEN_RATE;
    const discount = ((normalPrice - tokenPackage.price) / normalPrice) * 100;
    return discount > 0 ? Math.round(discount) : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Acheter des tokens</h3>
        <div className="text-sm text-gray-500">
          1M tokens = {formatCurrency(10, 'USD')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TOKEN_PACKAGES.map((pkg, index) => {
          const discount = getDiscount(pkg);
          
          return (
            <div
              key={index}
              className="border rounded-lg p-4 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
              onClick={() => onSelect(pkg)}
            >
              <div className="flex items-center justify-between mb-2">
                <Coins className="w-5 h-5 text-primary" />
                {discount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <Percent className="w-3 h-3 mr-1" />
                    {discount}% off
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-2xl font-bold">
                  {(pkg.tokens / 1_000_000).toFixed(1)}M
                </p>
                <p className="text-sm text-gray-500">tokens</p>
                <div className="flex items-baseline space-x-2">
                  <p className="text-lg font-medium text-primary">
                    {formatCurrency(pkg.price, 'USD')}
                  </p>
                  {discount > 0 && (
                    <p className="text-sm text-gray-500 line-through">
                      {formatCurrency(pkg.tokens * TOKEN_RATE, 'USD')}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {formatCurrency(pkg.price * 2500, 'CDF')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        Les tokens achetés n'expirent pas et peuvent être utilisés à tout moment.
        Plus vous achetez de tokens, plus vous bénéficiez de réductions importantes.
      </p>
    </div>
  );
}
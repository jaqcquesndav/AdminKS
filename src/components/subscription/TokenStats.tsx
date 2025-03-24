import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coins } from 'lucide-react';

interface TokenStatsProps {
  totalTokens: number;
  usedTokens: number;
  remainingTokens: number;
}

export function TokenStats({ totalTokens, usedTokens, remainingTokens }: TokenStatsProps) {
  const { t } = useTranslation();
  const usagePercentage = (usedTokens / totalTokens) * 100;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Tokens</h3>
        <Coins className="w-6 h-6 text-primary" />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Utilisation</span>
            <span className="font-medium">{usedTokens} / {totalTokens}</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                usagePercentage > 90 
                  ? 'bg-red-500' 
                  : usagePercentage > 70 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
              }`}
              style={{ width: `${usagePercentage}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tokens restants</p>
            <p className="text-2xl font-semibold text-primary">
              {remainingTokens.toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Tokens utilisés</p>
            <p className="text-2xl font-semibold text-gray-700">
              {usedTokens.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
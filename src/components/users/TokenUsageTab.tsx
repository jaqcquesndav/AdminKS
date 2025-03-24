import React from 'react';
import { useTranslation } from 'react-i18next';
import { Coins, TrendingUp, AlertTriangle } from 'lucide-react';
import type { TokenUsage } from '../../types/user';

interface TokenUsageTabProps {
  monthlyLimit: number;
  used: number;
  remaining: number;
  usageHistory: TokenUsage[];
}

export function TokenUsageTab({ monthlyLimit, used, remaining, usageHistory }: TokenUsageTabProps) {
  const { t } = useTranslation();
  const usagePercentage = (used / monthlyLimit) * 100;

  return (
    <div className="space-y-6">
      {/* Token Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Limite mensuelle</h4>
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {monthlyLimit.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Utilisés ce mois</h4>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {used.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Restants</h4>
            <AlertTriangle className={`w-5 h-5 ${
              remaining < monthlyLimit * 0.1 ? 'text-red-500' : 'text-green-500'
            }`} />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {remaining.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Usage Progress */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium text-gray-600">Utilisation</h4>
          <span className="text-sm text-gray-500">
            {usagePercentage.toFixed(1)}%
          </span>
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

      {/* Usage History */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <h4 className="font-medium">Historique d'utilisation</h4>
        </div>
        <div className="divide-y">
          {usageHistory.map((usage) => (
            <div key={usage.id} className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {usage.applicationName}
                </p>
                <p className="text-sm text-gray-500">{usage.action}</p>
                <p className="text-xs text-gray-400">
                  {usage.timestamp.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-primary">
                  {usage.tokens.toLocaleString()} tokens
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
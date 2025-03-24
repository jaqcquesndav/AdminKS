import React from 'react';

interface PriceDisplayProps {
  usd: number;
  cdf: number;
  cycle: 'monthly' | 'yearly';
}

export function PriceDisplay({ usd, cdf, cycle }: PriceDisplayProps) {
  return (
    <div className="space-y-1">
      <div className="text-2xl font-bold">
        ${usd} <span className="text-sm text-gray-500">USD</span>
      </div>
      <div className="text-sm text-gray-600">
        {new Intl.NumberFormat('fr-CD', {
          style: 'currency',
          currency: 'CDF'
        }).format(cdf)}
      </div>
      <div className="text-xs text-gray-500">
        {cycle === 'monthly' ? 'par mois' : 'par an'}
      </div>
    </div>
  );
}
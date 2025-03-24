import React from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TokenUsage } from '../../../types/user';

interface TokenUsageChartProps {
  data: TokenUsage[];
}

export function TokenUsageChart({ data }: TokenUsageChartProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">{t('dashboard.tokenUsage.title')}</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">{t('dashboard.tokenUsage.used')}</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-primary/20 rounded-full mr-2"></div>
            <span className="text-sm text-gray-500">{t('dashboard.tokenUsage.remaining')}</span>
          </div>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis 
              dataKey="date" 
              className="text-gray-500"
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis className="text-gray-500" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem'
              }}
              formatter={(value: number) => [value.toLocaleString(), 'Tokens']}
            />
            <Bar dataKey="used" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="remaining" fill="rgba(var(--color-primary-rgb), 0.2)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
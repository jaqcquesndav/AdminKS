import React from 'react';
import { ArrowUp, ArrowDown, DivideIcon as LucideIcon } from 'lucide-react';

interface StatCardProps {
  name: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendDirection?: 'up' | 'down';
}

export function StatCard({ name, value, icon: Icon, trend, trendDirection }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${
            trendDirection === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trendDirection === 'up' ? (
              <ArrowUp className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDown className="w-4 h-4 mr-1" />
            )}
            {trend}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          {value}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {name}
        </p>
      </div>
    </div>
  );
}
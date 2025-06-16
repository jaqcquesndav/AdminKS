import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
    text?: string;
  };
  trend?: number; // Ajout de la propriété trend pour afficher une tendance en pourcentage
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
  loading?: boolean;
}

export const StatCard = ({
  title,
  value,
  icon,
  change,
  trend,
  color = 'primary',
  loading = false
}: StatCardProps) => {const iconColorClasses = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    info: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col h-full">
      {loading ? (
        <div className="animate-pulse h-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
            <div className={`rounded-full p-2 ${iconColorClasses[color]}`}>
              {icon}
            </div>          </div>
          <div className="text-2xl font-bold mb-1 dark:text-white">{value}</div>
          {change && (
            <div className="flex items-center mt-auto">
              <span
                className={`flex items-center text-sm ${
                  change.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change.isPositive ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                {Math.abs(change.value).toFixed(1)}%
              </span>              {change.text && (
                <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">{change.text}</span>
              )}
            </div>
          )}
          {trend !== undefined && !change && (
            <div className="flex items-center mt-auto">
              <span
                className={`flex items-center text-sm ${
                  trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend >= 0 ? (
                  <ArrowUpIcon className="w-4 h-4 mr-1" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 mr-1" />
                )}
                {Math.abs(trend).toFixed(1)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">vs précédent</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
import React from 'react';

interface PageLoaderProps {
  fullScreen?: boolean;
}

export function PageLoader({ fullScreen = false }: PageLoaderProps) {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 bg-white/80 dark:bg-gray-900/80'
    : 'w-full h-full min-h-[400px]';

  return (
    <div className={`${containerClasses} flex items-center justify-center`}>
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-4 border-primary/40 border-b-primary animate-spin" />
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">Chargement...</p>
      </div>
    </div>
  );
}
// No need for React import in modern React with automatic JSX transform

interface PageLoaderProps {
  fullScreen?: boolean;
  message?: string;
}

export function PageLoader({ fullScreen = false, message }: PageLoaderProps) {
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
        {message && (
          <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
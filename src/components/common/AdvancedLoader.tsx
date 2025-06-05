import { useEffect, useState } from 'react';

interface AdvancedLoaderProps {
  fullScreen?: boolean;
  message?: string;
  showProgress?: boolean;
  progressValue?: number;
  logo?: string;
}

export function AdvancedLoader({ 
  fullScreen = false, 
  message = 'Chargement...', 
  showProgress = false,
  progressValue = 0,  logo = '/src/assets/logo.svg'
}: AdvancedLoaderProps) {
  const [progress, setProgress] = useState(progressValue);
  const [dots, setDots] = useState('');
  
  // Effet pour simuler une progression si aucune valeur n'est fournie
  useEffect(() => {
    if (showProgress && progressValue === 0) {
      const timer = setTimeout(() => {
        setProgress(prev => prev < 90 ? prev + Math.random() * 10 : prev);
      }, 500);
      return () => clearTimeout(timer);
    } else if (progressValue > 0) {
      setProgress(progressValue);
    }
  }, [showProgress, progressValue]);

  // Effet pour l'animation des points
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, 400);
    return () => clearInterval(interval);
  }, []);
  
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm'
    : 'w-full h-full min-h-[400px] bg-white/50 dark:bg-gray-900/50';

  return (
    <div className={`${containerClasses} flex flex-col items-center justify-center transition-all duration-300`}>
      <div className="flex flex-col items-center space-y-8">
        {/* Logo (if available) */}
        {logo && (
          <div className="w-20 h-20 mb-4 animate-pulse">
            <img src={logo} alt="Logo" className="w-full h-full" />
          </div>
        )}
        
        {/* Spinner animation */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-primary/10 border-t-primary animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-primary/20 border-b-primary animate-spin-reverse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
        
        {/* Loading message */}
        <div className="text-center">
          <p className="text-base font-medium text-gray-700 dark:text-gray-300">{message}{dots}</p>
          
          {/* Progress bar */}
          {showProgress && (
            <div className="mt-4 w-64">
              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
                {Math.round(progress)}%
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

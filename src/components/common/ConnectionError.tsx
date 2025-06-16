import React from 'react';
import { AlertTriangle, WifiOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ConnectionErrorProps {
  message?: string;
  retry?: () => void;
  title?: string;           // Add title property
  onRetry?: () => void;     // Add onRetry as an alternative to retry
  retryAction?: () => void; // Add retryAction as another alternative
  className?: string;
}

export const ConnectionError: React.FC<ConnectionErrorProps> = ({
  message,
  retry,
  title,
  onRetry,
  retryAction,
  className = '',
}) => {
  const { t } = useTranslation();
  
  // Determine which retry function to use (prioritize retry, then onRetry, then retryAction)
  const handleRetry = retry || onRetry || retryAction;
  
  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-lg bg-red-50 border border-red-200 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-red-100">
        <WifiOff className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-red-700">
        {title || t('common.connectionError.title', 'Problème de connexion')}
      </h3>
      <p className="mb-4 text-center text-red-600">
        {message || t('common.connectionError.defaultMessage', 'Impossible de se connecter au serveur. Vérifiez votre connexion et réessayez.')}
      </p>
      {handleRetry && (
        <button 
          onClick={handleRetry}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          {t('common.connectionError.retry', 'Réessayer')}
        </button>
      )}
    </div>
  );
};

export const BackendError: React.FC<ConnectionErrorProps> = ({
  message,
  retry,
  className = '',
}) => {
  const { t } = useTranslation();
  
  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-lg bg-amber-50 border border-amber-200 ${className}`}>
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-full bg-amber-100">
        <AlertTriangle className="w-6 h-6 text-amber-600" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-amber-700">
        {t('common.backendError.title', 'Erreur du serveur')}
      </h3>
      <p className="mb-4 text-center text-amber-600">
        {message || t('common.backendError.defaultMessage', 'Une erreur est survenue lors de la communication avec le serveur.')}
      </p>
      {retry && (
        <button 
          onClick={retry}
          className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
        >
          {t('common.backendError.retry', 'Réessayer')}
        </button>
      )}
    </div>
  );
};

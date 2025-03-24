// src/components/common/Toast.tsx

import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const icons: Record<ToastType, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  success: CheckCircle,
  error: XCircle,
  info: AlertCircle,
};

const colors: Record<ToastType, string> = {
  success: 'bg-green-50 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  error: 'bg-red-50 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  info: 'bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
};

export const Toast: React.FC<ToastProps> = ({ type, message, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const Icon = icons[type] || AlertCircle;

  return (
    <div className={`${colors[type]} p-4 rounded-md shadow-lg max-w-sm w-full`}>
      <div className="flex items-start">
        <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
        <div className="flex-1 mr-2">
          <p className="text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-3 flex items-center justify-center w-5 h-5 
                     rounded-full hover:bg-black/10 transition-colors"
          aria-label="Fermer le toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

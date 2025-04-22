import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Toast } from '../components/common/Toast';
import { ToastContainer } from '../components/common/ToastContainer';

// Types de toast
type ToastType = 'success' | 'error' | 'info' | 'warning';

// Structure d'un toast
interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
}

// Interface du contexte
interface ToastContextType {
  toasts: ToastItem[];
  showToast: (type: ToastType, message: string) => void;
  hideToast: (id: string) => void;
}

// Création du contexte
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte
export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext doit être utilisé dans un ToastProvider');
  }
  return context;
};

// Props du provider
interface ToastProviderProps {
  children: ReactNode;
}

// Provider du contexte
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Afficher un toast
  const showToast = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  }, []);

  // Masquer un toast
  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer>
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            type={toast.type}
            message={toast.message}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};
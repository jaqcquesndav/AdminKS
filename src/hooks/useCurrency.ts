import { useContext } from 'react';
import { CurrencyContext } from '../contexts/CurrencyContext'; // Adjust path as needed

// Hook pour utiliser le contexte de devise
export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}

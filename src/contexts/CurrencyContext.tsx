import React, { createContext, useState, useContext, useEffect } from 'react';
import { SupportedCurrency } from '../utils/currency';

type CurrencyContextType = {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
};

// Création du contexte
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Clé utilisée pour stocker la devise dans localStorage
const CURRENCY_STORAGE_KEY = 'app-currency';

// Provider du contexte
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // État pour stocker la devise active
  const [currency, setCurrency] = useState<SupportedCurrency>(() => {
    // Récupérer la devise depuis localStorage ou utiliser USD par défaut
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as SupportedCurrency | null;
    return savedCurrency && ['USD', 'CDF', 'FCFA'].includes(savedCurrency) 
      ? savedCurrency 
      : 'USD';
  });

  // Sauvegarder la devise dans localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

// Hook personnalisé pour utiliser le contexte
export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency doit être utilisé dans un CurrencyProvider');
  }
  return context;
}
import React, { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { SupportedCurrency, ExchangeRateConfig } from '../types/currency';
import { formatCurrency, convertCurrency, getCurrentExchangeRates, updateExchangeRates } from '../utils/currency';
import { CURRENCY_STORAGE_KEY, SUPPORTED_CURRENCIES } from '../constants/currencyConstants';

type FormatOptions = Intl.NumberFormatOptions & {
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
};

export type CurrencyContextType = {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  supportedCurrencies: SupportedCurrency[];
  format: (amount: number, options?: FormatOptions) => string;
  convert: (amount: number, fromCurrency: SupportedCurrency, toCurrency?: SupportedCurrency) => number;
  formatInCurrency: (amount: number, targetCurrency: SupportedCurrency, options?: FormatOptions) => string;
  exchangeRates: Record<SupportedCurrency, number>;
  lastRatesUpdate: string;
  setUserExchangeRate: (targetCurrency: SupportedCurrency, rate: number) => void; // Added
  baseCurrency: SupportedCurrency; // Added
};

// Création du contexte
export const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Provider du contexte
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // État pour stocker la devise active
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as SupportedCurrency | null;
    return savedCurrency && SUPPORTED_CURRENCIES.includes(savedCurrency) 
      ? savedCurrency 
      : 'CDF'; // Default to CDF
  });

  // État pour stocker les taux de change actuels
  const [exchangeRatesConfig, setExchangeRatesConfig] = useState<ExchangeRateConfig>(
    getCurrentExchangeRates() // This will load from localStorage or defaults
  );

  // Fonction pour mettre à jour la devise avec gestion d'erreur et logging
  const setCurrency = useCallback((newCurrency: SupportedCurrency) => {
    if (!SUPPORTED_CURRENCIES.includes(newCurrency)) {
      console.error(`Devise non supportée: ${newCurrency}`);
      return;
    }

    console.log(`Changing currency from ${currency} to ${newCurrency}`);
    setCurrencyState(newCurrency);
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  }, [currency]);

  // Fonction pour permettre à l'utilisateur de définir un taux de change spécifique
  const setUserExchangeRate = useCallback((targetCurrency: SupportedCurrency, rate: number) => {
    if (targetCurrency === exchangeRatesConfig.baseCurrency) {
      console.warn(`Cannot set exchange rate for the base currency ${exchangeRatesConfig.baseCurrency}`);
      return;
    }
    if (rate <= 0) {
      console.error('Exchange rate must be positive');
      return;
    }
    const newRates = { ...exchangeRatesConfig.rates, [targetCurrency]: rate };
    updateExchangeRates(newRates, new Date().toISOString()); // updateExchangeRates in utils/currency.ts will save to localStorage
    setExchangeRatesConfig(getCurrentExchangeRates()); // Re-fetch from storage to reflect update
  }, [exchangeRatesConfig]);


  // Surveiller les changements dans les taux de change globaux (e.g., from an API or localStorage)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'exchange_rates') {
        console.log('Exchange rates updated in localStorage, reloading in context.');
        setExchangeRatesConfig(getCurrentExchangeRates());
      }
      if (event.key === CURRENCY_STORAGE_KEY) {
        const newCurrencyFromStorage = localStorage.getItem(CURRENCY_STORAGE_KEY) as SupportedCurrency | null;
        if (newCurrencyFromStorage && SUPPORTED_CURRENCIES.includes(newCurrencyFromStorage) && newCurrencyFromStorage !== currency) {
          console.log('App currency changed in another tab, updating current tab.');
          setCurrencyState(newCurrencyFromStorage);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Initial load
    setExchangeRatesConfig(getCurrentExchangeRates());

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [currency]); // Added currency to dependency array to re-run if it changes programmatically elsewhere

  // Extraire les taux de change pour plus de facilité d'utilisation
  const exchangeRates = useMemo(() => exchangeRatesConfig.rates, [exchangeRatesConfig]);
  const baseCurrency = useMemo(() => exchangeRatesConfig.baseCurrency, [exchangeRatesConfig]);

  // Formatter un montant dans la devise active
  const format = useCallback((amount: number, options?: FormatOptions): string => {
    return formatCurrency(amount, currency, options);
  }, [currency]); // Added currency to dependency array
  
  // Convertir un montant d'une devise à une autre en utilisant les taux actuels
  const convert = useCallback((amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency = currency): number => {
    if (fromCurrency === toCurrency) return amount;
    
    const rates = exchangeRatesConfig.rates; // Use current rates from state

    try {
      // Assumes all rates are relative to the baseCurrency (e.g., USD)
      const fromRate = fromCurrency === exchangeRatesConfig.baseCurrency ? 1 : rates[fromCurrency];
      const toRate = toCurrency === exchangeRatesConfig.baseCurrency ? 1 : rates[toCurrency];

      if (!fromRate || !toRate) {
        console.warn(`Exchange rate not found for ${fromCurrency} or ${toCurrency}. Falling back to default conversion.`);
        return convertCurrency(amount, fromCurrency, toCurrency); // Fallback to util's default if rate missing
      }
      
      const amountInBase = amount / fromRate;
      return amountInBase * toRate;
    } catch (error) {
      console.warn('Erreur lors de la conversion avec les taux dynamiques', error);
      // Fallback sur la méthode standard
      return convertCurrency(amount, fromCurrency, toCurrency);
    }
  }, [currency, exchangeRatesConfig]); // Added dependencies
  
  // Formatter un montant dans une devise spécifique
  const formatInCurrency = useCallback((amount: number, targetCurrency: SupportedCurrency, options?: FormatOptions): string => {
    return formatCurrency(amount, targetCurrency, options);
  }, []); // No dependencies needed as formatCurrency is a stable import

  const contextValue = useMemo(() => ({
    currency,
    setCurrency,
    supportedCurrencies: SUPPORTED_CURRENCIES as SupportedCurrency[],
    format,
    convert,
    formatInCurrency,
    exchangeRates,
    lastRatesUpdate: exchangeRatesConfig.lastUpdated,
    setUserExchangeRate,
    baseCurrency
  }), [
    currency, 
    setCurrency, 
    format, // Now stable due to useCallback
    convert, // Now stable due to useCallback
    formatInCurrency, // Now stable due to useCallback
    exchangeRates, 
    exchangeRatesConfig.lastUpdated,
    setUserExchangeRate,
    baseCurrency
  ]);

  return (
    <CurrencyContext.Provider value={contextValue}>
      {children}
    </CurrencyContext.Provider>
  );
}
import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { SupportedCurrency, DEFAULT_CURRENCY_INFO, ExchangeRateConfig } from '../types/currency';
import { formatCurrency, convertCurrency, getCurrentExchangeRates } from '../utils/currency';
import { CURRENCY_STORAGE_KEY, SUPPORTED_CURRENCIES } from '../constants/currencyConstants';

type FormatOptions = Intl.NumberFormatOptions & {
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
};

type CurrencyContextType = {
  currency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  supportedCurrencies: SupportedCurrency[];
  format: (amount: number, options?: FormatOptions) => string;
  convert: (amount: number, fromCurrency: SupportedCurrency, toCurrency?: SupportedCurrency) => number;
  formatInCurrency: (amount: number, targetCurrency: SupportedCurrency, options?: FormatOptions) => string;
  exchangeRates: Record<SupportedCurrency, number>;
  lastRatesUpdate: string;
};

// Création du contexte
const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Provider du contexte
export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  // État pour stocker la devise active
  const [currency, setCurrencyState] = useState<SupportedCurrency>(() => {
    // Récupérer la devise depuis localStorage ou utiliser USD par défaut
    const savedCurrency = localStorage.getItem(CURRENCY_STORAGE_KEY) as SupportedCurrency | null;
    return savedCurrency && Object.keys(DEFAULT_CURRENCY_INFO).includes(savedCurrency) 
      ? savedCurrency 
      : 'USD';
  });

  // État pour stocker les taux de change actuels
  const [exchangeRatesConfig, setExchangeRatesConfig] = useState<ExchangeRateConfig>(
    getCurrentExchangeRates()
  );

  // Fonction pour mettre à jour la devise avec gestion d'erreur et logging
  const setCurrency = useCallback((newCurrency: SupportedCurrency) => {
    if (!Object.keys(DEFAULT_CURRENCY_INFO).includes(newCurrency)) {
      console.error(`Devise non supportée: ${newCurrency}`);
      return;
    }

    console.log(`Changing currency from ${currency} to ${newCurrency}`);
    setCurrencyState(newCurrency);
    // Forcer la mise à jour du localStorage immédiatement au lieu d'attendre l'effet
    localStorage.setItem(CURRENCY_STORAGE_KEY, newCurrency);
  }, [currency]);

  // Surveiller les changements dans les taux de change globaux
  useEffect(() => {
    // Créer une fonction pour mettre à jour les taux
    const updateRatesFromGlobal = () => {
      const currentRates = getCurrentExchangeRates();
      setExchangeRatesConfig(currentRates);
    };

    // Configurer un intervalle pour vérifier les mises à jour (toutes les 5 minutes)
    const checkInterval = setInterval(updateRatesFromGlobal, 5 * 60 * 1000);

    // Effectuer une vérification initiale
    updateRatesFromGlobal();

    // Nettoyer l'intervalle lorsque le composant est démonté
    return () => clearInterval(checkInterval);
  }, []);

  // Extraire les taux de change pour plus de facilité d'utilisation
  const exchangeRates = useMemo(() => exchangeRatesConfig.rates, [exchangeRatesConfig]);

  // Formatter un montant dans la devise active
  const format = (amount: number, options?: FormatOptions): string => {
    return formatCurrency(amount, currency, options);
  };
  
  // Convertir un montant d'une devise à une autre en utilisant les taux actuels
  const convert = (amount: number, fromCurrency: SupportedCurrency, toCurrency: SupportedCurrency = currency): number => {
    if (fromCurrency === toCurrency) return amount;
    
    try {
      // Essayer d'utiliser les taux de change actuels
      if (fromCurrency === 'USD') {
        return amount * exchangeRates[toCurrency];
      }
      
      if (toCurrency === 'USD') {
        return amount / exchangeRates[fromCurrency];
      }
      
      // Conversion via USD
      const amountInUSD = amount / exchangeRates[fromCurrency];
      return amountInUSD * exchangeRates[toCurrency];
    } catch (error) {
      console.warn('Erreur lors de la conversion avec les taux dynamiques', error);
      // Fallback sur la méthode standard
      return convertCurrency(amount, fromCurrency, toCurrency);
    }
  };
  
  // Formatter un montant dans une devise spécifique
  const formatInCurrency = (amount: number, targetCurrency: SupportedCurrency, options?: FormatOptions): string => {
    return formatCurrency(amount, targetCurrency, options);
  };

  const contextValue = {
    currency,
    setCurrency,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    format,
    convert,
    formatInCurrency,
    exchangeRates,
    lastRatesUpdate: exchangeRatesConfig.lastUpdated,
  };

  return (
    <CurrencyContext.Provider value={contextValue}>
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
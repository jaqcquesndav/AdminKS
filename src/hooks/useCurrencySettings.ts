import { useEffect, useState, useCallback } from 'react';
import { useCurrency } from './useCurrency'; // Corrected import path
import { useLanguage } from './useLanguage';
import { formatCurrency } from '../utils/currency';
import { useExchangeRates } from './useExchangeRates'; // Added import
import { 
  SupportedCurrency, 
  DEFAULT_CURRENCY_INFO, 
  CurrencyInfo, 
  CurrencyPreferences,
  MultiCurrencyPrice
} from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../constants/currencyConstants';

interface CurrencySettings {
  currency: SupportedCurrency;
  activeCurrency: SupportedCurrency;
  setCurrency: (currency: SupportedCurrency) => void;
  format: (amount: number) => string;
  formatInCurrency: (amount: number, currency: SupportedCurrency) => string;
  convert: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => number;
  formatAllCurrencies: (amount: number) => Record<SupportedCurrency, string>;
  currencyInfo: CurrencyInfo;
  supportedCurrencies: SupportedCurrency[];
  preferences: CurrencyPreferences;
  updatePreferences: (prefs: Partial<CurrencyPreferences>) => void;
  formatMultiCurrencyPrice: (price: MultiCurrencyPrice) => string;
  loading: boolean; // Combined loading state
  lastUpdated: string; // From context
  refreshRates: () => Promise<void>; // For external rates
  formatCurrency: (amount: number, currency?: SupportedCurrency, options?: Intl.NumberFormatOptions) => string;
  getCurrencySymbol: (currency: SupportedCurrency) => string;
  exchangeRates: Record<SupportedCurrency, number>; 
  updateUserRate: (targetCurrency: SupportedCurrency, rate: number) => void;
  baseCurrency: SupportedCurrency;
}

/**
 * Mapping par défaut des langues vers les devises préférées
 */
const DEFAULT_LANGUAGE_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  'en': 'USD',
  'fr': 'FCFA',
  'fr-CD': 'CDF',
  'default': 'CDF'
};

/**
 * Hook personnalisé pour gérer les paramètres d'affichage des devises
 * Fournit des fonctions utilitaires pour formater et convertir les montants
 * Intègre les taux de change dynamiques via useExchangeRates
 */
export function useCurrencySettings(): CurrencySettings {
  const currencyContext = useCurrency();
  const {
    currency: contextCurrency,
    setCurrency: setContextCurrency,
    setUserExchangeRate, // Renamed from updateUserRate in context to avoid conflict
    baseCurrency,
    convert: contextConvert,
    exchangeRates: contextExchangeRates,
    lastRatesUpdate: contextLastRateUpdate
  } = currencyContext;

  const { currentLanguage } = useLanguage();
  // Assuming useExchangeRates is for fetching external rates. 
  // The first argument might be a base currency for the API call, or undefined if it fetches all.
  // Corrected signature: useExchangeRates(baseCurrencyForApi?: SupportedCurrency, autoFetch?: boolean, intervalInMinutes?: number)
  const { loading: externalRatesLoading, refreshRates: refreshExternalRates } = useExchangeRates(undefined, true, 30); 

  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(() => {
    if (contextCurrency && SUPPORTED_CURRENCIES.includes(contextCurrency)) {
      return DEFAULT_CURRENCY_INFO[contextCurrency as SupportedCurrency];
    }
    console.warn(`Initial contextCurrency ('${contextCurrency}') in useCurrencySettings is not valid for DEFAULT_CURRENCY_INFO. Falling back to USD info.`);
    return DEFAULT_CURRENCY_INFO.USD; 
  });

  const [preferences, setPreferences] = useState<CurrencyPreferences>(() => {
    const initialCurrency = contextCurrency || DEFAULT_LANGUAGE_CURRENCY_MAP[currentLanguage] || DEFAULT_LANGUAGE_CURRENCY_MAP.default;
    return {
      defaultCurrency: initialCurrency,
      format: 'symbol_first',
      showDecimals: initialCurrency === 'USD',
      showAlwaysSign: true,
      currencySetManually: !!contextCurrency
    };
  });

  // Synchronize with context currency and set based on language if not manually set
  useEffect(() => {
    const preferredCurrency = DEFAULT_LANGUAGE_CURRENCY_MAP[currentLanguage] || DEFAULT_LANGUAGE_CURRENCY_MAP.default;
    if (!preferences.currencySetManually && preferredCurrency !== contextCurrency) {
      setContextCurrency(preferredCurrency);
    }
  }, [currentLanguage, preferences.currencySetManually, contextCurrency, setContextCurrency]);

  // Update local currencyInfo when contextCurrency changes
  useEffect(() => {
    let validCurrencyToSet = contextCurrency;
    if (!(contextCurrency && SUPPORTED_CURRENCIES.includes(contextCurrency))) {
      console.error(`Invalid contextCurrency ('${contextCurrency}') detected in useEffect for currencyInfo/preferences update. Using fallback USD.`);
      validCurrencyToSet = 'USD'; 
    }
    
    setCurrencyInfo(DEFAULT_CURRENCY_INFO[validCurrencyToSet as SupportedCurrency]);
    
    setPreferences(prev => ({
      ...prev,
      defaultCurrency: validCurrencyToSet, 
      showDecimals: validCurrencyToSet === 'USD'
    }));
  }, [contextCurrency]);

  // Fonction de mise à jour de la devise qui garantit la propagation des changements
  const setCurrency = useCallback((newCurrency: SupportedCurrency) => {
    setContextCurrency(newCurrency);
    setPreferences(prev => ({ ...prev, currencySetManually: true, defaultCurrency: newCurrency }));
  }, [setContextCurrency]);

  // Mettre à jour les préférences locales
  const updatePreferences = useCallback((newPrefs: Partial<CurrencyPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  // Fonction pour formater un montant selon la devise actuelle
  const format = useCallback((amount: number): string => {
    return formatCurrency(amount, contextCurrency);
  }, [contextCurrency]);

  // Fonction pour formater un montant dans une devise spécifique
  const formatInCurrency = useCallback((amount: number, currency: SupportedCurrency): string => {
    return formatCurrency(amount, currency);
  }, []);

  const convert = useCallback((amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
    return contextConvert(amount, from, to);
  }, [contextConvert]);

  const formatAllCurrencies = useCallback((amount: number): Record<SupportedCurrency, string> => {
    const result: Record<SupportedCurrency, string> = {} as Record<SupportedCurrency, string>;
    SUPPORTED_CURRENCIES.forEach((curr: SupportedCurrency) => {
      result[curr] = formatCurrency(convert(amount, contextCurrency, curr), curr);
    });
    return result;
  }, [contextCurrency, convert]);

  const formatMultiCurrencyPrice = useCallback((price: MultiCurrencyPrice): string => {
    const priceInKey = contextCurrency.toLowerCase() as keyof MultiCurrencyPrice;
    const amountInActiveCurrency = price[priceInKey] !== undefined
      ? price[priceInKey]
      : convert(price.usd, 'USD', contextCurrency);
    return format(amountInActiveCurrency);
  }, [contextCurrency, format, convert]);

  const getCurrencySymbol = useCallback((currency: SupportedCurrency): string => {
    return DEFAULT_CURRENCY_INFO[currency]?.symbol || currency;
  }, []);

  const updateUserRate = useCallback((targetCurrency: SupportedCurrency, rate: number) => {
    if (targetCurrency === baseCurrency) {
      console.warn("Cannot update rate for base currency. Base rate is always 1.");
      return;
    }
    setUserExchangeRate(targetCurrency, rate); // Call context function
  }, [setUserExchangeRate, baseCurrency]);

  return {
    currency: contextCurrency,
    activeCurrency: contextCurrency,
    setCurrency,
    format,
    formatInCurrency,
    convert,
    formatAllCurrencies,
    currencyInfo,
    supportedCurrencies: SUPPORTED_CURRENCIES,
    preferences,
    updatePreferences,
    formatMultiCurrencyPrice,
    loading: contextLastRateUpdate === 'loading' || externalRatesLoading,
    lastUpdated: contextLastRateUpdate === 'loading' ? 'Loading...' : contextLastRateUpdate,
    refreshRates: refreshExternalRates,
    formatCurrency, // Raw utility
    getCurrencySymbol,
    exchangeRates: contextExchangeRates,
    updateUserRate,
    baseCurrency
  };
}
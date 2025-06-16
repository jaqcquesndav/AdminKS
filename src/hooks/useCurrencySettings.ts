import { useEffect, useState, useCallback, useMemo } from 'react';
import { useCurrency } from './useCurrency'; 
import { useLanguage } from './useLanguage';
import { formatCurrency as utilFormatCurrency } from '../utils/currency';
import { useExchangeRates } from './useExchangeRates'; 
import { 
  SupportedCurrency, 
  DEFAULT_CURRENCY_INFO, 
  CurrencyInfo, 
  CurrencyPreferences,
  MultiCurrencyPrice,
  ManualExchangeRate as ManualRate // Aliasing for consistency with previous usage
} from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../constants/currencyConstants';
import { useTranslation } from 'react-i18next'; // Standard way to get t function

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
  loading: boolean; 
  lastUpdated: string; 
  refreshRates: () => Promise<void>; 
  formatCurrency: (amount: number, currency?: SupportedCurrency, options?: Intl.NumberFormatOptions) => string;
  getCurrencySymbol: (currency: SupportedCurrency) => string;
  exchangeRates: Record<SupportedCurrency, number>; 
  manualRates: ManualRate[]; 
  addManualRate: (currency: SupportedCurrency, rate: number) => void; 
  updateManualRate: (currency: SupportedCurrency, rate: number) => void; 
  removeManualRate: (currency: SupportedCurrency) => void; 
  baseCurrency: SupportedCurrency;
}

const DEFAULT_LANGUAGE_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  'en': 'USD',
  'fr': 'FCFA',
  'fr-CD': 'CDF',
  'default': 'CDF'
};

export function useCurrencySettings(): CurrencySettings {
  const { t } = useTranslation(); // Get t function via hook
  const currencyContext = useCurrency();
  const {
    currency: contextCurrency,
    setCurrency: setContextCurrency,
    setUserExchangeRate, 
    removeUserExchangeRate, 
    baseCurrency,
    convert: contextConvert,
    exchangeRates: contextExchangeRates,
    lastRatesUpdate: contextLastRateUpdate
  } = currencyContext;

  const { currentLanguage } = useLanguage();
  const { loading: externalRatesLoading, refreshRates: refreshExternalRates } = useExchangeRates(undefined, true, 30); 

  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(() => {
    if (contextCurrency && SUPPORTED_CURRENCIES.includes(contextCurrency)) {
      return DEFAULT_CURRENCY_INFO[contextCurrency as SupportedCurrency];
    }
    return DEFAULT_CURRENCY_INFO.USD; 
  });

  const [preferences, setPreferences] = useState<CurrencyPreferences>(() => {
    const initialCurrency = contextCurrency || DEFAULT_LANGUAGE_CURRENCY_MAP[currentLanguage] || DEFAULT_LANGUAGE_CURRENCY_MAP.default;
    return {
      defaultCurrency: initialCurrency,
      format: 'symbol_first',
      showDecimals: initialCurrency === 'USD', // This is a custom preference, not for Intl.NumberFormatOptions directly
      showAlwaysSign: true,
      currencySetManually: !!contextCurrency
    };
  });

  useEffect(() => {
    const preferredCurrency = DEFAULT_LANGUAGE_CURRENCY_MAP[currentLanguage] || DEFAULT_LANGUAGE_CURRENCY_MAP.default;
    if (!preferences.currencySetManually && preferredCurrency !== contextCurrency) {
      setContextCurrency(preferredCurrency);
    }
  }, [currentLanguage, preferences.currencySetManually, contextCurrency, setContextCurrency]);

  useEffect(() => {
    let validCurrencyToSet = contextCurrency;
    if (!validCurrencyToSet || !SUPPORTED_CURRENCIES.includes(validCurrencyToSet)) {
      console.warn(`Invalid contextCurrency ('${validCurrencyToSet}') in useCurrencySettings. Falling back to USD info.`);
      validCurrencyToSet = 'USD'; 
    }
    setCurrencyInfo(DEFAULT_CURRENCY_INFO[validCurrencyToSet]);
  }, [contextCurrency]);

  const updatePreferences = useCallback((prefs: Partial<CurrencyPreferences>) => {
    setPreferences(prev => ({ ...prev, ...prefs }));
    if (prefs.defaultCurrency) {
      setContextCurrency(prefs.defaultCurrency);
      setPreferences(prev => ({ ...prev, currencySetManually: true }));
    }
  }, [setContextCurrency]);

  const formatOptions = useCallback((): Intl.NumberFormatOptions => ({
    currencyDisplay: preferences.format === 'symbol_first' ? 'symbol' : 'code',
    minimumFractionDigits: preferences.showDecimals ? 2 : 0,
    maximumFractionDigits: preferences.showDecimals ? 2 : 0,
  }), [preferences.format, preferences.showDecimals]);

  const format = useCallback((amount: number): string => {
    return utilFormatCurrency(amount, contextCurrency, formatOptions());
  }, [contextCurrency, formatOptions]);

  const formatInCurrency = useCallback((amount: number, currency: SupportedCurrency): string => {
    return utilFormatCurrency(amount, currency, formatOptions());
  }, [formatOptions]);

  const formatAllCurrencies = useCallback((amount: number): Record<SupportedCurrency, string> => {
    const result: Record<SupportedCurrency, string> = {} as Record<SupportedCurrency, string>; 
    SUPPORTED_CURRENCIES.forEach(curr => {
      const convertedAmount = contextConvert(amount, contextCurrency, curr);
      result[curr] = utilFormatCurrency(convertedAmount, curr, formatOptions());
    });
    return result;
  }, [contextCurrency, contextConvert, formatOptions]);

  const getCurrencySymbol = useCallback((currency: SupportedCurrency): string => {
    return DEFAULT_CURRENCY_INFO[currency]?.symbol || currency;
  }, []);

  const formatMultiCurrencyPrice = useCallback((price: MultiCurrencyPrice): string => {
    const displayCurrency = contextCurrency;
    // Adjust for lowercase keys in MultiCurrencyPrice
    const priceForDisplayCurrency = price[displayCurrency.toLowerCase() as keyof MultiCurrencyPrice];

    if (priceForDisplayCurrency !== undefined) {
      return formatInCurrency(priceForDisplayCurrency, displayCurrency);
    }
    
    const priceInUSD = price.usd;
    if (priceInUSD !== undefined) {
      const convertedAmount = contextConvert(priceInUSD, 'USD', displayCurrency);
      return formatInCurrency(convertedAmount, displayCurrency);
    }

    const firstAvailableCurrency = Object.keys(price)[0] as keyof MultiCurrencyPrice | undefined;
    if (firstAvailableCurrency && price[firstAvailableCurrency] !== undefined) {
      // Ensure the key is a valid SupportedCurrency before converting
      const sourceCurrency = firstAvailableCurrency.toUpperCase() as SupportedCurrency;
      if (SUPPORTED_CURRENCIES.includes(sourceCurrency)){
        const convertedAmount = contextConvert(price[firstAvailableCurrency]!, sourceCurrency, displayCurrency);
        return formatInCurrency(convertedAmount, displayCurrency) + ` (*${t('currency.convertedFrom', {currency: sourceCurrency})})` ;
      }
    }
    return t('currency.priceUnavailable', 'Price unavailable');
  }, [contextCurrency, contextConvert, formatInCurrency, t]);

  const addManualRate = useCallback((currency: SupportedCurrency, rate: number) => {
    setUserExchangeRate(currency, rate);
  }, [setUserExchangeRate]);

  const updateManualRate = useCallback((currency: SupportedCurrency, rate: number) => {
    setUserExchangeRate(currency, rate); 
  }, [setUserExchangeRate]);

  const removeManualRate = useCallback((currency: SupportedCurrency) => {
    removeUserExchangeRate(currency);
  }, [removeUserExchangeRate]);

  const manualRates = useMemo((): ManualRate[] => {
    return Object.entries(contextExchangeRates)
      .filter(([currency]) => currency !== baseCurrency)
      .map(([currency, rate]) => ({ currency: currency as SupportedCurrency, rate }));
  }, [contextExchangeRates, baseCurrency]);

  return {
    currency: contextCurrency,
    activeCurrency: contextCurrency, 
    setCurrency: setContextCurrency,
    format,
    formatInCurrency,
    convert: contextConvert,
    formatAllCurrencies,
    currencyInfo,
    supportedCurrencies: SUPPORTED_CURRENCIES as SupportedCurrency[],
    preferences,
    updatePreferences,
    formatMultiCurrencyPrice,
    loading: externalRatesLoading, 
    lastUpdated: contextLastRateUpdate || new Date().toISOString(),
    refreshRates: refreshExternalRates,
    formatCurrency: utilFormatCurrency, 
    getCurrencySymbol,
    exchangeRates: contextExchangeRates,
    manualRates, 
    addManualRate,
    updateManualRate,
    removeManualRate,
    baseCurrency,
  };
}
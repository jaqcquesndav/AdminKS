import { useEffect, useState, useCallback, useMemo } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useExchangeRates } from './useExchangeRates';
import { useLanguage } from './useLanguage';
import { formatCurrency, convertCurrency } from '../utils/currency';
import { 
  SupportedCurrency, 
  DEFAULT_CURRENCY_INFO, 
  CurrencyInfo, 
  CurrencyPreferences,
  MultiCurrencyPrice
} from '../types/currency';

interface CurrencySettings {
  // Devise actuelle
  currency: SupportedCurrency;
  
  // Alias plus explicite pour la devise actuelle (pour une meilleure lisibilité du code)
  activeCurrency: SupportedCurrency;
  
  // Fonction pour changer la devise
  setCurrency: (currency: SupportedCurrency) => void;
  
  // Fonction pour formater un montant selon la devise actuelle
  format: (amount: number) => string;
  
  // Fonction pour formater un montant dans une devise spécifique
  formatInCurrency: (amount: number, currency: SupportedCurrency) => string;
  
  // Fonction pour convertir un montant d'une devise à une autre
  convert: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => number;
  
  // Fonction qui renvoie toutes les devises supportées formatées
  formatAllCurrencies: (amount: number) => Record<SupportedCurrency, string>;
  
  // Information sur la devise actuelle
  currencyInfo: CurrencyInfo;
  
  // Liste des devises supportées
  supportedCurrencies: SupportedCurrency[];

  // Préférences d'affichage des devises
  preferences: CurrencyPreferences;
  
  // Fonction pour mettre à jour les préférences d'affichage des devises
  updatePreferences: (prefs: Partial<CurrencyPreferences>) => void;
  
  // Fonction pour formater un prix avec plusieurs devises
  formatMultiCurrencyPrice: (price: MultiCurrencyPrice) => string;
  
  // État de chargement des taux de change
  loading: boolean;
  
  // Date de dernière mise à jour des taux de change
  lastUpdated: string;
  
  // Rafraîchir manuellement les taux de change
  refreshRates: () => Promise<void>;
  
  // Fonction utilitaire pour formater un montant selon une devise spécifiée
  formatCurrency: (amount: number, currency?: SupportedCurrency, options?: Intl.NumberFormatOptions) => string;

  // Fonction pour récupérer le symbole de devise
  getCurrencySymbol: (currency: SupportedCurrency) => string;
}

/**
 * Mapping par défaut des langues vers les devises préférées
 */
const DEFAULT_LANGUAGE_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  'en': 'USD',
  'fr': 'FCFA',
  'fr-CD': 'CDF'
};

/**
 * Hook personnalisé pour gérer les paramètres d'affichage des devises
 * Fournit des fonctions utilitaires pour formater et convertir les montants
 * Intègre les taux de change dynamiques via useExchangeRates
 */
export function useCurrencySettings(): CurrencySettings {
  const currencyContext = useCurrency();
  const { currency: contextCurrency, setCurrency: setContextCurrency } = currencyContext;
  const { currentLanguage } = useLanguage();
  const { loading, lastUpdated, getRate, refreshRates } = useExchangeRates(30, true);
  const [currencyInfo, setCurrencyInfo] = useState<CurrencyInfo>(DEFAULT_CURRENCY_INFO[contextCurrency]);
  const [preferences, setPreferences] = useState<CurrencyPreferences>({
    defaultCurrency: contextCurrency,
    format: 'symbol_first',
    showDecimals: contextCurrency === 'USD',
    showAlwaysSign: true,
    currencySetManually: false
  });

  // Fonction de mise à jour de la devise qui garantit la propagation des changements
  const setCurrency = useCallback((newCurrency: SupportedCurrency) => {
    console.log(`useCurrencySettings: Changing currency to ${newCurrency}`);
    
    // Mettre à jour dans le contexte global
    setContextCurrency(newCurrency);
    
    // Mettre à jour les préférences locales
    setPreferences(prev => ({
      ...prev,
      defaultCurrency: newCurrency,
      currencySetManually: true
    }));
    
    // Forcer la mise à jour des informations de devise
    setCurrencyInfo(DEFAULT_CURRENCY_INFO[newCurrency]);
  }, [setContextCurrency]);

  // Détecter la devise par défaut en fonction de la langue de l'utilisateur
  useEffect(() => {
    if (currentLanguage && !preferences.currencySetManually) {
      const languageCurrency = DEFAULT_LANGUAGE_CURRENCY_MAP[currentLanguage] || 
                              DEFAULT_LANGUAGE_CURRENCY_MAP[currentLanguage.split('-')[0]];
      
      if (languageCurrency && languageCurrency !== contextCurrency) {
        setCurrency(languageCurrency);
      }
    }
  }, [currentLanguage, contextCurrency, setCurrency, preferences.currencySetManually]);

  // Mettre à jour les infos de devise lorsque la devise change via le contexte
  useEffect(() => {
    if (contextCurrency !== preferences.defaultCurrency) {
      setCurrencyInfo(DEFAULT_CURRENCY_INFO[contextCurrency]);
      setPreferences(prev => ({
        ...prev,
        defaultCurrency: contextCurrency,
        showDecimals: contextCurrency === 'USD'
      }));
    }
  }, [contextCurrency, preferences.defaultCurrency]);

  // Utiliser les taux de change dynamiques lorsqu'ils sont disponibles
  const convert = useCallback((amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
    // Si les mêmes devises, pas de conversion nécessaire
    if (from === to) return amount;
    
    try {
      // Essayer d'utiliser les taux dynamiques
      const rate = getRate(from, to);
      return amount * rate;
    } catch (error) {
      // Fallback sur la conversion statique si erreur
      console.warn('Erreur lors de la conversion avec taux dynamiques, utilisation des taux statiques', error);
      return convertCurrency(amount, from, to);
    }
  }, [getRate]);

  // Fonction pour formater un montant selon la devise actuelle
  const format = useCallback((amount: number): string => {
    return formatCurrency(amount, contextCurrency);
  }, [contextCurrency]);

  // Fonction pour formater un montant dans une devise spécifique
  const formatInCurrency = useCallback((amount: number, currencyCode: SupportedCurrency): string => {
    return formatCurrency(amount, currencyCode);
  }, []);

  // Fonction qui renvoie toutes les devises supportées formatées
  const formatAllCurrencies = useCallback((amount: number): Record<SupportedCurrency, string> => {
    const usdAmount = contextCurrency === 'USD' ? amount : convert(amount, contextCurrency, 'USD');
    
    return {
      USD: formatCurrency(usdAmount, 'USD'),
      CDF: formatCurrency(convert(usdAmount, 'USD', 'CDF'), 'CDF'),
      FCFA: formatCurrency(convert(usdAmount, 'USD', 'FCFA'), 'FCFA')
    };
  }, [contextCurrency, convert]);
  
  // Mettre à jour les préférences d'affichage des devises
  const updatePreferences = useCallback((prefs: Partial<CurrencyPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...prefs,
      // Si la devise est changée manuellement, marquer comme paramètre défini par l'utilisateur
      currencySetManually: prefs.defaultCurrency ? true : prev.currencySetManually
    }));
    
    // Si la devise par défaut change, mettre à jour la devise actuelle
    if (prefs.defaultCurrency && prefs.defaultCurrency !== contextCurrency) {
      setCurrency(prefs.defaultCurrency);
    }
  }, [contextCurrency, setCurrency]);
  
  // Fonction pour formater un prix avec plusieurs devises (affiche la devise principale et une secondaire en plus petit)
  const formatMultiCurrencyPrice = useCallback((price: MultiCurrencyPrice): string => {
    let mainAmount: number;
    
    // Essayer d'obtenir le montant dans la devise actuelle directement
    const currencyLower = contextCurrency.toLowerCase() as keyof MultiCurrencyPrice;
    if (price[currencyLower] !== undefined) {
      mainAmount = price[currencyLower] as number;
    } else {
      // Sinon convertir depuis USD
      mainAmount = convert(price.usd as number, 'USD', contextCurrency);
    }
    
    const mainFormatted = formatCurrency(mainAmount, contextCurrency);
    
    // Déterminer la devise secondaire (USD si la devise actuelle n'est pas USD, sinon CDF)
    const secondaryCurrency: SupportedCurrency = contextCurrency !== 'USD' ? 'USD' : 'CDF';
    
    let secondaryAmount: number;
    const secondaryCurrencyLower = secondaryCurrency.toLowerCase() as keyof MultiCurrencyPrice;
    if (price[secondaryCurrencyLower] !== undefined) {
      secondaryAmount = price[secondaryCurrencyLower] as number;
    } else {
      // Sinon convertir depuis USD
      secondaryAmount = convert(price.usd as number, 'USD', secondaryCurrency);
    }
    
    const secondaryFormatted = formatCurrency(secondaryAmount, secondaryCurrency);
    
    return `${mainFormatted} (${secondaryFormatted})`;
  }, [contextCurrency, convert]);

  // Récupère le symbole de devise pour une devise donnée
  const getCurrencySymbol = useCallback((currency: SupportedCurrency): string => {
    const info = DEFAULT_CURRENCY_INFO[currency];
    return info ? info.symbol : currency;
  }, []);

  // Liste des devises supportées
  const supportedCurrencies = useMemo(() => 
    Object.keys(DEFAULT_CURRENCY_INFO) as SupportedCurrency[],
  []);

  return {
    currency: contextCurrency,
    activeCurrency: contextCurrency,
    setCurrency,
    format,
    formatInCurrency,
    convert,
    formatAllCurrencies,
    currencyInfo,
    supportedCurrencies,
    preferences,
    updatePreferences,
    formatMultiCurrencyPrice,
    loading,
    lastUpdated,
    refreshRates,
    formatCurrency, // Add the imported formatCurrency function
    getCurrencySymbol // Add the getCurrencySymbol function
  };
}
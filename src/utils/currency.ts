import { 
  SupportedCurrency, 
  DEFAULT_CURRENCY_INFO, 
  DEFAULT_EXCHANGE_RATES,
  CurrencyInfo,
  ExchangeRateConfig
} from '../types/currency';
import { SUPPORTED_CURRENCIES } from '../constants/currencyConstants'; // Added import

// Re-export types that other files might import from here
export type { SupportedCurrency, CurrencyInfo, ExchangeRateConfig };
export { DEFAULT_CURRENCY_INFO, DEFAULT_EXCHANGE_RATES };

// Variable qui pourra être mise à jour avec des taux dynamiques
let CURRENT_EXCHANGE_RATES: ExchangeRateConfig = {
  baseCurrency: 'USD', // Keep USD as the base for calculations
  rates: {
    USD: 1,
    CDF: 1, // Default to 1, user can update
    FCFA: 1, // Default to 1, user can update
  },
  lastUpdated: new Date(0).toISOString(), // Initialize with a very old date
};

// Événement personnalisé pour notifier les changements de taux
export const EXCHANGE_RATES_UPDATED_EVENT = 'exchangeRatesUpdated';

/**
 * Met à jour les taux de change utilisés par l'application
 * @param rates Nouvelles valeurs des taux de change
 * @param timestamp Date de mise à jour (ISO string)
 */
export function updateExchangeRates(newRates: Partial<Record<SupportedCurrency, number>>, timestamp: string): void {
  // Valider les données avant de mettre à jour
  if (!newRates || typeof newRates !== 'object') {
    console.error('updateExchangeRates: Invalid rates object', newRates);
    return;
  }

  // Ensure base currency (USD) is always 1 and not changed by user input for other rates
  const validatedRates = { 
    ...CURRENT_EXCHANGE_RATES.rates, // Keep existing rates not being updated
    ...newRates, 
    [CURRENT_EXCHANGE_RATES.baseCurrency]: 1 
  };

  CURRENT_EXCHANGE_RATES = {
    ...CURRENT_EXCHANGE_RATES, // Keep baseCurrency and potentially other properties
    rates: validatedRates,
    lastUpdated: timestamp
  };

  // Émettre un événement pour informer les composants intéressés
  try {
    const event = new CustomEvent(EXCHANGE_RATES_UPDATED_EVENT, {
      detail: { rates: { ...validatedRates }, timestamp }
    });
    window.dispatchEvent(event);
  } catch (error) {
    console.error('Error dispatching exchange rates update event', error);
  }

  // Enregistrer dans le localStorage pour persistance
  try {
    localStorage.setItem('exchange_rates', JSON.stringify(CURRENT_EXCHANGE_RATES));
  } catch (error) {
    console.error('Error saving exchange rates to localStorage', error);
  }
}

/**
 * Récupère les taux de change actuels
 * @returns Configuration des taux de change
 */
export function getCurrentExchangeRates(): ExchangeRateConfig {
  // Tentative de récupération depuis le localStorage au premier appel
  // Check if it's the initial default state or if localStorage might be more up-to-date
  if (CURRENT_EXCHANGE_RATES.lastUpdated === new Date(0).toISOString()) { 
    try {
      const savedRatesString = localStorage.getItem('exchange_rates');
      if (savedRatesString) {
        const parsed = JSON.parse(savedRatesString) as ExchangeRateConfig;
        // Vérifier que les données sont valides
        if (
          parsed &&
          parsed.rates &&
          parsed.baseCurrency && 
          SUPPORTED_CURRENCIES.includes(parsed.baseCurrency as SupportedCurrency) && // Cast to SupportedCurrency
          parsed.lastUpdated &&
          typeof parsed.lastUpdated === 'string' &&
          Object.keys(parsed.rates).length > 0 && 
          SUPPORTED_CURRENCIES.every((sc: SupportedCurrency) => typeof parsed.rates[sc] === 'number') // Added type for sc
        ) {
          // Ensure the base currency rate is 1 after loading from storage
          parsed.rates[parsed.baseCurrency as SupportedCurrency] = 1; // Cast to SupportedCurrency
          CURRENT_EXCHANGE_RATES = parsed;
        } else {
          // If data in localStorage is invalid or incomplete, save the current (default or initialized) state back
          console.warn('Invalid or incomplete exchange rates in localStorage, re-initializing.');
          localStorage.setItem('exchange_rates', JSON.stringify(CURRENT_EXCHANGE_RATES));
        }
      } else {
        // If no rates in localStorage, save the current (default or initialized) state
        localStorage.setItem('exchange_rates', JSON.stringify(CURRENT_EXCHANGE_RATES));
      }
    } catch (error) {
      console.error('Error loading/initializing exchange rates from localStorage', error);
      // In case of error, ensure localStorage is set with current defaults
      localStorage.setItem('exchange_rates', JSON.stringify(CURRENT_EXCHANGE_RATES));
    }
  }
  
  return CURRENT_EXCHANGE_RATES;
}

/**
 * Formate un montant dans la devise spécifiée
 * @param amount Montant à formater
 * @param currency Devise cible (USD par défaut)
 * @param options Options de formatage supplémentaires
 * @returns Chaîne de caractères formatée avec symbole de devise
 */
export function formatCurrency(
  amount: number, 
  currency: SupportedCurrency = 'CDF', // Default to CDF for display
  options?: Intl.NumberFormatOptions
): string {
  // Validation de l'entrée
  if (amount === undefined || amount === null || isNaN(amount)) {
    console.warn('formatCurrency: Invalid amount provided', { amount });
    amount = 0;
  }

  const currencyInfo = DEFAULT_CURRENCY_INFO[currency];
  if (!currencyInfo) {
    console.error(`formatCurrency: Unsupported currency ${currency}`);
    return `${amount} ${currency}`;
  }
  
  try {
    // Détection de la langue du navigateur pour un formatage adapté à la locale
    const userLocale = navigator.language || currencyInfo.localeCode;
    
    return new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: currency === 'FCFA' ? 'XAF' : currency, // XAF est le code ISO pour le FCFA
      minimumFractionDigits: currencyInfo.decimalPlaces,
      maximumFractionDigits: currencyInfo.decimalPlaces,
      ...options
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currencyInfo.symbol}${amount.toFixed(currencyInfo.decimalPlaces)}`;
  }
}

/**
 * Fonction utilitaire pour convertir entre devises
 * @param amount Montant à convertir
 * @param from Devise source
 * @param to Devise cible
 * @returns Montant converti
 */
export function convertCurrency(amount: number, from: SupportedCurrency, to: SupportedCurrency): number {
  // Validation de l'entrée
  if (amount === undefined || amount === null || isNaN(amount)) {
    console.warn('convertCurrency: Invalid amount provided', { amount });
    return 0;
  }
  if (!from || !to || !SUPPORTED_CURRENCIES.includes(from) || !SUPPORTED_CURRENCIES.includes(to)){
    console.warn('convertCurrency: Invalid or unsupported currency provided', { from, to });
    return amount; // Return original amount if currencies are invalid
  }

  const currentRatesConfig = getCurrentExchangeRates(); // Get the whole config
  const rates = currentRatesConfig.rates;
  const base = currentRatesConfig.baseCurrency;

  // Ensure rates are available
  if (!rates[from] || !rates[to] || !rates[base]) {
    console.error('Exchange rates not available for conversion', { from, to, base, rates });
    // Attempt to return a sensible value or throw error, here returning original amount
    return amount; 
  }

  // Convert 'from' currency to base currency
  const amountInBase = from === base ? amount : amount / rates[from];
  
  // Convert from base currency to 'to' currency
  const convertedAmount = to === base ? amountInBase : amountInBase * rates[to];
  
  return convertedAmount;
}

/**
 * Liste des devises supportées avec leurs symboles
 */
export const CURRENCIES: Record<SupportedCurrency, string> = Object.entries(DEFAULT_CURRENCY_INFO)
  .reduce((acc, [code, info]) => ({ 
    ...acc, 
    [code]: info.symbol 
  }), {} as Record<SupportedCurrency, string>);

/**
 * Formate un prix dans toutes les devises supportées
 * @param amount Montant en USD
 * @returns Objet contenant les montants formatés dans toutes les devises
 */
export function formatAllCurrencies(amount: number): Record<SupportedCurrency, string> {
  if (amount === undefined || amount === null || isNaN(amount)) {
    console.warn('formatAllCurrencies: Invalid amount provided', { amount });
    amount = 0;
  }
  
  const result: Partial<Record<SupportedCurrency, string>> = {};
  
  // Formater pour chaque devise supportée
  Object.keys(DEFAULT_CURRENCY_INFO).forEach((code) => {
    const currency = code as SupportedCurrency;
    const convertedAmount = currency === 'USD' ? amount : convertCurrency(amount, 'USD', currency);
    result[currency] = formatCurrency(convertedAmount, currency);
  });
  
  return result as Record<SupportedCurrency, string>;
}

/**
 * Récupère le symbole de devise pour une devise donnée
 * @param currency Code de la devise
 * @returns Symbole de la devise
 */
export function getCurrencySymbol(currency: SupportedCurrency): string {
  const currencyInfo = DEFAULT_CURRENCY_INFO[currency];
  if (!currencyInfo) {
    console.warn(`getCurrencySymbol: Unsupported currency ${currency}`);
    return currency;
  }
  return currencyInfo.symbol;
}

/**
 * Détermine la devise locale en fonction de la langue du navigateur
 * @returns Code de la devise locale
 */
export function getLocaleCurrency(): SupportedCurrency {
  try {
    const language = navigator.language;
    
    // Mapping simple des langues vers les devises locales
    if (language.startsWith('fr-CD')) return 'CDF';
    if (language.startsWith('fr')) return 'FCFA';
    
    // Par défaut, USD
    return 'USD';
  } catch (error) {
    console.error('Error determining locale currency', error);
    return 'USD';
  }
}

/**
 * Initialise les taux de change depuis une API externe
 * Dans une application réelle, cette fonction ferait un appel API
 */
export async function initializeExchangeRates(): Promise<void> {
  try {
    // Simule un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dans une application réelle, vous feriez un appel API ici
    // const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=CDF,XAF');
    // const data = await response.json();
    
    // Simuler des données
    const now = new Date();
    const rates: Record<SupportedCurrency, number> = {
      USD: 1,
      CDF: DEFAULT_EXCHANGE_RATES.rates.CDF * (1 + (Math.random() * 0.05 - 0.025)),
      FCFA: DEFAULT_EXCHANGE_RATES.rates.FCFA * (1 + (Math.random() * 0.05 - 0.025))
    };
    
    // Mettre à jour les taux
    updateExchangeRates(rates, now.toISOString());
    
    return Promise.resolve();
  } catch (error) {
    console.error('Failed to initialize exchange rates', error);
    return Promise.reject(error);
  }
}
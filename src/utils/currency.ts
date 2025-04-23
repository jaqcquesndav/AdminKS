import { 
  SupportedCurrency, 
  DEFAULT_CURRENCY_INFO, 
  DEFAULT_EXCHANGE_RATES,
  CurrencyInfo,
  ExchangeRateConfig
} from '../types/currency';

// Re-export types that other files might import from here
export type { SupportedCurrency, CurrencyInfo, ExchangeRateConfig };
export { DEFAULT_CURRENCY_INFO, DEFAULT_EXCHANGE_RATES };

// Variable qui pourra être mise à jour avec des taux dynamiques
let CURRENT_EXCHANGE_RATES: ExchangeRateConfig = DEFAULT_EXCHANGE_RATES;

// Événement personnalisé pour notifier les changements de taux
export const EXCHANGE_RATES_UPDATED_EVENT = 'exchangeRatesUpdated';

/**
 * Met à jour les taux de change utilisés par l'application
 * @param rates Nouvelles valeurs des taux de change
 * @param timestamp Date de mise à jour (ISO string)
 */
export function updateExchangeRates(rates: Record<SupportedCurrency, number>, timestamp: string): void {
  // Valider les données avant de mettre à jour
  if (!rates || typeof rates !== 'object') {
    console.error('updateExchangeRates: Invalid rates object', rates);
    return;
  }

  // Vérifier que toutes les devises sont présentes
  const allCurrenciesPresent = Object.keys(DEFAULT_CURRENCY_INFO).every(
    currency => rates[currency as SupportedCurrency] !== undefined
  );

  if (!allCurrenciesPresent) {
    console.warn('updateExchangeRates: Some currencies are missing in the provided rates', {
      provided: Object.keys(rates),
      expected: Object.keys(DEFAULT_CURRENCY_INFO)
    });
  }

  // Créer une copie pour éviter les modifications externes
  CURRENT_EXCHANGE_RATES = {
    baseCurrency: 'USD',
    rates: { ...rates },
    lastUpdated: timestamp
  };

  // Émettre un événement pour informer les composants intéressés
  try {
    const event = new CustomEvent(EXCHANGE_RATES_UPDATED_EVENT, {
      detail: { rates: { ...rates }, timestamp }
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
  if (CURRENT_EXCHANGE_RATES === DEFAULT_EXCHANGE_RATES) {
    try {
      const savedRates = localStorage.getItem('exchange_rates');
      if (savedRates) {
        const parsed = JSON.parse(savedRates) as ExchangeRateConfig;
        // Vérifier que les données sont valides
        if (
          parsed &&
          parsed.rates &&
          parsed.baseCurrency === 'USD' &&
          parsed.lastUpdated &&
          typeof parsed.lastUpdated === 'string'
        ) {
          CURRENT_EXCHANGE_RATES = parsed;
        }
      }
    } catch (error) {
      console.error('Error loading exchange rates from localStorage', error);
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
  currency: SupportedCurrency = 'USD',
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

  if (from === to) return amount;
  
  const rates = CURRENT_EXCHANGE_RATES.rates;
  
  // Vérifier que les devises sont supportées
  if (!rates[from] || !rates[to]) {
    console.error(`convertCurrency: Unsupported currency conversion from ${from} to ${to}`);
    return amount;
  }
  
  try {
    // Convertir d'abord en USD si nécessaire
    let amountInUSD = amount;
    if (from !== 'USD') {
      amountInUSD = amount / rates[from];
    }
    
    // Puis convertir en devise cible
    if (to === 'USD') {
      return amountInUSD;
    }
    
    return amountInUSD * rates[to];
  } catch (error) {
    console.error('Error converting currency:', error);
    return amount;
  }
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
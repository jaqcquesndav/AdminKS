// Types pour la gestion des devises dans Wanzo

/**
 * Types de devises supportées dans l'application
 */
export type SupportedCurrency = 'USD' | 'CDF' | 'FCFA';

/**
 * Structure pour les taux de change entre devises
 */
export interface ExchangeRate {
  from: SupportedCurrency;
  to: SupportedCurrency;
  rate: number;
  date: string;
}

/**
 * Informations sur les devises supportées
 */
export interface CurrencyInfo {
  code: SupportedCurrency;
  name: string;
  symbol: string;
  flag: string;
  decimalPlaces: number;
  localeCode: string;
}

/**
 * Configuration des taux de change par défaut
 */
export interface ExchangeRateConfig {
  baseCurrency: SupportedCurrency;
  rates: Record<SupportedCurrency, number>;
  lastUpdated: string;
}

/**
 * Prix dans différentes devises
 */
export interface MultiCurrencyPrice {
  usd: number;
  cdf: number;
  fcfa: number;
}

/**
 * Montant avec devise associée
 */
export interface CurrencyAmount {
  amount: number;
  currency: SupportedCurrency;
}

/**
 * Préférences de devise d'un utilisateur
 */
export interface CurrencyPreferences {
  defaultCurrency: SupportedCurrency;
  format: 'symbol_first' | 'symbol_last' | 'code';
  showDecimals: boolean;
  showAlwaysSign: boolean;
  currencySetManually: boolean;
}

/**
 * Configuration initiale des devises par défaut
 */
export const DEFAULT_CURRENCY_INFO: Record<SupportedCurrency, CurrencyInfo> = {
  USD: {
    code: 'USD',
    name: 'Dollar américain',
    symbol: '$',
    flag: '🇺🇸',
    decimalPlaces: 2,
    localeCode: 'en-US'
  },
  CDF: {
    code: 'CDF',
    name: 'Franc congolais',
    symbol: 'FC',
    flag: '🇨🇩',
    decimalPlaces: 0,
    localeCode: 'fr-CD'
  },
  FCFA: {
    code: 'FCFA',
    name: 'Franc CFA',
    symbol: 'FCFA',
    flag: '🇨🇮',
    decimalPlaces: 0,
    localeCode: 'fr-CI'
  }
};

/**
 * Taux de change par défaut
 * Note: Ces valeurs sont approximatives et devraient être mises à jour par une API en production
 */
export const DEFAULT_EXCHANGE_RATES: ExchangeRateConfig = {
  baseCurrency: 'USD',
  rates: {
    USD: 1,
    CDF: 2500,
    FCFA: 600
  },
  lastUpdated: new Date().toISOString()
};
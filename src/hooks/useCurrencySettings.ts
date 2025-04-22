import { useEffect, useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { SupportedCurrency, CURRENCIES, formatCurrency, convertCurrency } from '../utils/currency';

interface CurrencySettings {
  // Devise actuelle
  currency: SupportedCurrency;
  
  // Fonction pour changer la devise
  setCurrency: (currency: SupportedCurrency) => void;
  
  // Fonction pour formater un montant selon la devise actuelle
  format: (amount: number) => string;
  
  // Fonction pour formater un montant dans une devise spécifique
  formatInCurrency: (amount: number, currency: SupportedCurrency) => string;
  
  // Fonction pour convertir un montant d'une devise à une autre
  convert: (amount: number, from: SupportedCurrency, to: SupportedCurrency) => number;
  
  // Fonction qui renvoie toutes les devises supportées formatées
  formatAllCurrencies: (amount: number) => {
    usd: string;
    cdf: string;
    fcfa: string;
  };
  
  // Symbole de la devise actuelle
  currencySymbol: string;
  
  // Liste des devises supportées
  supportedCurrencies: SupportedCurrency[];
}

/**
 * Hook personnalisé pour gérer les paramètres d'affichage des devises
 * Fournit des fonctions utilitaires pour formater et convertir les montants
 */
export function useCurrencySettings(): CurrencySettings {
  const { currency, setCurrency } = useCurrency();
  const [currencySymbol, setCurrencySymbol] = useState<string>(CURRENCIES[currency]);

  // Mettre à jour le symbole de devise lorsque la devise change
  useEffect(() => {
    setCurrencySymbol(CURRENCIES[currency]);
  }, [currency]);

  // Fonction pour formater un montant selon la devise actuelle
  const format = (amount: number): string => {
    return formatCurrency(amount, currency);
  };

  // Fonction pour formater un montant dans une devise spécifique
  const formatInCurrency = (amount: number, currencyCode: SupportedCurrency): string => {
    return formatCurrency(amount, currencyCode);
  };

  // Fonction pour convertir un montant d'une devise à une autre
  const convert = (amount: number, from: SupportedCurrency, to: SupportedCurrency): number => {
    return convertCurrency(amount, from, to);
  };

  // Fonction qui renvoie toutes les devises supportées formatées
  const formatAllCurrencies = (amount: number) => {
    return {
      usd: formatCurrency(amount, 'USD'),
      cdf: formatCurrency(amount, 'CDF'),
      fcfa: formatCurrency(amount, 'FCFA'),
    };
  };

  return {
    currency,
    setCurrency,
    format,
    formatInCurrency,
    convert,
    formatAllCurrencies,
    currencySymbol,
    supportedCurrencies: ['USD', 'CDF', 'FCFA']
  };
}
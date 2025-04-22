const EXCHANGE_RATES = {
  CDF: 2500,  // 1 USD = 2500 CDF
  FCFA: 600,  // 1 USD = ~600 FCFA (approximatif)
};

export type SupportedCurrency = 'USD' | 'CDF' | 'FCFA';

export function formatCurrency(amount: number, currency: SupportedCurrency = 'USD'): string {
  // Si ce n'est pas USD, convertir depuis USD vers la devise spécifiée
  if (currency !== 'USD') {
    amount *= EXCHANGE_RATES[currency];
  }

  const locales = {
    USD: 'en-US',
    CDF: 'fr-CD',
    FCFA: 'fr-FR',
  };

  return new Intl.NumberFormat(locales[currency], {
    style: 'currency',
    currency: currency === 'FCFA' ? 'XAF' : currency, // XAF est le code ISO pour le FCFA
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount);
}

// Fonction utilitaire pour convertir entre devises
export function convertCurrency(amount: number, from: SupportedCurrency, to: SupportedCurrency): number {
  // Convertir d'abord en USD si nécessaire
  let amountInUSD = amount;
  if (from !== 'USD') {
    amountInUSD = amount / EXCHANGE_RATES[from];
  }
  
  // Puis convertir en devise cible
  if (to === 'USD') {
    return amountInUSD;
  }
  
  return amountInUSD * EXCHANGE_RATES[to];
}

// Liste des devises supportées avec leurs symboles
export const CURRENCIES: Record<SupportedCurrency, string> = {
  USD: '$',
  CDF: 'FC',
  FCFA: 'FCFA',
};
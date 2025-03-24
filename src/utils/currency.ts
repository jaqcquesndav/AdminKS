const EXCHANGE_RATE = 2500; // 1 USD = 2500 CDF

export function formatCurrency(amount: number, currency: 'USD' | 'CDF' = 'USD'): string {
  if (currency === 'CDF') {
    amount *= EXCHANGE_RATE;
  }

  return new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'fr-CD', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'USD' ? 2 : 0,
  }).format(amount);
}
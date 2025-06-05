export type PaymentMethod = {
  id: string;
  name: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  details: {
    lastFour?: string;
    expiryDate?: string;
    provider?: string;
    accountNumber?: string;
  };
  isDefault: boolean;
  createdAt: Date;
};

export type PaymentHistory = {
  id: string;
  amount: {
    usd: number;
    cdf: number;
  };
  method: PaymentMethod;
  status: 'pending' | 'completed' | 'failed';
  description: string;
  invoiceNumber: string;
  createdAt: Date;
  tokenConsumption?: {
    count: number;
    rate: number;
  };
};

// Taux de conversion : 1M tokens = 10 USD
export const TOKEN_RATE = 0.00001; // USD par token

// Définir l'interface pour les packages de tokens
export interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
}

export const TOKEN_PACKAGES: TokenPackage[] = [
  { id: 'starter', tokens: 100_000, price: 1 },    // 1 USD
  { id: 'basic', tokens: 500_000, price: 5 },    // 5 USD
  { id: 'standard', tokens: 1_000_000, price: 10 }, // 10 USD
  { id: 'pro', tokens: 5_000_000, price: 45 }, // 45 USD (10% de réduction)
  { id: 'enterprise', tokens: 10_000_000, price: 85 } // 85 USD (15% de réduction)
];

export const COMPANY_INFO = {
  name: 'Wanzo',
  slogan: 'Le numérique au service de l\'inclusion financière des PMEs',
  address: {
    street: 'Avenue Kabanda',
    city: 'Goma',
    province: 'Nord-Kivu',
    country: 'RD Congo',
    quartier: 'Lac Vert',
    commune: 'Goma'
  },
  registration: {
    rccm: 'CD/GOMA/RCCM/23-B-00196',
    nationalId: '19-H5300-N40995F',
    taxNumber: 'A2321658S'  },
  contact: {
    email: 'contact@wanzo.com',
    phone: '+243 999 999 999'
  }
};
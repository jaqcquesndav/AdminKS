import { SupportedCurrency } from '../utils/currency';

export interface ApplicationGroup {
  id: string;
  name: string;
  description: string;
  applications: Application[];
  monthlyPrice: {
    usd: number;
    cdf: number;
    fcfa: number;
  };
  yearlyPrice: {
    usd: number;
    cdf: number;
    fcfa: number;
  };
  tokenBonus: {
    monthly: number;
    yearly: number;
  };
}

export interface Application {
  id: string;
  name: string;
  description: string;
  features: string[];
}

// Exchange rates
const CDF_RATE = 2500; // 1 USD = 2500 CDF (approximate)
const FCFA_RATE = 600; // 1 USD = 600 FCFA (approximate)

export const ERP_GROUP: ApplicationGroup = {
  id: 'erp',
  name: 'ERP Suite',
  description: 'Suite complète de gestion d\'entreprise',
  applications: [
    {
      id: 'accounting',
      name: 'Comptabilité',
      description: 'Gestion comptable et financière',
      features: ['Grand livre', 'Journaux', 'États financiers', 'Rapports fiscaux']
    },
    {
      id: 'sales',
      name: 'Ventes',
      description: 'Gestion commerciale',
      features: ['Facturation', 'Devis', 'Gestion clients', 'Reporting commercial']
    },
    {
      id: 'inventory',
      name: 'Stocks',
      description: 'Gestion des stocks',
      features: ['Inventaire', 'Mouvements', 'Valorisation', 'Alertes']
    }
  ],
  monthlyPrice: {
    usd: 15,
    cdf: 15 * CDF_RATE,
    fcfa: 15 * FCFA_RATE
  },
  yearlyPrice: {
    usd: 150,
    cdf: 150 * CDF_RATE,
    fcfa: 150 * FCFA_RATE
  },
  tokenBonus: {
    monthly: 1000, // 1000 tokens gratuits par mois
    yearly: 15000  // 15000 tokens gratuits par an
  }
};

export const FINANCE_GROUP: ApplicationGroup = {
  id: 'finance',
  name: 'Solutions Financières',
  description: 'Suite d\'applications financières',
  applications: [
    {
      id: 'portfolio',
      name: 'Gestion de Portefeuille',
      description: 'Gestion des investissements',
      features: ['Suivi des actifs', 'Analyse de performance', 'Reporting']
    },
    {
      id: 'leasing',
      name: 'Gestion de Leasing',
      description: 'Solutions de crédit-bail',
      features: ['Contrats', 'Échéanciers', 'Facturation', 'Contentieux']
    }
  ],
  monthlyPrice: {
    usd: 20,
    cdf: 20 * CDF_RATE,
    fcfa: 20 * FCFA_RATE
  },
  yearlyPrice: {
    usd: 200,
    cdf: 200 * CDF_RATE,
    fcfa: 200 * FCFA_RATE
  },
  tokenBonus: {
    monthly: 1500, // 1500 tokens gratuits par mois
    yearly: 20000  // 20000 tokens gratuits par an
  }
};

// Types pour la gestion des abonnements et tokens dans Kiota Suit

export type SubscriptionPlan = 'basic' | 'standard' | 'premium' | 'enterprise';
export type PlanStatus = 'active' | 'expired' | 'trial' | 'canceled' | 'pending';
export type AppType = 'accounting_mobile' | 'accounting_web' | 'portfolio_management';
export type PaymentMethod = 'credit_card' | 'mobile_money' | 'manual_payment';
export type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

export interface SubscriptionPlanDefinition {
  id: string;
  name: string;
  type: SubscriptionPlan;
  price: number;
  currency: SupportedCurrency;
  interval: 'monthly' | 'yearly';
  features: string[];
  tokensIncluded: number;
  maxUsers: number;
  applicableFor: OrganizationType[];
  availableApps: AppType[];
}

export interface TokenPackage {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  currency: SupportedCurrency;
  discount?: number;
}

export interface CustomerSubscription {
  id: string;
  customerId: string;
  planId: string;
  status: PlanStatus;
  startDate: string;
  endDate: string;
  renewalDate?: string;
  autoRenew: boolean;
  paymentMethod: PaymentMethod;
  price: number;
  currency: SupportedCurrency;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
}

export interface TokenTransaction {
  id: string;
  customerId: string;
  packageId?: string;
  amount: number;
  cost: number;
  currency: SupportedCurrency;
  date: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId: string;
  receipt?: string;
}

export interface TokenUsage {
  id: string;
  customerId: string;
  userId: string;
  appType: AppType;
  tokensUsed: number;
  date: string;
  feature: string;
  prompt?: string;
  responseTokens: number;
  requestTokens: number;
  cost: number;
}

export interface TokenCostConfiguration {
  provider: string;
  modelName: string;
  inputCostPer1K: number;
  outputCostPer1K: number;
  markup: number;  // pourcentage de marge sur le coût brut
  currency: SupportedCurrency;
}

export interface PaymentTransaction {
  id: string;
  customerId: string;
  amount: number;
  currency: SupportedCurrency;
  method: PaymentMethod;
  status: PaymentStatus;
  date: string;
  description: string;
  referenceNumber?: string;
  receiptUrl?: string;
  proofDocument?: string; // URL vers un document pour les paiements manuels
  validatedBy?: string; // ID de l'admin qui a validé un paiement manuel
  validatedAt?: string;
  notes?: string;
}

export interface RevenueStatistics {
  totalRevenue: number;
  subscriptionRevenue: number;
  tokenRevenue: number;
  revenueTrend: {
    date: string;
    amount: number;
    type: 'subscription' | 'token';
  }[];
  revenueByCountry: Record<string, number>;
  revenueByPlan: Record<string, number>;
  conversionRate: number;
  churnRate: number;
  averageRevenuePerUser: number;
}

export interface TokenStatistics {
  totalTokensUsed: number;
  totalTokensSold: number;
  tokensUsedToday: number;
  tokensCostToday: number;
  revenueFromTokens: number;
  profitFromTokens: number;
  tokenUsageByApp: Record<AppType, number>;
  tokenUsageByFeature: Record<string, number>;
  tokenUsageTrend: {
    date: string;
    used: number;
    cost: number;
    revenue: number;
  }[];
}

// Type pour représenter l'interface OrganizationType importée d'user.ts
import { OrganizationType } from './user';
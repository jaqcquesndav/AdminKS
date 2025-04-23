import { CustomerType } from './customer';

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
export type PlanStatus = 'active' | 'expired' | 'cancelled' | 'pending' | 'payment_failed';
export type PlanFeature = 'basic_support' | 'premium_support' | 'custom_domain' | 'api_access' | 'advanced_analytics' | 'white_label' | 'dedicated_account_manager' | 'custom_integration';
export type PlanCategory = 'base' | 'standard' | 'premium' | 'enterprise' | 'custom';
export type CustomerCategory = 'starter' | 'growth' | 'scale' | 'enterprise';
export type PlanBillingCycle = 'monthly' | 'quarterly' | 'yearly';
export type AppType = 'accounting_mobile' | 'accounting_web' | 'portfolio_management';
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'mobile_money' | 'cash' | 'check';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled' | 'pending_validation';
export type TokenTransactionType = 'purchase' | 'consumption' | 'refund' | 'expiration' | 'bonus';

// Interface pour les métadonnées client pour les prix différents par segment
export interface CustomerTypeSpecificMetadata {
  customerType: CustomerType;
  pricingMultiplier?: number;
  minimumTokenPurchase?: number;
  paymentTerms?: string;
  discountPercentage?: number;
}

// Interface pour la définition d'un plan d'abonnement
export interface SubscriptionPlanDefinition {
  id: string;
  name: string;
  description: string;
  category: PlanCategory;
  features: PlanFeature[];
  targetCustomerTypes: CustomerType[];
  basePriceUSD: number;
  basePriceLocal?: number;
  localCurrency?: string;
  tokenAllocation: number;
  billingCycles: PlanBillingCycle[];
  discountPercentage: {
    quarterly: number;
    yearly: number;
  };
  customerTypeSpecific: CustomerTypeSpecificMetadata[];
  trialDays?: number;
  isCustomizablePlan: boolean;
  isHidden?: boolean;
  isPromoted?: boolean;
  maxUsers?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Interface pour un abonnement client
export interface CustomerSubscription {
  id: string;
  customerId: string;
  customerName?: string;
  customerType?: CustomerType;
  planId: string;
  planName?: string;
  planCategory: PlanCategory;
  startDate: string;
  endDate: string;
  tokenAllocation: number;
  tokensRemaining: number;
  priceUSD: number;
  priceLocal?: number;
  localCurrency?: string;
  status: PlanStatus;
  paymentMethod: PaymentMethod;
  billingCycle: PlanBillingCycle;
  autoRenew: boolean;
  createdAt: string;
  updatedAt?: string;
  lastPaymentDate?: string;
  nextPaymentDate?: string;
  cancelledAt?: string;
  cancelReason?: string;
  features?: PlanFeature[];
  customFeatures?: string[];
  paymentStatus: PaymentStatus;
  paymentTransactions?: PaymentTransaction[];
  metaData?: {
    accountManager?: string;
    specialConditions?: string;
    notes?: string;
    tags?: string[];
  };
}

// Interface pour une transaction de paiement
export interface PaymentTransaction {
  id: string;
  subscriptionId?: string;
  customerId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionDate: string;
  transactionReference?: string;
  gatewayReference?: string;
  gatewayResponse?: Record<string, unknown>;
  description?: string;
  metadata?: {
    receiptUrl?: string;
    validatedBy?: string;
    validatedAt?: string;
    notes?: string;
  };
}

// Interface pour un package de tokens
export interface TokenPackage {
  id: string;
  name: string;
  description?: string;
  tokenAmount: number;
  priceUSD: number;
  priceLocal?: number;
  localCurrency?: string;
  isPopular?: boolean;
  validityDays: number;
  targetCustomerTypes: CustomerType[];
  customerTypeSpecific: CustomerTypeSpecificMetadata[];
  minimumPurchase?: number;
  discountPercentages?: {
    tier1: {
      minAmount: number;
      percentage: number;
    };
    tier2: {
      minAmount: number;
      percentage: number;
    };
    tier3: {
      minAmount: number;
      percentage: number;
    };
  };
}

// Interface pour une transaction de token
export interface TokenTransaction {
  id: string;
  customerId: string;
  subscriptionId?: string;
  packageId?: string;
  type: TokenTransactionType;
  amount: number;
  balance: number;
  description?: string;
  timestamp: string;
  expiryDate?: string;
  metadata?: {
    operation?: string;
    apiEndpoint?: string;
    sessionId?: string;
    paymentId?: string;
  };
}

// Interface pour une utilisation de token
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

// Interface pour les statistiques de revenus
export interface RevenueStatistics {
  totalRevenue: {
    usd: number;
    local?: number;
    localCurrency?: string;
  };
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    currency: string;
  }>;
  averageRevenuePerCustomer: number;
  revenueByCustomerType: {
    pme: number;
    financial: number;
  };
  revenueByPlan: Record<PlanCategory, number>;
  revenueByPaymentMethod: Record<PaymentMethod, number>;
  recurringRevenue: number;
  oneTimeRevenue: number;
  tokenRevenue: number;
  revenueTrend: Array<{
    date: string;
    amount: number;
    type: 'subscription' | 'token';
  }>;
}

// Interface pour les statistiques de tokens
export interface TokenStatistics {
  totalTokensAllocated: number;
  totalTokensUsed: number;
  totalTokensPurchased: number;
  tokenUsageByPeriod: Array<{
    period: string;
    tokensUsed: number;
  }>;
  tokenUsageByCustomerType: {
    pme: number;
    financial: number;
  };
  averageTokensPerCustomer: number;
  top10TokenConsumers: Array<{
    customerId: string;
    customerName: string;
    tokensConsumed: number;
  }>;
  tokenUsageTrend: Array<{
    date: string;
    used: number;
    cost: number;
    revenue: number;
  }>;
}

// Interface pour le tableau de bord financier
export interface FinancialDashboardData {
  revenue: RevenueStatistics;
  tokenStats: TokenStatistics;
  subscriptionSummary: {
    totalActive: number;
    totalExpiring30Days: number;
    totalExpired: number;
    totalCancelled: number;
    renewalRate: number;
    churnRate: number;
  };
  predictions: {
    nextMonthRevenue: number;
    nextMonthGrowthRate: number;
    customerLifetimeValue: number;
  };
}
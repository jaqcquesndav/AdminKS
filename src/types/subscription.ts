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
/** @deprecated Exchange rates are now managed dynamically via CurrencyContext and useCurrencySettings. */
// const CDF_RATE = 2500; // 1 USD = 2500 CDF (approximate)
/** @deprecated Exchange rates are now managed dynamically via CurrencyContext and useCurrencySettings. */
// const FCFA_RATE = 600; // 1 USD = 600 FCFA (approximate)

/** 
 * @deprecated Replaced by more specific plan definitions like FINANCIAL_INSTITUTION_ERP_PLAN_MONTHLY/YEARLY. 
 * Pricing and token bonuses are now part of SubscriptionPlanDefinition. 
 * Exchange rates are handled by CurrencyContext.
 */
export const ERP_GROUP: ApplicationGroup = {
  id: 'erp',
  name: 'ERP Suite',
  description: "Suite complète de gestion d'entreprise", 
  applications: [
    {
      id: 'accounting',
      name: 'Comptabilité',
      description: "Gestion comptable et financière", // Corrected string literal
      features: ['Grand livre', 'Journaux', 'États financiers', 'Rapports fiscaux']
    },
    {
      id: 'sales',
      name: 'Ventes',
      description: "Gestion commerciale", // Corrected string literal
      features: ['Facturation', 'Devis', 'Gestion clients', 'Reporting commercial']
    },
    {
      id: 'inventory',
      name: 'Stocks',
      description: "Gestion des stocks", // Corrected string literal
      features: ['Inventaire', 'Mouvements', 'Valorisation', 'Alertes']
    }
  ],
  monthlyPrice: {
    usd: 15,
    cdf: 15 * 2500, // Kept for historical reference, direct value used
    fcfa: 15 * 600  // Kept for historical reference, direct value used
  },
  yearlyPrice: {
    usd: 150,
    cdf: 150 * 2500, // Kept for historical reference, direct value used
    fcfa: 150 * 600   // Kept for historical reference, direct value used
  },
  tokenBonus: {
    monthly: 1000, 
    yearly: 15000  
  }
};

/** 
 * @deprecated Replaced by more specific plan definitions like FINANCIAL_INSTITUTION_FINANCE_PLAN_MONTHLY/YEARLY. 
 * Pricing and token bonuses are now part of SubscriptionPlanDefinition. 
 * Exchange rates are handled by CurrencyContext.
 */
export const FINANCE_GROUP: ApplicationGroup = {
  id: 'finance',
  name: 'Solutions Financières',
  description: "Suite d'applications financières", 
  applications: [
    {
      id: 'portfolio',
      name: 'Gestion de Portefeuille',
      description: "Gestion des investissements", // Corrected string literal
      features: ['Suivi des actifs', 'Analyse de performance', 'Reporting']
    },
    {
      id: 'leasing',
      name: 'Gestion de Leasing',
      description: "Solutions de crédit-bail", // Corrected string literal
      features: ['Contrats', 'Échéanciers', 'Facturation', 'Contentieux']
    }
  ],
  monthlyPrice: {
    usd: 20,
    cdf: 20 * 2500, // Kept for historical reference, direct value used
    fcfa: 20 * 600  // Kept for historical reference, direct value used
  },
  yearlyPrice: {
    usd: 200,
    cdf: 200 * 2500, // Kept for historical reference, direct value used
    fcfa: 200 * 600   // Kept for historical reference, direct value used
  },
  tokenBonus: {
    monthly: 1500, 
    yearly: 20000  
  }
};

// Types pour la gestion des abonnements et tokens dans Kiota Suit

export type SubscriptionPlanId = 
  | 'pme_freemium' 
  | 'pme_starter' 
  | 'pme_premium' 
  | 'fi_erp_monthly'       // New ID for Financial Institution ERP Monthly Plan
  | 'fi_erp_yearly'        // New ID for Financial Institution ERP Yearly Plan
  | 'fi_finance_monthly'   // New ID for Financial Institution Finance Monthly Plan
  | 'fi_finance_yearly'    // New ID for Financial Institution Finance Yearly Plan
  | 'custom'; // For any custom plans not fitting predefined structures

// It's often better to use the specific plan IDs (like 'pme_freemium') directly
// rather than a generic 'basic', 'standard' type if plans have distinct properties.
// However, if a general categorization is still needed:
export type LegacySubscriptionPlanTier = 'basic' | 'standard' | 'premium' | 'enterprise';


export type PlanStatus = 'active' | 'expired' | 'cancelled' | 'pending' | 'payment_failed';
export type PlanFeature = 
  | 'basic_support' 
  | 'premium_support' 
  | 'custom_domain' 
  | 'api_access' 
  | 'advanced_analytics' 
  | 'white_label' 
  | 'dedicated_account_manager' 
  | 'custom_integration'
  | 'max_users_1'
  | 'max_users_5'
  | 'max_users_10'
  | 'max_users_enterprise' // For enterprise/FI plans
  | 'tokens_500k'
  | 'tokens_1m'
  | 'tokens_4m'
  | 'app_accounting'       // Feature for Accounting App
  | 'app_sales'            // Feature for Sales App
  | 'app_inventory'        // Feature for Inventory App
  | 'app_portfolio'        // Feature for Portfolio Management App
  | 'app_leasing';         // Feature for Leasing Management App

export type PlanCategory = 'freemium' | 'starter' | 'premium' | 'enterprise' | 'custom' | 'base'; // Updated PlanCategory
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

// New PME Plan Definitions
export const PME_FREEMIUM_PLAN: SubscriptionPlanDefinition = {
  id: 'pme_freemium',
  name: 'PME Freemium',
  description: 'Ideal for small PMEs starting out. Get essential tools and 100K Adha AI tokens per month.', // Corrected token amount
  category: 'freemium',
  targetCustomerTypes: ['pme'],
  basePriceUSD: 0,
  tokenAllocation: 100000, // Corrected token amount
  maxUsers: 1,
  billingCycles: ['monthly'],
  discountPercentage: { quarterly: 0, yearly: 0 },
  customerTypeSpecific: [],
  isCustomizablePlan: false,
  isHidden: false,
  isPromoted: false,
  features: ['basic_support', 'api_access', 'max_users_1', 'tokens_500k'],
  trialDays: 0,
};

export const PME_STARTER_PLAN: SubscriptionPlanDefinition = {
  id: 'pme_starter',
  name: 'PME Starter',
  description: 'Perfect for growing PMEs. Includes 5 users and 1 Million Adha AI tokens per month.',
  category: 'starter',
  targetCustomerTypes: ['pme'],
  basePriceUSD: 10,
  tokenAllocation: 1000000,
  maxUsers: 5,
  billingCycles: ['monthly'],
  discountPercentage: { quarterly: 0, yearly: 0 },
  customerTypeSpecific: [],
  isCustomizablePlan: false,
  isHidden: false,
  isPromoted: true, // Example: promote this plan
  features: ['basic_support', 'api_access', 'max_users_5', 'tokens_1m'],
  trialDays: 0,
};

export const PME_PREMIUM_PLAN: SubscriptionPlanDefinition = {
  id: 'pme_premium',
  name: 'PME Premium',
  description: 'Comprehensive solution for established PMEs. Offers 10 users and 4 Million Adha AI tokens per month.',
  category: 'premium',
  targetCustomerTypes: ['pme'],
  basePriceUSD: 30,
  tokenAllocation: 4000000,
  maxUsers: 10,
  billingCycles: ['monthly'],
  discountPercentage: { quarterly: 0, yearly: 0 },
  customerTypeSpecific: [],
  isCustomizablePlan: false,
  isHidden: false,
  isPromoted: false,
  features: ['premium_support', 'api_access', 'advanced_analytics', 'max_users_10', 'tokens_4m'],
  trialDays: 0,
};

// Array of all PME plan definitions for easier access
export const PME_PLANS: SubscriptionPlanDefinition[] = [
  PME_FREEMIUM_PLAN,
  PME_STARTER_PLAN,
  PME_PREMIUM_PLAN,
];

// --- Financial Institution Plan Definitions ---

export const FINANCIAL_INSTITUTION_ERP_PLAN_MONTHLY: SubscriptionPlanDefinition = {
  id: 'fi_erp_monthly',
  name: 'FI - ERP Suite (Monthly)',
  description: 'Comprehensive ERP suite for financial institutions, billed monthly.',
  category: 'enterprise',
  targetCustomerTypes: ['financial'],
  basePriceUSD: 15, // Hardcoded from ERP_GROUP.monthlyPrice.usd
  tokenAllocation: 1000, // Hardcoded from ERP_GROUP.tokenBonus.monthly
  maxUsers: 50, 
  billingCycles: ['monthly'],
  discountPercentage: { quarterly: 0, yearly: 0 }, 
  customerTypeSpecific: [],
  isCustomizablePlan: true, 
  isHidden: false,
  isPromoted: false,
  features: ['premium_support', 'api_access', 'advanced_analytics', 'dedicated_account_manager', 'max_users_enterprise', 'app_accounting', 'app_sales', 'app_inventory'],
  trialDays: 0,
};

export const FINANCIAL_INSTITUTION_ERP_PLAN_YEARLY: SubscriptionPlanDefinition = {
  id: 'fi_erp_yearly',
  name: 'FI - ERP Suite (Yearly)',
  description: 'Comprehensive ERP suite for financial institutions, billed yearly with savings.',
  category: 'enterprise',
  targetCustomerTypes: ['financial'],
  basePriceUSD: 150, // Hardcoded from ERP_GROUP.yearlyPrice.usd
  tokenAllocation: 15000, // Hardcoded from ERP_GROUP.tokenBonus.yearly
  maxUsers: 50,
  billingCycles: ['yearly'],
  discountPercentage: { quarterly: 0, yearly: 0 }, 
  customerTypeSpecific: [],
  isCustomizablePlan: true,
  isHidden: false,
  isPromoted: false,
  features: ['premium_support', 'api_access', 'advanced_analytics', 'dedicated_account_manager', 'max_users_enterprise', 'app_accounting', 'app_sales', 'app_inventory'],
  trialDays: 0,
};

export const FINANCIAL_INSTITUTION_FINANCE_PLAN_MONTHLY: SubscriptionPlanDefinition = {
  id: 'fi_finance_monthly',
  name: 'FI - Financial Solutions (Monthly)',
  description: 'Specialized financial solutions for institutions, billed monthly.',
  category: 'enterprise',
  targetCustomerTypes: ['financial'],
  basePriceUSD: 20, // Hardcoded from FINANCE_GROUP.monthlyPrice.usd
  tokenAllocation: 1500, // Hardcoded from FINANCE_GROUP.tokenBonus.monthly
  maxUsers: 50,
  billingCycles: ['monthly'],
  discountPercentage: { quarterly: 0, yearly: 0 },
  customerTypeSpecific: [],
  isCustomizablePlan: true,
  isHidden: false,
  isPromoted: false,
  features: ['premium_support', 'api_access', 'advanced_analytics', 'dedicated_account_manager', 'max_users_enterprise', 'app_portfolio', 'app_leasing'],
  trialDays: 0,
};

export const FINANCIAL_INSTITUTION_FINANCE_PLAN_YEARLY: SubscriptionPlanDefinition = {
  id: 'fi_finance_yearly',
  name: 'FI - Financial Solutions (Yearly)',
  description: 'Specialized financial solutions for institutions, billed yearly with savings.',
  category: 'enterprise',
  targetCustomerTypes: ['financial'],
  basePriceUSD: 200, // Hardcoded from FINANCE_GROUP.yearlyPrice.usd
  tokenAllocation: 20000, // Hardcoded from FINANCE_GROUP.tokenBonus.yearly
  maxUsers: 50,
  billingCycles: ['yearly'],
  discountPercentage: { quarterly: 0, yearly: 0 },
  customerTypeSpecific: [],
  isCustomizablePlan: true,
  isHidden: false,
  isPromoted: false,
  features: ['premium_support', 'api_access', 'advanced_analytics', 'dedicated_account_manager', 'max_users_enterprise', 'app_portfolio', 'app_leasing'],
  trialDays: 0,
};

// Array of all Financial Institution plan definitions
export const FINANCIAL_INSTITUTION_PLANS: SubscriptionPlanDefinition[] = [
  FINANCIAL_INSTITUTION_ERP_PLAN_MONTHLY,
  FINANCIAL_INSTITUTION_ERP_PLAN_YEARLY,
  FINANCIAL_INSTITUTION_FINANCE_PLAN_MONTHLY,
  FINANCIAL_INSTITUTION_FINANCE_PLAN_YEARLY,
];

// Combine all plans for easier global access if needed
export const ALL_SUBSCRIPTION_PLANS: SubscriptionPlanDefinition[] = [
  ...PME_PLANS,
  ...FINANCIAL_INSTITUTION_PLANS,
];

// Interface for an abonnement client
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
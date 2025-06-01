import apiClient from '../api/client';
import { API_ENDPOINTS, replaceUrlParams } from '../api/config';
import type { 
  SubscriptionPlanDefinition, 
  CustomerSubscription, 
  TokenPackage, 
  TokenTransaction, 
  TokenUsage,
  PaymentTransaction,
  RevenueStatistics,
  TokenStatistics,
  PlanStatus, // Assuming this might be used by other functions in the file
} from '../../types/subscription';
import { 
  ALL_SUBSCRIPTION_PLANS,
  PME_PLANS,
  FINANCIAL_INSTITUTION_PLANS,
} from '../../types/subscription'; // Changed from import type
import type { CustomerType } from '../../types/customer'; // Import CustomerType

// A simple flag for now to enable mock behavior for plans
// In a real app, this would likely come from a global config or env variable
const USE_MOCK_PLANS = true; 

interface SubscriptionPlansResponse {
  plans: SubscriptionPlanDefinition[];
}

interface CustomerSubscriptionsResponse { // Assuming this might be used by other functions
  subscriptions: CustomerSubscription[];
  totalCount: number;
}

interface TokenPackagesResponse {
  packages: TokenPackage[];
}

interface TokenTransactionsResponse {
  transactions: TokenTransaction[];
  totalCount: number;
}

interface TokenUsageResponse {
  usages: TokenUsage[];
  totalCount: number;
  totalTokensUsed: number;
}

export const subscriptionApi = {
  // Récupérer les plans d'abonnement disponibles
  getPlans: async (customerType?: CustomerType): Promise<SubscriptionPlansResponse> => {
    if (USE_MOCK_PLANS) {
      console.log('[Mock API] Getting plans for customer type:', customerType);
      let plansToReturn: SubscriptionPlanDefinition[] = ALL_SUBSCRIPTION_PLANS;
      if (customerType === 'pme') {
        plansToReturn = PME_PLANS;
      } else if (customerType === 'financial') {
        plansToReturn = FINANCIAL_INSTITUTION_PLANS;
      }
      return Promise.resolve({ plans: plansToReturn });
    }
    // Original API call
    const response = await apiClient.get(API_ENDPOINTS.subscriptions.plans, { params: { customerType } });
    return response.data;
  },

  // Récupérer les abonnements d'un client
  getCustomerSubscriptions: async (customerId: string): Promise<CustomerSubscriptionsResponse> => {
    const response = await apiClient.get(`/customers/${customerId}/subscriptions`);
    return response.data;
  },

  // Récupérer tous les abonnements (pour l'admin)
  getAllSubscriptions: async (params?: {
    status?: PlanStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<CustomerSubscriptionsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.subscriptions.list, { params });
    return response.data;
  },

  // Créer un nouvel abonnement
  createSubscription: async (subscriptionData: {
    customerId: string;
    planId: string;
    paymentMethod: string;
    autoRenew: boolean;
  }): Promise<CustomerSubscription> => {
    const response = await apiClient.post(API_ENDPOINTS.subscriptions.create, subscriptionData);
    return response.data;
  },

  // Annuler un abonnement
  cancelSubscription: async (id: string, reason?: string): Promise<CustomerSubscription> => {
    const url = replaceUrlParams(API_ENDPOINTS.subscriptions.cancel, { id });
    const response = await apiClient.post(url, { reason });
    return response.data;
  },

  // Renouveler un abonnement
  renewSubscription: async (id: string, paymentData: {
    method: string;
    transactionReference?: string;
  }): Promise<CustomerSubscription> => {
    const url = replaceUrlParams(API_ENDPOINTS.subscriptions.renew, { id });
    const response = await apiClient.post(url, paymentData);
    return response.data;
  },
  
  // Récupérer les packages de tokens disponibles
  getTokenPackages: async (): Promise<TokenPackagesResponse> => {
    const response = await apiClient.get('/tokens/packages');
    return response.data;
  },
  
  // Acheter un package de tokens
  purchaseTokens: async (purchaseData: {
    packageId: string;
    customerId: string;
    paymentMethod: string;
    transactionReference?: string;
  }): Promise<TokenTransaction> => {
    const response = await apiClient.post('/tokens/purchase', purchaseData);
    return response.data;
  },
  
  // Récupérer l'historique des transactions de tokens
  getTokenTransactions: async (params?: {
    customerId?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<TokenTransactionsResponse> => {
    const response = await apiClient.get('/tokens/transactions', { params });
    return response.data;
  },
  
  // Récupérer l'utilisation des tokens
  getTokenUsage: async (params?: {
    customerId?: string;
    userId?: string;
    appType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }): Promise<TokenUsageResponse> => {
    const response = await apiClient.get('/tokens/usage', { params });
    return response.data;
  },
  
  // Vérifier le solde de tokens
  getTokenBalance: async (customerId: string): Promise<{ 
    available: number;
    used: number;
    allocated: number;
  }> => {
    const response = await apiClient.get(`/customers/${customerId}/tokens/balance`);
    return response.data;
  },
  
  // Récupérer les statistiques des revenus
  getRevenueStatistics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<RevenueStatistics> => {
    const response = await apiClient.get('/admin/statistics/revenue', { params: { period } });
    return response.data;
  },
  
  // Récupérer les statistiques des tokens
  getTokenStatistics: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<TokenStatistics> => {
    const response = await apiClient.get('/admin/statistics/tokens', { params: { period } });
    return response.data;
  },
  
  // Valider un paiement manuel
  validateManualPayment: async (transactionId: string, adminData: {
    validatedBy: string;
    notes?: string;
  }): Promise<PaymentTransaction> => {
    const url = replaceUrlParams(API_ENDPOINTS.finance.validateManualPayment, { transactionId });
    const response = await apiClient.post(url, adminData);
    return response.data;
  },

  // Add tokens to a customer's account (manual adjustment or bonus)
  addTokensToCustomer: async (customerId: string, data: {
    amount: number;
    reason: string; // e.g., 'manual_adjustment', 'bonus_tokens', 'compensation'
    adminUserId: string;
    notes?: string;
  }): Promise<TokenTransaction> => {
    const url = replaceUrlParams(API_ENDPOINTS.tokens.addCustomerTokens, { customerId });
    const response = await apiClient.post(url, data);
    return response.data;
  },

  // Get detailed token usage, potentially more granular than getTokenUsage
  getDetailedTokenUsage: async (params?: {
    customerId?: string;
    userId?: string;
    serviceId?: string; // e.g., specific API or application feature
    transactionId?: string; // Link to a specific token transaction (purchase, bonus)
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    includePromptDetails?: boolean; // Example of a more detailed flag
  }): Promise<TokenUsageResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.tokens.detailedUsage, { params });
    return response.data;
  }
};

export default subscriptionApi;
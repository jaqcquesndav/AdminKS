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
} from '../../types/subscription'; // Changed from import type
import type { CustomerType } from '../../types/customer'; // Import CustomerType

// A simple flag for now to enable mock behavior for plans
// In a real app, this would likely come from a global config or env variable
const USE_MOCK_PLANS = true; 

// In-memory store for mock plans if USE_MOCK_PLANS is true
let mockPlansStore: SubscriptionPlanDefinition[] = [...ALL_SUBSCRIPTION_PLANS];

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
      let plansToReturn: SubscriptionPlanDefinition[];
      if (customerType === 'pme') {
        plansToReturn = mockPlansStore.filter(p => p.targetCustomerTypes.includes('pme'));
      } else if (customerType === 'financial') {
        plansToReturn = mockPlansStore.filter(p => p.targetCustomerTypes.includes('financial'));
      } else {
        plansToReturn = mockPlansStore;
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

  // CRUD for SubscriptionPlanDefinition (Mock implementations)
  createPlan: async (planData: SubscriptionPlanDefinition): Promise<SubscriptionPlanDefinition> => {
    if (USE_MOCK_PLANS) {
      console.log('[Mock API] Creating plan:', planData);
      const newPlan = { ...planData, id: `mock-plan-${Date.now()}-${Math.random().toString(16).slice(2)}`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      mockPlansStore.push(newPlan);
      return Promise.resolve(newPlan);
    }
    const response = await apiClient.post(API_ENDPOINTS.subscriptions.plans, planData); // Assuming an endpoint for creating plans
    return response.data;
  },

  updatePlan: async (planId: string, planData: Partial<SubscriptionPlanDefinition>): Promise<SubscriptionPlanDefinition> => {
    if (USE_MOCK_PLANS) {
      console.log(`[Mock API] Updating plan ${planId}:`, planData);
      const planIndex = mockPlansStore.findIndex(p => p.id === planId);
      if (planIndex === -1) {
        return Promise.reject(new Error(`Mock Plan with ID ${planId} not found`));
      }
      mockPlansStore[planIndex] = { ...mockPlansStore[planIndex], ...planData, updatedAt: new Date().toISOString() };
      return Promise.resolve(mockPlansStore[planIndex]);
    }
    const url = `${API_ENDPOINTS.subscriptions.plans}/${planId}`; // Assuming an endpoint for updating a specific plan
    const response = await apiClient.put(url, planData);
    return response.data;
  },

  deletePlan: async (planId: string): Promise<void> => {
    if (USE_MOCK_PLANS) {
      console.log('[Mock API] Deleting plan:', planId);
      const initialLength = mockPlansStore.length;
      mockPlansStore = mockPlansStore.filter(p => p.id !== planId);
      if (mockPlansStore.length === initialLength) {
        return Promise.reject(new Error(`Mock Plan with ID ${planId} not found for deletion`));
      }
      return Promise.resolve();
    }
    const url = `${API_ENDPOINTS.subscriptions.plans}/${planId}`; // Assuming an endpoint for deleting a specific plan
    await apiClient.delete(url);
    return Promise.resolve();
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
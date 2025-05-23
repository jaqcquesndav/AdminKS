import apiClient from './client';
import { API_ENDPOINTS, replaceUrlParams } from './config';
import type { 
  SubscriptionPlanDefinition, 
  CustomerSubscription, 
  TokenPackage, 
  TokenTransaction, 
  TokenUsage,
  PaymentTransaction,
  RevenueStatistics,
  TokenStatistics,
  PlanStatus
} from '../../types/subscription';

interface SubscriptionPlansResponse {
  plans: SubscriptionPlanDefinition[];
}

interface CustomerSubscriptionsResponse {
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
  getPlans: async (): Promise<SubscriptionPlansResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.subscriptions.plans);
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
    const response = await apiClient.post(`/payments/${transactionId}/validate`, adminData);
    return response.data;
  }
};

export default subscriptionApi;
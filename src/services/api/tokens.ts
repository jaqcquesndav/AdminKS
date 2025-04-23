import apiClient from './client';
import { API_ENDPOINTS } from './config';
import { cloudinaryService } from '../cloudinary';
import type { 
  TokenPackage, 
  TokenTransaction, 
  TokenUsage,
  TokenStatistics
} from '../../types/subscription';

interface TokenBalanceResponse {
  available: number;
  allocated: number;
  used: number;
  lastUpdated: string;
}

interface TokenPurchaseResponse {
  transaction: TokenTransaction;
  newBalance: TokenBalanceResponse;
}

interface TokenUsageHistoryResponse {
  usages: TokenUsage[];
  totalCount: number;
  totalTokensUsed: number;
}

export const tokensApi = {
  // Vérifier le solde des tokens
  getBalance: async (): Promise<TokenBalanceResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.tokens.balance);
    return response.data;
  },
  
  // Acheter des tokens
  purchase: async (data: {
    packageId: string;
    paymentMethod: string;
    transactionReference?: string;
    proofDocument?: File;
  }): Promise<TokenPurchaseResponse> => {
    try {
      if (data.proofDocument) {
        // Upload proof document to Cloudinary
        const cloudinaryResponse = await cloudinaryService.upload(
          data.proofDocument,
          'payment-proofs'
        );
        
        // Send data with Cloudinary URL to the backend
        const requestData = {
          packageId: data.packageId,
          paymentMethod: data.paymentMethod,
          transactionReference: data.transactionReference,
          proofDocumentUrl: cloudinaryResponse.secure_url,
          proofDocumentPublicId: cloudinaryResponse.public_id
        };
        
        const response = await apiClient.post(API_ENDPOINTS.tokens.purchase, requestData);
        return response.data;
      } else {
        const response = await apiClient.post(API_ENDPOINTS.tokens.purchase, data);
        return response.data;
      }
    } catch (error) {
      console.error('Error during token purchase:', error);
      throw error;
    }
  },
  
  // Récupérer les packages de tokens disponibles
  getPackages: async (): Promise<{ packages: TokenPackage[] }> => {
    const response = await apiClient.get('/tokens/packages');
    return response.data;
  },
  
  // Récupérer l'historique d'utilisation des tokens
  getUsageHistory: async (params?: {
    startDate?: string;
    endDate?: string;
    appType?: string;
    feature?: string;
    page?: number;
    limit?: number;
  }): Promise<TokenUsageHistoryResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.tokens.usage, { params });
    return response.data;
  },
  
  // Récupérer l'historique des transactions de tokens
  getTransactionHistory: async (params?: {
    startDate?: string;
    endDate?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ transactions: TokenTransaction[]; totalCount: number }> => {
    const response = await apiClient.get(API_ENDPOINTS.tokens.history, { params });
    return response.data;
  },
  
  // Obtenir les statistiques d'utilisation des tokens par période
  getUsageStatsByPeriod: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<Record<string, number>> => {
    const response = await apiClient.get('/tokens/usage/stats', {
      params: { period }
    });
    return response.data;
  },
  
  // Obtenir les statistiques d'utilisation des tokens par fonctionnalité
  getUsageStatsByFeature: async (): Promise<Record<string, number>> => {
    const response = await apiClient.get('/tokens/usage/features');
    return response.data;
  },
  
  // Obtenir les statistiques d'utilisation des tokens par application
  getUsageStatsByApp: async (): Promise<Record<string, number>> => {
    const response = await apiClient.get('/tokens/usage/apps');
    return response.data;
  },
  
  // Obtenir toutes les statistiques des tokens (pour l'admin seulement)
  getAllStats: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<TokenStatistics> => {
    const response = await apiClient.get('/admin/tokens/statistics', {
      params: { period }
    });
    return response.data;
  },
  
  // Allouer des tokens à un client (pour l'admin seulement)
  allocateTokensToCustomer: async (data: {
    customerId: string;
    amount: number;
    reason: string;
  }): Promise<{ success: boolean; newBalance: TokenBalanceResponse }> => {
    const response = await apiClient.post('/admin/tokens/allocate', data);
    return response.data;
  }
};

export default tokensApi;
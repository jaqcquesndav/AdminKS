import api from './client';
import type { TokenUsage } from '../../types/user';

export const tokensApi = {
  getBalance: async () => {
    const response = await api.get('/tokens/balance');
    return response.data;
  },

  purchase: async (data: { amount: number; paymentMethodId: string }) => {
    const response = await api.post('/tokens/purchase', data);
    return response.data;
  },

  getUsage: async (params?: { startDate?: Date; endDate?: Date }): Promise<TokenUsage[]> => {
    const response = await api.get('/tokens/usage', { params });
    return response.data;
  },

  getHistory: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get('/tokens/history', { params });
    return response.data;
  }
};
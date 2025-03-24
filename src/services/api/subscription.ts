import api from './index';
import type { ApplicationGroup } from '../../types/subscription';
import type { PaymentMethod, PaymentHistory } from '../../types/payment';

export const subscriptionApi = {
  getPlans: async (): Promise<ApplicationGroup[]> => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  subscribe: async (planId: string, billingCycle: 'monthly' | 'yearly'): Promise<void> => {
    await api.post('/subscriptions/subscribe', { planId, billingCycle });
  },

  cancelSubscription: async (subscriptionId: string): Promise<void> => {
    await api.post(`/subscriptions/${subscriptionId}/cancel`);
  },

  renewSubscription: async (subscriptionId: string): Promise<void> => {
    await api.post(`/subscriptions/${subscriptionId}/renew`);
  },

  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get('/payment/methods');
    return response.data;
  },

  addPaymentMethod: async (data: Partial<PaymentMethod>): Promise<PaymentMethod> => {
    const response = await api.post('/payment/methods', data);
    return response.data;
  },

  deletePaymentMethod: async (methodId: string): Promise<void> => {
    await api.delete(`/payment/methods/${methodId}`);
  },

  setDefaultPaymentMethod: async (methodId: string): Promise<void> => {
    await api.post(`/payment/methods/${methodId}/default`);
  },

  getPaymentHistory: async (): Promise<PaymentHistory[]> => {
    const response = await api.get('/payment/history');
    return response.data;
  }
};
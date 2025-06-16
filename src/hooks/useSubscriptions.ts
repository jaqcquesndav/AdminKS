import { useState, useEffect, useCallback } from 'react';
import { useFinanceService } from './useFinanceService';
import type { Subscription, SubscriptionFilterParams, CreateSubscriptionPayload, UpdateSubscriptionPayload, PaginatedResponse } from '../types/finance';
import { useToast } from './useToast'; // Assuming a toast hook for notifications

export const useSubscriptions = (initialLoadParams?: SubscriptionFilterParams) => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ totalCount: number; page: number; totalPages: number } | null>(null);

  const fetchSubscriptions = useCallback(async (params?: SubscriptionFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Subscription> = await financeService.getSubscriptions(params);
      setSubscriptions(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch subscriptions: ${e.message}`);
      console.error('Failed to fetch subscriptions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financeService, showToast]);

  useEffect(() => {
    if (initialLoadParams) {
      fetchSubscriptions(initialLoadParams);
    }
  }, [fetchSubscriptions, initialLoadParams]);

  const getSubscriptionById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const subscription = await financeService.getSubscriptionById(id);
      setIsLoading(false);
      return subscription;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch subscription ${id}: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast]);

  const createSubscription = useCallback(async (data: CreateSubscriptionPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSubscription = await financeService.createSubscription(data);
      showToast('success', 'Subscription created successfully!');
      // Optionally refetch or add to local state
      fetchSubscriptions(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return newSubscription;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to create subscription: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchSubscriptions, initialLoadParams]);

  const updateSubscription = useCallback(async (id: string, data: UpdateSubscriptionPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedSubscription = await financeService.updateSubscription(id, data);
      showToast('success', 'Subscription updated successfully!');
      // Optionally refetch or update local state
      fetchSubscriptions(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return updatedSubscription;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to update subscription ${id}: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchSubscriptions, initialLoadParams]);

  const cancelSubscription = useCallback(async (id: string, reason?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const cancelledSubscription = await financeService.cancelSubscription(id, reason);
      showToast('success', 'Subscription cancelled successfully!');
      // Optionally refetch or update local state
      fetchSubscriptions(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return cancelledSubscription;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to cancel subscription ${id}: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchSubscriptions, initialLoadParams]);
  
  const getSubscriptionPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const plans = await financeService.getSubscriptionPlans();
      setIsLoading(false);
      return plans;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch subscription plans: ${e.message}`);
      setIsLoading(false);
      return [];
    }
  }, [financeService, showToast]);

  return {
    subscriptions,
    isLoading,
    error,
    pagination,
    fetchSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getSubscriptionPlans,
  };
};

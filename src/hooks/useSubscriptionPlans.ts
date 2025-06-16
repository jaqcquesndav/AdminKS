import { useState, useEffect, useCallback } from 'react';
import { useFinanceService } from './useFinanceService';
import type { SubscriptionPlan } from '../types/finance';
import { useToast } from './useToast';

export const useSubscriptionPlans = () => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSubscriptionPlans = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedPlans = await financeService.getSubscriptionPlans();
      setPlans(fetchedPlans);
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch subscription plans: ${e.message}`);
      console.error('Failed to fetch subscription plans:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financeService, showToast]);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, [fetchSubscriptionPlans]);

  return {
    plans,
    isLoading,
    error,
    fetchSubscriptionPlans,
  };
};

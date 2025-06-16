import { useState, useCallback } from 'react';
import { useFinanceService } from './useFinanceService';
import type { FinancialSummary } from '../types/finance';
import { useToast } from './useToast';

export const useFinancialSummary = () => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchFinancialSummary = useCallback(async (period?: 'daily' | 'weekly' | 'monthly' | 'yearly', customerId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await financeService.getFinancialSummary(period, customerId);
      setSummary(data);
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch financial summary: ${e.message}`);
      console.error('Failed to fetch financial summary:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financeService, showToast]);

  return {
    summary,
    isLoading,
    error,
    fetchFinancialSummary,
  };
};

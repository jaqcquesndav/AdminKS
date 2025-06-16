import { useState, useEffect, useCallback } from 'react';
import { useFinanceService } from './useFinanceService';
import type { TokenTransaction, TokenTransactionFilterParams, TokenPackage, PaginatedResponse } from '../types/finance';
import { useToast } from './useToast';

export const useTokens = (initialLoadParams?: TokenTransactionFilterParams) => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [tokenTransactions, setTokenTransactions] = useState<TokenTransaction[]>([]);
  const [tokenPackages, setTokenPackages] = useState<TokenPackage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ totalCount: number; page: number; totalPages: number } | null>(null);

  const fetchTokenPackages = useCallback(async () => {
    // setIsLoading(true); // Avoid double setting isLoading if called within another loading state
    // setError(null);
    try {
      const packages = await financeService.getTokenPackages();
      setTokenPackages(packages);
    } catch (err) {
      const e = err as Error;
      // setError(e); // Avoid overwriting error from a primary fetch
      showToast('error', `Failed to fetch token packages: ${e.message}`);
    } finally {
      // setIsLoading(false);
    }
  }, [financeService, showToast]);

  const fetchTokenTransactions = useCallback(async (params?: TokenTransactionFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<TokenTransaction> = await financeService.getTokenTransactions(params);
      setTokenTransactions(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch token transactions: ${e.message}`);
      console.error('Failed to fetch token transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financeService, showToast]);

  useEffect(() => {
    if (initialLoadParams) {
      fetchTokenTransactions(initialLoadParams);
    }
    fetchTokenPackages(); 
  }, [fetchTokenTransactions, fetchTokenPackages, initialLoadParams]); // Added fetchTokenPackages to dependency array

  const getCustomerTokenBalance = useCallback(async (customerId: string, tokenType?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const balance = await financeService.getCustomerTokenBalance(customerId, tokenType);
      setIsLoading(false);
      return balance; // Returns directly, not setting state in this hook
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch token balance for customer ${customerId}: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast]);

  return {
    tokenTransactions,
    tokenPackages,
    isLoading,
    error,
    pagination,
    fetchTokenTransactions,
    fetchTokenPackages,
    getCustomerTokenBalance,
  };
};

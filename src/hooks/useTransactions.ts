import { useState, useCallback, useEffect } from 'react';
import { useFinanceService } from './useFinanceService';
import type { Transaction, TransactionFilterParams, CreateTransactionData, PaginatedResponse } from '../types/finance';
import { useToast } from './useToast';

export const useTransactions = (initialLoadParams?: TransactionFilterParams) => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ totalCount: number; page: number; totalPages: number } | null>(null);

  const fetchTransactions = useCallback(async (params?: TransactionFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Transaction> = await financeService.getTransactions(params);
      setTransactions(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch transactions: ${e.message}`);
      console.error('Failed to fetch transactions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financeService, showToast]);

  useEffect(() => {
    if (initialLoadParams) {
      fetchTransactions(initialLoadParams);
    }
  }, [fetchTransactions, initialLoadParams]);

  const getTransactionById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const transaction = await financeService.getTransactionById(id);
      setIsLoading(false);
      return transaction;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch transaction ${id}: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast]);

  const createTransaction = useCallback(async (data: CreateTransactionData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newTransaction = await financeService.createTransaction(data);
      showToast('success', 'Transaction created successfully!');
      fetchTransactions(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return newTransaction;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to create transaction: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchTransactions, initialLoadParams]);

  return {
    transactions,
    isLoading,
    error,
    pagination,
    fetchTransactions,
    getTransactionById,
    createTransaction,
  };
};

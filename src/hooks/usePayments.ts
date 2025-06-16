import { useState, useEffect, useCallback } from 'react';
import { useFinanceService } from './useFinanceService';
import type { Payment, TransactionFilterParams, RecordManualPaymentPayload, VerifyPaymentPayload, PaginatedResponse } from '../types/finance'; // PaginatedResponse is now available
import { useToast } from './useToast';

export const usePayments = (initialLoadParams?: TransactionFilterParams) => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ totalCount: number; page: number; totalPages: number } | null>(null);

  const fetchPayments = useCallback(async (params?: TransactionFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Payment> = await financeService.getPayments(params);
      setPayments(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch payments: ${e.message}`); // Corrected showToast usage
      console.error('Failed to fetch payments:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financeService, showToast]);

  useEffect(() => {
    if (initialLoadParams) {
      fetchPayments(initialLoadParams);
    }
  }, [fetchPayments, initialLoadParams]);

  const getPaymentById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const payment = await financeService.getPaymentById(id);
      setIsLoading(false);
      return payment;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch payment ${id}: ${e.message}`); // Corrected showToast usage
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast]);

  const recordManualPayment = useCallback(async (data: RecordManualPaymentPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const newPayment = await financeService.recordManualPayment(data);
      showToast('success', 'Manual payment recorded successfully!'); // Corrected showToast usage
      fetchPayments(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return newPayment;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to record manual payment: ${e.message}`); // Corrected showToast usage
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchPayments, initialLoadParams]);

  const verifyManualPayment = useCallback(async (data: VerifyPaymentPayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const verifiedPayment = await financeService.verifyManualPayment(data);
      showToast('success', 'Payment verified successfully!'); // Corrected showToast usage
      fetchPayments(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return verifiedPayment;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to verify payment: ${e.message}`); // Corrected showToast usage
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchPayments, initialLoadParams]);

  return {
    payments,
    isLoading,
    error,
    pagination,
    fetchPayments,
    getPaymentById,
    recordManualPayment,
    verifyManualPayment,
  };
};

import { useState, useCallback, useEffect } from 'react';
import { useFinanceService } from './useFinanceService';
import type { Invoice, InvoiceFilterParams, CreateInvoiceData, PaginatedResponse } from '../types/finance';
import { useToast } from './useToast';

export const useInvoices = (initialLoadParams?: InvoiceFilterParams) => {
  const financeService = useFinanceService();
  const { showToast } = useToast();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState<{ totalCount: number; page: number; totalPages: number } | null>(null);

  const fetchInvoices = useCallback(async (params?: InvoiceFilterParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<Invoice> = await financeService.getInvoices(params);
      setInvoices(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        totalPages: response.totalPages,
      });
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch invoices: ${e.message}`);
      console.error('Failed to fetch invoices:', err);
    } finally {
      setIsLoading(false);
    }
  }, [financeService, showToast]);

  useEffect(() => {
    if (initialLoadParams) {
      fetchInvoices(initialLoadParams);
    }
  }, [fetchInvoices, initialLoadParams]);

  const getInvoiceById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const invoice = await financeService.getInvoiceById(id);
      setIsLoading(false);
      return invoice;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to fetch invoice ${id}: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast]);

  const createInvoice = useCallback(async (data: CreateInvoiceData) => {
    setIsLoading(true);
    setError(null);
    try {
      const newInvoice = await financeService.createInvoice(data);
      showToast('success', 'Invoice created successfully!');
      fetchInvoices(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return newInvoice;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to create invoice: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchInvoices, initialLoadParams]);

  const updateInvoice = useCallback(async (id: string, data: Partial<Invoice>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedInvoice = await financeService.updateInvoice(id, data);
      showToast('success', 'Invoice updated successfully!');
      fetchInvoices(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return updatedInvoice;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to update invoice ${id}: ${e.message}`);
      setIsLoading(false);
      return null;
    }
  }, [financeService, showToast, fetchInvoices, initialLoadParams]);

  const deleteInvoice = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await financeService.deleteInvoice(id);
      showToast('success', 'Invoice deleted successfully!');
      fetchInvoices(initialLoadParams); // Refetch to update list
      setIsLoading(false);
      return true;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to delete invoice ${id}: ${e.message}`);
      setIsLoading(false);
      return false;
    }
  }, [financeService, showToast, fetchInvoices, initialLoadParams]);

  const sendInvoiceReminder = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await financeService.sendInvoiceReminder(id);
      showToast('success', 'Invoice reminder sent successfully!');
      setIsLoading(false);
      return true;
    } catch (err) {
      const e = err as Error;
      setError(e);
      showToast('error', `Failed to send invoice reminder for ${id}: ${e.message}`);
      setIsLoading(false);
      return false;
    }
  }, [financeService, showToast]);

  return {
    invoices,
    isLoading,
    error,
    pagination,
    fetchInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoiceReminder,
  };
};

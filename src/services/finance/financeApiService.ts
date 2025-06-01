import apiClient from './client';
import { API_ENDPOINTS, replaceUrlParams } from './config';
import type { 
  Transaction, 
  Invoice, 
  Payment, 
  TransactionFilterParams, 
  InvoiceFilterParams, 
  CreateInvoiceData, 
  CreateTransactionData,
  FinancialSummary
} from '../../types/finance';

interface TransactionListResponse {
  transactions: Transaction[];
  totalCount: number;
  page: number;
  totalPages: number;
}

interface InvoiceListResponse {
  invoices: Invoice[];
  totalCount: number;
  page: number;
  totalPages: number;
}

interface PaymentListResponse {
  payments: Payment[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export const financeApi = {
  // Transactions
  getTransactions: async (params?: TransactionFilterParams): Promise<TransactionListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.finance.transactions, { params });
    return response.data;
  },

  createTransaction: async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await apiClient.post(API_ENDPOINTS.finance.createTransaction, data);
    return response.data;
  },

  // Invoices
  getInvoices: async (params?: InvoiceFilterParams): Promise<InvoiceListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.finance.invoices, { params });
    return response.data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const url = replaceUrlParams(API_ENDPOINTS.finance.getInvoice, { id });
    const response = await apiClient.get(url);
    return response.data;
  },

  createInvoice: async (data: CreateInvoiceData): Promise<Invoice> => {
    const response = await apiClient.post(API_ENDPOINTS.finance.createInvoice, data);
    return response.data;
  },

  payInvoice: async (id: string, paymentData: { method: string; transactionReference?: string }): Promise<Payment> => {
    const url = replaceUrlParams(API_ENDPOINTS.finance.payInvoice, { id });
    const response = await apiClient.post(url, paymentData);
    return response.data;
  },

  // Payments
  getPayments: async (params?: TransactionFilterParams): Promise<PaymentListResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.finance.payments, { params });
    return response.data;
  },

  // Revenue
  getRevenue: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<FinancialSummary> => {
    const response = await apiClient.get(API_ENDPOINTS.finance.revenue, { params: { period } });
    return response.data;
  },

  // Expenses
  getExpenses: async (period: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'): Promise<Record<string, number>> => {
    const response = await apiClient.get(API_ENDPOINTS.finance.expenses, { params: { period } });
    return response.data;
  }
};

export default financeApi;
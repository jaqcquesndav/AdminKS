import { useApi } from '../services/api/apiService'; // Corrected import to useApi
import type {
  Transaction,
  Invoice,
  Payment,
  Subscription,
  TokenTransaction,
  TokenPackage,
  TokenBalance,
  FinancialSummary,
  TransactionFilterParams,
  InvoiceFilterParams,
  SubscriptionFilterParams,
  TokenTransactionFilterParams,
  CreateInvoiceData,
  CreateTransactionData,
  RecordManualPaymentPayload,
  VerifyPaymentPayload,
  CreateSubscriptionPayload,
  UpdateSubscriptionPayload,
  SubscriptionPlan,
} from '../types/finance';

interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  totalPages: number;
}

// Define a more specific type for query parameter values
type QueryParamValue = string | number | boolean | ReadonlyArray<string | number | boolean> | null | undefined;
// Define a type for the params object
type QueryParams = Record<string, QueryParamValue>;


export const useFinanceService = () => {
  const api = useApi();

  // Helper function to append query params to URL
  const buildUrlWithParams = (baseUrl: string, params?: QueryParams): string => {
    if (!params) return baseUrl;
    const queryParams = new URLSearchParams();
    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            value.forEach((val) => queryParams.append(key, String(val)));
          } else {
            queryParams.append(key, String(value));
          }
        }
      }
    }
    const queryString = queryParams.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Transactions
  const getTransactions = async (params?: TransactionFilterParams): Promise<PaginatedResponse<Transaction>> => {
    const url = buildUrlWithParams('/finance/transactions', params as QueryParams); // Cast to QueryParams
    const response = await api.get<PaginatedResponse<Transaction>>(url);
    return response.data; 
  };

  const createTransaction = async (data: CreateTransactionData): Promise<Transaction> => {
    const response = await api.post<Transaction>('/finance/transactions', data);
    return response.data;
  };

  const getTransactionById = async (transactionId: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/finance/transactions/${transactionId}`);
    return response.data;
  };

  // Invoices
  const getInvoices = async (params?: InvoiceFilterParams): Promise<PaginatedResponse<Invoice>> => {
    const url = buildUrlWithParams('/finance/invoices', params as QueryParams); // Cast to QueryParams
    const response = await api.get<PaginatedResponse<Invoice>>(url);
    return response.data;
  };

  const getInvoiceById = async (invoiceId: string): Promise<Invoice> => {
    const response = await api.get<Invoice>(`/finance/invoices/${invoiceId}`);
    return response.data;
  };

  const createInvoice = async (data: CreateInvoiceData): Promise<Invoice> => {
    const response = await api.post<Invoice>('/finance/invoices', data);
    return response.data;
  };

  const updateInvoice = async (invoiceId: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await api.put<Invoice>(`/finance/invoices/${invoiceId}`, data);
    return response.data;
  };

  const deleteInvoice = async (invoiceId: string): Promise<void> => {
    const response = await api.delete<void>(`/finance/invoices/${invoiceId}`); // Changed api.del to api.delete
    return response.data; // For void responses, Axios still has a data property (often null or empty)
  };

  const sendInvoiceReminder = async (invoiceId: string): Promise<void> => {
    const response = await api.post<void>(`/finance/invoices/${invoiceId}/send-reminder`, {});
    return response.data; // For void responses
  };

  // Payments
  const getPayments = async (params?: TransactionFilterParams): Promise<PaginatedResponse<Payment>> => {
    const url = buildUrlWithParams('/finance/payments', params as QueryParams); // Cast to QueryParams
    const response = await api.get<PaginatedResponse<Payment>>(url);
    return response.data;
  };

  const getPaymentById = async (paymentId: string): Promise<Payment> => {
    const response = await api.get<Payment>(`/finance/payments/${paymentId}`);
    return response.data;
  };

  const recordManualPayment = async (data: RecordManualPaymentPayload): Promise<Payment> => {
    const response = await api.post<Payment>('/finance/payments/manual', data);
    return response.data;
  };

  const verifyManualPayment = async (data: VerifyPaymentPayload): Promise<Payment> => {
    const response = await api.post<Payment>('/finance/payments/verify', data);
    return response.data;
  };

  // Subscriptions
  const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
    const url = '/finance/subscriptions/plans';
    const response = await api.get<SubscriptionPlan[]>(url);
    return response.data;
  };

  const getSubscriptions = async (params?: SubscriptionFilterParams): Promise<PaginatedResponse<Subscription>> => {
    const url = buildUrlWithParams('/finance/subscriptions', params as QueryParams); // Cast to QueryParams
    const response = await api.get<PaginatedResponse<Subscription>>(url);
    return response.data;
  };

  const getSubscriptionById = async (subscriptionId: string): Promise<Subscription> => {
    const response = await api.get<Subscription>(`/finance/subscriptions/${subscriptionId}`);
    return response.data;
  };

  const createSubscription = async (data: CreateSubscriptionPayload): Promise<Subscription> => {
    const response = await api.post<Subscription>('/finance/subscriptions', data);
    return response.data;
  };

  const updateSubscription = async (subscriptionId: string, data: UpdateSubscriptionPayload): Promise<Subscription> => {
    const response = await api.put<Subscription>(`/finance/subscriptions/${subscriptionId}`, data);
    return response.data;
  };

  const cancelSubscription = async (subscriptionId: string, reason?: string): Promise<Subscription> => {
    const response = await api.post<Subscription>(`/finance/subscriptions/${subscriptionId}/cancel`, { reason });
    return response.data;
  };

  // Tokens
  const getTokenPackages = async (): Promise<TokenPackage[]> => {
    const url = '/finance/tokens/packages';
    const response = await api.get<TokenPackage[]>(url);
    return response.data;
  };

  const getTokenTransactions = async (params?: TokenTransactionFilterParams): Promise<PaginatedResponse<TokenTransaction>> => {
    const url = buildUrlWithParams('/finance/tokens/transactions', params as QueryParams); // Cast to QueryParams
    const response = await api.get<PaginatedResponse<TokenTransaction>>(url);
    return response.data;
  };

  const getCustomerTokenBalance = async (customerId: string, tokenType?: string): Promise<TokenBalance | TokenBalance[]> => {
    const queryParamsObj: QueryParams = {};
    if (tokenType) {
      queryParamsObj.tokenType = tokenType;
    }
    const url = buildUrlWithParams(`/finance/tokens/balance/${customerId}`, queryParamsObj);
    const response = await api.get<TokenBalance | TokenBalance[]>(url);
    return response.data;
  };
  
  // Revenue & Financial Summary
  const getFinancialSummary = async (period?: 'daily' | 'weekly' | 'monthly' | 'yearly', customerId?: string): Promise<FinancialSummary> => {
    const paramsToBuild: QueryParams = {};
    if (period) paramsToBuild.period = period;
    if (customerId) paramsToBuild.customerId = customerId;
    const url = buildUrlWithParams('/finance/summary', paramsToBuild);
    const response = await api.get<FinancialSummary>(url);
    return response.data;
  };

  return {
    getTransactions,
    createTransaction,
    getTransactionById,
    getInvoices,
    getInvoiceById,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    sendInvoiceReminder,
    getPayments,
    getPaymentById,
    recordManualPayment,
    verifyManualPayment,
    getSubscriptionPlans,
    getSubscriptions,
    getSubscriptionById,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getTokenPackages,
    getTokenTransactions,
    getCustomerTokenBalance,
    getFinancialSummary,
  };
};

import { useApi } from './apiService';
import type {
  Customer, 
  CustomerFormData, 
  CustomerDocument, 
  CustomerListResponse, 
  CustomerFilterParams,
  CustomerDetailsResponse,
  CustomerStatistics,
  CustomerActivity,
  ValidationProcess,
  ExtendedCustomer,
  ValidationStep // Added for updateCustomerValidationStep
} from '../../types/customer'; // Added customer types
import type {
  Transaction,
  Invoice,
  Payment,
  TransactionFilterParams,
  InvoiceFilterParams,
  CreateInvoiceData,
  CreateTransactionData,
  FinancialSummary,
  Subscription, // Added
  SubscriptionFilterParams, // Added
  TokenPackage, // Added
  TokenTransaction, // Changed from TokenUsageLog
  // ManualPaymentFilterParams, // To be reviewed - using TransactionFilterParams for now
  VerifyPaymentPayload // Changed from VerifyManualPaymentData
} from '../../types/finance'; // Added finance types

// Interface pour les utilisateurs
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  status: string;
  userType?: string; // internal or external
  customerAccountId?: string; // ID of associated customer account for external users
  companyName?: string; // Name of the associated company
  companyType?: string; // Type of the associated company
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Interface pour les entreprises
export interface Company {
  id: string;
  name: string;
  status: string;
  industry: string;
  createdAt: string;
  subscription?: {
    plan: string;
    status: string;
    nextBillingDate?: string;
  };
}

// Interface pour les statistiques du tableau de bord
export interface DashboardStats {
  activeUsers: number;
  totalUsers: number;
  activeCompanies: number;
  totalCompanies: number;
  revenueCurrentMonth: number;
  revenueLastMonth: number;
  growthRate: number;
  tokenUsage: {
    total: number;
    byCategory: Record<string, number>;
  };
}

// Service d'API pour l'administration
export const useAdminApi = () => {
  const api = useApi();

  // Helper function to build query string from params object
  const buildQueryString = (params: Record<string, string | number | boolean | undefined>): string => {
    const query = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    return query ? `?${query}` : '';
  };

  return {
    // Gestion des utilisateurs
    getUsers: () => api.get<AdminUser[]>('/users'),
    getUserById: (id: string) => api.get<AdminUser>(`/users/${id}`),
    createUser: (userData: Partial<AdminUser>) => api.post<AdminUser>('/users', userData),
    updateUser: (id: string, userData: Partial<AdminUser>) => api.put<AdminUser>(`/users/${id}`, userData),
    deleteUser: (id: string) => api.delete<void>(`/users/${id}`),
    resetUserPassword: (userId: string) => api.post(`/users/${userId}/reset-password`, {}),
    
    // Gestion des clients (anciennement entreprises, clarifié comme "Customer")
    getCustomersList: (params: CustomerFilterParams) => 
      api.get<CustomerListResponse>(`/customers${buildQueryString(params as Record<string, string | number | boolean | undefined>)}"`),
    getCustomerDetails: (id: string) => api.get<CustomerDetailsResponse>(`/customers/${id}`),
    createCustomerRecord: (customerData: CustomerFormData) => api.post<Customer>('/customers', customerData),
    updateCustomerRecord: (id: string, customerData: Partial<CustomerFormData>) => api.put<Customer>(`/customers/${id}`, customerData),
    // deleteCustomer: (id: string) => api.delete<void>(`/customers/${id}`), // Endpoint à confirmer pour la suppression client

    // Statut client
    approveCustomer: (id: string) => api.post<void>(`/customers/${id}/approve`, {}), // Existed, returns void
    rejectCustomer: (id: string, reason: string) => api.post<void>(`/customers/${id}/reject`, { reason }), // Existed, returns void
    suspendCustomer: (id: string, reason: string) => api.post<Customer>(`/customers/${id}/suspend`, { reason }),
    reactivateCustomer: (id: string) => api.post<Customer>(`/customers/${id}/reactivate`, {}),

    // Documents client
    getCustomerDocuments: (customerId: string) => api.get<CustomerDocument[]>(`/customers/${customerId}/documents`),
    uploadCustomerDocument: (customerId: string, documentData: FormData) => 
      api.postMultipart<CustomerDocument>(`/customers/${customerId}/documents`, documentData), // Utilisation de postMultipart
    approveCustomerDocument: (customerId: string, documentId: string, data?: { comments?: string }) => 
      api.post<CustomerDocument>(`/customers/${customerId}/documents/${documentId}/approve`, data),
    rejectCustomerDocument: (customerId: string, documentId: string, data: { reason: string }) => 
      api.post<CustomerDocument>(`/customers/${customerId}/documents/${documentId}/reject`, data),
    // getCustomerDocumentById: (customerId: string, documentId: string) => api.get<CustomerDocument>(`/customers/${customerId}/documents/${documentId}`),
    // deleteCustomerDocument: (customerId: string, documentId: string) => api.delete<void>(`/customers/${customerId}/documents/${documentId}`),

    // Activités et statistiques client
    getCustomerActivities: (customerId: string, params?: { limit?: number, page?: number }) => 
      api.get<CustomerActivity[]>(`/customers/${customerId}/activities${buildQueryString(params as Record<string, string | number | boolean | undefined> || {})}`),
    getCustomerStatistics: () => api.get<CustomerStatistics>('/customers/stats'), // Endpoint global pour stats clients

    // Processus de validation client
    getExtendedCustomerDetails: (customerId: string) => api.get<ExtendedCustomer>(`/customers/${customerId}/extended-details`),
    getCustomerValidationProcess: (customerId: string) => api.get<ValidationProcess>(`/customers/${customerId}/validation-process`),
    initiateCustomerValidation: (customerId: string) => api.post<ValidationProcess>(`/customers/${customerId}/validation-process/initiate`, {}),
    updateCustomerValidationStep: (customerId: string, stepId: string, data: { status: ValidationStep['status']; notes?: string }) => 
      api.put<ValidationProcess>(`/customers/${customerId}/validation-process/steps/${stepId}`, data),
    // La validation spécifique d'un document DANS un processus de validation pourrait être gérée par approveCustomerDocument/rejectCustomerDocument
    // ou nécessiter un endpoint dédié si la logique est différente.
    // Par exemple: api.post(`/customers/${customerId}/validation-process/documents/${documentId}/validate`, { status, comments })

    // Gestion des entreprises (si différent de client, ex: partenaires)
    getCompanies: () => api.get<Company[]>('/companies'),
    getCompanyById: (id: string) => api.get<Company>(`/companies/${id}`),
    updateCompany: (id: string, companyData: Partial<Company>) => api.put<Company>(`/companies/${id}`, companyData),
    
    // Tableau de bord et statistiques
    getDashboardStats: () => api.get<DashboardStats>('/dashboard/stats'),
    
    // Paramètres système
    getSettings: () => api.get('/settings'),
    updateSetting: (id: string, value: string | number | boolean | Record<string, unknown>) => 
      api.put(`/settings/${id}`, { value }),
    
    // Rapports et exports
    generateUserReport: (filters: { 
      status?: string; 
      role?: string; 
      dateRange?: { start: string; end: string } 
    }) => api.post('/reports/users', filters),
    generateRevenueReport: (period: string) => api.get<FinancialSummary>(`/reports/revenue?period=${period}`), // Ensure FinancialSummary is the correct return type

    // Finance Module Endpoints
    // Transactions
    getTransactions: (params?: TransactionFilterParams) => 
      api.get<Transaction[]>(`/finance/transactions${buildQueryString(params as Record<string, string | number | boolean | undefined> || {})}`),
    getTransactionById: (id: string) => api.get<Transaction>(`/finance/transactions/${id}`),
    createTransaction: (data: CreateTransactionData) => api.post<Transaction>('/finance/transactions', data),
    updateTransaction: (id: string, data: Partial<CreateTransactionData>) => api.put<Transaction>(`/finance/transactions/${id}`, data),
    deleteTransaction: (id: string) => api.delete<void>(`/finance/transactions/${id}`),

    // Invoices
    getInvoices: (params?: InvoiceFilterParams) => 
      api.get<Invoice[]>(`/finance/invoices${buildQueryString(params as Record<string, string | number | boolean | undefined> || {})}`),
    getInvoiceById: (id: string) => api.get<Invoice>(`/finance/invoices/${id}`),
    createInvoice: (data: CreateInvoiceData) => api.post<Invoice>('/finance/invoices', data),
    updateInvoice: (id: string, data: Partial<CreateInvoiceData>) => api.put<Invoice>(`/finance/invoices/${id}`, data),
    deleteInvoice: (id: string) => api.delete<void>(`/finance/invoices/${id}`),
    payInvoice: (id: string, paymentData: { method: string; transactionReference?: string }) => 
      api.post<Payment>(`/finance/invoices/${id}/pay`, paymentData),

    // Payments (general, not manual specific, could be combined or separate from manual)
    getPayments: (params?: TransactionFilterParams) => // Assuming TransactionFilterParams can be used or a new PaymentFilterParams
      api.get<Payment[]>(`/finance/payments${buildQueryString(params as Record<string, string | number | boolean | undefined> || {})}`),
    getPaymentById: (id: string) => api.get<Payment>(`/finance/payments/${id}`),

    // Manual Payments
    getManualPayments: (params?: TransactionFilterParams) => // Changed ManualPaymentFilterParams to TransactionFilterParams
      api.get<Payment[]>(`/finance/manual-payments${buildQueryString(params as Record<string, string | number | boolean | undefined> || {})}`),
    verifyManualPayment: (paymentId: string, data: VerifyPaymentPayload) => // Changed VerifyManualPaymentData to VerifyPaymentPayload
      api.post<Payment>(`/finance/manual-payments/${paymentId}/verify`, data),
    
    // Revenue & Expenses (assuming FinancialSummary might be more generic)
    getFinancialSummary: (period?: 'daily' | 'weekly' | 'monthly' | 'yearly') => 
      api.get<FinancialSummary>(`/finance/summary${buildQueryString({ period } as Record<string, string | number | boolean | undefined>)}`),
    // getExpenses: (params) => api.get('/finance/expenses', { params }), // Define if needed

    // Subscriptions
    getSubscriptions: (params?: SubscriptionFilterParams) => 
      api.get<Subscription[]>(`/finance/subscriptions${buildQueryString(params as Record<string, string | number | boolean | undefined> || {})}`),
    getSubscriptionById: (id: string) => api.get<Subscription>(`/finance/subscriptions/${id}`),
    updateSubscriptionStatus: (id: string, status: string) => // Define status type more strictly if possible
      api.put<Subscription>(`/finance/subscriptions/${id}/status`, { status }),
    cancelSubscription: (id: string) => api.post<Subscription>(`/finance/subscriptions/${id}/cancel`, {}),


    // Tokens (Packages, Usage)
    getTokenPackages: () => api.get<TokenPackage[]>('/finance/tokens/packages'),
    getTokenTransactions: (params?: TransactionFilterParams) => // Assuming TokenTransaction is the correct log type and TransactionFilterParams can be used
      api.get<TokenTransaction[]>(`/finance/tokens/transactions${buildQueryString(params as Record<string, string | number | boolean | undefined> || {})}`),

    // Placeholder for other token related endpoints if needed:
    // issueTokens: (data: IssueTokenPayload) => api.post(\'/finance/tokens/issue\', data),
    // getTokenBalance: (customerId: string, tokenType: string) => api.get(`/finance/tokens/balance/${customerId}/${tokenType}`),
  };
};

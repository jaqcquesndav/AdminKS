import { SupportedCurrency } from './currency'; // Added import

export type TransactionType = 'payment' | 'invoice' | 'refund' | 'credit' | 'debit';
export type TransactionStatus = 'completed' | 'pending' | 'failed' | 'canceled' | 'verified' | 'rejected';
export type PaymentMethod = 'bank_transfer' | 'card' | 'mobile_money' | 'crypto' | 'cash' | 'check' | 'other'; // Added 'check' and 'other'
export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'canceled';

export interface Transaction {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
  updatedAt: string;
  description: string;
  customerId?: string;
  customerName?: string;
  paymentMethod?: PaymentMethod;
  metadata?: Record<string, unknown>; // Changed from any to unknown
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  taxRate?: number;
  taxAmount?: number;
}

export interface Payment {
  id: string;
  invoiceId?: string;
  customerId: string;
  customerName: string; // Added
  amount: number;
  currency: string;
  method: PaymentMethod; // Original field, represents the actual payment method recorded
  proofType?: 'bank_transfer' | 'check' | 'other'; // Added: specific type of proof provided for manual verification
  proofUrl?: string; // Added: URL to the proof document/image
  status: 'pending' | 'verified' | 'rejected' | 'completed' | 'failed' | 'canceled'; // Expanded to include UI states directly for manual payments
  transactionReference: string; // UI might call this 'reference'
  paidAt: string; // UI might call this 'date'
  createdAt?: string; // Added: Timestamp of payment record creation/submission
  description?: string; // General notes about the payment, UI might use for 'notes'
  verifiedBy?: string; // Added: ID/name of admin who verified/rejected
  verifiedAt?: string; // Added: Timestamp of verification/rejection
  metadata?: { // For additional dynamic data
    approvalNotes?: string; // Specific notes from admin during verification
    [key: string]: unknown; // Changed from any to unknown
  };
}

export interface RecordManualPaymentPayload {
  customerId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  transactionReference: string;
  paidAt: string; // ISO Date string
  description?: string;
  proofType?: 'bank_transfer' | 'check' | 'other';
  proofUrl?: string;
}

export interface VerifyPaymentPayload {
  paymentId: string;
  status: 'verified' | 'rejected';
  adminNotes?: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingInvoices: number;
  pendingAmount: number;
  overdueAmount: number; // Corrected typo: overduAmount -> overdueAmount
  paidInvoices: number;
  revenueByMonth: Record<string, number>;
  topCustomers: Array<{
    customerId: string;
    customerName: string;
    totalSpent: number;
  }>;
}

export interface TransactionFilterParams {
  search?: string;
  type?: TransactionType | 'all';
  status?: TransactionStatus | 'all';
  paymentMethod?: PaymentMethod | 'all'; // Added paymentMethod
  startDate?: string;
  endDate?: string;
  customerId?: string;
  page?: number;
  limit?: number;
}

export interface InvoiceFilterParams {
  search?: string;
  status?: InvoiceStatus | 'all';
  customerId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface CreateInvoiceData {
  customerId: string;
  items: Array<Omit<InvoiceItem, 'id'>>;
  dueDate: string;
  notes?: string;
  currency: string;
}

export interface CreateTransactionData {
  customerId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  paymentMethod?: PaymentMethod;
  metadata?: Record<string, unknown>; // Changed from any to unknown
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  totalPages: number;
}

// Subscription Related Types
export type SubscriptionStatus = 'active' | 'pending_activation' | 'canceled' | 'expired' | 'paused' | 'trial' | 'payment_failed';
export type BillingCycle = 'monthly' | 'annually' | 'quarterly' | 'biennially' | 'one_time';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: SupportedCurrency; // Changed from string to SupportedCurrency
  billingCycle: BillingCycle;
  features: string[];
  isActive: boolean;
  trialPeriodDays?: number;
  metadata?: Record<string, unknown>;
}

export interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planId: string;
  planName: string; // Denormalized for convenience, or use planId to fetch plan details
  status: SubscriptionStatus;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string, optional for non-terminating or ongoing subscriptions
  currentPeriodStart?: string; // ISO date string
  currentPeriodEnd?: string; // ISO date string
  nextBillingDate?: string; // ISO date string
  amount: number; // Amount per billing cycle
  currency: SupportedCurrency; // Changed from string to SupportedCurrency
  billingCycle: BillingCycle;
  autoRenew: boolean;
  paymentMethodId?: string; // Reference to a stored payment method for auto-renewal
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  trialEndsAt?: string; // ISO date string, if applicable
  canceledAt?: string; // ISO date string, if applicable
  cancellationReason?: string;
  metadata?: Record<string, unknown>;
}

export interface SubscriptionFilterParams {
  search?: string; // Search by customer name, plan name, etc.
  status?: SubscriptionStatus | 'all';
  planId?: string;
  customerId?: string;
  billingCycle?: BillingCycle;
  startDateBefore?: string;
  startDateAfter?: string;
  endDateBefore?: string;
  endDateAfter?: string;
  page?: number;
  limit?: number;
}

export interface CreateSubscriptionPayload {
  customerId: string;
  planId: string;
  startDate?: string; // Optional, defaults to now or plan-defined start
  autoRenew?: boolean;
  paymentMethodId?: string; // For immediate payment or setting up auto-renewal
  trialPeriodDays?: number; // Override plan's trial if needed
  couponCode?: string;
  metadata?: Record<string, unknown>;
}

export interface UpdateSubscriptionPayload {
  planId?: string;
  status?: SubscriptionStatus; // e.g., to pause, resume
  autoRenew?: boolean;
  paymentMethodId?: string;
  cancellationReason?: string; // If status is 'canceled'
  endDate?: string; // To set a specific end date for cancellation
  metadata?: Record<string, unknown>;
}

// Token Related Types
export type TokenType = 'wanzo_credit' | 'api_call' | 'storage_gb' | 'processing_unit' | 'generic';

export interface TokenPackage {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  tokensIncluded: number;
  tokenType: TokenType;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

export interface TokenBalance {
  customerId: string;
  tokenType: TokenType;
  balance: number;
  lastUpdatedAt: string; // ISO date string
}

export interface TokenTransaction {
  id: string;
  customerId: string;
  customerName?: string; // Denormalized for display convenience
  type: 'purchase' | 'usage' | 'refund' | 'adjustment' | 'expiry' | 'bonus';
  tokenType: TokenType;
  amount: number; // Number of tokens (positive for credit, negative for debit)
  balanceAfterTransaction?: number; // Optional: current balance after this transaction
  transactionDate: string; // ISO date string
  description?: string;
  relatedPurchaseId?: string; // If usage/refund, could link to a TokenPackage purchase or another TokenTransaction
  relatedInvoiceId?: string; // If tokens were part of an invoice
  issuedBy?: string; // Admin ID if manually adjusted/issued
  metadata?: Record<string, unknown>;
}

export interface TokenTransactionFilterParams {
  search?: string; // Search by customer name, description
  customerId?: string;
  type?: TokenTransaction['type'] | 'all';
  tokenType?: TokenType | 'all';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export interface PurchaseTokensPayload {
  customerId: string;
  tokenPackageId: string;
  quantity?: number; // Default 1 package
  paymentDetails?: { // If immediate payment is required
    method: PaymentMethod;
    transactionReference?: string;
  };
  invoiceId?: string; // If this purchase is to be added to an existing invoice
  metadata?: Record<string, unknown>;
}

export interface IssueTokensPayload {
  customerId: string;
  tokenType: TokenType;
  amount: number; // Can be positive or negative for adjustments
  description: string;
  transactionDate?: string; // Defaults to now if not provided
  metadata?: Record<string, unknown>;
}
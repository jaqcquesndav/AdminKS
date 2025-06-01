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
  description?: string; // General notes about the payment, UI might use for 'notes'
  verifiedBy?: string; // Added: ID/name of admin who verified/rejected
  verifiedAt?: string; // Added: Timestamp of verification/rejection
  metadata?: { // For additional dynamic data
    approvalNotes?: string; // Specific notes from admin during verification
    [key: string]: unknown; // Changed from any to unknown
  };
}

export interface FinancialSummary {
  totalRevenue: number;
  pendingInvoices: number;
  pendingAmount: number;
  overduAmount: number;
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
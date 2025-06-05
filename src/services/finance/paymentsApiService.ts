// import apiClient from '../api/client'; // Commented out as unused in mock implementation
// import { API_ENDPOINTS, replaceUrlParams } from '../api/config'; // Commented out as unused in mock implementation
import type { Payment, TransactionFilterParams } from '../../types/finance';

// Mock data for manual payments - Updated to align with the new Payment interface
const mockManualPayments: Payment[] = [  {
    id: 'manual-payment-1',
    customerId: 'customer-123',
    customerName: 'Wanzo Tech', // Added
    amount: 100,
    currency: 'USD',
    method: 'bank_transfer',
    proofType: 'bank_transfer', // Added
    proofUrl: 'https://example.com/proofs/manual001.pdf', // Added
    status: 'pending',
    transactionReference: 'TX12345MANUAL',
    paidAt: new Date().toISOString(),
    description: 'Manual payment for services rendered', // Can be used for UI 'notes'
    // verifiedBy and verifiedAt will be set upon verification
    metadata: {
      approvalNotes: '', // For admin notes during verification
    },
  },
  {
    id: 'manual-payment-2',
    customerId: 'customer-456',
    customerName: 'SmartFinance SA', // Added
    amount: 250,
    currency: 'USD',
    method: 'cash',
    proofType: 'other', // Added
    proofUrl: 'https://example.com/proofs/manual002.jpg', // Added
    status: 'verified', // Changed from 'completed' to 'verified' to match UI
    transactionReference: 'TX67890MANUAL',
    paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    description: 'Cash payment received at office',
    verifiedBy: 'admin-xyz', // Added
    verifiedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // Added (4 days ago)
    metadata: {
      approvalNotes: 'Verified by finance department.',
    },
  },
  {
    id: 'manual-payment-3',
    customerId: 'cust-789',
    customerName: 'Startup Innovation',
    amount: 499,
    currency: 'EUR',
    method: 'check',
    proofType: 'check',
    proofUrl: 'https://example.com/proofs/manual003.pdf',
    status: 'rejected',
    transactionReference: 'INV20250418-007',
    paidAt: '2025-04-18T00:00:00.000Z',
    description: 'Preuve de paiement illisible, demande d\'une nouvelle preuve',
    verifiedBy: 'Marie Martin',
    verifiedAt: '2025-04-19T09:15:00Z',
    metadata: {
        approvalNotes: 'Preuve de paiement illisible.'
    }
  }
];

interface ManualPaymentsResponse {
  payments: Payment[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export const paymentsApiService = {
  // Get list of manual payments that require verification or have been processed
  getManualPayments: async (params?: TransactionFilterParams): Promise<ManualPaymentsResponse> => {
    // Actual API call
    // const response = await apiClient.get(API_ENDPOINTS.finance.getManualPayments, { params });
    // return response.data;

    // Mock implementation
    const { page = 1, limit = 10, status } = params || {};
    let filteredPayments = mockManualPayments;

    if (status && status !== 'all') {
      // Ensure status filter works with the updated Payment status type
      filteredPayments = filteredPayments.filter(p => p.status === status);
    }
    
    const totalCount = filteredPayments.length;
    const totalPages = Math.ceil(totalCount / limit);
    const paginatedPayments = filteredPayments.slice((page - 1) * limit, page * limit);

    return Promise.resolve({
      payments: paginatedPayments,
      totalCount,
      page,
      totalPages,
    });
  },

  // Verify/Approve a manual payment
  verifyManualPayment: async (paymentId: string, adminData: {
    verifiedBy: string; 
    notes?: string;
    newStatus: 'verified' | 'rejected'; // Changed from 'completed' | 'failed'
  }): Promise<Payment> => { // Return type changed to Payment
    // const url = replaceUrlParams(API_ENDPOINTS.finance.validateManualPayment, { transactionId: paymentId }); // Commented out as it's unused in mock
    
    // Mock implementation
    const paymentIndex = mockManualPayments.findIndex(p => p.id === paymentId);
    if (paymentIndex === -1) {
      throw new Error('Manual payment not found');
    }
    const paymentToUpdate = mockManualPayments[paymentIndex];
    paymentToUpdate.status = adminData.newStatus;
    paymentToUpdate.verifiedBy = adminData.verifiedBy;
    paymentToUpdate.verifiedAt = new Date().toISOString();
    if (paymentToUpdate.metadata) {
        paymentToUpdate.metadata.approvalNotes = adminData.notes;
    } else {
        paymentToUpdate.metadata = { approvalNotes: adminData.notes };
    }
    
    mockManualPayments[paymentIndex] = paymentToUpdate;
    return Promise.resolve(paymentToUpdate);
  },
};

export default paymentsApiService;

export type CustomerType = 'financial' | 'corporate' | 'individual';
export type CustomerStatus = 'active' | 'pending' | 'suspended' | 'inactive';
export type AccountType = 'freemium' | 'standard' | 'premium' | 'enterprise';

export interface Customer {
  id?: string;
  name: string;
  type: CustomerType;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: CustomerStatus;
  createdAt?: string;
  updatedAt?: string;
  billingContactName: string;
  billingContactEmail: string;
  tokenAllocation: number;
  accountType: AccountType;
}

export type CustomerFormData = Customer;

export interface CustomerFilterParams {
  search?: string;
  status?: CustomerStatus | 'all';
  type?: CustomerType | 'all';
  page?: number;
  limit?: number;
}

export interface CustomerStatistics {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  byType: {
    financial: number;
    corporate: number;
    individual: number;
  };
  byAccountType: {
    freemium: number;
    standard: number;
    premium: number;
    enterprise: number;
  };
}

export interface CustomerDetailsResponse {
  customer: Customer;
  statistics: {
    tokensUsed: number;
    lastActivity: string;
    activeSubscriptions: number;
    totalSpent: number;
  };
  activities: Array<{
    id: string;
    type: string;
    description: string;
    timestamp: string;
  }>;
}

export interface CustomerListResponse {
  customers: Customer[];
  totalCount: number;
  page: number;
  totalPages: number;
}
export type CustomerType = 'pme' | 'financial';
export type CustomerStatus = 'active' | 'pending' | 'suspended' | 'inactive' | 'needs_validation' | 'validation_in_progress';
export type AccountType = 'freemium' | 'standard' | 'premium' | 'enterprise';
export type DocumentType = 'rccm' | 'id_nat' | 'nif' | 'cnss' | 'inpp' | 'patente' | 'agrement' | 'contract';
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface CustomerDocument {
  id?: string;
  type: DocumentType;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  uploadedBy: string;
  status: DocumentStatus;
  reviewNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComments?: string;
  file?: File;  // Added to support file uploads
}

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
  ownerId?: string;
  ownerEmail?: string;
  validatedAt?: string;
  validatedBy?: string;
  documents?: CustomerDocument[];
  suspendedAt?: string;
  suspendedBy?: string;
  suspensionReason?: string;
  reactivatedAt?: string;
  reactivatedBy?: string;
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
    pme: number;
    financial: number;
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
  activities: CustomerActivity[];
}

export interface CustomerListResponse {
  customers: Customer[];
  totalCount: number;
  page: number;
  totalPages: number;
}

// Adding missing types needed by services
export interface DocumentApprovalData {
  comments?: string;
  status: DocumentStatus;
}

export interface CustomerActivity {
  id: string;
  customerId: string;
  type: string;
  action?: string;
  description?: string;
  performedBy?: string;
  performedByName?: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Types spécifiques pour les PME
export interface PmeSpecificData {
  industry: string;
  size: 'micro' | 'small' | 'medium';
  employeesCount: number;
  yearFounded?: number;
  registrationNumber?: string;
  taxId?: string;
  businessLicense?: string;
}

// Types spécifiques pour les institutions financières
export interface FinancialInstitutionSpecificData {
  institutionType: 'bank' | 'microfinance' | 'insurance' | 'investment' | 'other';
  regulatoryBody?: string;
  regulatoryLicenseNumber?: string;
  branchesCount?: number;
  clientsCount?: number;
  assetsUnderManagement?: number;
}

// Interface étendue pour les clients avec les données spécifiques
export interface ExtendedCustomer extends Customer {
  pmeData?: PmeSpecificData;
  financialData?: FinancialInstitutionSpecificData;
  validationRequirements?: {
    requiredDocuments: DocumentType[];
    completedSteps: string[];
    nextStep?: string;
  };
}

// Type pour le processus de validation
export interface ValidationProcess {
  customerId: string;
  status: CustomerStatus;
  steps: ValidationStep[];
  currentStepIndex: number;
  startedAt: string;
  lastUpdatedAt: string;
  completedAt?: string;
  validatedBy?: string;
  notes?: string[];
}

export interface ValidationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  requiredDocuments?: DocumentType[];
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}
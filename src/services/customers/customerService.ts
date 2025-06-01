import type { 
  Customer, 
  CustomerFormData, 
  CustomerDocument, 
  CustomerListResponse, 
  CustomerFilterParams,
  CustomerDetailsResponse,
  DocumentApprovalData,
  CustomerStatistics,
  CustomerActivity,
  ValidationProcess, // Added
  ExtendedCustomer // Added
} from '../../types/customer'; // Corrected path
import customersApi from './customersApiService'; // Corrected import path
import { USE_MOCK_AUTH } from '../../utils/mockAuth'; // Corrected path, removed unused isDemoEmail
import { authService } from '../auth/authService'; // Corrected path
import { isUsingDemoUser } from '../api/client'; // Corrected path
import { API_ENDPOINTS, replaceUrlParams } from '../api/config'; // Added for direct API calls
import apiClient from '../api/client'; // Added for direct API calls

class CustomerService {
  
  // Obtenir la liste des clients avec filtrage et pagination
  async getCustomers(filters: CustomerFilterParams): Promise<CustomerListResponse> {
    return customersApi.getAll(filters);
  }
  
  // Obtenir un client par son ID
  async getCustomerById(id: string): Promise<CustomerDetailsResponse> {
    return customersApi.getById(id);
  }
  
  // Créer un nouveau client
  async createCustomer(customerData: CustomerFormData): Promise<Customer> { // Changed parameter to CustomerFormData
    return customersApi.create(customerData);
  }
  
  // Mettre à jour un client
  async updateCustomer(id: string, customerData: Partial<CustomerFormData>): Promise<Customer> { // Changed parameter to Partial<CustomerFormData>
    return customersApi.update(id, customerData);
  }
  
  // Télécharger un document pour un client
  async uploadDocument(
    customerId: string, 
    documentData: FormData // Changed to FormData to align with customersApiService
  ): Promise<CustomerDocument> {
    return customersApi.uploadDocument(customerId, documentData);
  }
  
  // Approuver un document
  async approveDocument(customerId: string, documentId: string, data: DocumentApprovalData): Promise<CustomerDocument> {
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Mock implementation remains, but ideally, this would also call a method in customersApiService
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = authService.getStoredUser(); // Changed to getStoredUser()
      return {
        id: documentId,
        type: 'contract', // Example type, should be dynamic or from existing doc
        fileName: 'approved_document.pdf',
        fileUrl: 'https://example.com/documents/approved.pdf',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'user-123', // Example uploader
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.id || 'mock-admin',
        reviewComments: data.comments
      };
    }
    // Real API call - this should ideally be in customersApiService
    const url = replaceUrlParams(API_ENDPOINTS.customers.VALIDATE_CUSTOMER_DOCUMENT, { customerId, documentId });
    const response = await apiClient.post(url, { status: 'approved', comments: data.comments });
    return response.data;
  }
  
  // Rejeter un document
  async rejectDocument(customerId: string, documentId: string, reason: string): Promise<CustomerDocument> {
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Mock implementation remains
      await new Promise(resolve => setTimeout(resolve, 500));
      const user = authService.getStoredUser(); // Changed to getStoredUser()
      return {
        id: documentId,
        type: 'contract', // Example type
        fileName: 'rejected_document.pdf',
        fileUrl: 'https://example.com/documents/rejected.pdf',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'user-123',
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: user?.id || 'mock-admin',
        reviewComments: reason
      };
    }
    // Real API call - this should ideally be in customersApiService
    const url = replaceUrlParams(API_ENDPOINTS.customers.VALIDATE_CUSTOMER_DOCUMENT, { customerId, documentId });
    const response = await apiClient.post(url, { status: 'rejected', comments: reason });
    return response.data;
  }
  
  // Valider un client (changer son statut en "active")
  async validateCustomer(customerId: string): Promise<Customer> {
    return customersApi.validateCustomer(customerId);
  }
  
  // Suspendre un client
  async suspendCustomer(customerId: string, reason: string): Promise<Customer> {
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const customerDetails = await customersApi.getById(customerId);
      const user = authService.getStoredUser(); // Changed to getStoredUser()
      const updatedCustomer: Customer = {
        ...customerDetails.customer,
        status: 'suspended',
        suspendedAt: new Date().toISOString(),
        suspendedBy: user?.id || 'mock-admin',
        suspensionReason: reason
      };
      // This mock update should ideally go through customersApi.update if it supports status changes directly
      // For now, we assume the mock within customersApi.getById would reflect this if it were a real backend.
      // Or, we'd update the local mockCustomers array in customersApiService if this service had access.
      return updatedCustomer; 
    }
    const url = replaceUrlParams(API_ENDPOINTS.customers.update, { id: customerId }); // Assuming a general update endpoint handles status
    const response = await apiClient.put(url, { status: 'suspended', suspensionReason: reason });
    return response.data;
  }
  
  // Réactiver un client
  async reactivateCustomer(customerId: string): Promise<Customer> {
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const customerDetails = await customersApi.getById(customerId);
      const user = authService.getStoredUser(); // Changed to getStoredUser()
      const updatedCustomer: Customer = {
        ...customerDetails.customer,
        status: 'active',
        reactivatedAt: new Date().toISOString(),
        reactivatedBy: user?.id || 'mock-admin',
        suspensionReason: undefined, // Clear suspension reason
        suspendedAt: undefined, // Clear suspension date
        suspendedBy: undefined // Clear suspended by
      };
      return updatedCustomer;
    }
    const url = replaceUrlParams(API_ENDPOINTS.customers.update, { id: customerId }); // Assuming a general update endpoint handles status
    const response = await apiClient.put(url, { status: 'active' });
    return response.data;
  }
  
  // Obtenir les activités d'un client
  async getCustomerActivities(customerId: string, limit: number = 10): Promise<CustomerActivity[]> {
    // This method might need to be moved or adapted if activities are part of CustomerDetailsResponse from customersApi.getById
    // For now, assuming a separate endpoint or mock generation here.
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const user = authService.getStoredUser(); // Changed to getStoredUser()
      const mockActivities: CustomerActivity[] = [
        {
          id: '1',
          customerId,
          type: 'auth',
          action: 'login',
          performedBy: user?.id || 'user-123',
          performedByName: user?.name || 'John Doe', // Changed to user.name from user.firstName
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: { ip: '192.168.1.1', device: 'Desktop', browser: 'Chrome' }
        },
        {
          id: '2',
          customerId,
          type: 'profile_update',
          action: 'update_contact',
          performedBy: user?.id || 'user-123',
          performedByName: user?.name || 'John Doe', // Changed to user.name from user.firstName
          timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
          details: { updatedFields: ['phone', 'address'] }
        },
      ];
      return mockActivities.slice(0, limit);
    }
    
    const url = replaceUrlParams(API_ENDPOINTS.users.activities, { id: customerId }); // Assuming customer activities are fetched like user activities
    const response = await apiClient.get(url, { params: { limit } });
    return response.data.activities; // Assuming the API returns { activities: [] }
  }
  
  // Obtenir les statistiques des clients
  async getCustomerStatistics(): Promise<CustomerStatistics> {
    return customersApi.getStatistics();
  }

  // Get customer documents
  async getCustomerDocuments(customerId: string): Promise<CustomerDocument[]> {
    return customersApi.getDocuments(customerId);
  }

  // Get extended customer information
  async getExtendedCustomerInfo(customerId: string): Promise<ExtendedCustomer> {
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      const details = await customersApi.getById(customerId);
      const mockExtendedData: ExtendedCustomer = {
        ...details.customer,
        pmeData: details.customer.type === 'pme' ? {
          industry: 'Tech',
          size: 'small',
          employeesCount: 50,
          yearFounded: 2015,
          registrationNumber: 'RCCM12345',
          taxId: 'NIF54321',
        } : undefined,
        financialData: details.customer.type === 'financial' ? {
          institutionType: 'bank',
          regulatoryBody: 'Central Bank',
          branchesCount: 10,
        } : undefined,
        validationRequirements: {
          requiredDocuments: ['rccm', 'nif', 'id_nat'],
          completedSteps: ['Initial Submission'],
          nextStep: 'Document Verification'
        }
      };
      return mockExtendedData;
    }
    const url = replaceUrlParams(API_ENDPOINTS.customers.GET_CUSTOMER_EXTENDED_INFO, { customerId });
    const response = await apiClient.get(url);
    return response.data;
  }

  // Get customer validation process
  async getCustomerValidationProcess(customerId: string): Promise<ValidationProcess> {
     if (USE_MOCK_AUTH && isUsingDemoUser()) {
      const mockProcess: ValidationProcess = {
        id: `val-proc-${customerId}`,
        customerId,
        status: 'validation_in_progress',
        steps: [
          { id: 'step1', name: 'Initial Document Submission', description: 'Submit RCCM, NIF, ID Nat.', status: 'completed', order: 1, completedAt: new Date().toISOString() },
          { id: 'step2', name: 'Document Verification', description: 'Admin verifies submitted documents.', status: 'in_progress', order: 2 },
          { id: 'step3', name: 'Final Approval', description: 'Final validation by compliance team.', status: 'pending', order: 3 },
        ],
        currentStepIndex: 1,
        startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };
      return mockProcess;
    }
    const url = replaceUrlParams(API_ENDPOINTS.customers.GET_CUSTOMER_VALIDATION_PROCESS, { customerId });
    const response = await apiClient.get(url);
    return response.data;
  }

  // Initiate customer validation process
  async initiateCustomerValidation(customerId: string): Promise<ValidationProcess> {
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Return a newly initiated mock process
      const mockProcess: ValidationProcess = {
        id: `val-proc-new-${customerId}`,
        customerId,
        status: 'needs_validation',
        steps: [
          { id: 'step1', name: 'Initial Document Submission', description: 'Submit RCCM, NIF, ID Nat.', status: 'pending', order: 1 },
        ],
        currentStepIndex: 0,
        startedAt: new Date().toISOString(),
        lastUpdatedAt: new Date().toISOString(),
      };
      // Potentially update customer status via customersApi.update if this service had access to mockCustomers
      return mockProcess;
    }
    const url = replaceUrlParams(API_ENDPOINTS.customers.INITIATE_CUSTOMER_VALIDATION_PROCESS, { customerId });
    const response = await apiClient.post(url);
    return response.data;
  }

  // Update customer validation step
  async updateCustomerValidationStep(customerId: string, stepId: string, data: { status: 'completed' | 'rejected', notes?: string }): Promise<ValidationProcess> {
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // This would involve finding the mock process, updating the step, and returning it.
      // For simplicity, returning a static updated-like response.
      const existingProcess = await this.getCustomerValidationProcess(customerId); // Get current mock
      const stepIndex = existingProcess.steps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        existingProcess.steps[stepIndex].status = data.status;
        existingProcess.steps[stepIndex].notes = data.notes || existingProcess.steps[stepIndex].notes;
        existingProcess.steps[stepIndex].completedAt = data.status === 'completed' ? new Date().toISOString() : undefined;
        if (data.status === 'completed' && stepIndex < existingProcess.steps.length - 1) {
          existingProcess.currentStepIndex = stepIndex + 1;
          existingProcess.steps[existingProcess.currentStepIndex].status = 'in_progress';
        } else if (data.status === 'completed' && stepIndex === existingProcess.steps.length - 1) {
          existingProcess.status = 'active'; // Or some other completed status
          existingProcess.completedAt = new Date().toISOString();
        }
        existingProcess.lastUpdatedAt = new Date().toISOString();
      }
      return existingProcess;
    }
    const url = replaceUrlParams(API_ENDPOINTS.customers.UPDATE_CUSTOMER_VALIDATION_STEP, { customerId, stepId });
    const response = await apiClient.put(url, data);
    return response.data;
  }
  
  // Exporter les données client au format CSV
  async exportCustomersToCSV(filters: CustomerFilterParams): Promise<string> {
    // Obtenir les données des clients
    const { customers } = await this.getCustomers(filters);
    
    // Créer les en-têtes CSV
    const headers = [
      'ID', 'Nom', 'Type', 'Email', 'Téléphone', 'Adresse', 'Ville', 'Pays', 
      'Statut', 'Date de création', 'Type de compte', 'Tokens attribués'
    ].join(',');
    
    // Créer les lignes de données
    const rows = customers.map(customer => [
      customer.id,
      `"${customer.name.replace(/"/g, '""')}"`, // Échapper les guillemets doubles
      customer.type,
      customer.email,
      customer.phone,
      `"${customer.address?.replace(/"/g, '""') || ''}"`,
      customer.city,
      customer.country,
      customer.status,
      customer.createdAt,
      customer.accountType,
      customer.tokenAllocation
    ].join(','));
    
    // Combiner les en-têtes et les lignes
    return [headers, ...rows].join('\n');
  }
}

export const customerService = new CustomerService();
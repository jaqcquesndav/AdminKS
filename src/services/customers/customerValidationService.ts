import type {
  CustomerDocument,
  DocumentType,
  ValidationProcess,
  ValidationStep,
  ExtendedCustomer,
  CustomerStatus, // Added
  PmeSpecificData, // Added
  FinancialInstitutionSpecificData, // Added
  DocumentStatus // Added
} from '../../types/customer';
import apiClient from '../api/client';
import { API_ENDPOINTS, replaceUrlParams } from '../api/config';
import { apiAdapter } from '../api/adapter'; // Added

// Mock data generators
const mockValidationProcess = (customerId: string): ValidationProcess => ({
  id: `val-proc-${customerId}`,
  customerId,
  status: 'validation_in_progress' as CustomerStatus,
  steps: [
    { id: 'step1', name: 'Initial Document Submission', description: 'Submit RCCM, NIF, ID Nat.', status: 'completed', order: 1, completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
    { id: 'step2', name: 'Document Verification', description: 'Admin verifies submitted documents.', status: 'in_progress', order: 2 },
    { id: 'step3', name: 'Final Approval', description: 'Final validation by compliance team.', status: 'pending', order: 3 },
  ],
  currentStepIndex: 1,
  startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  lastUpdatedAt: new Date().toISOString(),
  notes: ['Process initiated, awaiting document verification.']
});

const mockExtendedCustomer = (customerId: string, type: 'pme' | 'financial' = 'pme'): ExtendedCustomer => ({
  id: customerId,
  name: type === 'pme' ? 'Mock PME SA' : 'Mock Bank Inc.',
  type: type,
  email: `${type}@mockcustomer.com`,
  phone: '+243000000000',
  address: '123 Mock Street',
  city: 'MockCity',
  country: 'RDC',
  status: 'validation_in_progress' as CustomerStatus,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  updatedAt: new Date().toISOString(),
  billingContactName: 'Mock Contact',
  billingContactEmail: `billing@${type}mock.com`,
  tokenAllocation: 5000,
  accountType: 'standard',
  documents: [
    { id: 'doc-mock-1', type: 'rccm', fileName: 'RCCM_Mock.pdf', fileUrl: 'mockurl/rccm.pdf', uploadedAt: new Date().toISOString(), uploadedBy: 'mock-user', status: 'pending' as DocumentStatus },
  ],
  pmeData: type === 'pme' ? {
    industry: 'MockTech',
    size: 'medium',
    employeesCount: 100,
  } as PmeSpecificData : undefined,
  financialData: type === 'financial' ? {
    institutionType: 'bank',
    regulatoryBody: 'Mock Central Bank',
  } as FinancialInstitutionSpecificData : undefined,
  validationRequirements: {
    requiredDocuments: type === 'pme' ? ['rccm', 'nif', 'patente', 'cnss'] : ['rccm', 'nif', 'patente', 'agrement'],
    completedSteps: ['document_submission'],
    nextStep: 'document_verification'
  }
});

const mockCustomerDocument = (documentId: string, type: DocumentType = 'rccm'): CustomerDocument => ({
  id: documentId,
  type: type,
  fileName: `Mock_${type.toUpperCase()}.pdf`,
  fileUrl: `mockurl/${type}.pdf`,
  uploadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  uploadedBy: 'mock-uploader',
  status: 'pending' as DocumentStatus,
});

class CustomerValidationService {
  /**
   * Obtient le processus de validation pour un client
   */
  async getValidationProcess(customerId: string): Promise<ValidationProcess> {
    const apiCall = async () => {
      const url = replaceUrlParams(API_ENDPOINTS.customers.GET_CUSTOMER_VALIDATION_PROCESS, { customerId });
      const response = await apiClient.get(url);
      return response.data;
    };
    const mockCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockValidationProcess(customerId);
    }
    return apiAdapter(apiCall, mockCall);
  }

  /**
   * Obtient les informations étendues d'un client
   */
  async getExtendedCustomerInfo(customerId: string): Promise<ExtendedCustomer> {
    const apiCall = async () => {
      const url = replaceUrlParams(API_ENDPOINTS.customers.GET_CUSTOMER_EXTENDED_INFO, { customerId });
      const response = await apiClient.get(url);
      return response.data;
    };
     const mockCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      // We need to know the customer type to generate relevant mock data.
      // For now, defaulting to 'pme'. In a real scenario, this might fetch basic customer info first.
      return mockExtendedCustomer(customerId, 'pme');
    }
    return apiAdapter(apiCall, mockCall);
  }

  /**
   * Initie un nouveau processus de validation pour un client
   */
  async initiateValidationProcess(customerId: string): Promise<ValidationProcess> {
    const apiCall = async () => {
      const url = replaceUrlParams(API_ENDPOINTS.customers.INITIATE_CUSTOMER_VALIDATION_PROCESS, { customerId });
      const response = await apiClient.post(url);
      return response.data;
    };
    const mockCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const process = mockValidationProcess(customerId);
      process.status = 'needs_validation';
      process.currentStepIndex = 0;
      process.steps.forEach(step => step.status = 'pending');
      process.steps[0].status = 'in_progress';
      return process;
    }
    return apiAdapter(apiCall, mockCall);
  }

  /**
   * Met à jour une étape du processus de validation
   */
  async updateValidationStep(
    customerId: string,
    stepId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'rejected',
    notes?: string
  ): Promise<ValidationProcess> {
    const apiCall = async () => {
      const url = replaceUrlParams(API_ENDPOINTS.customers.UPDATE_CUSTOMER_VALIDATION_STEP, { customerId, stepId });
      const response = await apiClient.patch(url, { status, notes });
      return response.data;
    };
    const mockCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const process = mockValidationProcess(customerId); // Get a base mock process
      const stepIndex = process.steps.findIndex(s => s.id === stepId);
      if (stepIndex !== -1) {
        process.steps[stepIndex].status = status;
        process.steps[stepIndex].notes = notes;
        if (status === 'completed') {
          process.steps[stepIndex].completedAt = new Date().toISOString();
          if (stepIndex < process.steps.length - 1) {
            process.currentStepIndex = stepIndex + 1;
            process.steps[process.currentStepIndex].status = 'in_progress';
          } else {
            process.status = 'active'; // Or other appropriate status like 'validation_completed'
            process.completedAt = new Date().toISOString();
          }
        }
        process.lastUpdatedAt = new Date().toISOString();
      }
      return process;
    }
    return apiAdapter(apiCall, mockCall);
  }

  /**
   * Valide un document spécifique
   */
  async validateDocument(
    customerId: string, // customerId is not used in the API endpoint for VALIDATE_CUSTOMER_DOCUMENT
    documentId: string,
    data: { status: DocumentStatus; comments?: string } // Changed to match customerService.ts and common patterns
  ): Promise<CustomerDocument> {
    const apiCall = async () => {
      // The endpoint API_ENDPOINTS.customers.VALIDATE_CUSTOMER_DOCUMENT was /customers/:customerId/documents/:documentId/validate
      // However, API_ENDPOINTS.DOCUMENT_STATUS is /documents/:documentId/status which seems more appropriate if not customer specific.
      // Assuming the former is correct as per current config.
      const url = replaceUrlParams(API_ENDPOINTS.customers.VALIDATE_CUSTOMER_DOCUMENT, { customerId, documentId });
      const response = await apiClient.post(url, data); // Changed to POST to match customerService, and payload
      return response.data;
    };
    const mockCall = async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const doc = mockCustomerDocument(documentId);
      doc.status = data.status;
      doc.reviewComments = data.comments;
      doc.reviewedAt = new Date().toISOString();
      doc.reviewedBy = 'mock-admin-reviewer';
      return doc;
    }
    return apiAdapter(apiCall, mockCall);
  }

  /**
   * Renvoie la liste des documents requis selon le type de client
   */
  getRequiredDocumentsByCustomerType(type: 'pme' | 'financial'): DocumentType[] {
    // Liste des documents communs à tous les types de clients
    const commonDocuments: DocumentType[] = [
      'rccm', 
      'nif', 
      'patente' 
    ];
    
    // Documents spécifiques selon le type de client
    if (type === 'pme') {
      return [
        ...commonDocuments,
        'cnss', 
        'inpp' 
      ];
    } else if (type === 'financial') {
      return [
        ...commonDocuments,
        'agrement', 
      ];
    }
    
    return commonDocuments;
  }

  /**
   * Obtient un modèle de processus de validation pour un nouveau client
   */
  getValidationProcessTemplate(type: 'pme' | 'financial'): ValidationStep[] {
    // Étapes communes à tous les types de clients
    const commonSteps: ValidationStep[] = [
      {
        id: 'document_submission',
        name: 'Soumission des documents',
        status: 'pending',
        order: 1,
        description: 'Le client doit soumettre tous les documents requis'
      },
      {
        id: 'document_verification',
        name: 'Vérification des documents',
        status: 'pending',
        order: 2,
        description: 'Vérification de l\'authenticité et de la validité des documents fournis'
      },
      {
        id: 'compliance_check',
        name: 'Vérification de conformité',
        status: 'pending',
        order: 3,
        description: 'Vérification de la conformité aux réglementations applicables'
      }
    ];
    
    // Étapes spécifiques selon le type de client
    if (type === 'financial') {
      return [
        ...commonSteps,
        {
          id: 'risk_assessment',
          name: 'Évaluation des risques',
          status: 'pending',
          order: 4,
          description: 'Évaluation des risques liés à l\'institution financière'
        },
        {
          id: 'regulatory_check',
          name: 'Vérification réglementaire',
          status: 'pending',
          order: 5,
          description: 'Vérification de la conformité aux réglementations financières spécifiques'
        },
        {
          id: 'final_approval',
          name: 'Approbation finale',
          status: 'pending',
          order: 6,
          description: 'Validation finale par le comité de conformité'
        }
      ];
    } else {
      // Pour les PME, processus plus simple
      return [
        ...commonSteps,
        {
          id: 'credit_check',
          name: 'Vérification de crédit',
          status: 'pending',
          order: 4,
          description: 'Évaluation de la solvabilité de l\'entreprise'
        },
        {
          id: 'final_approval',
          name: 'Approbation finale',
          status: 'pending',
          order: 5,
          description: 'Validation finale par le service client'
        }
      ];
    }
  }
}

export const customerValidationService = new CustomerValidationService();
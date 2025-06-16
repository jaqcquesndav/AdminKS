import type {
  CustomerDocument,
  ValidationProcess,
  ExtendedCustomer,
  DocumentApprovalData,
  ValidationStep, // Added for explicit step typing
  DocumentType // Added for explicit document type in placeholder
} from '../../types/customer';
import { useAdminApi } from '../api/adminApiService';

export const useCustomerValidationService = () => {
  const adminApi = useAdminApi(); 

  const getValidationProcess = async (customerId: string): Promise<ValidationProcess> => {
    console.warn("getValidationProcess: Backend endpoint not yet defined in adminApiService. Using placeholder. adminApi available for actual calls.", adminApi);
    // TODO: Replace with actual API call: const response = await adminApi.getCustomerValidationProcess(customerId);
    // return response.data;
    const placeholderStep: ValidationStep = {
      id: 'step1',
      name: 'Initial Document Submission',
      description: 'Submit required documents.', // description is required
      status: 'pending',
      order: 1, // order is optional
      requiredDocuments: ['id_nat' as DocumentType], // Corrected: array of DocumentType strings
    };
    return { 
      id: `val-proc-${customerId}`,
      customerId, 
      status: 'needs_validation', 
      steps: [placeholderStep], 
      currentStepIndex: 0, 
      startedAt: new Date().toISOString(), 
      lastUpdatedAt: new Date().toISOString(), 
      notes: [] 
    } as ValidationProcess;
  };

  const getExtendedCustomerInfo = async (customerId: string): Promise<ExtendedCustomer> => {
    console.warn("getExtendedCustomerInfo: Backend endpoint not yet defined in adminApiService. Using placeholder. adminApi available for actual calls.", adminApi);
    // TODO: Replace with actual API call: const response = await adminApi.getExtendedCustomerDetails(customerId);
    // return response.data;
    return { 
      id: customerId, 
      name: 'Placeholder Customer', 
      type: 'pme', 
      email:'placeholder@example.com', 
      phone:'+1234567890', 
      address:'123 Placeholder St', 
      city:'Placeholder City', 
      country:'PCY', 
      status:'pending', 
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString(), 
      documents: [],
      billingContactName: 'Placeholder Contact',
      billingContactEmail: 'billing@placeholder.com',
      tokenAllocation: 0,
      accountType: 'standard',
      pmeData: undefined, 
      financialData: undefined,
      validationRequirements: { requiredDocuments: ['nif'] as DocumentType[], completedSteps: [], nextStep: 'document_verification'}
    } as ExtendedCustomer;
  };

  const initiateValidationProcess = async (customerId: string): Promise<ValidationProcess> => {
    console.warn("initiateValidationProcess: Backend endpoint not yet defined in adminApiService. Using placeholder. adminApi available for actual calls.", adminApi);
    // TODO: Replace with actual API call: const response = await adminApi.initiateCustomerValidation(customerId);
    // return response.data;
    const placeholderStep: ValidationStep = {
      id: 'step1',
      name: 'Initial',
      description: 'Initial validation step', // description is required
      status: 'pending',
      order: 1, // order is optional
      requiredDocuments: [] // Corrected: array of DocumentType strings
    };
    return { 
      customerId, 
      steps: [placeholderStep], 
      status: 'needs_validation', 
      currentStepIndex: 0, 
      id:`val-proc-init-${customerId}`,
      startedAt:new Date().toISOString(), 
      lastUpdatedAt:new Date().toISOString(), 
      notes:[] 
    } as ValidationProcess;
  };

  const updateValidationStep = async (
    customerId: string,
    stepId: string,
    status: 'pending' | 'in_progress' | 'completed' | 'rejected',
    notes?: string
  ): Promise<ValidationProcess> => {
    console.warn("updateValidationStep: Backend endpoint not yet defined in adminApiService. Using placeholder. adminApi available for actual calls.", adminApi);
    // TODO: Replace with actual API call: const response = await adminApi.updateCustomerValidationStep(customerId, stepId, { status, notes });
    // return response.data;
    const process = await getValidationProcess(customerId); 
    const step = process.steps.find(s => s.id === stepId);
    if (step) {
      step.status = status;
      step.notes = notes;
      if (status === 'completed') step.completedAt = new Date().toISOString();
    }
    process.lastUpdatedAt = new Date().toISOString();
    return process;
  };

  const validateDocument = async (
    _customerId: string, 
    documentId: string,
    data: DocumentApprovalData
  ): Promise<CustomerDocument> => {
    console.warn("validateDocument: Backend endpoint for specific document validation (approve/reject) is missing or needs clarification in adminApiService. Using placeholder. adminApi available for actual calls.", adminApi);

    const placeholderDocumentType: DocumentType = 'contract'; // Use a valid DocumentType e.g. 'contract'

    if (data.status === 'approved') {
      console.error("validateDocument (approve): Backend endpoint for specific document approval is missing in adminApiService.");
      throw new Error("Backend endpoint for document approval missing.");
      // return { id: documentId, status: 'approved', reviewedAt: new Date().toISOString(), reviewedBy: 'admin', reviewComments: data.comments, type: placeholderDocumentType, fileName:'doc.pdf', fileUrl:'#', uploadedAt: new Date().toISOString(), uploadedBy:'user' } as CustomerDocument;
    } else if (data.status === 'rejected') {
      console.error("validateDocument (reject): Backend endpoint for specific document rejection is missing in adminApiService.");
      throw new Error("Backend endpoint for document rejection missing.");
      // return { id: documentId, status: 'rejected', reviewedAt: new Date().toISOString(), reviewedBy: 'admin', reviewComments: data.comments, type: placeholderDocumentType, fileName:'doc.pdf', fileUrl:'#', uploadedAt: new Date().toISOString(), uploadedBy:'user' } as CustomerDocument;
    }
    
    return { 
      id: documentId, 
      status: data.status, 
      type: placeholderDocumentType, 
      fileName:'placeholder.pdf', 
      fileUrl:'#', 
      uploadedAt: new Date().toISOString(), 
      uploadedBy:'system' 
    } as CustomerDocument;
  };
  
  return {
    getValidationProcess,
    getExtendedCustomerInfo,
    initiateValidationProcess,
    updateValidationStep,
    validateDocument,
  };
};

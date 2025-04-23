import type {
  Customer,
  CustomerDocument,
  DocumentType,
  ValidationProcess,
  ValidationStep,
  ExtendedCustomer
} from '../types/customer';
import { api } from './api';

class CustomerValidationService {
  /**
   * Obtient le processus de validation pour un client
   */
  async getValidationProcess(customerId: string): Promise<ValidationProcess> {
    try {
      const response = await api.get(`/customers/${customerId}/validation`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération du processus de validation:", error);
      throw new Error("Impossible de récupérer le processus de validation");
    }
  }

  /**
   * Obtient les informations étendues d'un client
   */
  async getExtendedCustomerInfo(customerId: string): Promise<ExtendedCustomer> {
    try {
      const response = await api.get(`/customers/${customerId}/extended`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des informations étendues du client:", error);
      throw new Error("Impossible de récupérer les informations étendues du client");
    }
  }

  /**
   * Initie un nouveau processus de validation pour un client
   */
  async initiateValidationProcess(customerId: string): Promise<ValidationProcess> {
    try {
      const response = await api.post(`/customers/${customerId}/validation/initiate`);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de l'initialisation du processus de validation:", error);
      throw new Error("Impossible d'initialiser le processus de validation");
    }
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
    try {
      const response = await api.patch(`/customers/${customerId}/validation/steps/${stepId}`, {
        status,
        notes
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'étape de validation:", error);
      throw new Error("Impossible de mettre à jour l'étape de validation");
    }
  }

  /**
   * Valide un document spécifique
   */
  async validateDocument(
    customerId: string,
    documentId: string,
    isApproved: boolean,
    note?: string
  ): Promise<CustomerDocument> {
    try {
      const response = await api.patch(`/customers/${customerId}/documents/${documentId}/validate`, {
        approved: isApproved,
        note
      });
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la validation du document:", error);
      throw new Error("Impossible de valider le document");
    }
  }

  /**
   * Renvoie la liste des documents requis selon le type de client
   */
  getRequiredDocumentsByCustomerType(type: 'pme' | 'financial'): DocumentType[] {
    // Liste des documents communs à tous les types de clients
    const commonDocuments: DocumentType[] = [
      'identity_proof',
      'company_registration',
      'address_proof'
    ];
    
    // Documents spécifiques selon le type de client
    if (type === 'pme') {
      return [
        ...commonDocuments,
        'tax_registration',
        'financial_statements'
      ];
    } else if (type === 'financial') {
      return [
        ...commonDocuments,
        'financial_license',
        'compliance_certificate',
        'audit_reports',
        'kyc_aml_policy',
        'ownership_structure'
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
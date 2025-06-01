import { useState, useEffect } from 'react';
import { customerValidationService } from '../services/customers/customerValidationService'; // Corrected path
import type { 
  DocumentType,
  ValidationProcess, 
  ExtendedCustomer,
  DocumentStatus // Added DocumentStatus for validateDocument
} from '../types/customer'; // Corrected path

/**
 * Hook personnalisé pour gérer le processus de validation des clients
 */
export function useCustomerValidation(customerId?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationProcess, setValidationProcess] = useState<ValidationProcess | null>(null);
  const [extendedCustomer, setExtendedCustomer] = useState<ExtendedCustomer | null>(null);
  
  // Charger le processus de validation pour un client spécifique
  const loadValidationProcess = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const process = await customerValidationService.getValidationProcess(id);
      setValidationProcess(process);
      
      // Charger également les informations étendues du client
      const customerInfo = await customerValidationService.getExtendedCustomerInfo(id);
      setExtendedCustomer(customerInfo);
    } catch (err) { // Replaced any with Error type or left as unknown
      setError((err instanceof Error ? err.message : String(err)) || 'Erreur lors du chargement du processus de validation');
      console.error('Erreur lors du chargement du processus de validation:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Initier un nouveau processus de validation
  const initiateValidation = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const process = await customerValidationService.initiateValidationProcess(id);
      setValidationProcess(process);
      return process;
    } catch (err) { // Replaced any with Error type or left as unknown
      setError((err instanceof Error ? err.message : String(err)) || 'Erreur lors de l\'initialisation du processus de validation');
      console.error('Erreur lors de l\'initialisation du processus de validation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Mettre à jour une étape du processus de validation
  const updateValidationStep = async (stepId: string, status: 'pending' | 'in_progress' | 'completed' | 'rejected', notes?: string) => {
    if (!customerId) {
      setError('ID client non spécifié');
      return null;
    }
    
    setLoading(true);
    
    try {
      const updatedProcess = await customerValidationService.updateValidationStep(
        customerId, 
        stepId, 
        status, 
        notes
      );
      setValidationProcess(updatedProcess);
      return updatedProcess;
    } catch (err) { // Replaced any with Error type or left as unknown
      setError((err instanceof Error ? err.message : String(err)) || 'Erreur lors de la mise à jour de l\'étape de validation');
      console.error('Erreur lors de la mise à jour de l\'étape de validation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Valider un document
  const validateDocument = async (documentId: string, isApproved: boolean, note?: string) => {
    if (!customerId) {
      setError('ID client non spécifié');
      return null;
    }
    
    setLoading(true);
    
    try {
      const documentStatus: DocumentStatus = isApproved ? 'approved' : 'rejected';
      const updatedDocument = await customerValidationService.validateDocument(
        customerId,
        documentId,
        { status: documentStatus, comments: note }
      );
      
      // Recharger le processus de validation pour refléter les changements
      await loadValidationProcess(customerId);
      
      return updatedDocument;
    } catch (err) { // Replaced any with Error type or left as unknown
      setError((err instanceof Error ? err.message : String(err)) || 'Erreur lors de la validation du document');
      console.error('Erreur lors de la validation du document:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Obtenir les documents requis pour un type de client
  const getRequiredDocuments = (type: 'pme' | 'financial'): DocumentType[] => {
    return customerValidationService.getRequiredDocumentsByCustomerType(type);
  };
  
  // Charger le processus de validation au montage si un ID client est fourni
  useEffect(() => {
    if (customerId) {
      loadValidationProcess(customerId);
    }
  }, [customerId]);
  
  return {
    loading,
    error,
    validationProcess,
    extendedCustomer,
    initiateValidation,
    updateValidationStep,
    validateDocument,
    getRequiredDocuments,
    refreshValidation: (id: string) => loadValidationProcess(id)
  };
}
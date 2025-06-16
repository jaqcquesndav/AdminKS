import { useState, useEffect, useCallback } from 'react'; // Added useCallback
// import { customerValidationService } from '../services/customers/customerValidationService'; // Old import
import { useCustomerValidationService } from '../services/customers/customerValidationService'; // New hook import
import type { 
  // DocumentType, // No longer needed here
  ValidationProcess, 
  ExtendedCustomer,
  // DocumentStatus // No longer needed here
  DocumentApprovalData // Keep for validateDocument if called directly from hook
} from '../types/customer'; 

/**
 * Hook personnalisé pour gérer le processus de validation des clients
 */
export function useCustomerValidation(customerId?: string) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validationProcess, setValidationProcess] = useState<ValidationProcess | null>(null);
  const [extendedCustomer, setExtendedCustomer] = useState<ExtendedCustomer | null>(null);
  
  const customerValidationService = useCustomerValidationService(); // Instantiate the hook

  // Charger le processus de validation pour un client spécifique
  const loadValidationProcess = useCallback(async (id: string) => { // useCallback
    setLoading(true);
    setError(null);
    
    try {
      const process = await customerValidationService.getValidationProcess(id);
      setValidationProcess(process);
      
      const customerInfo = await customerValidationService.getExtendedCustomerInfo(id);
      setExtendedCustomer(customerInfo);
    } catch (err) { 
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Erreur lors du chargement du processus de validation');
      console.error('Erreur lors du chargement du processus de validation:', err);
    } finally {
      setLoading(false);
    }
  }, [customerValidationService]); // Added dependency
  
  // Initier un nouveau processus de validation
  const initiateValidation = useCallback(async (id: string) => { // useCallback
    setLoading(true);
    setError(null);
    
    try {
      const process = await customerValidationService.initiateValidationProcess(id);
      setValidationProcess(process);
      return process;
    } catch (err) { 
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Erreur lors de l\\\'initialisation du processus de validation');
      console.error('Erreur lors de l\\\'initialisation du processus de validation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [customerValidationService]); // Added dependency
  
  // Mettre à jour une étape du processus de validation
  const updateValidationStep = useCallback(async (stepId: string, status: 'pending' | 'in_progress' | 'completed' | 'rejected', notes?: string) => { // useCallback
    if (!customerId) {
      setError('ID client non spécifié');
      console.warn('updateValidationStep called without customerId');
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
    } catch (err) { 
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Erreur lors de la mise à jour de l\\\'étape de validation');
      console.error('Erreur lors de la mise à jour de l\\\'étape de validation:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [customerId, customerValidationService]); // Added dependencies
  
  // Valider un document
  const validateDocument = useCallback(async (documentId: string, isApproved: boolean, note?: string) => { // useCallback
    if (!customerId) {
      setError('ID client non spécifié');
      console.warn('validateDocument called without customerId');
      return null;
    }
    
    setLoading(true);
    
    try {
      // Construct DocumentApprovalData based on isApproved and note
      const approvalData: DocumentApprovalData = {
        status: isApproved ? 'approved' : 'rejected',
        comments: note
      };
      const updatedDocument = await customerValidationService.validateDocument(
        customerId,
        documentId,
        approvalData 
      );
      
      // After document validation, reload the validation process to reflect changes
      // This assumes document validation might affect the overall process steps or customer documents list
      if (validationProcess) {
        await loadValidationProcess(customerId); 
      }
      
      return updatedDocument; // Or potentially return void or a success boolean
    } catch (err) { 
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || 'Erreur lors de la validation du document');
      console.error('Erreur lors de la validation du document:', err);
      throw err; // Re-throw to allow UI to handle if needed
    } finally {
      setLoading(false);
    }
  }, [customerId, customerValidationService, loadValidationProcess, validationProcess]); // Added dependencies
  
  // Charger automatiquement les données si customerId est fourni à l'initialisation
  useEffect(() => {
    if (customerId) {
      loadValidationProcess(customerId);
    }
  }, [customerId, loadValidationProcess]); // loadValidationProcess is now stable due to useCallback

  return {
    loading,
    error,
    validationProcess,
    extendedCustomer,
    loadValidationProcess,
    initiateValidation,
    updateValidationStep,
    validateDocument,
  };
}
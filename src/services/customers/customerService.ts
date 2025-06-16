import type { 
  Customer, 
  CustomerFormData, 
  CustomerDocument, 
  CustomerListResponse, 
  CustomerFilterParams,
  CustomerDetailsResponse,
  CustomerStatistics,
  CustomerActivity
} from '../../types/customer';
import { useAdminApi } from '../api/adminApiService';
import { useToastContext } from '../../contexts/ToastContext';

export const useCustomerService = () => {
  const adminApi = useAdminApi();
  const { showToast } = useToastContext();

  // Obtenir la liste des clients avec filtrage et pagination
  const getCustomers = async (filters: CustomerFilterParams): Promise<CustomerListResponse> => {
    try {
      const response = await adminApi.getCustomersList(filters);
      return response.data;
    } catch (error) {
      console.error("Error fetching customers:", error);
      showToast('error', 'Erreur lors du chargement des clients. Veuillez réessayer.');
      return { customers: [], totalCount: 0, page: 1, totalPages: 0 };
    }
  };
  
  // Obtenir un client par son ID
  const getCustomerById = async (id: string): Promise<CustomerDetailsResponse> => {
    try {
      const response = await adminApi.getCustomerDetails(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer by ID ${id}:`, error);
      showToast('error', `Erreur lors du chargement des informations du client. Veuillez réessayer.`);
      const placeholderCustomer: Customer = {
        id, 
        name: 'Error Loading Customer', 
        type: 'pme', 
        email:'', 
        phone:'', 
        address:'', 
        city:'', 
        country:'', 
        status:'inactive', 
        billingContactName:'', 
        billingContactEmail:'', 
        tokenAllocation:0, 
        accountType:'freemium'
      };
      return { 
        customer: placeholderCustomer, 
        statistics: {tokensUsed:0, lastActivity:'', activeSubscriptions:0, totalSpent:0}, 
        activities: [] 
      };
    }
  };
  
  // Créer un nouveau client
  const createCustomer = async (customerData: CustomerFormData): Promise<Customer> => {
    try {
      const response = await adminApi.createCustomerRecord(customerData);
      showToast('success', 'Client créé avec succès');
      return response.data;
    } catch (error) {
      console.error("Error creating customer:", error);
      showToast('error', 'Erreur lors de la création du client. Veuillez réessayer.');
      throw error;
    }
  };
    // Mettre à jour un client
  const updateCustomer = async (id: string, customerData: Partial<CustomerFormData>): Promise<Customer> => {
    try {
      const response = await adminApi.updateCustomerRecord(id, customerData);
      showToast('success', 'Client mis à jour avec succès');
      return response.data;
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      showToast('error', 'Erreur lors de la mise à jour du client. Veuillez réessayer.');
      throw error;
    }
  };
  
  // Télécharger un document pour un client
  const uploadDocument = async (
    customerId: string, 
    documentData: FormData
  ): Promise<CustomerDocument> => {
    try {
      const response = await adminApi.uploadCustomerDocument(customerId, documentData);
      showToast('success', 'Document téléchargé avec succès');
      return response.data;
    } catch (error) {
      console.error(`Error uploading document for customer ${customerId}:`, error);
      showToast('error', 'Erreur lors du téléchargement du document. Veuillez réessayer.');
      throw error;
    }
  };
  
  // Approuver un document
  const approveDocument = async (customerId: string, documentId: string, data: { comments?: string }): Promise<CustomerDocument> => {
    try {
      const response = await adminApi.approveCustomerDocument(customerId, documentId, data);
      showToast('success', 'Document approuvé avec succès');
      return response.data;
    } catch (error) {
      console.error(`Error approving document ${documentId} for customer ${customerId}:`, error);
      showToast('error', 'Erreur lors de l\'approbation du document. Veuillez réessayer.');
      throw error;
    }
  };
  
  // Rejeter un document
  const rejectDocument = async (customerId: string, documentId: string, reason: string): Promise<CustomerDocument> => {
    try {
      const response = await adminApi.rejectCustomerDocument(customerId, documentId, { reason });
      showToast('success', 'Document rejeté avec succès');
      return response.data;
    } catch (error) {
      console.error(`Error rejecting document ${documentId} for customer ${customerId}:`, error);
      showToast('error', 'Erreur lors du rejet du document. Veuillez réessayer.');
      throw error;
    }
  };
    // Valider un client (changer son statut en "active")
  const validateCustomer = async (customerId: string): Promise<Customer> => {
    try {
      await adminApi.approveCustomer(customerId);
      const updatedCustomerDetails = await adminApi.getCustomerDetails(customerId);
      showToast('success', 'Client validé avec succès');
      return updatedCustomerDetails.data.customer;
    } catch (error) {
      console.error(`Error validating customer ${customerId}:`, error);
      showToast('error', 'Erreur lors de la validation du client. Veuillez réessayer.');
      throw error;
    }
  };
    // Suspendre un client
  const suspendCustomer = async (customerId: string, reason: string): Promise<Customer> => {
    try {
      const response = await adminApi.suspendCustomer(customerId, reason);
      showToast('success', 'Client suspendu avec succès');
      return response.data;
    } catch (error) {
      console.error(`Error suspending customer ${customerId}:`, error);
      showToast('error', 'Erreur lors de la suspension du client. Veuillez réessayer.');
      throw error;
    }
  };
  
  // Réactiver un client
  const reactivateCustomer = async (customerId: string): Promise<Customer> => {
    try {
      const response = await adminApi.reactivateCustomer(customerId);
      showToast('success', 'Client réactivé avec succès');
      return response.data;
    } catch (error) {
      console.error(`Error reactivating customer ${customerId}:`, error);
      showToast('error', 'Erreur lors de la réactivation du client. Veuillez réessayer.');
      throw error;
    }
  };
    // Obtenir les activités d'un client
  const getCustomerActivities = async (customerId: string, limit: number = 10, page: number = 1): Promise<CustomerActivity[]> => {
    try {
      const response = await adminApi.getCustomerActivities(customerId, { limit, page });
      return response.data;
    } catch (error) {
      console.error(`Error fetching activities for customer ${customerId}:`, error);
      showToast('error', 'Erreur lors du chargement des activités du client. Veuillez réessayer.');
      return []; // Return empty array on error
    }
  };
  
  // Obtenir les statistiques des clients
  const getCustomerStatistics = async (): Promise<CustomerStatistics> => {
    try {
      const response = await adminApi.getCustomerStatistics();
      return response.data;
    } catch (error) {
      console.error("Error fetching customer statistics:", error);
      showToast('error', 'Erreur lors du chargement des statistiques. Veuillez réessayer.');
      return { total: 0, active: 0, inactive: 0, pending: 0, suspended: 0, byType: {pme:0, financial:0}, byAccountType:{freemium:0, standard:0, premium:0, enterprise:0} } as CustomerStatistics;
    }
  };

  // Get customer documents
  const getCustomerDocuments = async (customerId: string): Promise<CustomerDocument[]> => {
    try {
      const response = await adminApi.getCustomerDocuments(customerId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching documents for customer ${customerId}:`, error);
      showToast('error', 'Erreur lors du chargement des documents du client. Veuillez réessayer.');
      return []; // Return empty array on error
    }
  };  // Supprimer un client
  const deleteCustomer = async (customerId: string): Promise<void> => {
    try {
      // Utiliser la méthode appropriée pour supprimer un client
      // À remplacer par la méthode correcte dans l'API réelle
      await adminApi.deleteUser(customerId); // Méthode temporaire pour simuler la suppression
      showToast('success', 'Client supprimé avec succès');
    } catch (error) {
      console.error(`Error deleting customer ${customerId}:`, error);
      showToast('error', 'Erreur lors de la suppression du client. Veuillez réessayer.');
      throw error;
    }
  };

  return {
    getCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer,
    uploadDocument,
    approveDocument, 
    rejectDocument,  
    validateCustomer, 
    suspendCustomer,
    reactivateCustomer,
    getCustomerActivities,
    getCustomerStatistics,
    getCustomerDocuments,
    deleteCustomer,
  };
};
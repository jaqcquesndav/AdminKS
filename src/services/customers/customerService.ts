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

export const useCustomerService = () => {
  const adminApi = useAdminApi();

  // Obtenir la liste des clients avec filtrage et pagination
  const getCustomers = async (filters: CustomerFilterParams): Promise<CustomerListResponse> => {
    try {
      const response = await adminApi.getCustomersList(filters);
      // The actual API response from adminApi.getCustomersList is AxiosResponse<CustomerListResponse>.
      // We need to return response.data which should match CustomerListResponse.
      return response.data; 
    } catch (error) {
      console.error("Error fetching customers:", error);
      return { customers: [], totalCount: 0, page: 1, totalPages: 0 };
    }
  };
  
  // Obtenir un client par son ID
  const getCustomerById = async (id: string): Promise<CustomerDetailsResponse> => {
    try {
      const response = await adminApi.getCustomerDetails(id);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error fetching customer by ID ${id}:`, error);
      const placeholderCustomer: Customer = {id, name: 'Error Loading Customer', type: 'pme', email:'', phone:'', address:'', city:'', country:'', status:'inactive', billingContactName:'', billingContactEmail:'', tokenAllocation:0, accountType:'freemium'}; // Basic placeholder
      return { customer: placeholderCustomer, statistics: {tokensUsed:0, lastActivity:'', activeSubscriptions:0, totalSpent:0}, activities: [] };
    }
  };
  
  // Créer un nouveau client
  const createCustomer = async (customerData: CustomerFormData): Promise<Customer> => {
    try {
      const response = await adminApi.createCustomerRecord(customerData);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error("Error creating customer:", error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Mettre à jour un client
  const updateCustomer = async (id: string, customerData: Partial<CustomerFormData>): Promise<Customer> => {
    try {
      const response = await adminApi.updateCustomerRecord(id, customerData);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error updating customer ${id}:`, error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Télécharger un document pour un client
  const uploadDocument = async (
    customerId: string, 
    documentData: FormData
  ): Promise<CustomerDocument> => {
    try {
      const response = await adminApi.uploadCustomerDocument(customerId, documentData);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error uploading document for customer ${customerId}:`, error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Approuver un document
  const approveDocument = async (customerId: string, documentId: string, data: { comments?: string }): Promise<CustomerDocument> => {
    try {
      const response = await adminApi.approveCustomerDocument(customerId, documentId, data);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error approving document ${documentId} for customer ${customerId}:`, error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Rejeter un document
  const rejectDocument = async (customerId: string, documentId: string, reason: string): Promise<CustomerDocument> => {
    try {
      const response = await adminApi.rejectCustomerDocument(customerId, documentId, { reason });
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error rejecting document ${documentId} for customer ${customerId}:`, error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Valider un client (changer son statut en "active")
  const validateCustomer = async (customerId: string): Promise<Customer> => {
    try {
      await adminApi.approveCustomer(customerId); // Returns void, so no .data extraction needed for this call itself
      const updatedCustomerDetails = await adminApi.getCustomerDetails(customerId); // Fetch updated details
      return updatedCustomerDetails.data.customer; // Extract data from AxiosResponse for the getCustomerDetails call
    } catch (error) {
      console.error(`Error validating customer ${customerId}:`, error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Suspendre un client
  const suspendCustomer = async (customerId: string, reason: string): Promise<Customer> => {
    try {
      const response = await adminApi.suspendCustomer(customerId, reason);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error suspending customer ${customerId}:`, error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Réactiver un client
  const reactivateCustomer = async (customerId: string): Promise<Customer> => {
    try {
      const response = await adminApi.reactivateCustomer(customerId);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error reactivating customer ${customerId}:`, error);
      throw error; // Rethrow or handle as appropriate
    }
  };
  
  // Obtenir les activités d'un client
  const getCustomerActivities = async (customerId: string, limit: number = 10, page: number = 1): Promise<CustomerActivity[]> => {
    try {
      const response = await adminApi.getCustomerActivities(customerId, { limit, page });
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error fetching activities for customer ${customerId}:`, error);
      return []; // Return empty array on error or rethrow
    }
  };
  
  // Obtenir les statistiques des clients
  const getCustomerStatistics = async (): Promise<CustomerStatistics> => {
    try {
      const response = await adminApi.getCustomerStatistics();
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error("Error fetching customer statistics:", error);
      return { total: 0, active: 0, inactive: 0, pending: 0, suspended: 0, byType: {pme:0, financial:0}, byAccountType:{freemium:0, standard:0, premium:0, enterprise:0} } as CustomerStatistics;
    }
  };

  // Get customer documents
  const getCustomerDocuments = async (customerId: string): Promise<CustomerDocument[]> => {
    try {
      const response = await adminApi.getCustomerDocuments(customerId);
      return response.data; // Extract data from AxiosResponse
    } catch (error) {
      console.error(`Error fetching documents for customer ${customerId}:`, error);
      return []; // Return empty array on error or rethrow
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
  };
};
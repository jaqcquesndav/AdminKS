import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useToastStore } from '../components/common/ToastContainer';
import { useCustomerService } from '../services/customers/customerService';
import type { 
  Customer, 
  CustomerFormData, 
  CustomerFilterParams,
  CustomerDetailsResponse,
  CustomerStatistics,
  CustomerActivity,
  CustomerDocument
} from '../types/customer';

export function useCustomers() {
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetailsResponse | null>(null);
  const [customerActivities, setCustomerActivities] = useState<CustomerActivity[]>([]);
  const [customerDocuments, setCustomerDocuments] = useState<CustomerDocument[]>([]);
  const [statistics, setStatistics] = useState<CustomerStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isActivitiesLoading, setIsActivitiesLoading] = useState(false);
  const [isDocumentsLoading, setIsDocumentsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [pagination, setPagination] = useState({ totalCount: 0, page: 1, totalPages: 0 });

  const addToast = useToastStore(state => state.addToast);
  const customerService = useCustomerService();

  const loadCustomers = useCallback(async (filters: CustomerFilterParams) => {
    setIsLoading(true);
    try {
      const response = await customerService.getCustomers(filters);
      setCustomers(response.customers);
      setPagination({ totalCount: response.totalCount, page: response.page, totalPages: response.totalPages });
    } catch (err) {
      console.error('Failed to load customers:', err);
      addToast('error', t('customers.errors.loadFailed'));
      setCustomers([]);
      setPagination({ totalCount: 0, page: 1, totalPages: 0 });
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService]);

  const getCustomerDetails = useCallback(async (id: string) => {
    setIsDetailsLoading(true);
    try {
      const data = await customerService.getCustomerById(id);
      setCustomerDetails(data);
      return data;
    } catch (err) {
      console.error(`Failed to load customer details for ${id}:`, err);
      addToast('error', t('customers.errors.loadDetailsFailed'));
      setCustomerDetails(null);
      return null;
    } finally {
      setIsDetailsLoading(false);
    }
  }, [addToast, t, customerService]);

  const createCustomer = useCallback(async (data: CustomerFormData) => {
    setIsLoading(true); // Or a specific creating state
    try {
      const newCustomer = await customerService.createCustomer(data);
      addToast('success', t('customers.notifications.created'));
      // Optionally, refresh list or add to local state
      // For simplicity, let's assume a list refresh will be triggered separately if needed
      return newCustomer;
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : t('customers.errors.createFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService]);

  const updateCustomer = useCallback(async (id: string, data: Partial<CustomerFormData>) => {
    setIsLoading(true); // Or a specific updating state
    try {
      const updatedCustomer = await customerService.updateCustomer(id, data);
      addToast('success', t('customers.notifications.updated'));
      // Update local state
      setCustomers(prev => prev.map(cust => cust.id === id ? { ...cust, ...updatedCustomer } : cust));
      if (customerDetails && customerDetails.customer.id === id) {
        setCustomerDetails(prev => prev ? { ...prev, customer: { ...prev.customer, ...updatedCustomer } } : null);
      }
      return updatedCustomer;
    } catch (err) {
      addToast('error', t('customers.errors.updateFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]);

  const uploadCustomerDocument = useCallback(async (customerId: string, documentData: FormData) => {
    // Consider a specific loading state for document uploads
    setIsLoading(true); 
    try {
      const newDocument = await customerService.uploadDocument(customerId, documentData);
      addToast('success', t('customers.notifications.documentUploaded'));
      // Refresh documents for the customer or add to local state
      if (customerDetails && customerDetails.customer.id === customerId) {
        // Assuming getCustomerDocuments is available and fetches/updates customerDocuments state
        // loadCustomerDocuments(customerId); 
      }
      return newDocument;
    } catch (err) {
      addToast('error', t('customers.errors.documentUploadFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]); // Add loadCustomerDocuments if used

  const approveCustomerDocument = useCallback(async (customerId: string, documentId: string, data: { comments?: string }) => {
    setIsLoading(true);
    try {
      const updatedDocument = await customerService.approveDocument(customerId, documentId, data);
      addToast('success', t('customers.notifications.documentApproved'));
      // Refresh documents or update specific document in local state
      setCustomerDocuments(prev => prev.map(doc => doc.id === documentId ? updatedDocument : doc));
      if (customerDetails && customerDetails.customer.id === customerId) {
        // Potentially update documents within customerDetails if they are stored there
      }
      return updatedDocument;
    } catch (err) {
      addToast('error', t('customers.errors.documentApproveFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]);

  const rejectCustomerDocument = useCallback(async (customerId: string, documentId: string, reason: string) => {
    setIsLoading(true);
    try {
      const updatedDocument = await customerService.rejectDocument(customerId, documentId, reason);
      addToast('success', t('customers.notifications.documentRejected'));
      // Refresh documents or update specific document in local state
      setCustomerDocuments(prev => prev.map(doc => doc.id === documentId ? updatedDocument : doc));
      if (customerDetails && customerDetails.customer.id === customerId) {
        // Potentially update documents within customerDetails
      }
      return updatedDocument;
    } catch (err) {
      addToast('error', t('customers.errors.documentRejectFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]);
  
  const validateCustomer = useCallback(async (customerId: string) => {
    setIsLoading(true);
    try {
      const updatedCustomer = await customerService.validateCustomer(customerId);
      addToast('success', t('customers.notifications.validated'));
      setCustomers(prev => prev.map(cust => cust.id === customerId ? { ...cust, ...updatedCustomer, status: 'active' } : cust));
      if (customerDetails && customerDetails.customer.id === customerId) {
        setCustomerDetails(prev => prev ? { ...prev, customer: { ...prev.customer, ...updatedCustomer, status: 'active' } } : null);
      }
      return updatedCustomer;
    } catch (err) {
      addToast('error', t('customers.errors.validateFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]);

  const suspendCustomer = useCallback(async (customerId: string, reason: string) => {
    setIsLoading(true);
    try {
      const updatedCustomer = await customerService.suspendCustomer(customerId, reason);
      addToast('success', t('customers.notifications.suspended'));
      setCustomers(prev => prev.map(cust => cust.id === customerId ? { ...cust, ...updatedCustomer } : cust));
      if (customerDetails && customerDetails.customer.id === customerId) {
        setCustomerDetails(prev => prev ? { ...prev, customer: { ...prev.customer, ...updatedCustomer } } : null);
      }
      return updatedCustomer;
    } catch (err) {
      addToast('error', t('customers.errors.suspendFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]);

  const reactivateCustomer = useCallback(async (customerId: string) => {
    setIsLoading(true);
    try {
      const updatedCustomer = await customerService.reactivateCustomer(customerId);
      addToast('success', t('customers.notifications.reactivated'));
      setCustomers(prev => prev.map(cust => cust.id === customerId ? { ...cust, ...updatedCustomer } : cust));
      if (customerDetails && customerDetails.customer.id === customerId) {
        setCustomerDetails(prev => prev ? { ...prev, customer: { ...prev.customer, ...updatedCustomer } } : null);
      }
      return updatedCustomer;
    } catch (err) {
      addToast('error', t('customers.errors.reactivateFailed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]);

  const loadCustomerActivities = useCallback(async (customerId: string, limit: number = 10, page: number = 1) => {
    setIsActivitiesLoading(true);
    try {
      const activities = await customerService.getCustomerActivities(customerId, limit, page);
      setCustomerActivities(activities);
      // Potentially handle pagination for activities if needed
    } catch (err) {
      console.error(`Failed to load activities for customer ${customerId}:`, err);
      addToast('error', t('customers.errors.loadActivitiesFailed'));
      setCustomerActivities([]);
    } finally {
      setIsActivitiesLoading(false);
    }
  }, [addToast, t, customerService]);

  const loadCustomerStatistics = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const stats = await customerService.getCustomerStatistics();
      setStatistics(stats);
    } catch (err) {
      console.error('Failed to load customer statistics:', err);
      addToast('error', t('customers.errors.loadStatsFailed'));
      setStatistics(null);
    } finally {
      setIsStatsLoading(false);
    }
  }, [addToast, t, customerService]);

  const loadCustomerDocuments = useCallback(async (customerId: string) => {
    setIsDocumentsLoading(true);
    try {
      const documents = await customerService.getCustomerDocuments(customerId);
      setCustomerDocuments(documents);
      // If customerDetails also stores documents, update it here or ensure consistency
      if (customerDetails && customerDetails.customer.id === customerId) {
        // This assumes customerDetails might have its own copy or view of documents.
        // For simplicity, we're managing a separate customerDocuments state here.
        // Depending on UI needs, you might integrate this more closely with customerDetails.
      }
    } catch (err) {
      console.error(`Failed to load documents for customer ${customerId}:`, err);
      addToast('error', t('customers.errors.loadDocumentsFailed'));
      setCustomerDocuments([]);
    } finally {
      setIsDocumentsLoading(false);
    }
  }, [addToast, t, customerService, customerDetails]);


  return {
    customers,
    customerDetails,
    customerActivities,
    customerDocuments,
    statistics,
    isLoading,
    isDetailsLoading,
    isActivitiesLoading,
    isDocumentsLoading,
    isStatsLoading,
    pagination,
    loadCustomers,
    getCustomerDetails,
    createCustomer,
    updateCustomer,
    uploadCustomerDocument,
    approveCustomerDocument,
    rejectCustomerDocument,
    validateCustomer,
    suspendCustomer,
    reactivateCustomer,
    loadCustomerActivities,
    loadCustomerStatistics,
    loadCustomerDocuments,
  };
}

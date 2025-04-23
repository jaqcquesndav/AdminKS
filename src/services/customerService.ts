import type { 
  Customer, 
  CustomerFormData, 
  CustomerDocument, 
  CustomerListResponse, 
  CustomerFilterParams,
  CustomerDetailsResponse,
  DocumentApprovalData,
  CustomerStatistics,
  CustomerActivity
} from '../types/customer';
import customersApi from './api/customers';
import { USE_MOCK_AUTH, isDemoEmail } from '../utils/mockAuth';
import { authService } from './authService';
import { isUsingDemoUser } from './api/client';

class CustomerService {
  
  // Obtenir la liste des clients avec filtrage et pagination
  async getCustomers(filters: CustomerFilterParams): Promise<CustomerListResponse> {
    // Utiliser directement l'API des clients qui gère déjà les comptes de démo
    return customersApi.getAll(filters);
  }
  
  // Obtenir un client par son ID
  async getCustomerById(id: string): Promise<CustomerDetailsResponse> {
    // Utiliser directement l'API des clients qui gère déjà les comptes de démo
    return customersApi.getById(id);
  }
  
  // Créer un nouveau client
  async createCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Customer> {
    // Utiliser directement l'API des clients qui gère déjà les comptes de démo
    return customersApi.create(customer as CustomerFormData);
  }
  
  // Mettre à jour un client
  async updateCustomer(id: string, customerData: Partial<Customer>): Promise<Customer> {
    // Utiliser directement l'API des clients qui gère déjà les comptes de démo
    return customersApi.update(id, customerData as Partial<CustomerFormData>);
  }
  
  // Télécharger un document pour un client
  async uploadDocument(
    customerId: string, 
    document: Omit<CustomerDocument, 'id' | 'uploadedAt' | 'uploadedBy' | 'status'>
  ): Promise<CustomerDocument> {
    // Vérifier si nous utilisons un compte de démo
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Simuler le téléchargement d'un document
      await new Promise(resolve => setTimeout(resolve, 800)); // Simuler un délai réseau
      
      const mockDocument: CustomerDocument = {
        ...document,
        id: `doc-${Date.now()}`,
        uploadedAt: new Date().toISOString(),
        uploadedBy: authService.getStoredUser()?.id || 'unknown',
        status: 'pending',
      };
      
      return mockDocument;
    }
    
    // En production, utiliser l'API réelle
    // À implémenter quand l'API sera disponible
    const url = `/api/v1/customers/${customerId}/documents`;
    
    // Créer un FormData pour l'upload
    const formData = new FormData();
    if (document.file) {
      formData.append('file', document.file);
    } else {
      formData.append('fileUrl', document.fileUrl || '');
    }
    formData.append('type', document.type);
    formData.append('fileName', document.fileName);
    
    // Effectuer la requête
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Failed to upload document');
    }
    
    return response.json();
  }
  
  // Approuver un document
  async approveDocument(customerId: string, documentId: string, data: DocumentApprovalData): Promise<CustomerDocument> {
    // Vérifier si nous utilisons un compte de démo
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Simuler l'approbation d'un document
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: documentId,
        type: 'contract',
        fileName: 'approved_document.pdf',
        fileUrl: 'https://example.com/documents/approved.pdf',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'user-123',
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        reviewedBy: authService.getStoredUser()?.id || 'unknown',
        reviewComments: data.comments
      };
    }
    
    // En production, utiliser l'API réelle
    const url = `/api/v1/customers/${customerId}/documents/${documentId}/approve`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Failed to approve document');
    }
    
    return response.json();
  }
  
  // Rejeter un document
  async rejectDocument(customerId: string, documentId: string, reason: string): Promise<CustomerDocument> {
    // Vérifier si nous utilisons un compte de démo
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Simuler le rejet d'un document
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        id: documentId,
        type: 'contract',
        fileName: 'rejected_document.pdf',
        fileUrl: 'https://example.com/documents/rejected.pdf',
        uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        uploadedBy: 'user-123',
        status: 'rejected',
        reviewedAt: new Date().toISOString(),
        reviewedBy: authService.getStoredUser()?.id || 'unknown',
        reviewComments: reason
      };
    }
    
    // En production, utiliser l'API réelle
    const url = `/api/v1/customers/${customerId}/documents/${documentId}/reject`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify({ reason })
    });
    
    if (!response.ok) {
      throw new Error('Failed to reject document');
    }
    
    return response.json();
  }
  
  // Valider un client (changer son statut en "active")
  async validateCustomer(customerId: string): Promise<Customer> {
    // Vérifier si nous utilisons un compte de démo
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Simuler la validation d'un client
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const customer = (await customersApi.getById(customerId)).customer;
      
      return {
        ...customer,
        status: 'active',
        validatedAt: new Date().toISOString(),
        validatedBy: authService.getStoredUser()?.id || 'unknown'
      };
    }
    
    // En production, utiliser l'API réelle
    const url = `/api/v1/customers/${customerId}/validate`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to validate customer');
    }
    
    return response.json();
  }
  
  // Suspendre un client
  async suspendCustomer(customerId: string, reason: string): Promise<Customer> {
    // Vérifier si nous utilisons un compte de démo
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Simuler la suspension d'un client
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const customer = (await customersApi.getById(customerId)).customer;
      
      return {
        ...customer,
        status: 'suspended',
        suspendedAt: new Date().toISOString(),
        suspendedBy: authService.getStoredUser()?.id || 'unknown',
        suspensionReason: reason
      };
    }
    
    // En production, utiliser l'API réelle
    const url = `/api/v1/customers/${customerId}/suspend`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      },
      body: JSON.stringify({ reason })
    });
    
    if (!response.ok) {
      throw new Error('Failed to suspend customer');
    }
    
    return response.json();
  }
  
  // Réactiver un client
  async reactivateCustomer(customerId: string): Promise<Customer> {
    // Vérifier si nous utilisons un compte de démo
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Simuler la réactivation d'un client
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const customer = (await customersApi.getById(customerId)).customer;
      
      return {
        ...customer,
        status: 'active',
        reactivatedAt: new Date().toISOString(),
        reactivatedBy: authService.getStoredUser()?.id || 'unknown'
      };
    }
    
    // En production, utiliser l'API réelle
    const url = `/api/v1/customers/${customerId}/reactivate`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to reactivate customer');
    }
    
    return response.json();
  }
  
  // Obtenir les activités d'un client
  async getCustomerActivities(customerId: string, limit: number = 10): Promise<CustomerActivity[]> {
    // Vérifier si nous utilisons un compte de démo
    if (USE_MOCK_AUTH && isUsingDemoUser()) {
      // Simuler l'obtention des activités d'un client
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const mockActivities: CustomerActivity[] = [
        {
          id: '1',
          customerId,
          type: 'auth',
          action: 'login',
          performedBy: 'user-123',
          performedByName: 'John Doe',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          details: { ip: '192.168.1.1', device: 'Desktop', browser: 'Chrome' }
        },
        {
          id: '2',
          customerId,
          type: 'subscription',
          action: 'update',
          performedBy: 'user-456',
          performedByName: 'Jane Smith',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          details: { plan: 'premium', previousPlan: 'standard' }
        },
        {
          id: '3',
          customerId,
          type: 'token',
          action: 'purchase',
          performedBy: 'user-123',
          performedByName: 'John Doe',
          timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          details: { amount: 500, total: 50 }
        },
      ];
      
      return mockActivities.slice(0, limit);
    }
    
    // En production, utiliser l'API réelle
    const url = `/api/v1/customers/${customerId}/activities?limit=${limit}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authService.getToken()}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch customer activities');
    }
    
    return response.json();
  }
  
  // Obtenir les statistiques des clients
  async getCustomerStatistics(): Promise<CustomerStatistics> {
    // Utiliser l'API des clients qui gère déjà les comptes de démo
    return customersApi.getStatistics();
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
import { apiAdapter } from '../api/adapter';
import { Customer, CustomerFilterParams } from '../../types/customer';

interface PendingCustomer extends Omit<Customer, 'status'> {
  status: 'pending_verification' | 'pending_approval' | 'pending_info' | 'pending_payment';
  notes?: string;
  contactName?: string;
  contactEmail?: string;
}

/**
 * Service API pour les clients en attente
 */
export const pendingCustomersApiService = {
  /**
   * Récupérer la liste des clients en attente
   */
  getPendingCustomers: async (params?: CustomerFilterParams): Promise<PendingCustomer[]> => {
    const apiCall = async () => {
      const url = new URL(`${process.env.REACT_APP_API_URL}/customers/pending`);
      
      // Ajouter les paramètres à l'URL si présents
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, String(value));
          }
        });
      }
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return await response.json();
    };
    
    // Données mockées pour les tests
    const mockPendingCustomers: PendingCustomer[] = [
      {
        id: 'pend-1',
        name: 'TechStart SAS',
        email: 'contact@techstart.fr',
        phone: '+33123456789',
        type: 'pme',
        contactName: 'Sophie Martin',
        contactEmail: 'sophie@techstart.fr',
        status: 'pending_verification',
        createdAt: '2025-04-15',
        updatedAt: '2025-04-15',
        billingContactName: 'Sophie Martin',
        billingContactEmail: 'sophie@techstart.fr',
        address: '15 Rue de l\'Innovation',
        city: 'Paris',
        country: 'France',
        accountType: 'standard',
        tokenAllocation: 0
      },
      {
        id: 'pend-2',
        name: 'Crédit Maritime',
        email: 'integration@credit-maritime.fr',
        type: 'financial',
        contactName: 'Jean Dubois',
        contactEmail: 'j.dubois@credit-maritime.fr',
        status: 'pending_approval',
        createdAt: '2025-04-18',
        updatedAt: '2025-04-18',
        notes: 'Vérification d\'identité nécessaire',
        billingContactName: 'Jean Dubois',
        billingContactEmail: 'j.dubois@credit-maritime.fr',
        address: '24 Avenue de la Mer',
        city: 'Brest',
        country: 'France',
        accountType: 'premium',
        tokenAllocation: 0,
        phone: '+33289012345'
      },
      {
        id: 'pend-3',
        name: 'InnoVert',
        email: 'contact@innovert.com',
        phone: '+33789012345',
        type: 'pme',
        status: 'pending_info',
        createdAt: '2025-04-19',
        updatedAt: '2025-04-19',
        notes: 'Doit fournir un KBIS',
        billingContactName: 'Paul Martin',
        billingContactEmail: 'p.martin@innovert.com',
        address: '8 Rue des Innovateurs',
        city: 'Lyon',
        country: 'France',
        accountType: 'standard',
        tokenAllocation: 0
      },
      {
        id: 'pend-4',
        name: 'MicroFinance SA',
        email: 'operations@microfinance.fr',
        type: 'financial',
        contactName: 'Marie Lefevre',
        contactEmail: 'm.lefevre@microfinance.fr',
        status: 'pending_payment',
        createdAt: '2025-04-10',
        updatedAt: '2025-04-10',
        billingContactName: 'Marie Lefevre',
        billingContactEmail: 'm.lefevre@microfinance.fr',
        address: '37 Boulevard Finance',
        city: 'Paris',
        country: 'France',
        accountType: 'enterprise',
        tokenAllocation: 0,
        phone: '+33987654321'
      },
      {
        id: 'pend-5',
        name: 'EcoSolutions',
        email: 'contact@ecosolutions.fr',
        phone: '+33456789012',
        type: 'pme',
        contactName: 'Paul Richard',
        contactEmail: 'p.richard@ecosolutions.fr',
        status: 'pending_verification',
        createdAt: '2025-04-20',
        updatedAt: '2025-04-20',
        billingContactName: 'Paul Richard',
        billingContactEmail: 'p.richard@ecosolutions.fr',
        address: '12 Avenue Ecologique',
        city: 'Montpellier',
        country: 'France',
        accountType: 'freemium',
        tokenAllocation: 0
      }
    ];
    
    return apiAdapter(apiCall, mockPendingCustomers);
  },
  
  /**
   * Approuver un client en attente
   */
  approveCustomer: async (id: string): Promise<void> => {
    const apiCall = async () => {
      const url = `${process.env.REACT_APP_API_URL}/customers/${id}/approve`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return;
    };
    
    return apiAdapter(apiCall, () => {});
  },
  
  /**
   * Rejeter un client en attente
   */
  rejectCustomer: async (id: string, reason: string): Promise<void> => {
    const apiCall = async () => {
      const url = `${process.env.REACT_APP_API_URL}/customers/${id}/reject`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return;
    };
    
    return apiAdapter(apiCall, () => {});
  },
  
  /**
   * Demander plus d'informations à un client en attente
   */
  requestMoreInfo: async (id: string, message: string): Promise<void> => {
    const apiCall = async () => {
      const url = `${process.env.REACT_APP_API_URL}/customers/${id}/request-info`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ message })
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      return;
    };
    
    return apiAdapter(apiCall, () => {});
  }
};

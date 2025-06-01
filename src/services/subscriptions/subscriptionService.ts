import { 
  CustomerSubscription, 
  SubscriptionPlanDefinition, 
  TokenPackage,
  TokenTransaction,
  PaymentTransaction,
  PlanStatus,
  CustomerTypeSpecificMetadata
} from '../types/subscription';
import { CustomerType } from '../types/customer';
import { api } from './api';
import { ERP_GROUP, FINANCE_GROUP } from '../types/subscription';

// Interface pour les réponses d'API paginées
interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const subscriptionService = {
  // Récupérer les abonnements d'un client avec pagination et filtres
  async getSubscriptions(
    page: number = 1, 
    pageSize: number = 10, 
    filters: Record<string, any> = {}
  ): Promise<PaginatedResponse<CustomerSubscription>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...filters
      });
      
      const response = await api.get(`/subscriptions?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  // Récupérer un abonnement spécifique
  async getSubscription(subscriptionId: string): Promise<CustomerSubscription> {
    try {
      const response = await api.get(`/subscriptions/${subscriptionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Récupérer les plans disponibles, éventuellement filtrés par type de client
  async getAvailablePlans(
    customerType?: CustomerType
  ): Promise<PaginatedResponse<SubscriptionPlanDefinition>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (customerType) {
        queryParams.append('customerType', customerType);
      }
      
      const response = await api.get(`/subscription-plans?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Récupérer les packages de tokens disponibles
  async getTokenPackages(
    customerType?: CustomerType
  ): Promise<PaginatedResponse<TokenPackage>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (customerType) {
        queryParams.append('customerType', customerType);
      }
      
      const response = await api.get(`/token-packages?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token packages:', error);
      throw error;
    }
  },

  // Récupérer l'historique des transactions de tokens
  async getTokenTransactions(
    customerId?: string,
    subscriptionId?: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<TokenTransaction>> {
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString()
      });
      
      if (customerId) {
        queryParams.append('customerId', customerId);
      }
      
      if (subscriptionId) {
        queryParams.append('subscriptionId', subscriptionId);
      }
      
      const response = await api.get(`/token-transactions?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching token transactions:', error);
      throw error;
    }
  },

  // Créer un nouvel abonnement
  async createSubscription(
    subscriptionData: Partial<CustomerSubscription>
  ): Promise<CustomerSubscription> {
    try {
      const response = await api.post('/subscriptions', subscriptionData);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  },

  // Mettre à jour un abonnement existant
  async updateSubscription(
    subscriptionId: string,
    updateData: Partial<CustomerSubscription>
  ): Promise<CustomerSubscription> {
    try {
      const response = await api.patch(`/subscriptions/${subscriptionId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error updating subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Annuler un abonnement
  async cancelSubscription(
    subscriptionId: string,
    reason?: string,
    endImmediately: boolean = false
  ): Promise<CustomerSubscription> {
    try {
      const response = await api.post(`/subscriptions/${subscriptionId}/cancel`, {
        reason,
        endImmediately
      });
      return response.data;
    } catch (error) {
      console.error(`Error cancelling subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Ajouter des tokens à un abonnement
  async addTokensToSubscription(
    subscriptionId: string,
    tokenAmount: number,
    packageId?: string,
    price?: number,
    currency?: string,
    validUntil?: string
  ): Promise<{
    subscription: CustomerSubscription;
    transaction: TokenTransaction;
  }> {
    try {
      const response = await api.post(`/subscriptions/${subscriptionId}/add-tokens`, {
        tokenAmount,
        packageId,
        price,
        currency,
        validUntil
      });
      return response.data;
    } catch (error) {
      console.error(`Error adding tokens to subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Traiter un paiement pour un abonnement
  async processPayment(
    subscriptionId: string,
    paymentData: Partial<PaymentTransaction>
  ): Promise<PaymentTransaction> {
    try {
      const response = await api.post(`/subscriptions/${subscriptionId}/payments`, paymentData);
      return response.data;
    } catch (error) {
      console.error(`Error processing payment for subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Changer le plan d'abonnement
  async changePlan(
    subscriptionId: string,
    newPlanId: string,
    effectiveDate?: string,
    prorateFees: boolean = true
  ): Promise<CustomerSubscription> {
    try {
      const response = await api.post(`/subscriptions/${subscriptionId}/change-plan`, {
        newPlanId,
        effectiveDate,
        prorateFees
      });
      return response.data;
    } catch (error) {
      console.error(`Error changing plan for subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Calculer le prix pour un client spécifique en fonction de son type
  calculatePriceForCustomer(
    basePrice: number,
    customerType: CustomerType,
    applicationGroup: typeof ERP_GROUP | typeof FINANCE_GROUP,
    billingCycle: 'monthly' | 'yearly'
  ): {
    finalPrice: number;
    discountPercentage: number;
    originalPrice: number;
    currency: string;
  } {
    let originalPrice = billingCycle === 'monthly' 
      ? applicationGroup.monthlyPrice.usd 
      : applicationGroup.yearlyPrice.usd;
      
    // Prix de base avant réduction
    let finalPrice = originalPrice;
    let discountPercentage = 0;
    
    // Appliquer une réduction pour la souscription annuelle (si pas déjà incluse dans yearlyPrice)
    if (billingCycle === 'yearly') {
      // La réduction annuelle est généralement déjà incluse dans yearlyPrice
      // Donc cette partie est optionnelle selon votre modèle de prix
    }
    
    // Appliquer des prix spécifiques selon le type de client
    if (customerType === 'financial') {
      // Les institutions financières peuvent avoir un multiplicateur de prix
      finalPrice = finalPrice * 1.2; // Exemple: 20% plus cher pour les institutions financières
    } else if (customerType === 'pme') {
      // Les PME peuvent avoir une réduction
      discountPercentage = 10; // Exemple: 10% de réduction pour les PME
      finalPrice = finalPrice * (1 - discountPercentage / 100);
    }
    
    return {
      finalPrice,
      discountPercentage,
      originalPrice,
      currency: 'USD'
    };
  },
  
  // Obtenir les conditions spécifiques au type de client
  getCustomerTypeSpecificMetadata(
    customerType: CustomerType
  ): CustomerTypeSpecificMetadata {
    switch (customerType) {
      case 'financial':
        return {
          customerType: 'financial',
          pricingMultiplier: 1.2,
          minimumTokenPurchase: 5000,
          paymentTerms: "30 jours nets",
          discountPercentage: 0
        };
      case 'pme':
      default:
        return {
          customerType: 'pme',
          pricingMultiplier: 1.0,
          minimumTokenPurchase: 1000,
          paymentTerms: "Paiement immédiat",
          discountPercentage: 10
        };
    }
  }
};
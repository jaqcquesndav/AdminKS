import {
  CustomerSubscription,
  SubscriptionPlanDefinition,
  TokenPackage,
  TokenTransaction,
  PaymentTransaction,
  CustomerTypeSpecificMetadata,
  SubscriptionPlanId,
  PlanStatus,
} from '../../types/subscription';
import { CustomerType } from '../../types/customer';
import { subscriptionApi } from './subscriptionsApiService';

// Interface pour les réponses d'API paginées
interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface GetSubscriptionsFilters {
  status?: PlanStatus;
  startDate?: string;
  endDate?: string;
}

export const subscriptionService = {
  // Récupérer les abonnements d'un client avec pagination et filtres
  async getSubscriptions(
    page: number = 1,
    pageSize: number = 10,
    filters: GetSubscriptionsFilters = {}
  ): Promise<PaginatedResponse<CustomerSubscription>> {
    try {
      const apiParams: { page: number; limit: number; status?: PlanStatus; startDate?: string; endDate?: string } = {
        page,
        limit: pageSize,
      };
      if (filters.status) apiParams.status = filters.status;
      if (filters.startDate) apiParams.startDate = filters.startDate;
      if (filters.endDate) apiParams.endDate = filters.endDate;

      const response = await subscriptionApi.getAllSubscriptions(apiParams);
      return {
        data: response.subscriptions,
        totalCount: response.totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(response.totalCount / pageSize),
      };
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      throw error;
    }
  },

  // Récupérer un abonnement spécifique
  async getSubscription(subscriptionId: string): Promise<CustomerSubscription> {
    try {
      // FIXME: This is inefficient. It fetches all subscriptions and then filters.
      // Consider adding a specific getSubscriptionById method to subscriptionsApiService.ts.
      // For now, fetching a large limit to simulate getting all, then filtering.
      const response = await subscriptionApi.getAllSubscriptions({ limit: 10000 }); 
      const subscription = response.subscriptions.find(sub => sub.id === subscriptionId);
      if (!subscription) {
        throw new Error(`Subscription with ID ${subscriptionId} not found.`);
      }
      return subscription;
    } catch (error) {
      console.error(`Error fetching subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Récupérer les plans disponibles, éventuellement filtrés par type de client
  async getAvailablePlans(
    customerType?: CustomerType,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<SubscriptionPlanDefinition>> {
    try {
      const response = await subscriptionApi.getPlans(customerType);
      const plans = response.plans;
      // The mock API (getPlans) returns all plans; totalCount is derived here.
      const totalCount = plans.length;

      // Manual pagination for the mock/simple API response
      const paginatedData = plans.slice((page - 1) * pageSize, page * pageSize);

      return {
        data: paginatedData,
        totalCount: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  },

  // Récupérer les packages de tokens disponibles
  async getTokenPackages(
    customerType?: CustomerType, 
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedResponse<TokenPackage>> {
    try {
      if (customerType) {
        console.warn('[subscriptionService.getTokenPackages] customerType parameter is not currently used by the underlying subscriptionApi.getTokenPackages method.');
      }
      const response = await subscriptionApi.getTokenPackages();
      const packages = response.packages;
      // The mock API (getTokenPackages) returns all packages; totalCount is derived here.
      const totalCount = packages.length;

      const paginatedData = packages.slice((page - 1) * pageSize, page * pageSize);

      return {
        data: paginatedData,
        totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      };
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
      const apiParams: { customerId?: string; page: number; limit: number; startDate?: string; endDate?: string } = {
        page,
        limit: pageSize,
      };
      if (customerId) apiParams.customerId = customerId;
      // subscriptionId is not directly supported by subscriptionApi.getTokenTransactions.
      // It might be used for client-side filtering if needed, or logged.
      if (subscriptionId) {
        console.warn('[subscriptionService.getTokenTransactions] subscriptionId parameter is not directly used by the API. Transactions are fetched for the customerId if provided.');
      }
      
      const response = await subscriptionApi.getTokenTransactions(apiParams);
      return {
        data: response.transactions,
        totalCount: response.totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(response.totalCount / pageSize),
      };
    } catch (error) {
      console.error('Error fetching token transactions:', error);
      throw error;
    }
  },

  // Créer un nouvel abonnement
  async createSubscription(
    // Ensure all required fields for the API call are present in subscriptionData
    subscriptionData: { 
      customerId: string; 
      planId: SubscriptionPlanId; 
      paymentMethod: string; 
      autoRenew: boolean; 
      // Allow other CustomerSubscription fields, but they won't be sent to this specific API endpoint
      [key: string]: unknown; 
    }
  ): Promise<CustomerSubscription> {
    try {
      const { customerId, planId, paymentMethod, autoRenew } = subscriptionData;
      if (!customerId || !planId || !paymentMethod || autoRenew === undefined) {
        throw new Error('Missing required fields for creating subscription: customerId, planId, paymentMethod, autoRenew');
      }
      // Ensure planId is passed as string, as expected by subscriptionApi
      const apiSubscriptionData = { customerId, planId: planId as string, paymentMethod, autoRenew };
      const response = await subscriptionApi.createSubscription(apiSubscriptionData);
      return response; 
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
    console.error(`[subscriptionService.updateSubscription] Method not implemented in subscriptionsApiService.ts. Subscription ID: ${subscriptionId}`, updateData);
    throw new Error('updateSubscription is not supported by the current subscriptionsApiService.');
  },

  // Annuler un abonnement
  async cancelSubscription(
    subscriptionId: string,
    reason?: string,
    _endImmediately: boolean = false // Prefixed as unused in current API mapping
  ): Promise<CustomerSubscription> {
    try {
      if (_endImmediately) {
        console.warn(`[subscriptionService.cancelSubscription] _endImmediately parameter (value: ${_endImmediately}) is not directly supported by the underlying subscriptionApi.cancelSubscription method.`);
      }
      const response = await subscriptionApi.cancelSubscription(subscriptionId, reason);
      return response;
    } catch (error) {
      console.error(`Error cancelling subscription ${subscriptionId}:`, error);
      throw error;
    }
  },

  // Ajouter des tokens à un abonnement
  async addTokensToSubscription(
    subscriptionId: string,
    tokenAmount: number,
    packageId?: string, // Renamed from _packageId
    price?: number, // Renamed from _price
    currency?: string, // Renamed from _currency
    validUntil?: string // Renamed from _validUntil
  ): Promise<{
    subscription: CustomerSubscription;
    transaction: TokenTransaction;
  }> {
    console.error(`[subscriptionService.addTokensToSubscription] Method needs complete rework. Subscription ID: ${subscriptionId}, Amount: ${tokenAmount}, Package ID: ${packageId}, Price: ${price}, Currency: ${currency}, Valid Until: ${validUntil}.`);
    throw new Error('addTokensToSubscription requires further implementation to map to appropriate API calls like purchaseTokens or addTokensToCustomer, and to resolve customerId from subscriptionId.');
  },

  // Traiter un paiement pour un abonnement
  async processPayment(
    subscriptionId: string,
    paymentData: Partial<PaymentTransaction>
  ): Promise<PaymentTransaction> {
    console.error(`[subscriptionService.processPayment] Method not implemented in subscriptionsApiService.ts. Subscription ID: ${subscriptionId}`, paymentData);
    throw new Error('processPayment is not supported by current subscriptionsApiService. Consider using specific API methods like validateManualPayment or implementing payment gateway integrations elsewhere.');
  },

  // Changer le plan d'abonnement
  async changeSubscriptionPlan( // Name was previously updated from changePlan
    subscriptionId: string,
    newPlanId: SubscriptionPlanId,
    _effectiveDate?: string, 
    prorateFees: boolean = true // Renamed from _prorateFees
  ): Promise<CustomerSubscription> {
    console.error(`[subscriptionService.changeSubscriptionPlan] Method not implemented in subscriptionsApiService.ts. Subscription ID: ${subscriptionId}, New Plan: ${newPlanId}, Effective Date: ${_effectiveDate}, Prorate Fees: ${prorateFees}.`);
    throw new Error('changeSubscriptionPlan is not supported by the current subscriptionsApiService.');
  },

  // Calculer le prix pour un client spécifique en fonction de son type et du plan choisi
  calculatePriceForCustomer(
    plan: SubscriptionPlanDefinition,
    customerType: CustomerType
  ): {
    finalPrice: number;
    discountPercentage: number;
    originalPrice: number;
    currency: string;
  } {
    const currency = plan.localCurrency || 'USD';
    const originalPrice = plan.localCurrency && typeof plan.basePriceLocal === 'number'
                          ? plan.basePriceLocal 
                          : plan.basePriceUSD;
    let finalPrice = originalPrice;
    let discountPercentage = 0;

    if (customerType === 'financial') {
      // Example: 15% uplift for financial institutions on non-enterprise plans
      if (plan.category !== 'enterprise' && 
          plan.id !== 'FINANCIAL_INSTITUTION_ENTERPRISE_PLAN_MONTHLY' && 
          plan.id !== 'FINANCIAL_INSTITUTION_ENTERPRISE_PLAN_ANNUAL') { 
         finalPrice = finalPrice * 1.15; 
      }
    } else if (customerType === 'pme') {
      if (plan.id === 'PME_STARTER_PLAN') {
        discountPercentage = 10; // 10% discount on PME Starter
        finalPrice = finalPrice * (1 - discountPercentage / 100);
      }
      if (plan.id === 'PME_FREEMIUM_PLAN') {
        finalPrice = 0;
        discountPercentage = originalPrice > 0 ? 100 : 0; // 100% discount if original price was > 0
      }
    }

    return {
      finalPrice: parseFloat(finalPrice.toFixed(2)),
      discountPercentage,
      originalPrice: parseFloat(originalPrice.toFixed(2)), // Also format originalPrice
      currency,
    };
  },
  
  // Obtenir les conditions spécifiques au type de client
  getCustomerTypeSpecificMetadata(
    customerType: CustomerType
  ): CustomerTypeSpecificMetadata {
    // This is local logic and seems fine.
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
          discountPercentage: 10 // Default discount for PME, can be overridden by plan specifics
        };
    }
  }
};
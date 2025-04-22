import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Filter, Calendar, AlertCircle, RefreshCcw, CheckCircle, XCircle, MoreHorizontal, Building, CreditCard, PlusCircle } from 'lucide-react';
import { useToastContext } from '../../contexts/ToastContext';
import { formatCurrency } from '../../utils/currency';

// Types pour les abonnements
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  features: string[];
}

interface Subscription {
  id: string;
  customerId: string;
  customerName: string;
  planId: string;
  planName: string;
  status: 'active' | 'canceled' | 'pending' | 'trial' | 'expired';
  startDate: string;
  currentPeriodEnd: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod: string;
  metadata?: Record<string, any>;
}

export function SubscriptionsPage() {
  const { t } = useTranslation();
  const { showToast } = useToastContext();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);

  useEffect(() => {
    // Simuler un appel API pour récupérer la liste des plans
    const fetchPlans = async () => {
      try {
        // Simule une requête API avec données mockées
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockPlans: SubscriptionPlan[] = [
          {
            id: 'plan_starter',
            name: 'Starter',
            price: 49.99,
            currency: 'EUR',
            billingCycle: 'monthly',
            features: ['5 utilisateurs', '10 projets', 'Support par email'],
          },
          {
            id: 'plan_pro',
            name: 'Professional',
            price: 199.99,
            currency: 'EUR',
            billingCycle: 'monthly',
            features: ['20 utilisateurs', 'Projets illimités', 'Support prioritaire'],
          },
          {
            id: 'plan_enterprise',
            name: 'Enterprise',
            price: 499.99,
            currency: 'EUR',
            billingCycle: 'monthly',
            features: ['Utilisateurs illimités', 'Fonctionnalités avancées', 'Support dédié'],
          },
          {
            id: 'plan_financial',
            name: 'Financial Institution',
            price: 1299.99,
            currency: 'EUR',
            billingCycle: 'monthly',
            features: ['Accès API complet', 'Intégration système bancaire', 'SLA garantie'],
          },
        ];
        
        setPlans(mockPlans);
      } catch (error) {
        console.error('Erreur lors du chargement des plans:', error);
      }
    };
    
    fetchPlans();
  }, []);

  useEffect(() => {
    // Simuler un appel API pour récupérer la liste des abonnements
    const fetchSubscriptions = async () => {
      setLoading(true);
      try {
        // Simule une requête API avec données mockées
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockSubscriptions: Subscription[] = [
          {
            id: 'sub_123456',
            customerId: '123',
            customerName: 'Kiota Tech',
            planId: 'plan_enterprise',
            planName: 'Enterprise',
            status: 'active',
            startDate: '2023-01-15',
            currentPeriodEnd: '2023-05-15',
            amount: 499.99,
            currency: 'EUR',
            autoRenew: true,
            paymentMethod: 'card',
          },
          {
            id: 'sub_123457',
            customerId: '456',
            customerName: 'Exoscode',
            planId: 'plan_pro',
            planName: 'Professional',
            status: 'active',
            startDate: '2023-02-01',
            currentPeriodEnd: '2023-05-01',
            amount: 199.99,
            currency: 'EUR',
            autoRenew: true,
            paymentMethod: 'bank_transfer',
          },
          {
            id: 'sub_123458',
            customerId: '789',
            customerName: 'Banque Centrale',
            planId: 'plan_financial',
            planName: 'Financial Institution',
            status: 'active',
            startDate: '2022-12-01',
            currentPeriodEnd: '2023-06-01',
            amount: 1299.99,
            currency: 'EUR',
            autoRenew: false,
            paymentMethod: 'bank_transfer',
          },
          {
            id: 'sub_123459',
            customerId: '101',
            customerName: 'Startup Innovation',
            planId: 'plan_starter',
            planName: 'Starter',
            status: 'canceled',
            startDate: '2023-01-10',
            currentPeriodEnd: '2023-04-10',
            amount: 49.99,
            currency: 'EUR',
            autoRenew: false,
            paymentMethod: 'card',
          },
          {
            id: 'sub_123460',
            customerId: '112',
            customerName: 'Crédit Mutuel',
            planId: 'plan_financial',
            planName: 'Financial Institution',
            status: 'trial',
            startDate: '2023-04-01',
            currentPeriodEnd: '2023-05-01',
            amount: 0,
            currency: 'EUR',
            autoRenew: true,
            paymentMethod: 'card',
          },
        ];
        
        setSubscriptions(mockSubscriptions);
      } catch (error) {
        console.error('Erreur lors du chargement des abonnements:', error);
        showToast('error', 'Erreur lors du chargement des abonnements');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptions();
  }, [showToast]);

  const handleCancelSubscription = (subscriptionId: string) => {
    // Simulation d'annulation d'abonnement
    setSubscriptions(subs => subs.map(sub => 
      sub.id === subscriptionId 
        ? { ...sub, status: 'canceled', autoRenew: false } 
        : sub
    ));
    showToast('success', 'L\'abonnement a été annulé avec succès');
  };

  const handleRenewSubscription = (subscriptionId: string) => {
    // Simulation de renouvellement d'abonnement
    setSubscriptions(subs => subs.map(sub => 
      sub.id === subscriptionId 
        ? { 
            ...sub, 
            status: 'active',
            autoRenew: true,
            currentPeriodEnd: new Date(
              new Date(sub.currentPeriodEnd).setMonth(
                new Date(sub.currentPeriodEnd).getMonth() + 1
              )
            ).toISOString().split('T')[0]
          } 
        : sub
    ));
    showToast('success', 'L\'abonnement a été renouvelé avec succès');
  };

  const filteredSubscriptions = subscriptions.filter(sub => {
    // Filtre par terme de recherche
    const matchesSearch = searchTerm === '' || 
      sub.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par statut
    const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
    
    // Filtre par plan
    const matchesPlan = filterPlan === 'all' || sub.planId === filterPlan;
    
    return matchesSearch && matchesStatus && matchesPlan;
  });

  const statusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trial':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case 'trial':
        return <Calendar className="w-3 h-3 mr-1" />;
      case 'pending':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'canceled':
        return <XCircle className="w-3 h-3 mr-1" />;
      case 'expired':
        return <AlertCircle className="w-3 h-3 mr-1" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'trial':
        return 'Essai';
      case 'pending':
        return 'En attente';
      case 'canceled':
        return 'Annulé';
      case 'expired':
        return 'Expiré';
      default:
        return status;
    }
  };

  const getBillingCycleLabel = (cycle: string) => {
    switch (cycle) {
      case 'monthly':
        return 'Mensuel';
      case 'quarterly':
        return 'Trimestriel';
      case 'yearly':
        return 'Annuel';
      default:
        return cycle;
    }
  };

  const getRenewalStatusLabel = (subscription: Subscription) => {
    if (subscription.status === 'canceled' || subscription.status === 'expired') {
      return 'Non renouvelable';
    }
    return subscription.autoRenew ? 'Renouvellement auto.' : 'Renouvellement manuel';
  };

  return (
    <div className="space-y-6">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl font-bold">Gestion des Abonnements</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Rechercher un abonnement..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-full"
            />
          </div>
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un abonnement
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        <div className="flex items-center">
          <Filter className="h-4 w-4 text-gray-500 mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Filtres:</span>
        </div>
        
        <div className="space-x-2 flex flex-wrap gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="trial">Essai</option>
            <option value="pending">En attente</option>
            <option value="canceled">Annulé</option>
            <option value="expired">Expiré</option>
          </select>
          
          <select
            value={filterPlan}
            onChange={(e) => setFilterPlan(e.target.value)}
            className="text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-3 py-1"
          >
            <option value="all">Tous les plans</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>
                {plan.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plans overview cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="mb-2">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">{plan.name}</h3>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {formatCurrency(plan.price, plan.currency)}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  /{getBillingCycleLabel(plan.billingCycle)}
                </span>
              </div>
            </div>
            <hr className="my-2 border-gray-200 dark:border-gray-700" />
            <ul className="space-y-1 mb-3">
              {plan.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="text-xs text-gray-500">
              <span className="font-medium">
                {filteredSubscriptions.filter(sub => sub.planId === plan.id && sub.status === 'active').length}
              </span> clients actifs
            </div>
          </div>
        ))}
      </div>

      {/* Subscriptions table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredSubscriptions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 mr-2" />
                      Client / Plan
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Période
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Montant / Paiement
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Statut
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <div className="flex items-center">
                      <RefreshCcw className="w-4 h-4 mr-2" />
                      Renouvellement
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSubscriptions.map((subscription) => (
                  <tr 
                    key={subscription.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {subscription.customerName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {subscription.planName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        Depuis: {subscription.startDate}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Fin: {subscription.currentPeriodEnd}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(subscription.amount, subscription.currency)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {subscription.paymentMethod === 'card' ? 'Carte bancaire' : 
                         subscription.paymentMethod === 'bank_transfer' ? 'Virement bancaire' : 
                         subscription.paymentMethod}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadgeClass(subscription.status)}`}>
                        {statusIcon(subscription.status)}
                        {getStatusLabel(subscription.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getRenewalStatusLabel(subscription)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {subscription.status !== 'canceled' && subscription.status !== 'expired' && (
                          <button
                            onClick={() => handleCancelSubscription(subscription.id)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Annuler
                          </button>
                        )}
                        {(subscription.status === 'canceled' || !subscription.autoRenew) && subscription.status !== 'expired' && (
                          <button
                            onClick={() => handleRenewSubscription(subscription.id)}
                            className="text-green-600 hover:text-green-800 text-xs"
                          >
                            Renouveler
                          </button>
                        )}
                        <button
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Aucun abonnement trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterStatus !== 'all' || filterPlan !== 'all'
                ? "Aucun abonnement ne correspond à vos critères de recherche."
                : "Commencez par enregistrer un nouveau abonnement."}
            </p>
            <div className="mt-6">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter un abonnement
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
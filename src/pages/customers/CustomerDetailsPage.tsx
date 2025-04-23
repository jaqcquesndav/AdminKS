import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Edit, Trash2, AlertTriangle, Shield, Check, User, ChevronRight } from 'lucide-react';
import { CustomerFormModal, CustomerFormData } from '../../components/customers/CustomerFormModal';
import { CustomerDetailsCard } from '../../components/customers/CustomerDetailsCard';
import { SubscriptionInfoCard } from '../../components/customers/SubscriptionInfoCard';
import { TokenUsagePanel } from '../../components/customers/TokenUsagePanel';
import { CustomerTransactionHistory } from '../../components/customers/CustomerTransactionHistory';
import { CustomerUsersList } from '../../components/customers/CustomerUsersList';
import { CustomerInviteUserModal, InviteUserData } from '../../components/customers/CustomerInviteUserModal';
import { useToastContext } from '../../contexts/ToastContext';

// Types pour le client complet
interface Customer {
  id: string;
  name: string;
  type: 'pme' | 'financial';
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  createdAt: string;
  updatedAt: string;
  usersCount: number;
  validationHistory?: ValidationEvent[];
  // From CustomerFormData
  billingContactName: string;
  billingContactEmail: string;
  planId?: string;
  validatedAt?: string;
  validatedBy?: string;
  ownerId?: string;
  ownerEmail?: string;
  tokenAllocation: number;
  tokenUsage?: number;
  nextTokenRenewalDate?: string;
  accountType: 'freemium' | 'standard' | 'premium' | 'enterprise';
  // From SubscriptionInfo
  subscriptionStatus: 'active' | 'trial' | 'expired' | 'canceled' | 'none';
  subscriptionPlan: string;
  subscriptionExpiry: string;
  lastInvoiceAmount: number;
  lastInvoiceDate: string;
}

interface ValidationEvent {
  date: string;
  action: 'validated' | 'revoked';
  by: string;
  reason?: string;
}

interface TabProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

export function CustomerDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isInviteUserModalOpen, setIsInviteUserModalOpen] = useState(false);
  const [validationReason, setValidationReason] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  
  // Paramètres pour le TokenUsagePanel
  const [nextTokenRenewalDate, setNextTokenRenewalDate] = useState<Date>(new Date());

  // Configuration des onglets
  const tabs: TabProps[] = [
    { id: 'overview', label: t('customers.tabs.overview', 'Vue d\'ensemble') },
    { id: 'tokens', label: t('customers.tabs.tokens', 'Tokens & Usage') },
    { id: 'transactions', label: t('customers.tabs.transactions', 'Transactions') },
    { id: 'users', label: t('customers.tabs.users', 'Utilisateurs') },
  ];

  useEffect(() => {
    const fetchCustomer = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Simuler une requête API avec délai
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Calculer date de renouvellement des tokens
        const today = new Date();
        const nextRenewal = new Date();
        nextRenewal.setMonth(today.getMonth() + 1);
        nextRenewal.setDate(1);
        setNextTokenRenewalDate(nextRenewal);
        
        // Données mockées pour un client spécifique
        const mockCustomer: Customer = {
          id,
          name: id === '123' ? 'Kiota Tech' : 'Client ' + id,
          type: 'pme',
          email: id === '123' ? 'contact@kiota.tech' : `contact@client${id}.com`,
          phone: '+33 1 23 45 67 89',
          address: '123 Rue de la République',
          city: 'Paris',
          country: 'France',
          status: 'active',
          createdAt: '2023-01-15',
          updatedAt: '2023-03-22',
          billingContactName: 'Jean Dupont',
          billingContactEmail: 'jean.dupont@kiota.tech',
          usersCount: 12,
          subscriptionStatus: 'active',
          subscriptionPlan: 'Business',
          subscriptionExpiry: '2024-01-15',
          lastInvoiceAmount: 499,
          lastInvoiceDate: '2023-03-15',
          tokenAllocation: 1000000,
          tokenUsage: 350000,
          accountType: 'premium',
          validatedAt: '2023-01-16',
          validatedBy: 'admin_user_001',
          ownerId: 'user123',
          ownerEmail: 'owner@kiota.tech',
          validationHistory: [
            {
              date: '2023-01-16',
              action: 'validated',
              by: 'admin_user_001',
              reason: 'Vérification des documents complétée avec succès'
            }
          ]
        };
        
        setCustomer(mockCustomer);
      } catch (error) {
        console.error('Erreur lors du chargement du client:', error);
        showToast('error', 'Erreur lors du chargement des informations du client');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomer();
  }, [id, showToast]);

  const handleEditCustomer = (data: CustomerFormData) => {
    if (!customer) return;
    
    // Mise à jour du client
    const updatedCustomer = {
      ...customer,
      ...data,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    
    setCustomer(updatedCustomer);
    setIsEditModalOpen(false);
    showToast('success', 'Client mis à jour avec succès');
  };

  const handleDeleteCustomer = async () => {
    if (!customer) return;
    
    // Simuler une suppression
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setIsDeleteConfirmOpen(false);
    showToast('success', 'Client supprimé avec succès');
    navigate('/customers');
  };
  
  const handleValidateAccount = async () => {
    if (!customer) return;
    
    // Simuler une validation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const currentAdmin = "admin_user_002"; // Ceci viendrait du contexte d'authentification
    
    const updatedCustomer = {
      ...customer,
      status: 'active' as const,
      validatedAt: now,
      validatedBy: currentAdmin,
      validationHistory: [
        ...(customer.validationHistory || []),
        {
          date: now,
          action: 'validated' as const,
          by: currentAdmin,
          reason: validationReason
        }
      ]
    };
    
    setCustomer(updatedCustomer);
    setIsValidationModalOpen(false);
    setValidationReason('');
    showToast('success', 'Compte client validé avec succès');
  };
  
  const handleRevokeValidation = async () => {
    if (!customer) return;
    
    // Simuler une révocation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const now = new Date().toISOString();
    const currentAdmin = "admin_user_002"; // Ceci viendrait du contexte d'authentification
    
    const updatedCustomer = {
      ...customer,
      validatedAt: undefined,
      validatedBy: undefined,
      validationHistory: [
        ...(customer.validationHistory || []),
        {
          date: now,
          action: 'revoked' as const,
          by: currentAdmin
        }
      ]
    };
    
    setCustomer(updatedCustomer);
    showToast('info', 'Validation du compte révoquée');
  };
  
  const handleAddTokens = async (customerId: string, amount: number) => {
    if (!customer) return;
    
    // Simuler l'ajout de tokens
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const updatedCustomer = {
      ...customer,
      tokenAllocation: customer.tokenAllocation + amount
    };
    
    setCustomer(updatedCustomer);
    showToast('success', `${amount.toLocaleString()} tokens ajoutés avec succès`);
  };
  
  const handleViewInvoices = () => {
    navigate(`/finance/invoices?customer=${id}`);
  };
  
  const handleViewUsers = () => {
    setActiveTab('users');
  };
  
  const handleInviteUser = async (data: InviteUserData) => {
    // Simuler l'invitation d'un utilisateur
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mise à jour du compteur d'utilisateurs (simulation)
    if (customer) {
      setCustomer({
        ...customer,
        usersCount: customer.usersCount + 1
      });
    }
    
    showToast('success', `Invitation envoyée à ${data.email} avec le rôle ${data.role}`);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Client introuvable</h3>
        <p className="mt-1 text-sm text-gray-500">
          Impossible de trouver le client demandé.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate('/customers')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumb navigation */}
        <nav className="flex items-center text-sm font-medium">
          <button 
            onClick={() => navigate('/customers')}
            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
          >
            Clients
          </button>
          <ChevronRight className="mx-2 h-4 w-4 text-gray-400" />
          <span className="text-gray-900 dark:text-white">{customer.name}</span>
        </nav>

        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              {customer.name}
              {customer.validatedAt ? (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  <Check className="h-3 w-3 mr-1" />
                  {t('customers.validated', 'Validé')}
                </span>
              ) : (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {t('customers.pendingValidation', 'En attente')}
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {customer.type === 'pme' ? 'PME' : 'Institution Financière'} • 
              {customer.usersCount} {t('customers.users', 'utilisateurs')} •
              {t('customers.created', 'Créé le')} {new Date(customer.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex space-x-3">
            {!customer.validatedAt && (
              <button
                onClick={() => setIsValidationModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Shield className="mr-2 h-4 w-4" />
                {t('customers.actions.validate', 'Valider')}
              </button>
            )}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('customers.actions.edit', 'Modifier')}
            </button>
            <button
              onClick={() => setIsDeleteConfirmOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t('customers.actions.delete', 'Supprimer')}
            </button>
          </div>
        </div>
        
        {/* Onglets */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex -mb-px space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-primary text-primary dark:border-primary-light dark:text-primary-light'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
                  }
                `}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Contenu de l'onglet */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Info Card */}
            <div className="lg:col-span-2">
              {customer.validatedAt ? (
                <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Shield className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700 dark:text-green-200">
                        {t('customers.validatedInfo', 'Ce compte a été validé le')} {' '}
                        {new Date(customer.validatedAt).toLocaleDateString()} {t('customers.validatedBy', 'par')} {customer.validatedBy}.
                      </p>
                      {customer.validatedAt && (
                        <button
                          type="button"
                          onClick={handleRevokeValidation}
                          className="mt-2 text-sm font-medium text-green-700 dark:text-green-200 hover:text-green-600 dark:hover:text-green-300"
                        >
                          {t('customers.revokeValidation', 'Révoquer la validation')}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 dark:text-yellow-200">
                        {t('customers.pendingValidationInfo', 'Ce compte est en attente de validation. La validation permet au client d\'accéder à toutes les fonctionnalités.')}
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsValidationModalOpen(true)}
                        className="mt-2 text-sm font-medium text-yellow-700 dark:text-yellow-200 hover:text-yellow-600 dark:hover:text-yellow-300"
                      >
                        {t('customers.validateAccount', 'Valider ce compte')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <CustomerDetailsCard 
                customer={{
                  id: customer.id,
                  name: customer.name,
                  type: customer.type,
                  email: customer.email,
                  phone: customer.phone,
                  address: `${customer.address}, ${customer.city}, ${customer.country}`,
                  status: customer.status,
                  createdAt: customer.createdAt
                }} 
                onEdit={() => setIsEditModalOpen(true)}
              />
              
              {customer.ownerId && (
                <div className="mt-6 bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                      <User className="w-5 h-5 mr-2" />
                      {t('customers.owner.title', 'Propriétaire du compte')}
                    </h3>
                  </div>
                  <div className="px-6 py-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {customer.ownerEmail}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('customers.owner.info', 'Peut ajouter et gérer les utilisateurs de ce compte')}
                        </p>
                      </div>
                      <button 
                        onClick={handleViewUsers}
                        className="text-primary hover:text-primary-dark text-sm font-medium"
                      >
                        {t('customers.owner.viewUsers', 'Voir les utilisateurs')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Subscription Info Card */}
            <div>
              <SubscriptionInfoCard 
                subscription={{
                  subscriptionStatus: customer.subscriptionStatus,
                  subscriptionPlan: customer.subscriptionPlan,
                  subscriptionExpiry: customer.subscriptionExpiry,
                  billingContactName: customer.billingContactName,
                  billingContactEmail: customer.billingContactEmail,
                  lastInvoiceAmount: customer.lastInvoiceAmount,
                  lastInvoiceDate: customer.lastInvoiceDate
                }}
                onViewInvoices={handleViewInvoices}
              />
            </div>
          </div>
        )}
        
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <TokenUsagePanel
              customerId={customer.id}
              customerName={customer.name}
              customerType={customer.type}
              tokenAllocation={customer.tokenAllocation}
              tokenUsage={customer.tokenUsage || 0}
              nextRenewalDate={nextTokenRenewalDate}
              onAddTokens={handleAddTokens}
            />
            
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {t('customers.tokens.pricing', 'Tarification des tokens')}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-primary opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('customers.tokens.includedTokens', 'Tokens inclus')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {customer.type === 'pme'
                        ? t('customers.tokens.pmeAllocation', 'PME: 1 million de tokens par mois inclus avec les forfaits payants')
                        : t('customers.tokens.financialAllocation', 'Institution financière: 10 millions de tokens par mois inclus avec les forfaits payants')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-primary opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('customers.tokens.additionalTokens', 'Tokens supplémentaires')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('customers.tokens.additionalPricing', '10 USD par million de tokens supplémentaires')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 relative mt-1">
                    <div className="absolute inset-0 rounded-full bg-primary opacity-20"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-primary"></div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {t('customers.tokens.renewal', 'Renouvellement mensuel')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('customers.tokens.renewalInfo', 'L\'allocation de tokens est renouvelée automatiquement le premier jour de chaque mois')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'transactions' && (
          <div>
            <CustomerTransactionHistory customerId={customer.id} limit={20} showFilters={true} />
          </div>
        )}
        
        {activeTab === 'users' && (
          <CustomerUsersList
            customerId={customer.id}
            customerName={customer.name}
            onInviteUser={() => setIsInviteUserModalOpen(true)}
          />
        )}
      </div>
      
      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <CustomerFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditCustomer}
          customer={customer}
          title={t('customers.edit.title', 'Modifier le client')}
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('customers.delete.title', 'Supprimer le client')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('customers.delete.confirmation', 'Êtes-vous sûr de vouloir supprimer')} {customer.name}? {t('customers.delete.warning', 'Cette action est irréversible et supprimera toutes les données associées à ce client.')}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleDeleteCustomer}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                {t('customers.delete.confirm', 'Supprimer')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Validation Modal */}
      {isValidationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {t('customers.validate.title', 'Valider le compte client')}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t('customers.validate.info', 'La validation du compte permettra au client d\'accéder à toutes les fonctionnalités de la plateforme.')}
                  </p>
                  
                  <div className="mt-4">
                    <label htmlFor="validationReason" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t('customers.validate.reason', 'Raison de validation (optionnel)')}
                    </label>
                    <textarea
                      id="validationReason"
                      value={validationReason}
                      onChange={(e) => setValidationReason(e.target.value)}
                      className="mt-1 w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      rows={3}
                      placeholder={t('customers.validate.reasonPlaceholder', 'Ex: Vérification des documents complétée') as string}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex justify-end space-x-3">
              <button
                onClick={() => setIsValidationModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                onClick={handleValidateAccount}
                className="px-4 py-2 rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                {t('customers.validate.confirm', 'Valider le compte')}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Invite User Modal */}
      {isInviteUserModalOpen && (
        <CustomerInviteUserModal
          isOpen={isInviteUserModalOpen}
          onClose={() => setIsInviteUserModalOpen(false)}
          onSubmit={handleInviteUser}
          customerName={customer.name}
        />
      )}
    </>
  );
}
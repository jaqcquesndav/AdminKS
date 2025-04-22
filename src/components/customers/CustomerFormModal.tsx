import React, { useState, useEffect } from 'react';
import { X, Check, Shield, Users, Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  customer?: CustomerFormData;
  title?: string;
}

export interface CustomerFormData {
  id?: string;
  name: string;
  type: 'pme' | 'financial';
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
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
}

interface UserOption {
  id: string;
  email: string;
  name: string;
}

export function CustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  customer,
  title = 'Ajouter un client'
}: CustomerFormModalProps) {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserOption[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [formData, setFormData] = useState<CustomerFormData>(
    customer || {
      name: '',
      type: 'pme',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: 'France',
      status: 'pending',
      billingContactName: '',
      billingContactEmail: '',
      tokenAllocation: 0,
      accountType: 'freemium',
    }
  );

  useEffect(() => {
    // Update token allocation when type or accountType changes
    if (formData.type === 'pme') {
      setFormData(prev => ({
        ...prev,
        tokenAllocation: prev.accountType === 'freemium' ? 0 : 1000000 // 1 million tokens for paid PME
      }));
    } else if (formData.type === 'financial') {
      setFormData(prev => ({
        ...prev,
        tokenAllocation: prev.accountType === 'freemium' ? 0 : 10000000 // 10 million tokens for paid financial institutions
      }));
    }
  }, [formData.type, formData.accountType]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isOpen) return;
      
      setLoadingUsers(true);
      try {
        // Simulate API request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock user data
        const mockUsers = [
          { id: 'user1', email: 'user1@example.com', name: 'John Doe' },
          { id: 'user2', email: 'user2@example.com', name: 'Jane Smith' },
          { id: 'user3', email: 'user3@example.com', name: 'Robert Johnson' },
          { id: 'user4', email: 'user4@example.com', name: 'Emily Williams' },
        ];
        
        setUsers(mockUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoadingUsers(false);
      }
    };
    
    fetchUsers();
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // If owner ID changes, update owner email
    if (name === 'ownerId') {
      const selectedUser = users.find(user => user.id === value);
      if (selectedUser) {
        setFormData(prev => ({ ...prev, ownerEmail: selectedUser.email }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.form.name', 'Nom de l\'entreprise')}*
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.form.type', 'Type')}*
                  </label>
                  <select
                    name="type"
                    id="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="pme">PME</option>
                    <option value="financial">Institution Financière</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.form.email', 'Email')}*
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.form.phone', 'Téléphone')}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.address', 'Adresse')}
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.form.city', 'Ville')}
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.form.country', 'Pays')}
                  </label>
                  <input
                    type="text"
                    name="country"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.status', 'Statut')}*
                </label>
                <select
                  name="status"
                  id="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="active">Actif</option>
                  <option value="pending">En attente</option>
                  <option value="suspended">Suspendu</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
              
              {/* Account Validation Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {t('customers.form.validationTitle', 'Validation du compte')}
                  </h3>
                  {formData.validatedAt && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      <Check className="w-3 h-3 mr-1" />
                      {t('customers.form.validated', 'Validé')}
                    </span>
                  )}
                </div>
                
                {!formData.validatedAt ? (
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-900 rounded-md p-3 mb-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-200">
                      {t('customers.form.pendingValidation', 'Ce compte est en attente de validation. La validation permet au client d\'accéder à toutes les fonctionnalités.')}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        // Simulate validation by an admin
                        const now = new Date().toISOString();
                        const currentAdmin = "admin_user123"; // This would come from auth context in a real app
                        setFormData(prev => ({ 
                          ...prev, 
                          validatedAt: now, 
                          validatedBy: currentAdmin,
                          status: 'active'
                        }));
                      }}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                    >
                      {t('customers.form.validateAccount', 'Valider ce compte')}
                    </button>
                  </div>
                ) : (
                  <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900 rounded-md p-3 mb-3">
                    <p className="text-sm text-green-700 dark:text-green-200">
                      {t('customers.form.validatedInfo', 'Ce compte a été validé le')} {new Date(formData.validatedAt).toLocaleDateString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({ 
                          ...prev, 
                          validatedAt: undefined, 
                          validatedBy: undefined
                        }));
                      }}
                      className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {t('customers.form.revokeValidation', 'Révoquer la validation')}
                    </button>
                  </div>
                )}
              </div>
              
              {/* Owner Assignment Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium mb-3 flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  {t('customers.form.ownerTitle', 'Utilisateur principal (Owner)')}
                </h3>
                
                <div className="mb-3">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {t('customers.form.ownerInfo', 'L\'utilisateur principal aura tous les droits sur ce compte et pourra ajouter d\'autres utilisateurs.')}
                  </p>
                  
                  <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('customers.form.owner', 'Propriétaire du compte')}
                  </label>
                  
                  {loadingUsers ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
                      <span className="text-sm text-gray-500">Chargement des utilisateurs...</span>
                    </div>
                  ) : (
                    <select
                      name="ownerId"
                      id="ownerId"
                      value={formData.ownerId || ''}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">-- Sélectionner un utilisateur --</option>
                      {users.map(user => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  )}
                  
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('customers.form.ownerTransferable', 'Cette propriété est transférable ultérieurement.')}
                  </p>
                </div>
              </div>
              
              {/* Subscription & Tokens Section */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium mb-3 flex items-center">
                  <Coins className="w-5 h-5 mr-2" />
                  {t('customers.form.subscriptionTitle', 'Abonnement & Tokens')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.form.accountType', 'Type d\'abonnement')}*
                    </label>
                    <select
                      name="accountType"
                      id="accountType"
                      required
                      value={formData.accountType}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="freemium">Freemium</option>
                      {formData.type === 'pme' ? (
                        <>
                          <option value="standard">Standard PME</option>
                          <option value="premium">Premium PME</option>
                        </>
                      ) : (
                        <>
                          <option value="standard">Standard Financier</option>
                          <option value="premium">Premium Financier</option>
                          <option value="enterprise">Enterprise Financier</option>
                        </>
                      )}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="tokenAllocation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.form.tokenAllocation', 'Allocation de tokens mensuelle')}
                    </label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        name="tokenAllocation"
                        id="tokenAllocation"
                        min="0"
                        step="1000000"
                        value={formData.tokenAllocation}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (formData.type === 'pme') {
                            setFormData(prev => ({ ...prev, tokenAllocation: 1000000 }));
                          } else {
                            setFormData(prev => ({ ...prev, tokenAllocation: 10000000 }));
                          }
                        }}
                        className="ml-2 px-3 py-2 text-xs bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-500"
                      >
                        {formData.type === 'pme' ? 'Définir 1M' : 'Définir 10M'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formData.type === 'pme' 
                        ? t('customers.form.pmeTokenInfo', 'PMEs: 1 million de tokens/mois inclus avec les forfaits payants') 
                        : t('customers.form.financialTokenInfo', 'Institutions financières: 10 millions de tokens/mois inclus avec les forfaits payants')}
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-900 rounded-md p-3">
                  <p className="text-sm text-blue-700 dark:text-blue-200">
                    {t('customers.form.tokenPurchaseInfo', 'Les clients peuvent acheter des tokens supplémentaires au prix de 10 USD par million une fois leur allocation mensuelle épuisée.')}
                  </p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-medium mb-3">
                  {t('customers.form.billingContactTitle', 'Contact de facturation')}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="billingContactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.form.billingContactName', 'Nom du contact')}
                    </label>
                    <input
                      type="text"
                      name="billingContactName"
                      id="billingContactName"
                      value={formData.billingContactName}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="billingContactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.form.billingContactEmail', 'Email du contact')}
                    </label>
                    <input
                      type="email"
                      name="billingContactEmail"
                      id="billingContactEmail"
                      value={formData.billingContactEmail}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
              
              {formData.id && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-base font-medium mb-3">
                    {t('customers.form.planTitle', 'Plan & Abonnement')}
                  </h3>
                  
                  <div>
                    <label htmlFor="planId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('customers.form.plan', 'Plan')}
                    </label>
                    <select
                      name="planId"
                      id="planId"
                      value={formData.planId || ''}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">-- Sélectionner un plan --</option>
                      <option value="starter">Starter</option>
                      <option value="business">Business</option>
                      <option value="premium">Premium</option>
                      <option value="enterprise">Enterprise</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            {t('common.cancel', 'Annuler')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md"
          >
            {customer ? t('common.save', 'Enregistrer') : t('common.create', 'Créer')}
          </button>
        </div>
      </div>
    </div>
  );
}
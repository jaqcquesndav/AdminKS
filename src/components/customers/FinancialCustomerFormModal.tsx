import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useUsers } from '../../hooks/useUsers';
import type { CustomerFormData } from '../../types/customer';

interface FinancialCustomerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomerFormData) => void;
  initialData: CustomerFormData;
}

export function FinancialCustomerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: FinancialCustomerFormModalProps) {
  const { t } = useTranslation();
  const { users, loadUsers, isLoading: loadingUsers } = useUsers();
  const [formData, setFormData] = useState<CustomerFormData>(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, loadUsers]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newFormData = { ...prev, [name]: value };
      
      // Si le type de compte change, ajuster l'allocation de tokens
      if (name === 'accountType') {
        newFormData.tokenAllocation = value === 'freemium' ? 0 : 10000000;
      }
      
      // Si l'owner change, mettre à jour l'email de l'owner
      if (name === 'ownerId') {
        const selectedUser = users.find(user => user.id === value);
        if (selectedUser) {
          newFormData.ownerEmail = selectedUser.email;
        }
      }
      
      return newFormData;
    });
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {t('customers.addFinancialInstitution', 'Ajouter une institution financière')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.phone', 'Téléphone')}*
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.country', 'Pays')}*
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.city', 'Ville')}*
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.address', 'Adresse')}*
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="billingContactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.billingContactName', 'Nom du contact de facturation')}*
                </label>
                <input
                  type="text"
                  name="billingContactName"
                  id="billingContactName"
                  required
                  value={formData.billingContactName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              
              <div>
                <label htmlFor="billingContactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.billingContactEmail', 'Email du contact de facturation')}*
                </label>
                <input
                  type="email"
                  name="billingContactEmail"
                  id="billingContactEmail"
                  required
                  value={formData.billingContactEmail}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="accountType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.form.accountType', 'Type de compte')}*
                </label>
                <select
                  name="accountType"
                  id="accountType"
                  required
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="freemium">{t('customers.accountTypes.freemium', 'Freemium')}</option>
                  <option value="standard">{t('customers.accountTypes.standard', 'Standard')}</option>
                  <option value="premium">{t('customers.accountTypes.premium', 'Premium')}</option>
                  <option value="enterprise">{t('customers.accountTypes.enterprise', 'Enterprise')}</option>
                </select>
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
                  <option value="pending">{t('customers.status.pending', 'En attente')}</option>
                  <option value="active">{t('customers.status.active', 'Actif')}</option>
                  <option value="inactive">{t('customers.status.inactive', 'Inactif')}</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('customers.form.owner', 'Propriétaire (utilisateur principal)')}
              </label>
              <select
                name="ownerId"
                id="ownerId"
                value={formData.ownerId || ''}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">{loadingUsers ? t('common.loading', 'Chargement...') : t('customers.form.selectOwner', 'Sélectionner un propriétaire')}</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                {t('customers.form.ownerInfo', 'Le propriétaire sera le principal administrateur de ce compte client.')}
              </p>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark"
              >
                {t('common.save', 'Enregistrer')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

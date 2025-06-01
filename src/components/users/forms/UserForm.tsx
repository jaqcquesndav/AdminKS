import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, User, Shield, Building } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { PasswordInput } from '../../common/inputs/PasswordInput';
import type { User as UserType, UserRole, UserType as CustomUserType } from '../../../types/user';
import type { AuthUser } from '../../../types/auth';
import type { CustomerAccount } from '../../../types/user';

// Mock function to fetch customer accounts - replace with actual API call
async function fetchCustomerAccounts(): Promise<CustomerAccount[]> {
  // This is a placeholder. In a real app, you would fetch this from your backend.
  return Promise.resolve([
    { id: 'pme-123', name: 'PME Alpha', type: 'pme', status: 'active', createdAt: new Date().toISOString(), owner: {id: 'owner-1', name: 'Owner Alpha', email: 'owner@alpha.com'}, subscription: {plan: 'premium', status: 'active'}, usersCount: 5, country: 'France', tokensBalance: 1000, tokensPurchased: 2000 },
    { id: 'fi-456', name: 'Finance Corp', type: 'financial_institution', status: 'active', createdAt: new Date().toISOString(), owner: {id: 'owner-2', name: 'Owner Beta', email: 'owner@beta.com'}, subscription: {plan: 'enterprise', status: 'active'}, usersCount: 50, country: 'USA', tokensBalance: 10000, tokensPurchased: 20000 },
  ]);
}

export interface UserFormProps {
  user?: UserType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UserType> & { password?: string; userType?: CustomUserType; customerAccountId?: string }) => Promise<void>;
  currentUser: AuthUser | null;
}

export function UserForm({ user, isOpen, onClose, onSubmit, currentUser }: UserFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'company_user',
    userType: user?.userType || 'external',
    customerAccountId: user?.customerAccountId || '',
    password: '',
    confirmPassword: '',
  });
  const [customerAccounts, setCustomerAccounts] = useState<CustomerAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || (currentUser?.role === 'company_admin' ? 'company_user' : 'customer_support'),
      userType: user?.userType || (currentUser?.role === 'company_admin' ? 'external' : 'internal'),
      customerAccountId: user?.customerAccountId || (currentUser?.role === 'company_admin' ? currentUser.customerAccountId || '' : ''),
      password: '',
      confirmPassword: '',
    });
    if (currentUser?.role === 'super_admin') {
        fetchCustomerAccounts().then(setCustomerAccounts);
    }
  }, [user, currentUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && formData.password !== formData.confirmPassword) {
      setError(t('users.form.passwordMismatch'));
      return;
    }
    if (formData.userType === 'external' && !formData.customerAccountId) {
        setError(t('users.form.customerAccountRequired'));
        return;
    }

    setIsLoading(true);
    try {
      const dataToSubmit: Partial<UserType> & { password?: string; userType?: CustomUserType; customerAccountId?: string } = {
        name: formData.name,
        email: formData.email,
        role: formData.role as UserRole,
        userType: formData.userType as CustomUserType,
      };

      if (formData.userType === 'external') {
        dataToSubmit.customerAccountId = formData.customerAccountId;
      }

      if (!user && formData.password) {
        dataToSubmit.password = formData.password;
      }

      await onSubmit(dataToSubmit);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('users.form.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const availableRoles = (): UserRole[] => {
    if (currentUser?.role === 'super_admin') {
      return ['super_admin', 'cto', 'growth_finance', 'customer_support', 'content_manager', 'company_admin', 'company_user'];
    }
    if (currentUser?.role === 'company_admin') {
      // Company admins can only create/edit company_user or other company_admin within their own company
      // For simplicity, let's assume they can manage both roles if they are creating a new user.
      // If editing, the role might be restricted based on the user being edited.
      // This logic might need further refinement based on specific business rules.
      return ['company_admin', 'company_user'];
    }
    return []; // Should not happen if UI is controlled properly
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user ? t('users.form.edit') : t('users.form.create')}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Basic Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.name')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.email')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* User Type (Internal/External) - Super Admin only or based on context */}
          {currentUser?.role === 'super_admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.userType')}
              </label>
              <select
                value={formData.userType}
                onChange={(e) => setFormData({ ...formData, userType: e.target.value as CustomUserType, customerAccountId: '' })}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!!user} // Disable when editing
              >
                <option value="internal">{t('users.userTypes.internal')}</option>
                <option value="external">{t('users.userTypes.external')}</option>
              </select>
            </div>
          )}

          {/* Customer Account (Company) - If UserType is External and current user is Super Admin */}
          {formData.userType === 'external' && currentUser?.role === 'super_admin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('users.form.customerAccount')}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.customerAccountId}
                  onChange={(e) => setFormData({ ...formData, customerAccountId: e.target.value })}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={!!user && user.userType === 'external'} // Disable when editing an external user
                >
                  <option value="">{t('users.form.selectCustomerAccount')}</option>
                  {customerAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {/* If current user is company_admin, their company is implicitly assigned and displayed as read-only */}
          {formData.userType === 'external' && currentUser?.role === 'company_admin' && formData.customerAccountId && (
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('users.form.customerAccount')}
                </label>
                <input 
                    type="text" 
                    // Attempt to find the name, fallback to ID if not found (e.g., if customerAccounts isn't populated for company_admin)
                    value={customerAccounts.find(c => c.id === formData.customerAccountId)?.name || formData.customerAccountId} 
                    disabled 
                    className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
             </div>
        )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('users.form.role')}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              >
                {availableRoles().map(roleValue => (
                  <option key={roleValue} value={roleValue}>
                    {t(`users.roles.${roleValue}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Password fields for new users */}
          {!user && (
            <>
              <PasswordInput
                label={t('users.form.password')}
                value={formData.password}
                onChange={(value) => setFormData({ ...formData, password: value })}
              />

              <PasswordInput
                label={t('users.form.confirmPassword')}
                value={formData.confirmPassword}
                onChange={(value) => setFormData({ ...formData, confirmPassword: value })}
              />
            </>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
          >
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
          >
            {isLoading ? t('common.saving') : t('common.save')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
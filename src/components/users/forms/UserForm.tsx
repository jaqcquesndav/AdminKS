import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, User, Shield } from 'lucide-react';
import { Modal } from '../../common/Modal';
import { PasswordInput } from '../../common/inputs/PasswordInput';
import { UserPermissionsForm } from './UserPermissionsForm';
import type { User as UserType, UserRole } from '../../../types/user';
import type { ApplicationPermission } from '../../../types/permissions';

interface UserFormProps {
  user?: UserType;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<UserType> & { password?: string }) => Promise<void>;
}

export function UserForm({ user, isOpen, onClose, onSubmit }: UserFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'user',
    password: '',
    confirmPassword: '',
    permissions: user?.permissions || []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user && formData.password !== formData.confirmPassword) {
      setError(t('users.form.passwordMismatch'));
      return;
    }

    setIsLoading(true);
    try {
      const data: Partial<UserType> & { password?: string } = {
        name: formData.name,
        email: formData.email,
        role: formData.role as UserRole,
        permissions: formData.permissions
      };

      if (!user && formData.password) {
        data.password = formData.password;
      }

      await onSubmit(data);
      onClose();
    } catch (err) {
      setError(t('users.form.error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePermissionsChange = (permissions: ApplicationPermission[]) => {
    setFormData(prev => ({ ...prev, permissions }));
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
                <option value="user">{t('users.roles.user')}</option>
                <option value="admin">{t('users.roles.admin')}</option>
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

        {/* Permissions */}
        <div className="border-t pt-6">
          <UserPermissionsForm
            permissions={formData.permissions}
            onChange={handlePermissionsChange}
          />
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
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, UserPlus, Mail, AtSign } from 'lucide-react';

interface CustomerInviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: InviteUserData) => void;
  customerName: string;
  availableRoles?: Array<{id: string, name: string}>;
}

export interface InviteUserData {
  email: string;
  role: string;
  sendInvite: boolean;
  message?: string;
}

export function CustomerInviteUserModal({ 
  isOpen, 
  onClose, 
  onSubmit,
  customerName,
  availableRoles = [
    { id: 'admin', name: 'Administrateur' },
    { id: 'user', name: 'Utilisateur' },
    { id: 'readonly', name: 'Lecture seule' }
  ]
}: CustomerInviteUserModalProps) {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<InviteUserData>({
    email: '',
    role: 'user',
    sendInvite: true,
    message: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (name === 'email') {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(formData.email)) {
      setEmailError(t('validation.invalidEmail', 'Veuillez entrer une adresse email valide'));
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
        
        <div className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              {t('customers.users.invite.title', 'Inviter un utilisateur')}
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-5 w-5" />
              <span className="sr-only">{t('common.close', 'Fermer')}</span>
            </button>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('customers.users.invite.description', 'Invitez un nouveau utilisateur à rejoindre')} {customerName}.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('customers.users.invite.email', 'Adresse email')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full rounded-md border ${emailError ? 'border-red-300 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary`}
                  placeholder="email@example.com"
                  required
                />
              </div>
              {emailError && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailError}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('customers.users.invite.role', 'Rôle')} *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="pl-10 w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                  required
                >
                  {availableRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="sendInvite"
                name="sendInvite"
                type="checkbox"
                checked={formData.sendInvite}
                onChange={handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="sendInvite" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('customers.users.invite.sendInvite', 'Envoyer une invitation par email')}
              </label>
            </div>
            
            {formData.sendInvite && (
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('customers.users.invite.message', 'Message personnalisé (optionnel)')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary"
                  placeholder={t('customers.users.invite.messagePlaceholder', 'Ajoutez un message personnalisé à l\'email d\'invitation') as string}
                />
              </div>
            )}
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('common.cancel', 'Annuler')}
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark disabled:opacity-50"
              >
                {isLoading ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {t('customers.users.invite.submit', 'Inviter')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail } from 'lucide-react';

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<void>;
  onBack: () => void;
  error?: string;
}

export function ForgotPasswordForm({ onSubmit, onBack, error }: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email);
      setSuccess(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{t('auth.forgotPassword.successTitle')}</h2>
        <p className="text-gray-600 mb-6">{t('auth.forgotPassword.successMessage')}</p>
        <button
          onClick={onBack}
          className="text-sm text-indigo-600 hover:text-indigo-500"
        >
          {t('auth.forgotPassword.backToLogin')}
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-4">
        {t('auth.forgotPassword.title')}
      </h2>
      <p className="text-gray-600 text-center mb-6">
        {t('auth.forgotPassword.description')}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.forgotPassword.email')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('auth.forgotPassword.emailPlaceholder')}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? t('auth.forgotPassword.loading') : t('auth.forgotPassword.submit')}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {t('auth.forgotPassword.backToLogin')}
          </button>
        </div>
      </form>
    </div>
  );
}
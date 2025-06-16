import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '../common/Button';
import { useTranslation } from 'react-i18next';

interface ResetPasswordFormProps {
  onSubmit: (data: { password: string; token: string }) => Promise<void>;
  token: string;
  error?: string;
}

export function ResetPasswordForm({ onSubmit, token, error }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validatePassword = () => {
    if (password.length < 8) {
      setValidationError(t('auth.resetPasswordForm.passwordTooShort', 'Password must be at least 8 characters'));
      return false;
    }
    if (password !== confirmPassword) {
      setValidationError(t('auth.resetPasswordForm.passwordsDoNotMatch', 'Passwords do not match'));
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit({ password, token });
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        {t('auth.resetPasswordForm.title', 'Reset Your Password')}
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
        {t('auth.resetPasswordForm.instruction', 'Enter your new password below')}
      </p>

      {(error || validationError) && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error || validationError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('auth.resetPasswordForm.newPassword', 'New Password')}
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder={t('auth.resetPasswordForm.passwordPlaceholder', 'Enter your new password')}
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('auth.resetPasswordForm.confirmPassword', 'Confirm Password')}
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder={t('auth.resetPasswordForm.confirmPasswordPlaceholder', 'Confirm your new password')}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            type="submit"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full"
          >
            {t('auth.resetPasswordForm.resetButton', 'Reset Password')}
          </Button>
        </div>
      </form>
    </div>
  );
}

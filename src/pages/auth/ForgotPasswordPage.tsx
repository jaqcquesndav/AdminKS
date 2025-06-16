import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { authService } from '../../services/auth/authService';
import { useToastContext } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>();
  const { showToast } = useToastContext();
  const { t } = useTranslation();

  const handleSubmit = async (email: string) => {
    try {
      await authService.requestPasswordReset(email);
      showToast('success', t('auth.forgotPasswordPage.resetEmailSent', 'Reset email sent'));
    } catch {
      setError(t('auth.forgotPasswordPage.errorSendingEmail', 'An error occurred while sending the email'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          onBack={() => navigate('/login')}
          error={error}
        />
      </div>
    </div>
  );
}
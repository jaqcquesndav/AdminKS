import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { authService } from '../../services/auth/authService';
import { useTranslation } from 'react-i18next';

type AuthMode = 'login' | 'forgotPassword';

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }
    if (mode === 'login' && !authService.isAuthenticated()) {
        navigate('/login'); 
    }
  }, [navigate, mode]);

  const handleForgotPassword = async (email: string) => {
    try {
      await authService.requestPasswordReset(email); 
      console.log(t('auth.authPage.resetEmailSentLog', 'Password reset email request sent for: {email}', { email }));
    } catch (error) {
      console.error(t('auth.authPage.resetErrorLog', 'Error during password reset request:'), error);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">{t('auth.authPage.loginTitle', 'Wanzo Admin')}</h1>
          <p className="text-gray-600">
            {mode === 'forgotPassword' && t('auth.authPage.forgotPasswordMessage', 'Reset your password')}
          </p>
        </div>
        
        {mode === 'forgotPassword' && (
          <ForgotPasswordForm 
            onSubmit={handleForgotPassword} 
            onBack={() => navigate('/login')} 
          />
        )}
      </div>
    </div>
  );
}
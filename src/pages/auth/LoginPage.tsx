import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../../components/auth/LoginForm';
import { TwoFactorVerification } from '../../components/auth/TwoFactorVerification';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { useToastStore } from '../../components/common/ToastContainer';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string>();
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [tempLoginData, setTempLoginData] = useState<{ email: string, tempToken: string } | null>(null);
  const addToast = useToastStore(state => state.addToast);

  const handleLogin = async (email: string, password: string) => {
    try {
      setError(undefined);
      
      const response = await authService.login(email, password);
      
      // Vérifier si 2FA est requis
      if (response.requiresTwoFactor) {
        setTempLoginData({
          email,
          tempToken: response.tempToken || ''
        });
        setShowTwoFactor(true);
        return;
      }
      
      // Connexion réussie sans 2FA
      if (response.user) {
        login(response.user, response.token);
        addToast('success', t('auth.login.success'));
        navigate('/', { replace: true });
      } else {
        setError(t('auth.errors.invalidCredentials'));
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      setError(t('auth.errors.general'));
    }
  };
  
  const handleVerifyTwoFactor = async (code: string) => {
    if (!tempLoginData) return;
    
    try {
      const response = await authService.verifyTwoFactor(code, 'email');
      
      if (response.user) {
        login(response.user, response.token);
        addToast('success', t('auth.login.success'));
        navigate('/', { replace: true });
      } else {
        throw new Error('Authentification échouée');
      }
    } catch (err) {
      console.error('Erreur de vérification 2FA:', err);
      throw err; // Rethrow pour que TwoFactorVerification puisse gérer l'erreur
    }
  };
  
  const handleKsAuth = async () => {
    try {
      // Implémenter l'authentification KS ici
      addToast('info', 'Authentification KS non implémentée');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError(t('auth.errors.general'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {showTwoFactor ? (
          <TwoFactorVerification 
            onVerify={handleVerifyTwoFactor}
            onCancel={() => setShowTwoFactor(false)}
          />
        ) : (
          <LoginForm 
            onSubmit={handleLogin} 
            onKsAuth={handleKsAuth}
            error={error}
            onSwitchToSignUp={() => navigate('/register')}
            onForgotPassword={() => navigate('/forgot-password')}
          />
        )}
      </div>
    </div>
  );
}
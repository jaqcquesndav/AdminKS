import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../../components/auth/LoginForm';
import { TwoFactorVerification } from '../../components/auth/TwoFactorVerification';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth/authService';
import { useToastStore } from '../../components/common/ToastContainer';
import { useTheme } from '../../contexts/ThemeContext';

export function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark } = useTheme();
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
        navigate('/dashboard', { replace: true });
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
        navigate('/dashboard', { replace: true });
      } else {
        throw new Error('Authentification échouée');
      }
    } catch (err) {
      console.error('Erreur de vérification 2FA:', err);
      throw err; // Rethrow pour que TwoFactorVerification puisse gérer l'erreur
    }
  };
  return (
    <div className={`min-h-screen bg-bg-secondary dark:bg-bg-secondary flex items-center justify-center ${isDark ? 'dark' : ''}`}>
      <div className="bg-bg-primary dark:bg-bg-primary p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200 dark:border-gray-700">        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-1">Wanzo Administration</h1>
          <p className="text-sm text-text-secondary">Portail d'administration pour les gestionnaires Wanzo</p>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-2"></div>
        </div>
        
        {showTwoFactor ? (
          <TwoFactorVerification 
            onVerify={handleVerifyTwoFactor}
            onCancel={() => setShowTwoFactor(false)}
          />
        ) : (
          <LoginForm 
            onSubmit={handleLogin}
            error={error}
            onForgotPassword={() => navigate('/forgot-password')}
          />
        )}
      </div>
    </div>
  );
}
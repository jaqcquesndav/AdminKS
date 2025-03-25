import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/auth/LoginForm';
import { SignUpForm } from '../../components/auth/SignUpForm';
import { ForgotPasswordForm } from '../../components/auth/ForgotPasswordForm';
import { TwoFactorVerification } from '../../components/auth/TwoFactorVerification';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { authApi } from '../../services/api/auth';
import { useToastStore } from '../../components/common/ToastContainer';

type AuthMode = 'login' | 'signup' | 'forgotPassword' | '2fa';

export function AuthPage() {
  const navigate = useNavigate();
  const { login, setRequiresTwoFactor, requiresTwoFactor } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [mode, setMode] = useState<AuthMode>(requiresTwoFactor ? '2fa' : 'login');
  const [error, setError] = useState<string>();
  const [tempUser, setTempUser] = useState<any>(null);

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.requiresTwoFactor) {
        setTempUser(response.user);
        setRequiresTwoFactor(true);
        setMode('2fa');
      } else if (response.user) {
        login(response.user, response.token, response.refreshToken);
        addToast('success', 'Connexion réussie');
        // Redirection immédiate vers le tableau de bord
        navigate('/', { replace: true });
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Email ou mot de passe incorrect');
      addToast('error', 'Échec de la connexion');
    }
  };

  const handleKsAuth = async () => {
    try {
      const authUrl = await authApi.initiateKsAuth();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de KS Auth:', error);
      addToast('error', 'Échec de l\'initialisation de KS Auth');
    }
  };

  const handleSignUp = async (data: { name: string; email: string; password: string }) => {
    try {
      const user = await authService.register(data);
      if (user) {
        login(user);
        addToast('success', 'Compte créé avec succès');
        navigate('/', { replace: true });
      }
    } catch (error) {
      setError('Une erreur est survenue');
      addToast('error', 'Échec de la création du compte');
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await authService.requestPasswordReset(email);
      addToast('success', 'Email de réinitialisation envoyé');
      setMode('login');
    } catch (error) {
      setError('Une erreur est survenue');
      addToast('error', 'Échec de l\'envoi de l\'email');
    }
  };

  const handleTwoFactorVerification = async (code: string) => {
    try {
      const success = await authService.verifyTwoFactor({ code, method: 'email' });
      if (success && tempUser) {
        login(tempUser);
        setRequiresTwoFactor(false);
        navigate('/', { replace: true });
      }
    } catch (error) {
      setError('Code invalide');
      addToast('error', 'Code de vérification invalide');
    }
  };

  const renderForm = () => {
    switch (mode) {
      case 'signup':
        return (
          <SignUpForm
            onSubmit={handleSignUp}
            error={error}
            onSwitchToLogin={() => setMode('login')}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordForm
            onSubmit={handleForgotPassword}
            onBack={() => setMode('login')}
            error={error}
          />
        );
      case '2fa':
        return (
          <TwoFactorVerification
            onVerify={handleTwoFactorVerification}
            onCancel={() => {
              setRequiresTwoFactor(false);
              setTempUser(null);
              setMode('login');
            }}
          />
        );
      default:
        return (
          <LoginForm
            onSubmit={handleLogin}
            onKsAuth={handleKsAuth}
            error={error}
            onSwitchToSignUp={() => setMode('signup')}
            onForgotPassword={() => setMode('forgotPassword')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {renderForm()}
      </div>
    </div>
  );
}
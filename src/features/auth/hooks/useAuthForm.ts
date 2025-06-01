import { useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/auth/authService';
import { useToastStore } from '../../../components/common/ToastContainer';
import type { AuthMode, SignUpData, AuthCredentials } from '../types';

export function useAuthForm() {
  const { login } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: AuthCredentials) => {
    setLoading(true);
    try {
      const authResponse = await authService.login(data.email, data.password);
      if (authResponse.requiresTwoFactor) {
        // Handle 2FA if required (e.g., navigate to 2FA verification page)
      } else {
        const user = authResponse.user;
        login(user, authResponse.token);
        addToast('success', 'Connexion réussie');
        window.location.href = '/';
      }
    } catch {
      setError('Email ou mot de passe incorrect');
      addToast('error', 'Échec de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    setLoading(true);
    try {
      const authResponse = await authService.register(data);
      if (authResponse.requiresTwoFactor) {
        // Handle 2FA if required
      } else {
        const user = authResponse.user;
        login(user, authResponse.token);
        addToast('success', 'Compte créé avec succès');
        window.location.href = '/';
      }
    } catch {
      setError('Une erreur est survenue');
      addToast('error', 'Échec de la création du compte');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = {
    google: async () => {
      addToast('info', 'Connexion Google non disponible');
    },
    microsoft: async () => {
      addToast('info', 'Connexion Microsoft non disponible');
    },
    github: async () => {
      addToast('info', 'Connexion GitHub non disponible');
    },
  };

  return {
    mode,
    error,
    loading,
    handleLogin,
    handleSignUp,
    handleSocialAuth,
    setMode,
  };
}
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { authService } from '../../../services/authService';
import { useToastStore } from '../../../components/common/ToastContainer';
import type { AuthMode, SignUpData } from '../types';

export function useAuthForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const addToast = useToastStore(state => state.addToast);
  const [mode, setMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string>();

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await authService.login({ email, password });
      if (user) {
        login(user);
        addToast('success', 'Connexion réussie');
        window.location.href = '/';
      } else {
        setError('Email ou mot de passe incorrect');
        addToast('error', 'Échec de la connexion');
      }
    } catch (err) {
      setError('Email ou mot de passe incorrect');
      addToast('error', 'Échec de la connexion');
    }
  };

  const handleSignUp = async (data: SignUpData) => {
    try {
      const user = await authService.register(data);
      if (user) {
        login(user);
        addToast('success', 'Compte créé avec succès');
        window.location.href = '/';
      } else {
        setError('Échec de la création du compte');
        addToast('error', 'Échec de la création du compte');
      }
    } catch (err) {
      setError('Une erreur est survenue');
      addToast('error', 'Échec de la création du compte');
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
    handleLogin,
    handleSignUp,
    handleSocialAuth,
    setMode,
  };
}
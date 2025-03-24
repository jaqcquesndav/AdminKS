import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authApi } from '../../services/api/auth';
import { useToastStore } from '../../components/common/ToastContainer';
import { PageLoader } from '../../components/common/PageLoader';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const addToast = useToastStore(state => state.addToast);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        addToast('error', 'Échec de l\'authentification KS Auth');
        navigate('/login');
        return;
      }

      if (!code) {
        addToast('error', 'Code d\'autorisation manquant');
        navigate('/login');
        return;
      }

      try {
        const response = await authApi.handleKsAuthCallback(code);
        login(response.user, response.token, response.refreshToken);
        addToast('success', 'Connexion réussie');
        navigate('/');
      } catch (error) {
        console.error('Erreur lors de l\'authentification:', error);
        addToast('error', 'Échec de l\'authentification');
        navigate('/login');
      }
    };

    handleCallback();
  }, [searchParams, login, navigate, addToast]);

  return <PageLoader />;
}
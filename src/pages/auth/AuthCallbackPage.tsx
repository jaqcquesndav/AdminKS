import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLoader } from '../../components/common/PageLoader';
import { authService } from '../../services/auth/authService';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Initialiser le service d'authentification
    authService.initialize();
    
    // Si l'utilisateur est authentifié, rediriger vers le tableau de bord
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);
  
  return <PageLoader />;
}
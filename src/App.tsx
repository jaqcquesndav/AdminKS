import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppRoutes } from './routes';
import { ToastProvider } from './contexts/ToastContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { useAuth } from './hooks/useAuth';
import { authService } from './services/auth/authService';
import { convertAuth0UserToAuthUser } from './services/auth/auth0Service';
import { USE_MOCK_AUTH } from './utils/mockAuth';

function App() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { login } = useAuth();

  // Intégration du flux Auth0 avec le système d'auth existant
  useEffect(() => {
    const initAuth = async () => {
      // Si l'utilisateur est déjà authentifié via le système de démo, ne rien faire
      if (!USE_MOCK_AUTH && isAuthenticated && user) {
        try {
          // Récupérer le token d'accès depuis Auth0
          const token = await getAccessTokenSilently();
          
          // Convertir l'utilisateur Auth0 en format attendu par notre application
          const authUser = convertAuth0UserToAuthUser(user);
          
          // Mettre à jour notre système d'authentification avec les informations Auth0
          login(authUser, token);
          
          // Mettre à jour le service d'authentification avec le token Auth0
          await authService.refreshTokenFromAuth0(user, token);
        } catch (error) {
          console.error('Erreur lors de l\'authentification avec Auth0:', error);
        }
      }
    };

    if (!isLoading) {
      initAuth();
    }
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, login]);

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  return (
    <Router>
      <ToastProvider>
        <CurrencyProvider>
          <AppRoutes />
        </CurrencyProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
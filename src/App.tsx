import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { AppRoutes } from './routes';
import { ToastProvider } from './contexts/ToastContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { useAuth } from './hooks/useAuth';
import { authService } from './services/auth/authService';
import { convertAuth0UserToAuthUser } from './services/auth/auth0Service';
import { USE_MOCK_AUTH } from './utils/mockAuth';
import { AdvancedLoader } from './components/common/AdvancedLoader';

function App() {
  const { isLoading, isAuthenticated, user, getAccessTokenSilently } = useAuth0();
  const { login } = useAuth();

  // Intégration du flux Auth0 avec le système d'auth existant
  useEffect(() => {
    const initAuth = async () => {
      // Si on n'utilise pas l'authentification de démo et que l'utilisateur est authentifié
      if (!USE_MOCK_AUTH && isAuthenticated && user) {
        try {
          console.log('Initialisation Auth0: utilisateur authentifié', { email: user.email });
          
          // Récupérer le token d'accès depuis Auth0
          const token = await getAccessTokenSilently();
          console.log('Token Auth0 récupéré avec succès');
          
          // Convertir l'utilisateur Auth0 en format attendu par notre application
          const authUser = convertAuth0UserToAuthUser(user);
          
          // Mettre à jour notre système d'authentification avec les informations Auth0
          login(authUser, token);
          
          // Mettre à jour le service d'authentification avec le token Auth0
          await authService.refreshTokenFromAuth0(user, token);
          
          console.log('Authentification initialisée avec succès');
        } catch (error) {
          console.error('Erreur lors de l\'authentification avec Auth0:', error);
        }
      } else if (!isLoading && isAuthenticated) {
        console.log('Utilisateur authentifié, mais en attente des informations utilisateur');
      } else if (!isLoading && !isAuthenticated) {
        console.log('Utilisateur non authentifié');
      }
    };

    if (!isLoading) {
      initAuth();
    }  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, login]);

  if (isLoading) {
    return <AdvancedLoader fullScreen message="Initialisation de l'application..." />;
  }
  return (
    <ToastProvider>
      <CurrencyProvider>
        <AppRoutes />
      </CurrencyProvider>
    </ToastProvider>
  );
}

export default App;
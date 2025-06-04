import { useAuth0 } from '@auth0/auth0-react';
import { authService } from './authService';
import type { AuthUser } from '../../types/auth';

// Hook pour intégrer Auth0 avec notre système d'authentification existant
export const useAuth0Integration = () => {
  const { 
    isAuthenticated, 
    user, 
    getAccessTokenSilently, 
    loginWithRedirect, 
    logout 
  } = useAuth0();
  // Fonction pour convertir un utilisateur Auth0 en utilisateur de notre système
  const convertAuth0UserToAuthUser = (): AuthUser | null => {
    if (!user) return null;

    return {
      id: user.sub || '',
      name: user.name || '',
      email: user.email || '',
      picture: user.picture,
      role: user['https://api.wanzo.com/role'] || 'user',
      userType: user['https://api.wanzo.com/userType'] || 'internal', // Default to internal if not specified
      customerAccountId: user['https://api.wanzo.com/customerAccountId'], // Optional customer account ID
    };
  };

  // Fonction pour récupérer le token et le stocker dans notre système
  const refreshToken = async () => {
    if (!isAuthenticated) return null;

    try {
      const token = await getAccessTokenSilently();
      return token;
    } catch (error) {
      console.error('Erreur lors de la récupération du token Auth0:', error);
      return null;
    }
  };

  // Fonction pour se connecter avec Auth0
  const login = () => {
    loginWithRedirect();
  };

  // Fonction pour se déconnecter
  const logoutUser = () => {
    // D'abord, déconnecter l'utilisateur de notre système
    authService.logout();
    
    // Ensuite, déconnecter l'utilisateur de Auth0
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  };

  return {
    isAuthenticated,
    user: convertAuth0UserToAuthUser(),
    refreshToken,
    login,
    logout: logoutUser
  };
};

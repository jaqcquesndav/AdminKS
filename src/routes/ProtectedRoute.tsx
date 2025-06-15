import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useEffect } from 'react';
import { authService } from '../services/auth/authService';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  const location = useLocation();

  // Vérifier le token lors de l'accès à une route protégée
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && !isLoading) {
        try {
          console.log('🔒 Accès à une route protégée:', location.pathname);
          console.log('👤 Utilisateur Auth0:', user ? {
            sub: user.sub,
            email: user.email,
            name: user.name
          } : 'absent');
          
          // Vérifier si authService a déjà un token valide (non expiré)
          if (!authService.isAuthenticated()) {
            console.log('⚙️ Token local via authService manquant ou expiré. Tentative de récupération du token Auth0...');
            try {
              const tokenResponse = await getAccessTokenSilently({
                detailedResponse: true,
                timeoutInSeconds: 60
              });
              console.log('🔑 Nouveau token Auth0 obtenu (détaillé):', {
                accessToken: tokenResponse.access_token ? tokenResponse.access_token.substring(0, 15) + '...' : 'absent',
                idToken: tokenResponse.id_token ? 'présent' : 'absent',
                expiresIn: tokenResponse.expires_in
              });
              
              if (user) {
                await authService.refreshTokenFromAuth0(
                  user,
                  tokenResponse.access_token,
                  tokenResponse.id_token,
                  undefined, // Le refresh token n'est pas directement fourni par getAccessTokenSilently ici
                  tokenResponse.expires_in
                );
                console.log('💾 Token Auth0 et infos utilisateur sauvegardés via authService');
              }
            } catch (tokenError) {
              console.error('❌ Erreur lors de la récupération du token Auth0 en route protégée:', tokenError);
              // Gérer l'erreur, par exemple, déconnecter l'utilisateur si le token ne peut être rafraîchi
            }
          } else {
            console.log('✅ Token local (via authService) valide et existant.');
          }
        } catch (error) {
          console.error('❌ Erreur de vérification du token sur route protégée:', error);
        }
      } else if (!isAuthenticated && !isLoading) {
        console.log('❌ Utilisateur non authentifié tentant d\'accéder à:', location.pathname);
      }
    };
    
    checkAuth();
  }, [isAuthenticated, isLoading, location.pathname, getAccessTokenSilently, user]);

  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (isLoading) {
    console.log('⏳ Chargement de l\'authentification...');
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    console.log('🚫 Utilisateur non authentifié, redirection vers login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // L'utilisateur est authentifié, permettre l'accès aux routes protégées
  console.log('✅ Utilisateur authentifié, accès autorisé à:', location.pathname);
  return <Outlet />;
}
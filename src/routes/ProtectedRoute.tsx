import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLoader } from '../components/common/PageLoader'; // Assurez-vous que ce chemin est correct
import { authService } from '../services/auth/authService';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading, getAccessTokenSilently, user, logout: auth0Logout } = useAuth0();
  const location = useLocation();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  useEffect(() => {
    const checkAuthAndToken = async () => {
      setIsCheckingToken(true);
      if (isLoading) {
        // Si le SDK Auth0 est en cours de chargement, attendez.
        // Ne pas mettre setIsCheckingToken(false) ici car on attend la fin du chargement.
        return;
      }

      if (!isAuthenticated) {
        // Si Auth0 dit que l'utilisateur n'est pas authentifié, pas besoin de vérifier le token local.
        console.log('🚫 ProtectedRoute: Utilisateur non authentifié selon Auth0 SDK.');
        setIsCheckingToken(false);
        return;
      }

      // À ce stade, Auth0 SDK dit que l'utilisateur EST authentifié.
      // Vérifions si notre authService a un token valide.
      if (authService.isAuthenticated()) {
        console.log('✅ ProtectedRoute: Token local valide trouvé via authService.');
        setIsCheckingToken(false);
        return;
      }

      // Si authService n'a pas de token valide, essayons d'en obtenir un nouveau.
      console.log('⚙️ ProtectedRoute: Token local manquant/expiré. Tentative de récupération via Auth0 SDK...');
      try {
        const tokenResponse = await getAccessTokenSilently({
          detailedResponse: true,
          timeoutInSeconds: 60
        });
        
        console.log('🔑 ProtectedRoute: Nouveau token Auth0 obtenu:', {
          accessToken: tokenResponse.access_token ? 'présent' : 'absent',
          idToken: tokenResponse.id_token ? 'présent' : 'absent',
          expiresIn: tokenResponse.expires_in
        });

        if (user && tokenResponse.access_token) {
          await authService.refreshTokenFromAuth0(
            user,
            tokenResponse.access_token,
            tokenResponse.id_token,
            undefined, // refresh_token géré par le SDK
            tokenResponse.expires_in
          );
          console.log('💾 ProtectedRoute: Token et infos utilisateur sauvegardés via authService.');
        } else {
          console.warn('⚠️ ProtectedRoute: Utilisateur Auth0 ou access_token manquant après getAccessTokenSilently.');
          // Cela pourrait indiquer un problème, peut-être déconnecter l'utilisateur
          authService.logout();
          auth0Logout({ logoutParams: { returnTo: window.location.origin + '/login' } });
        }
      } catch (error) {
        console.error('❌ ProtectedRoute: Erreur lors de la récupération du token via Auth0 SDK:', error);
        // Si la récupération silencieuse échoue (ex: session Auth0 expirée), déconnecter l'utilisateur.
        authService.logout(); // Nettoyer notre état local
        auth0Logout({ logoutParams: { returnTo: window.location.origin + '/login' } }); // Déconnecter d'Auth0
      }
      setIsCheckingToken(false);
    };

    checkAuthAndToken();
  }, [isAuthenticated, isLoading, user, getAccessTokenSilently, location.pathname, auth0Logout]);

  if (isLoading || isCheckingToken) {
    console.log('⏳ ProtectedRoute: Chargement SDK Auth0 ou vérification du token...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageLoader />
      </div>
    );
  }

  if (!isAuthenticated || !authService.isAuthenticated()) {
    console.log('🚫 ProtectedRoute: Redirection vers /login. Auth0 SDK dit:', isAuthenticated, ', authService dit:', authService.isAuthenticated());
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  console.log('✅ ProtectedRoute: Accès autorisé à:', location.pathname);
  return <Outlet />;
}
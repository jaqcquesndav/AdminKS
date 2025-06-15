import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLoader } from '../../components/common/PageLoader';
import { authService } from '../../services/auth/authService';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { 
    isAuthenticated: isAuth0Authenticated, 
    isLoading, 
    getAccessTokenSilently, 
    getIdTokenClaims,
    user 
  } = useAuth0();
  
  // Log au montage du composant pour confirmer que la route fonctionne
  useEffect(() => {
    console.log('🎯 Page de callback Auth0 montée');
    console.log('📍 URL actuelle:', window.location.href);
    console.log('🧩 Paramètres de recherche:', location.search);
    
    // Vérifier le localStorage pour voir si des informations sont déjà stockées
    console.log('🗃️ Données localStorage:', {
      accessToken: authService.getAccessToken() ? 'présent' : 'absent',
      idToken: authService.getIdToken() ? 'présent' : 'absent',
      refreshToken: authService.getRefreshToken() ? 'présent' : 'absent',
      userInfo: authService.getUserInfo() ? 'présent' : 'absent',
      tokenExpiry: authService.getTokenExpiry()
    });
  }, [location.search]);

  useEffect(() => {
    // Fonction pour traiter l'authentification
    const processAuthentication = async () => {
      try {
        // Vérifier si le code est présent dans l'URL (paramètre de requête)
        const params = new URLSearchParams(location.search);
        const hasAuthCode = params.has('code');
        const authCode = params.get('code');
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');
        
        // Vérifier s'il y a une erreur dans les paramètres
        if (errorParam) {
          console.error(`❌ Erreur Auth0: ${errorParam} - ${errorDescription}`);
          setError(`Erreur d'authentification: ${errorDescription || errorParam}`);
          navigate('/login', { replace: true });
          return;
        }
        
        console.log('🔍 Traitement du callback Auth0:', { 
          hasAuthCode, 
          authCode: authCode ? `${authCode.substring(0, 10)}...` : 'absent',
          isAuth0Authenticated, 
          isLoading,
          user: user ? 'présent' : 'absent',
          url: location.pathname + location.search,
          state: params.get('state')
        });
        
        // Si le SDK est toujours en cours de chargement, on attend
        if (isLoading) {
          console.log('⏳ SDK Auth0 en cours de chargement, attente...');
          return;
        }
          // Si l'utilisateur est authentifié et que l'utilisateur est présent
        if (isAuth0Authenticated && user) {
          console.log('✅ Utilisateur authentifié via Auth0, récupération des tokens...');
          console.log('👤 Informations utilisateur:', {
            sub: user.sub,
            email: user.email,
            name: user.name,
            role: user['https://api.wanzo.com/role'] || 'non défini',
            scopes: user['https://api.wanzo.com/scopes'] || 'non défini'
          });
          
          try {
            // 1. Récupérer le token d'accès
            const accessTokenResponse = await getAccessTokenSilently({
              detailedResponse: true,
              timeoutInSeconds: 60 // Augmenter le timeout pour éviter les problèmes
            });
            
            console.log('🎫 Tokens récupérés:', {
              accessToken: accessTokenResponse.access_token ? accessTokenResponse.access_token.substring(0, 15) + '...' : 'absent',
              idToken: accessTokenResponse.id_token ? 'présent' : 'absent',
              // Note: Auth0 SDK pour React ne retourne pas directement le refresh token ici.
              // Il est géré en interne par le SDK pour le renouvellement silencieux.
              expiresIn: accessTokenResponse.expires_in,
            });
            
            // 2. Récupérer les claims du token d'ID pour des informations supplémentaires
            const idTokenClaims = await getIdTokenClaims();
            console.log('🔐 ID Token Claims:', idTokenClaims ? 'présent' : 'absent');
            
            // 3. Stocker tous les tokens et les infos utilisateur
            // Le refresh token n'est pas directement exposé par getAccessTokenSilently avec detailedResponse.
            // Il est géré par le SDK. Si vous avez besoin d'un refresh token explicite, 
            // assurez-vous que votre serveur Auth0 est configuré pour le retourner et 
            // que le scope offline_access est demandé.
            await authService.refreshTokenFromAuth0(
              user, 
              accessTokenResponse.access_token,
              accessTokenResponse.id_token, // id_token est disponible ici
              undefined, // refresh_token n'est pas directement fourni ici
              accessTokenResponse.expires_in
            );
            
            // 4. Vérifier que tout est correctement stocké
            console.log('🗃️ Vérification après sauvegarde:', {
              accessToken: authService.getAccessToken() ? 'présent' : 'absent',
              idToken: authService.getIdToken() ? 'présent' : 'absent',
              refreshToken: authService.getRefreshToken() ? 'présent' : 'absent', // Sera undefined si non fourni
              userInfo: authService.getUserInfo() ? 'présent' : 'absent',
              isAuthenticated: authService.isAuthenticated() ? 'oui' : 'non'
            });
            
            // 5. Rediriger vers le dashboard
            console.log('🚀 Authentification complète, redirection vers le dashboard');
            navigate('/dashboard', { replace: true });
          } catch (tokenError) {
            console.error('❌ Erreur lors de la récupération des tokens:', tokenError);
            setError('Erreur lors de la récupération des tokens. Veuillez réessayer.');
            navigate('/login', { replace: true });
          }
        } else if (hasAuthCode && !isAuth0Authenticated && !isLoading) {
          console.error('⚠️ Code Auth0 présent mais utilisateur non authentifié.');
          console.error('🔎 Détails du problème:', { 
            code: authCode ? `${authCode.substring(0, 10)}...` : 'absent', 
            state: params.get('state'),
            error: params.get('error'), 
            error_description: params.get('error_description')
          });
          
          setError('Erreur d\'authentification. Veuillez réessayer.');
          navigate('/login', { replace: true });
        } else if (!isAuth0Authenticated && !hasAuthCode && !isLoading) {
          console.log('🔄 Aucune authentification valide, redirection vers login');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('❌ Erreur lors du traitement du callback:', err);
        setError('Une erreur s\'est produite. Veuillez réessayer.');
        navigate('/login', { replace: true });
      }
    };
    
    processAuthentication();
  }, [navigate, isAuth0Authenticated, isLoading, location.search, location.pathname, getAccessTokenSilently, user, getIdTokenClaims]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-semibold mb-2">Erreur d'authentification</h2>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Retour à la page de connexion
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6 max-w-md w-full text-center">
        <PageLoader />
        <h2 className="text-xl font-semibold mt-4 mb-2">Authentification en cours</h2>
        <p className="text-gray-600 mb-2">Traitement de votre connexion...</p>
        <p className="text-sm text-gray-500">Vous allez être redirigé vers le tableau de bord.</p>
      </div>
    </div>
  );
}
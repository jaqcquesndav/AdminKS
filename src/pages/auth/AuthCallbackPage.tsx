import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLoader } from '../../components/common/PageLoader';
import { authService } from '../../services/auth/authService';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation(); // Initialize t function
  const { 
    isAuthenticated: isAuth0Authenticated, 
    isLoading, 
    getAccessTokenSilently, 
    getIdTokenClaims,
    user 
  } = useAuth0();
  
  // Log au montage du composant pour confirmer que la route fonctionne
  useEffect(() => {
    console.log(t('auth.authCallbackPage.logAuth0Mounted', 'Auth0 callback page mounted'));
    console.log(t('auth.authCallbackPage.logCurrentURL', 'Current URL:'), window.location.href);
    console.log(t('auth.authCallbackPage.logSearchParams', 'Search parameters:'), location.search);
    
    // Vérifier le localStorage pour voir si des informations sont déjà stockées
    console.log(t('auth.authCallbackPage.logLocalStorage', 'LocalStorage data:'), {
      accessToken: authService.getAccessToken() ? t('auth.authCallbackPage.logAccessTokenPresent', 'present') : t('auth.authCallbackPage.logAccessTokenAbsent', 'absent'),
      idToken: authService.getIdToken() ? t('auth.authCallbackPage.logIdTokenPresent', 'present') : t('auth.authCallbackPage.logIdTokenAbsent', 'absent'),
      refreshToken: authService.getRefreshToken() ? t('auth.authCallbackPage.logRefreshTokenPresent', 'present') : t('auth.authCallbackPage.logRefreshTokenAbsent', 'absent'),
      userInfo: authService.getUserInfo() ? t('auth.authCallbackPage.logUserInfoPresent', 'present') : t('auth.authCallbackPage.logUserInfoAbsent', 'absent'),
      tokenExpiry: authService.getTokenExpiry()
    });
  }, [location.search, t]);

  useEffect(() => {
    // Fonction pour traiter l\'authentification
    const processAuthentication = async () => {
      try {
        // Vérifier si le code est présent dans l\'URL (paramètre de requête)
        const params = new URLSearchParams(location.search);
        const hasAuthCode = params.has('code');
        const authCode = params.get('code');
        const errorParam = params.get('error');
        const errorDescription = params.get('error_description');
        
        // Vérifier s'il y a une erreur dans les paramètres
        if (errorParam) {
          console.error(t('auth.authCallbackPage.logAuth0Error', 'Auth0 Error: {error} - {description}', { error: errorParam, description: errorDescription }));
          setError(t('auth.authCallbackPage.errorMessage', 'An error occurred during authentication: {error}', { error: errorDescription || errorParam }));
          navigate('/login', { replace: true });
          return;
        }
        
        console.log(t('auth.authCallbackPage.logProcessingCallback', 'Processing Auth0 callback:'), { 
          hasAuthCode, 
          authCode: authCode ? `${authCode.substring(0, 10)}...` : t('auth.authCallbackPage.logAuthCodeAbsent', 'absent'),
          isAuth0Authenticated, 
          isLoading,
          user: user ? t('auth.authCallbackPage.logUserInfoPresent', 'present') : t('auth.authCallbackPage.logUserInfoAbsent', 'absent'),
          url: location.pathname + location.search,
          state: params.get('state')
        });
        
        // Si le SDK est toujours en cours de chargement, on attend
        if (isLoading) {
          console.log(t('auth.authCallbackPage.logAuth0SDKLoading', 'Auth0 SDK loading, please wait...'));
          return;
        }
          // Si l\'utilisateur est authentifié et que l\'utilisateur est présent
        if (isAuth0Authenticated && user) {
          console.log(t('auth.authCallbackPage.logUserAuthenticated', 'User authenticated via Auth0, fetching tokens...'));
          console.log(t('auth.authCallbackPage.logUserInfo', 'User information:'), {
            sub: user.sub,
            email: user.email,
            name: user.name,
            role: user['https://api.wanzo.com/role'] || t('auth.authCallbackPage.logRoleUndefined', 'undefined'),
            scopes: user['https://api.wanzo.com/scopes'] || t('auth.authCallbackPage.logScopesUndefined', 'undefined')
          });
          
          try {
            // 1. Récupérer le token d\'accès
            const accessTokenResponse = await getAccessTokenSilently({
              detailedResponse: true,
              timeoutInSeconds: 60 // Augmenter le timeout pour éviter les problèmes
            });
            
            console.log(t('auth.authCallbackPage.logTokensFetched', 'Tokens fetched:'), {
              accessToken: accessTokenResponse.access_token ? accessTokenResponse.access_token.substring(0, 15) + '...' : t('auth.authCallbackPage.logAccessTokenAbsent', 'absent'),
              idToken: accessTokenResponse.id_token ? t('auth.authCallbackPage.logIdTokenPresent', 'present') : t('auth.authCallbackPage.logIdTokenAbsent', 'absent'),
              expiresIn: accessTokenResponse.expires_in,
            });
            
            // 2. Récupérer les claims du token d\'ID pour des informations supplémentaires
            const idTokenClaims = await getIdTokenClaims();
            console.log(t('auth.authCallbackPage.logIdTokenClaimsPresent', 'ID Token Claims:'), idTokenClaims ? t('auth.authCallbackPage.logIdTokenPresent', 'present') : t('auth.authCallbackPage.logIdTokenAbsent', 'absent'));
            
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
            console.log(t('auth.authCallbackPage.logTokensStoredRedirecting', 'Tokens stored. Redirecting to dashboard...'));
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
  }, [navigate, isAuth0Authenticated, isLoading, location.search, location.pathname, getAccessTokenSilently, user, getIdTokenClaims, t]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4 text-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('auth.authCallbackPage.errorTitle', 'Authentication Error')}</h1>
          <p className="text-gray-700 mb-2">{error}</p>
          <p className="text-gray-600 text-sm mb-6">{t('auth.authCallbackPage.contactSupport', 'If the problem persists, please contact support.')}</p>
          <button 
            onClick={() => navigate('/login', { replace: true })}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            {t('auth.authCallbackPage.backToLogin', 'Back to Login')}
          </button>
        </div>
      </div>
    );
  }

  return <PageLoader message={t('auth.authCallbackPage.processing', 'Processing authentication...')} />;
}
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLoader } from '../../components/common/PageLoader';
import { authService } from '../../services/auth/authService';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated: isAuth0Authenticated, isLoading, getAccessTokenSilently, user } = useAuth0();
  
  useEffect(() => {
    // Fonction pour traiter l'authentification
    const processAuthentication = async () => {
      try {
        // Vérifier si le code est présent dans l'URL (paramètre de requête)
        const params = new URLSearchParams(location.search);
        const hasAuthCode = params.has('code');
        
        console.log('Traitement du callback Auth0:', { 
          hasAuthCode, 
          isAuth0Authenticated, 
          isLoading,
          user: user ? 'présent' : 'absent'
        });
        
        // Si le SDK est toujours en cours de chargement, on attend
        if (isLoading) {
          return;
        }
        
        // Si l'utilisateur est authentifié et que l'utilisateur est présent
        if (isAuth0Authenticated && user) {
          console.log('Utilisateur authentifié via Auth0, récupération du token...');
          
          try {
            // Récupérer le token d'accès
            const token = await getAccessTokenSilently();
            
            // Stocker le token et les infos utilisateur dans le service d'authentification
            await authService.refreshTokenFromAuth0(user, token);
            
            console.log('Token récupéré et stocké avec succès, redirection vers le dashboard');
            navigate('/dashboard', { replace: true });
          } catch (tokenError) {
            console.error('Erreur lors de la récupération du token:', tokenError);
            setError('Erreur lors de la récupération du token. Veuillez réessayer.');
            navigate('/login', { replace: true });
          }
        } 
        // Si un code est présent mais l'utilisateur n'est pas authentifié,
        // il y a peut-être un problème avec le SDK Auth0
        else if (hasAuthCode && !isAuth0Authenticated && !isLoading) {
          console.error('Code Auth0 présent mais utilisateur non authentifié.');
          setError('Erreur d\'authentification. Veuillez réessayer.');
          navigate('/login', { replace: true });
        }
        // Si l'utilisateur n'est pas authentifié et qu'il n'y a pas de code,
        // rediriger vers la page de login
        else if (!isAuth0Authenticated && !hasAuthCode && !isLoading) {
          console.log('Aucune authentification valide, redirection vers login');
          navigate('/login', { replace: true });
        }
      } catch (err) {
        console.error('Erreur lors du traitement du callback:', err);
        setError('Une erreur s\'est produite. Veuillez réessayer.');
        navigate('/login', { replace: true });
      }
    };
    
    processAuthentication();
  }, [navigate, isAuth0Authenticated, isLoading, location.search, getAccessTokenSilently, user]);
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retour à la page de connexion
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <PageLoader />
      <p className="mt-4 text-gray-600">Traitement de votre connexion...</p>
    </div>
  );
}
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Define a type for the redirect callback state
interface RedirectCallbackState {
  returnTo?: string;
  [key: string]: unknown; // Allow for other properties that might be present
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  
  // Log la configuration au montage du composant
  useEffect(() => {
    console.log('🔐 Configuration Auth0:', {
      domain: import.meta.env.VITE_AUTH0_DOMAIN,
      clientId: import.meta.env.VITE_AUTH0_CLIENT_ID?.substring(0, 5) + '...',
      redirectUri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      scope: import.meta.env.VITE_AUTH0_SCOPE
    });
  }, []);

  const onRedirectCallback = (appState: RedirectCallbackState | undefined) => {
    // Logs pour débogage
    console.log('🔑 Auth0 callback appelé avec appState:', appState);
    console.log('🔄 Redirection vers:', appState?.returnTo || '/dashboard');
    
    // Rediriger vers le tableau de bord ou la page spécifiée après l'authentification
    navigate(appState?.returnTo || '/dashboard', { replace: true });
  };  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: import.meta.env.VITE_AUTH0_SCOPE
      }}
      onRedirectCallback={onRedirectCallback}
      useRefreshTokens={true}
      cacheLocation="localstorage"
    >
      {children}
    </Auth0Provider>
  );
};

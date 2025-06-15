// Auth0 Diagnostic Tool
// Ce script vérifie si nous pouvons accéder à l'API Auth0 et affiche la configuration actuelle

import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export function Auth0Diagnostic() {
  const { loginWithRedirect, isAuthenticated, isLoading, error, user } = useAuth0();
  const [testStatus, setTestStatus] = useState<{ [key: string]: boolean | string }>({});
  const [showConfigDetails, setShowConfigDetails] = useState(false);

  // Vérifier la configuration et tester l'accès
  useEffect(() => {
    // Tester les variables d'environnement
    const envTests = {
      'Auth0 Domain': !!import.meta.env.VITE_AUTH0_DOMAIN,
      'Auth0 Client ID': !!import.meta.env.VITE_AUTH0_CLIENT_ID,
      'Auth0 Audience': !!import.meta.env.VITE_AUTH0_AUDIENCE,
      'Auth0 Redirect URI': !!import.meta.env.VITE_AUTH0_REDIRECT_URI,
      'Auth0 Scope': import.meta.env.VITE_AUTH0_SCOPE === '' ? 'Vide (utilise openid profile email par défaut)' : 'OK',
    };

    // Tester l'URL de redirection
    const redirectUri = new URL('/auth/callback', window.location.origin).href;
    const redirectMatches = redirectUri === import.meta.env.VITE_AUTH0_REDIRECT_URI;
      // Comparer les ports
    let portMatches = false;
    const currentPort = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
    let configPort = '';
    
    try {
      configPort = new URL(import.meta.env.VITE_AUTH0_REDIRECT_URI).port || 
                  (new URL(import.meta.env.VITE_AUTH0_REDIRECT_URI).protocol === 'https:' ? '443' : '80');
      portMatches = currentPort === configPort;
    } catch (e) {
      console.error('Erreur lors de l\'analyse de l\'URL de redirection:', e);
    }

    setTestStatus({
      ...envTests,
      'URL de redirection correcte': redirectMatches,
      'Port actuel correspond au port configuré': portMatches,
      'Port actuel': currentPort,
      'Port configuré': configPort,
      'SDK Auth0 chargé': !isLoading,
      'Erreur SDK Auth0': error ? error.message : false,
      'Authentifié': isAuthenticated,
      'Utilisateur Auth0': user ? 'OK' : 'Non disponible',
    });
  }, [isLoading, isAuthenticated, error, user]);

  // Tester le login Auth0 explicitement
  const testAuth0Login = () => {
    console.log('🧪 Test de connexion Auth0');
    
    // Utiliser les scopes configurés dans .env ou une valeur par défaut si vide
    const scope = import.meta.env.VITE_AUTH0_SCOPE || 'openid profile email';
    
    loginWithRedirect({
      appState: { returnTo: '/auth0-diagnostic' },
      authorizationParams: {
        redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: scope,
      }
    });
  };

  // Afficher la configuration actuelle
  const renderConfig = () => {
    return (
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Configuration actuelle</h3>
        <pre className="text-xs bg-black text-white p-4 rounded overflow-auto">
          {JSON.stringify({
            VITE_AUTH0_DOMAIN: import.meta.env.VITE_AUTH0_DOMAIN,
            VITE_AUTH0_CLIENT_ID: import.meta.env.VITE_AUTH0_CLIENT_ID,
            VITE_AUTH0_AUDIENCE: import.meta.env.VITE_AUTH0_AUDIENCE,
            VITE_AUTH0_REDIRECT_URI: import.meta.env.VITE_AUTH0_REDIRECT_URI,
            VITE_AUTH0_SCOPE: import.meta.env.VITE_AUTH0_SCOPE || '(vide, utilise openid profile email)',
            BROWSER_URL: window.location.origin,
            FULL_REDIRECT_URI: new URL('/auth/callback', window.location.origin).href,
          }, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Diagnostic Auth0</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Statut des tests</h3>
        <div className="space-y-2">
          {Object.entries(testStatus).map(([test, result]) => (
            <div key={test} className="flex items-center justify-between p-2 border-b">
              <span>{test}</span>
              {result === true ? (
                <span className="text-green-600 font-medium">✅ OK</span>
              ) : result === false ? (
                <span className="text-red-600 font-medium">❌ Manquant</span>
              ) : (
                <span className={`${result === 'OK' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                  {result}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={testAuth0Login}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Tester la connexion Auth0
        </button>
        
        <button 
          onClick={() => setShowConfigDetails(!showConfigDetails)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
        >
          {showConfigDetails ? 'Masquer' : 'Afficher'} la configuration
        </button>
      </div>
      
      {showConfigDetails && renderConfig()}
      
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Étapes de vérification</h3>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Vérifiez que toutes les variables d'environnement sont présentes</li>
          <li>Confirmez que l'URL de redirection correspond à l'URL configurée dans Auth0</li>
          <li>Vérifiez que le port actuel correspond au port configuré dans l'URL de redirection</li>
          <li>Testez la connexion en cliquant sur le bouton "Tester la connexion Auth0"</li>
          <li>Si la connexion échoue, vérifiez la console du navigateur pour les erreurs</li>
          <li>Vérifiez les paramètres de votre application dans le dashboard Auth0</li>
        </ol>
      </div>
    </div>
  );
}

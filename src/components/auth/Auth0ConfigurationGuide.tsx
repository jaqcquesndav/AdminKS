// Configuration recommandée pour Auth0 avec React + Vite
// Ce guide fournit les étapes pour configurer correctement Auth0 pour une SPA React

export function Auth0ConfigurationGuide() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Guide de configuration Auth0</h2>
      
      <div className="p-4 bg-yellow-50 rounded-lg mb-6">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">⚠️ Erreur 401 lors de l'échange de code</h3>
        <p className="mb-2">L'erreur <code>POST https://dev-tezmln0tk0g1gouf.eu.auth0.com/oauth/token 401 (Unauthorized)</code> indique un problème lors de l'échange du code d'autorisation contre un token d'accès.</p>
        <p>Cette erreur est généralement causée par une mauvaise configuration de l'application dans le dashboard Auth0.</p>
      </div>
      
      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-3">1. Vérifier le type d'application</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-3">Assurez-vous que votre application est configurée comme <strong>Single Page Application (SPA)</strong> dans le dashboard Auth0.</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Connectez-vous à <a href={`https://${import.meta.env.VITE_AUTH0_DOMAIN}/dashboard/`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">votre dashboard Auth0</a></li>
              <li>Allez dans Applications &gt; Applications</li>
              <li>Sélectionnez votre application (<code>{import.meta.env.VITE_AUTH0_CLIENT_ID}</code>)</li>
              <li>Vérifiez que "Application Type" est réglé sur "Single Page Application"</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm"><strong>Note:</strong> Si votre application est de type "Regular Web Application" ou "Native", vous devrez peut-être créer une nouvelle application de type SPA.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">2. Configurer les URLs de callback</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-3">Votre URL de callback actuelle est <code>{import.meta.env.VITE_AUTH0_REDIRECT_URI}</code>. Assurez-vous qu'elle est autorisée dans Auth0.</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Dans les paramètres de votre application Auth0</li>
              <li>Trouvez la section "Application URIs"</li>
              <li>Ajoutez <code>{import.meta.env.VITE_AUTH0_REDIRECT_URI}</code> dans "Allowed Callback URLs"</li>
              <li>Ajoutez <code>http://localhost:5173</code> dans "Allowed Web Origins" (pour CORS)</li>
              <li>Ajoutez <code>{import.meta.env.VITE_AUTH0_LOGOUT_URI}</code> dans "Allowed Logout URLs"</li>
            </ol>
            <div className="mt-3 p-3 bg-red-50 rounded-lg">
              <p className="text-red-800 text-sm"><strong>Important:</strong> Les URLs doivent correspondre exactement, y compris le protocole, le port et le chemin.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">3. Vérifier la configuration de l'API</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-3">Votre audience actuelle est <code>{import.meta.env.VITE_AUTH0_AUDIENCE}</code>. Assurez-vous qu'elle correspond à une API configurée dans Auth0.</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Dans le dashboard Auth0, allez dans "Applications {'>'}APIs"</li>
              <li>Vérifiez qu'une API avec l'identifiant <code>{import.meta.env.VITE_AUTH0_AUDIENCE}</code> existe</li>
              <li>Si elle n'existe pas, créez-la avec cet identifiant</li>
              <li>Vérifiez que votre application SPA est autorisée à accéder à cette API</li>
            </ol>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">4. Configurer les scopes</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-3">Votre configuration de scope actuelle est <code>{import.meta.env.VITE_AUTH0_SCOPE || "(vide)"}</code>.</p>
            <p className="mb-3">Pour une SPA de base, assurez-vous d'inclure au minimum <code>openid profile email</code>.</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Dans votre fichier <code>.env</code>, assurez-vous que <code>VITE_AUTH0_SCOPE</code> contient au moins <code>"openid profile email"</code></li>
              <li>Si vous avez besoin d'accéder à des APIs protégées, ajoutez les scopes spécifiques de l'API</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm"><strong>Conseil:</strong> Commencez avec les scopes de base avant d'ajouter des scopes personnalisés pour faciliter le débogage.</p>
            </div>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">5. Paramètres de sécurité avancés</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-3">Certains paramètres de sécurité peuvent causer des problèmes d'authentification s'ils sont mal configurés.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vérifiez que "Token Endpoint Authentication Method" est réglé sur "None" pour une SPA</li>
              <li>Assurez-vous que CORS est correctement configuré</li>
              <li>Vérifiez que "Default Directory" est configuré si vous utilisez des connexions basées sur une base de données</li>
              <li>Vérifiez les règles (Rules) qui pourraient interférer avec le processus d'authentification</li>
            </ul>
          </div>
        </section>
        
        <section>
          <h3 className="text-xl font-semibold mb-3">6. Étapes de débogage spécifiques</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="mb-3">Pour résoudre le problème d'erreur 401 actuel:</p>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Allez sur la page <a href="/auth0-api-diagnostic" className="text-blue-600 hover:underline">Auth0 API Diagnostic</a> pour tester directement l'API Auth0</li>
              <li>Vérifiez les logs d'authentification dans le dashboard Auth0 (Auth0 Dashboard {'>'} Monitoring {'>'} Logs)</li>
              <li>Essayez temporairement de désactiver l'audience pour tester l'authentification de base</li>
              <li>Comparez les paramètres avec une application Auth0 SPA fonctionnelle</li>
            </ol>
          </div>
        </section>
      </div>
      
      <div className="mt-8 p-4 bg-green-50 rounded-lg">
        <h3 className="text-lg font-medium text-green-800 mb-2">Référence rapide</h3>
        <p className="mb-3">Voici une configuration typique pour une SPA React avec Auth0:</p>
        <pre className="bg-black text-green-400 p-3 rounded text-xs overflow-auto">
{`// .env
VITE_AUTH0_DOMAIN=votredomaine.auth0.com
VITE_AUTH0_CLIENT_ID=votre_client_id
VITE_AUTH0_AUDIENCE=https://api.votreapi.com
VITE_AUTH0_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_AUTH0_LOGOUT_URI=http://localhost:5173
VITE_AUTH0_SCOPE="openid profile email"

// Configuration Auth0Provider
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
</Auth0Provider>`}
        </pre>
      </div>
    </div>
  );
}

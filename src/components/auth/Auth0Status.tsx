import { useAuth0 } from '@auth0/auth0-react';
import { LoginButton } from './LoginButton';
import { LogoutButton } from './LogoutButton';

export const Auth0Status = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="flex items-center text-gray-500">Vérification de l'authentification...</div>;
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-3">Statut Auth0</h2>
      
      <div className="mb-4">
        <div className="flex items-center">
          <span className="font-medium mr-2">Statut:</span>
          {isAuthenticated ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Authentifié
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Non Authentifié
            </span>
          )}
        </div>
      </div>

      {isAuthenticated && user && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            {user.picture && (
              <img src={user.picture} alt={user.name} className="h-8 w-8 rounded-full mr-2" />
            )}
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="mt-2 text-sm">
            <p><span className="font-medium">ID:</span> {user.sub}</p>
            <p><span className="font-medium">Scopes:</span> {user['https://api.wanzo.com/scopes'] || 'Aucun'}</p>
            <p><span className="font-medium">Rôle:</span> {user['https://api.wanzo.com/role'] || 'Non défini'}</p>
          </div>
        </div>
      )}

      <div className="mt-4">
        {isAuthenticated ? <LogoutButton /> : <LoginButton />}
      </div>
    </div>
  );
};

export default Auth0Status;

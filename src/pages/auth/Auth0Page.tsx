import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Auth0Status from '../../components/auth/Auth0Status';

export const Auth0Page = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  // Rediriger vers le tableau de bord si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Authentification avec Auth0
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Connectez-vous avec votre compte pour accéder au tableau de bord d'administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth0Status />
          
          {isAuthenticated && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                  <p className="text-sm text-blue-700">
                    Vous êtes authentifié ! Redirection vers le tableau de bord...
                  </p>
                  <p className="mt-3 text-sm md:mt-0 md:ml-6">
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                    >
                      Accéder maintenant <span aria-hidden="true">&rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Intégration sécurisée avec l'API Gateway
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default { Auth0Page };

import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { authService } from '../services/auth/authService';
import { USE_MOCK_AUTH } from '../utils/mockAuth';

export function ProtectedRoute() {
  const { isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } = useAuth0();
  const isDemoAuthenticated = authService.isAuthenticated();
  const location = useLocation();

  // Vérification stricte - on s'assure que l'utilisateur est authentifié par l'une des méthodes
  const isAuthenticated = USE_MOCK_AUTH ? isDemoAuthenticated : (isAuth0Authenticated || isDemoAuthenticated);

  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (isAuth0Loading && !USE_MOCK_AUTH) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }

  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de login
  if (!isAuthenticated) {
    console.log('Utilisateur non authentifié, redirection vers login');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // L'utilisateur est authentifié, permettre l'accès aux routes protégées
  return <Outlet />;
}
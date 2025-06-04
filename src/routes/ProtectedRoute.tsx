import { Navigate, Outlet } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { authService } from '../services/auth/authService';
import { USE_MOCK_AUTH } from '../utils/mockAuth';

export function ProtectedRoute() {
  const { isAuthenticated: isAuth0Authenticated, isLoading: isAuth0Loading } = useAuth0();
  const isDemoAuthenticated = authService.isAuthenticated();

  // Si nous utilisons l'authentification de démonstration, vérifier uniquement cette authentification
  if (USE_MOCK_AUTH) {
    if (!isDemoAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <Outlet />;
  }

  // Si Auth0 est encore en cours de chargement, afficher un écran de chargement
  if (isAuth0Loading) {
    return <div>Chargement...</div>;
  }

  // Vérifier si l'utilisateur est authentifié soit via Auth0, soit via le système de démonstration
  if (!isAuth0Authenticated && !isDemoAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
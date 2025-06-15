import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();

  // Si l'authentification est en cours de chargement, afficher un écran de chargement
  if (isLoading) {
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
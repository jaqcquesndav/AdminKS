import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services/authService';

export function ProtectedRoute() {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
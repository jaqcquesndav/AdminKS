import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CompanyProfilePage } from '../pages/company/CompanyProfilePage';
import { CompanyRegistrationPage } from '../pages/company/CompanyRegistrationPage';
import { SubscriptionAndPaymentPage } from '../pages/subscription/SubscriptionAndPaymentPage';
import { UsersPage } from '../pages/users/UsersPage';
import { SettingsPage } from '../pages/settings/SettingsPage';
import { UserProfilePage } from '../pages/profile/UserProfilePage';
import { ActivitiesPage } from '../pages/activities/ActivitiesPage';
import { authService } from '../services/authService';

// Guard pour vérifier l'authentification
const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  if (!authService.isAuthenticated()) {
    // Rediriger vers la page d'authentification avec l'URL actuelle en paramètre
    const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `${import.meta.env.VITE_AUTH_URL}?redirect=${currentPath}`;
    return null;
  }
  return <>{children}</>;
};

// Guard pour les routes admin
const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const user = authService.getStoredUser();
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'profile',
        element: <UserProfilePage />,
      },
      {
        path: 'company/profile',
        element: <CompanyProfilePage />,
      },
      {
        path: 'company/register',
        element: <CompanyRegistrationPage />,
      },
      {
        path: 'subscriptions',
        element: <SubscriptionAndPaymentPage />,
      },
      {
        path: 'users',
        element: (
          <AdminGuard>
            <UsersPage />
          </AdminGuard>
        ),
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'activities',
        element: <ActivitiesPage />,
      },
    ],
  },
  // Rediriger toutes les autres routes vers la page d'accueil
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { PageLoader } from '../components/common/PageLoader';
import { ProtectedRoute } from './ProtectedRoute';
import { Auth0ProtectedRoute } from './Auth0ProtectedRoute';
import SettingsPage from '../pages/settings/SettingsPage'; // Import directly as default

// Lazy-loaded pages
const LoginPage = lazy(() => import('../pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
// Inscription désactivée - les utilisateurs sont créés par le super admin
// const SignUpPage = lazy(() => import('../pages/auth/SignupPage').then(module => ({ default: module.SignupPage })));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage').then(module => ({ default: module.ResetPasswordPage })));
const TwoFactorVerificationPage = lazy(() => import('../pages/auth/TwoFactorVerificationPage').then(module => ({ default: module.TwoFactorVerificationPage })));
const AuthCallbackPage = lazy(() => import('../pages/auth/AuthCallbackPage').then(module => ({ default: module.AuthCallbackPage })));
const NonAutorisePage = lazy(() => import('../pages/auth/NonAutorisePage').then(module => ({ default: module.NonAutorisePage })));
const APISettingsPage = lazy(() => import('../pages/settings/APISettingsPage').then(module => ({ default: module.APISettingsPage })));
const Auth0Page = lazy(() => import('../pages/auth/Auth0Page').then(module => ({ default: module.Auth0Page })));
const Auth0DashboardPage = lazy(() => import('../pages/dashboard/Auth0DashboardPage').then(module => ({ default: module.Auth0DashboardPage })));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage').then(module => ({ default: module.DashboardPage })));

// Customer pages
const CustomerListPage = lazy(() => import('../pages/customers/CustomerListPage').then(module => ({ default: module.CustomerListPage })));
const CustomerDetailsPage = lazy(() => import('../pages/customers/CustomerDetailsPage').then(module => ({ default: module.CustomerDetailsPage })));
const PmeCustomersPage = lazy(() => import('../pages/customers/PmeCustomersPage').then(module => ({ default: module.PmeCustomersPage })));
const FinancialCustomersPage = lazy(() => import('../pages/customers/FinancialCustomersPage').then(module => ({ default: module.FinancialCustomersPage })));
const PendingCustomersPage = lazy(() => import('../pages/customers/PendingCustomersPage').then(module => ({ default: module.PendingCustomersPage }))); 

// Finance pages
const RevenueAnalyticsPage = lazy(() => import('../pages/finance/RevenueAnalyticsPage').then(module => ({ default: module.RevenueAnalyticsPage })));
const SubscriptionsPage = lazy(() => import('../pages/finance/SubscriptionsPage').then(module => ({ default: module.SubscriptionsPage })));
const TokensPage = lazy(() => import('../pages/finance/TokensPage').then(module => ({ default: module.TokensPage })));
const PaymentsPage = lazy(() => import('../pages/finance/PaymentsPage').then(module => ({ default: module.PaymentsPage })));
const ManualPaymentsPage = lazy(() => import('../pages/finance/ManualPaymentsPage').then(module => ({ default: module.ManualPaymentsPage })));

// System pages - Utilisons des placeholders puisque ces pages n'existent pas encore
// Configuration pages - Utilisons des placeholders puisque ces pages n'existent pas encore
// Other pages
const UsersPage = lazy(() => import('../pages/users/UsersPage').then(module => ({ default: module.UsersPage })));
const ReportsPage = lazy(() => import('../pages/reports/ReportsPage').then(module => ({ default: module.ReportsPage })));
// const SettingsPage = lazy(() => import('../pages/settings/SettingsPage').then(module => ({ default: module.SettingsPage }))); // Comment out lazy load
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(module => ({ default: module.NotFoundPage })));

// Fallback components for non-existent pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <h1 className="text-2xl font-bold mb-4">{title}</h1>
    <p className="text-gray-600 mb-6">Cette page est en cours de développement.</p>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-blue-800">Elle sera disponible dans une prochaine mise à jour.</p>
    </div>
  </div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>      <Routes>        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        {/* Route d'inscription désactivée - les utilisateurs sont créés par le super admin
        <Route path="/signup" element={<SignUpPage />} /> */}        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/two-factor-verification" element={<TwoFactorVerificationPage />} />
        <Route path="/non-autorise" element={<NonAutorisePage />} />        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/auth0" element={<Auth0Page />} />
        
        {/* Settings route moved outside ProtectedRoute and MainLayout for testing */}
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
          {/* Protected routes */}
        <Route element={<ProtectedRoute />}>          <Route element={<MainLayout />}>
            {/* Default route redirects to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
              {/* Dashboard route */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/auth0" element={
              <Auth0ProtectedRoute>
                <Auth0DashboardPage />
              </Auth0ProtectedRoute>
            } />
            
            {/* Customers routes */}
            <Route path="/customers" element={<CustomerListPage />} />
            <Route path="/customers/:id" element={<CustomerDetailsPage />} />
            <Route path="/customers/pme" element={<PmeCustomersPage />} />
            <Route path="/customers/financial" element={<FinancialCustomersPage />} />
            <Route path="/customers/pending" element={<PendingCustomersPage />} />
              {/* Finance routes - Protected with Auth0 and specific scopes */}
            <Route path="/finance" element={
              <Navigate to="/finance/revenue" replace />
            } />
            <Route path="/finance/revenue" element={<RevenueAnalyticsPage />} />
            <Route path="/finance/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/finance/tokens" element={<TokensPage />} />
            <Route path="/finance/payments" element={<PaymentsPage />} />
            <Route path="/finance/manual" element={<ManualPaymentsPage />} />
              {/* System routes - Protected with Auth0 and admin scope */}
            <Route path="/system" element={
              <Navigate to="/system/health" replace />
            } />
            <Route path="/system/health" element={
              <PlaceholderPage title="État du Système" />
            } />
            <Route path="/system/api" element={
              <PlaceholderPage title="Performance API" />
            } />
            <Route path="/system/database" element={
              <PlaceholderPage title="Bases de Données" />
            } />
            <Route path="/system/ai" element={
              <PlaceholderPage title="Configuration IA" />
            } />
            <Route path="/system/alerts" element={
              <PlaceholderPage title="Alertes Système" />
            } />
            <Route path="/system/logs" element={
              <PlaceholderPage title="Logs Système" />
            } />
            
            {/* Configuration routes */}
            <Route path="/configuration" element={
              <Navigate to="/configuration/plans" replace />
            } />
            <Route path="/configuration/plans" element={
              <PlaceholderPage title="Plans & Tarifs" />
            } />
            <Route path="/configuration/tokens" element={
              <PlaceholderPage title="Packages Tokens" />
            } />
            <Route path="/configuration/ai-costs" element={
              <PlaceholderPage title="Coûts IA" />
            } />
            
            {/* Users routes */}
            <Route path="/users" element={<UsersPage />} />
              {/* Reports routes */}
            <Route path="/reports" element={<ReportsPage />} />
              {/* Settings routes */}
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/api" element={<APISettingsPage />} />
          </Route>
        </Route>
        
        {/* 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
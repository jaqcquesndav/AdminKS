import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAdminApi } from '../../hooks/useAdminApi';
import Auth0Status from '../../components/auth/Auth0Status';
import type { DashboardStats } from '../../services/api/adminApiService';

export const Auth0DashboardPage = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth0();
  const { getDashboardStats, loading: apiLoading, error } = useAdminApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (isAuthenticated) {
        const data = await getDashboardStats();
        if (data) {
          setStats(data);
        }
      }
    };

    fetchStats();
  }, [isAuthenticated, getDashboardStats]);

  const loading = authLoading || apiLoading;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Tableau de Bord (Auth0)</h1>
        <div className="md:w-1/3">
          <Auth0Status />
        </div>
      </div>

      {!isAuthenticated && !authLoading && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Vous n'êtes pas authentifié. Certaines fonctionnalités peuvent être limitées.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isAuthenticated && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Utilisateurs Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                <p className="text-gray-500 text-xs">sur {stats.totalUsers} au total</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Entreprises Actives</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeCompanies}</p>
                <p className="text-gray-500 text-xs">sur {stats.totalCompanies} au total</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Revenu Mensuel</p>
                <p className="text-2xl font-bold text-gray-900">{stats.revenueCurrentMonth.toLocaleString()} €</p>
                <p className={`text-xs ${stats.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {stats.growthRate >= 0 ? '+' : ''}{stats.growthRate}% vs mois précédent
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-gray-500 text-sm">Utilisation Tokens</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tokenUsage.total.toLocaleString()}</p>
                <p className="text-gray-500 text-xs">répartis sur {Object.keys(stats.tokenUsage.byCategory).length} catégories</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">Intégration avec l'API Gateway</h2>
        <p className="mb-4">
          Cette page démontre l'intégration complète entre Auth0 et l'API Gateway de Wanzo conformément à la documentation d'intégration.
        </p>
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="font-medium mb-2">Fonctionnalités implémentées :</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Authentification sécurisée via Auth0</li>
            <li>Gestion des tokens JWT</li>
            <li>Vérification des scopes et autorisations</li>
            <li>Communication avec les microservices via l'API Gateway</li>
            <li>Interface utilisateur pour la gestion des utilisateurs et entreprises</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default { Auth0DashboardPage };

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, LogIn, Users } from 'lucide-react';
import { USE_MOCK_AUTH, demoUsers } from '../../utils/mockAuth';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onKsAuth: () => Promise<void>;
  error?: string;
  onSwitchToSignUp: () => void;
  onForgotPassword?: () => void;
}

export function LoginForm({ onSubmit, onKsAuth, error, onSwitchToSignUp, onForgotPassword }: LoginFormProps) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoUser = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('demo123'); // Mot de passe fictif pour les démos
    setShowDemoAccounts(false);
    
    // Préparer la soumission du formulaire
    setIsLoading(true);
    
    try {
      console.log('Connexion avec compte de démo:', demoEmail);
      // Attendre explicitement que la connexion soit terminée
      await onSubmit(demoEmail, 'demo123');
      
      // Si onSubmit ne redirige pas (dans le cas où window.location.href n'est pas utilisé), on peut forcer ici
      console.log('Connexion réussie, vérification de la redirection...');
      
      // Donner un peu de temps pour que la redirection s'effectue normalement
      setTimeout(() => {
        // Vérifier si on est toujours sur la page de login
        if (window.location.pathname.includes('login')) {
          console.log('Redirection forcée vers le dashboard');
          window.location.href = '/dashboard';
        }
      }, 500);
      
    } catch (err) {
      console.error("Erreur lors de la connexion avec le compte de démo:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center mb-6">{t('auth.login.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.login.email')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('auth.login.emailPlaceholder')}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('auth.login.password')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={t('auth.login.passwordPlaceholder')}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {t('auth.login.forgotPassword')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
        </button>

        {/* Afficher les comptes de démonstration uniquement si USE_MOCK_AUTH est activé */}
        {USE_MOCK_AUTH && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Comptes de démonstration</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="w-full flex justify-center items-center py-2 px-4 border border-green-500 text-green-500 rounded-md hover:bg-green-500 hover:text-white transition-colors duration-200"
            >
              <Users className="w-5 h-5 mr-2" />
              {showDemoAccounts ? 'Masquer les comptes' : 'Choisir un compte de démonstration'}
            </button>

            {showDemoAccounts && (
              <div className="mt-3 space-y-2 border p-3 rounded-md">
                <h3 className="font-medium text-gray-700 mb-2">Sélectionner un rôle:</h3>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.superAdmin.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center"
                >
                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 mr-3 flex items-center justify-center font-bold">SA</span>
                  Super Admin - {demoUsers.superAdmin.email}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.cto.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 mr-3 flex items-center justify-center font-bold">CT</span>
                  CTO - {demoUsers.cto.email}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.finance.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center"
                >
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-800 mr-3 flex items-center justify-center font-bold">FI</span>
                  Finance - {demoUsers.finance.email}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.support.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 flex items-center"
                >
                  <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 mr-3 flex items-center justify-center font-bold">CS</span>
                  Support - {demoUsers.support.email}
                </button>
              </div>
            )}
          </>
        )}

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onKsAuth}
          className="w-full flex justify-center items-center py-2 px-4 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
        >
          <LogIn className="w-5 h-5 mr-2" />
          Se connecter avec KS Auth
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            {t('auth.login.signUpLink')}
          </button>
        </div>
      </form>
    </div>
  );
}
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, Users } from 'lucide-react';
import { USE_MOCK_AUTH, demoUsers } from '../../utils/mockAuth';
import { useTheme } from '../../contexts/ThemeContext';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onKsAuth?: () => Promise<void>;
  error?: string;
  onForgotPassword?: () => void;
  onSwitchToSignUp?: () => void;
}

export function LoginForm({ onSubmit, error, onForgotPassword }: LoginFormProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
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
    <div className={isDark ? 'dark' : ''}>
      <h2 className="text-2xl font-bold text-center mb-6 text-text-primary">{t('auth.login.title')}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t('auth.login.email')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-text-tertiary" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input pl-10"
              placeholder={t('auth.login.emailPlaceholder')}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            {t('auth.login.password')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-text-tertiary" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10 pr-12"
              placeholder={t('auth.login.passwordPlaceholder')}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-text-tertiary hover:text-text-secondary" />
              ) : (
                <Eye className="h-5 w-5 text-text-tertiary hover:text-text-secondary" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:text-primary-light"
          >
            {t('auth.login.forgotPassword')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn btn-primary w-full"
        >
          {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
        </button>

        {/* Afficher les comptes de démonstration uniquement si USE_MOCK_AUTH est activé */}
        {USE_MOCK_AUTH && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-bg-primary text-text-secondary">{t('auth.demo.title', 'Comptes de démonstration')}</span>
              </div>
            </div>          <button
            type="button"
            onClick={() => setShowDemoAccounts(!showDemoAccounts)}
            className="w-full flex justify-center items-center py-2 px-4 border border-success text-success rounded-md hover:bg-success hover:text-white transition-colors duration-200"
          >
            <Users className="w-5 h-5 mr-2" />
            {showDemoAccounts ? t('auth.demo.hide', 'Masquer les comptes') : t('auth.demo.choose', 'Choisir un compte de démonstration')}
          </button>

            {showDemoAccounts && (
              <div className="mt-3 space-y-2 border border-gray-200 dark:border-gray-700 p-3 rounded-md bg-bg-secondary dark:bg-bg-secondary">
                <h3 className="font-medium text-text-primary mb-2">{t('auth.demo.selectRole', 'Sélectionner un rôle:')}</h3>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.superAdmin.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-bg-tertiary dark:hover:bg-bg-tertiary flex items-center"
                >                  <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 mr-3 flex items-center justify-center font-bold">SA</span>
                  {t('auth.demo.roles.superAdmin')} - {demoUsers.superAdmin.email}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.cto.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-bg-tertiary dark:hover:bg-bg-tertiary flex items-center"
                >
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mr-3 flex items-center justify-center font-bold">CT</span>
                  {t('auth.demo.roles.cto')} - {demoUsers.cto.email}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.finance.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-bg-tertiary dark:hover:bg-bg-tertiary flex items-center"
                >
                  <span className="w-8 h-8 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mr-3 flex items-center justify-center font-bold">FI</span>
                  {t('auth.demo.roles.finance')} - {demoUsers.finance.email}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSelectDemoUser(demoUsers.support.email)}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-bg-tertiary dark:hover:bg-bg-tertiary flex items-center"
                >
                  <span className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 mr-3 flex items-center justify-center font-bold">CS</span>
                  {t('auth.demo.roles.support')} - {demoUsers.support.email}
                </button>
              </div>        )}
          </>
        )}
      </form>
    </div>
  );
}
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from '../../contexts/ThemeContext';

export function LoginPage() {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { loginWithRedirect } = useAuth0();

  const handleAuth0Login = () => {
    loginWithRedirect({
      appState: { returnTo: '/dashboard' }
    });
  };

  return (
    <div className={`min-h-screen bg-bg-secondary dark:bg-bg-secondary flex items-center justify-center ${isDark ? 'dark' : ''}`}>
      <div className="bg-bg-primary dark:bg-bg-primary p-8 rounded-lg shadow-md w-full max-w-md border border-gray-200 dark:border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-primary mb-1">Wanzo Administration</h1>
          <p className="text-sm text-text-secondary">Portail d'administration pour les gestionnaires Wanzo</p>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full mt-2"></div>
        </div>
        
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-text-primary mb-3">{t('auth.login.title', 'Connexion')}</h2>
            <p className="text-text-secondary mb-6">Utilisez votre compte Wanzo pour vous connecter au portail d'administration</p>
          </div>

          <button 
            onClick={handleAuth0Login}
            className="btn btn-primary w-full py-3 flex items-center justify-center text-white"
          >
            <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.5815 2H2.41852C1.63532 2 1 2.66467 1 3.48343V20.5166C1 21.3353 1.63532 22 2.41852 22H21.5815C22.3647 22 23 21.3353 23 20.5166V3.48343C23 2.66467 22.3647 2 21.5815 2Z" fill="#EB5424"/>
              <path d="M7.47787 17.0645H5.46692V8.4375H7.47787V17.0645Z" fill="white"/>
              <path d="M14.9366 17.0645H12.9256V12.3828C12.9256 11.1216 12.1357 10.8952 11.7462 10.8952C11.3566 10.8952 10.5667 11.2299 10.5667 12.3828V17.0645H8.55579V8.4375H10.5667V9.53799C10.7616 9.09205 11.5515 8.21593 12.9256 8.21593C14.2997 8.21593 14.9366 9.31143 14.9366 10.8952V17.0645Z" fill="white"/>
              <path d="M6.47276 7.35578C5.67895 7.35578 5.03613 6.70526 5.03613 5.90132C5.03613 5.09738 5.67895 4.44687 6.47276 4.44687C7.26657 4.44687 7.90939 5.09738 7.90939 5.90132C7.90939 6.70526 7.26657 7.35578 6.47276 7.35578Z" fill="white"/>
            </svg>
            {t('auth.login.continueWithAuth0', 'Continuer avec Auth0')}
          </button>
          
          <div className="text-center text-sm text-text-tertiary">
            <p>En vous connectant, vous acceptez nos <a href="#" className="text-primary hover:underline">conditions d'utilisation</a> et notre <a href="#" className="text-primary hover:underline">politique de confidentialité</a>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
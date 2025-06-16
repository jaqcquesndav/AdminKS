import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export const NonAutorisePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Initialize t function

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{t('auth.nonAutorisePage.title', 'Unauthorized Access')}</h1>
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-600 mb-6">
            {t('auth.nonAutorisePage.message', 'You do not have the necessary permissions to access this page. Please contact your administrator if you believe this is an error.')}
          </p>
          <div className="flex space-x-4 justify-center">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {t('auth.nonAutorisePage.backToDashboard', 'Back to Dashboard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default { NonAutorisePage };

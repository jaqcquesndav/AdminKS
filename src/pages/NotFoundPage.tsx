import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import useTranslation

export function NotFoundPage() {
  const { t } = useTranslation(); // Initialize t function

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-6xl font-bold text-red-500 mb-4">{t('notFound.title', '404')}</h1>
        <h2 className="text-2xl font-semibold mb-4">{t('notFound.heading', 'Page Not Found')}</h2>
        <p className="text-gray-600 mb-6">{t('notFound.message', 'The page you are looking for does not exist or has been moved.')}</p>
        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          {t('notFound.goHome', 'Back to Dashboard')}
        </Link>
      </div>
    </div>
  );
}
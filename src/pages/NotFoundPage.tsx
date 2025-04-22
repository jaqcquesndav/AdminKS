import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page non trouvée</h2>
        <p className="text-gray-600 mb-6">La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Retour au tableau de bord
        </Link>
      </div>
    </div>
  );
}
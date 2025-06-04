import { useState, useEffect } from 'react';
import { useApi } from '../../services/api/apiService';

interface Setting {
  id: string;
  name: string;
  value: string;
  description: string;
  category: string;
}

export const APISettingsPage = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.getSettings();
        setSettings(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error('Erreur lors de la récupération des paramètres:', err);
        setError(err instanceof Error ? err.message : 'Impossible de charger les paramètres');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [api]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres de l'API</h1>
      
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{error}</p>
          <p className="text-sm mt-2">
            Assurez-vous que vous êtes bien authentifié et que vous disposez des autorisations nécessaires.
          </p>
        </div>
      )}
      
      {!loading && !error && settings.length > 0 && (
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valeur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {settings.map((setting) => (
                <tr key={setting.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{setting.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{setting.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{setting.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{setting.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && settings.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          Aucun paramètre n'a été trouvé. Veuillez contacter l'administrateur système.
        </div>
      )}
    </div>  );
};

export default APISettingsPage;

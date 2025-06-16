import { useState, useEffect } from 'react';
// import { useApi } from '../../services/api/apiService'; // Replaced with useAppSettings
import { useAppSettings, AppSetting } from '../../hooks/useAppSettings'; // Import the new hook and type
import { useToast } from '../../hooks/useToast'; // For potential direct toast usage if needed, though hook handles it
import { Edit3, Save, XCircle as XIcon } from 'lucide-react'; // Added icons for editing

// Interface Setting is now AppSetting and imported from the hook

export const APISettingsPage = () => {
  const {
    settings,
    isLoading: loading, // Renamed for consistency with previous local state
    isUpdating,
    error,
    // fetchAppSettings, // fetch is called on mount by the hook
    updateAppSetting,
  } = useAppSettings();
  
  const { showToast } = useToast(); // Though errors are toasted in hook, can be used for other UI feedback

  const [editingSettingId, setEditingSettingId] = useState<string | null>(null);
  const [currentValue, setCurrentValue] = useState<string>('');

  const handleEdit = (setting: AppSetting) => {
    setEditingSettingId(setting.id);
    setCurrentValue(setting.value);
  };

  const handleCancelEdit = () => {
    setEditingSettingId(null);
    setCurrentValue('');
  };

  const handleSave = async (settingId: string) => {
    if (currentValue === settings.find(s => s.id === settingId)?.value) {
      showToast('info', 'No changes made to the setting value.');
      setEditingSettingId(null);
      return;
    }
    await updateAppSetting(settingId, currentValue);
    // Error/Success is handled by the hook, toast is shown there.
    // Only clear editing state if update was successful (or error occurred, isUpdating will become null)
    if (!isUpdating) { // Check if isUpdating is null (meaning update finished)
        setEditingSettingId(null); 
    }
  };

  // If an update is in progress and finishes, clear editing state
  // This handles the case where updateAppSetting completes
  useEffect(() => {
    if (editingSettingId && !isUpdating) {
      // If we were editing an ID, and isUpdating became null (meaning update finished for that ID or any other)
      // We might want to be more specific if multiple updates could happen, but for one-by-one edit, this is fine.
      const stillEditingThisOne = settings.find(s => s.id === editingSettingId);
      if (stillEditingThisOne && stillEditingThisOne.value !== currentValue) {
        // If the value in the main list didn't change to our currentValue, it means an error likely occurred
        // or the updateAppSetting in the hook reset it due to an error.
        // The error toast would have been shown by the hook.
      }
      // Always clear editing mode after an attempt
      // setEditingSettingId(null); // This is now handled in handleSave after await or if isUpdating becomes null
    }
  }, [isUpdating, editingSettingId, settings, currentValue]);


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Paramètres de l'API</h1>
      
      {loading && (
        // ... existing loading spinner ...
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </div>
      )}

      {error && !loading && (
        // ... existing error display ...
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {editingSettingId === setting.id ? (
                      <input 
                        type="text" 
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm p-1 w-full"
                        disabled={isUpdating === setting.id}
                      />
                    ) : (
                      setting.value
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{setting.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{setting.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingSettingId === setting.id ? (
                      <>
                        <button 
                          onClick={() => handleSave(setting.id)}
                          className="text-green-600 hover:text-green-900 mr-2 disabled:opacity-50"
                          disabled={isUpdating === setting.id}
                        >
                          {isUpdating === setting.id ? 'Saving...' : <Save size={18} />}
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          disabled={isUpdating === setting.id}
                        >
                          <XIcon size={18} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleEdit(setting)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        disabled={!!isUpdating} // Disable edit if any setting is currently being updated
                      >
                        <Edit3 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && settings.length === 0 && (
        // ... existing no settings display ...
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          Aucun paramètre n'a été trouvé. Veuillez contacter l'administrateur système.
        </div>
      )}
    </div>  );
};

export default APISettingsPage;

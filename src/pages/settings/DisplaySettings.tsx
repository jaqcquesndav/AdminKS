import React, { useState } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { useToastContext } from '../../contexts/ToastContext';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const DisplaySettings: React.FC = () => {
  const { theme, setTheme, layout, setLayout } = useTheme();
  const { showToast } = useToastContext();
  const { t } = useTranslation(); // Initialize t function
  const [isUpdating, setIsUpdating] = useState(false);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setIsUpdating(true);
      setTheme(event.target.value as 'light' | 'dark' | 'system');
      showToast('success', t('settings.display.themeUpdateSuccess', 'Theme updated successfully'));
    } catch (error) {
      showToast('error', t('settings.display.themeUpdateError', 'Failed to update theme'));
      console.error('Error updating theme:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      setIsUpdating(true);
      setLayout(event.target.value as 'compact' | 'comfortable');
      showToast('success', t('settings.display.layoutUpdateSuccess', 'Layout updated successfully'));
    } catch (error) {
      showToast('error', t('settings.display.layoutUpdateError', 'Failed to update layout'));
      console.error('Error updating layout:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('settings.display.title', 'Display Settings')}</h2>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label htmlFor="theme-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.display.themeLabel', 'Theme')}</label>
          <select
            id="theme-select"
            value={theme}
            onChange={handleThemeChange}
            className="mt-1 block w-[180px] pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={isUpdating}
          >
            <option value="light">{t('settings.display.themeLight', 'Light')}</option>
            <option value="dark">{t('settings.display.themeDark', 'Dark')}</option>
            <option value="system">{t('settings.display.themeSystem', 'System')}</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="layout-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('settings.display.layoutLabel', 'Layout')}</label>
          <select
            id="layout-select"
            value={layout}
            onChange={handleLayoutChange}
            className="mt-1 block w-[180px] pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            disabled={isUpdating}
          >
            <option value="compact">{t('settings.display.layoutCompact', 'Compact')}</option>
            <option value="comfortable">{t('settings.display.layoutComfortable', 'Comfortable')}</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;

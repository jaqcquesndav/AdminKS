import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AlertCircle, Download, Upload, Trash2 } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const AdvancedSettings: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const handleDataExport = () => {
    showToast(
      'info',
      t('settings.advanced.exportStarted'),
      5000
    );
    // Actual export logic would be implemented here
  };
  const handleDataImport = () => {
    // In a real app, this would open a file selector
    showToast(
      'info',
      t('settings.advanced.importStarted'),
      5000
    );
  };
  const handleResetConfirm = () => {
    if (confirmReset) {
      // Actual reset logic would be implemented here
      showToast(
        'success',
        t('settings.advanced.resetComplete'),
        5000
      );
      setConfirmReset(false);
    } else {
      setConfirmReset(true);
    }
  };

  return (
    <div className="space-y-8">      {/* Data Export Section */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          {t('settings.advanced.exportData')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('settings.advanced.exportDescription')}
        </p>
        
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('settings.advanced.exportFormat')}
          </label>
          <select
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm rounded-lg focus:ring-primary focus:border-primary dark:focus:ring-primary-light dark:focus:border-primary-light block w-full p-2.5"
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="xlsx">Excel (XLSX)</option>
          </select>
        </div>
        
        <button
          onClick={handleDataExport}
          className="flex items-center justify-center gap-2 bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-lg hover:bg-primary-light dark:hover:bg-primary transition-colors"
        >
          <Download size={16} />
          {t('settings.advanced.exportButton')}
        </button>
      </div>      {/* Data Import Section */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
          {t('settings.advanced.importData')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {t('settings.advanced.importWarning')}
        </p>
        
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <p className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {t('settings.advanced.dropFiles')}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('settings.advanced.supportedFormats')}
          </p>
          <button
            onClick={handleDataImport}
            className="mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {t('settings.advanced.browseFiles')}
          </button>
        </div>
      </div>      {/* Reset Application Section */}
      <div className="card border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/20 p-6 rounded-lg shadow-sm">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-medium text-red-700 dark:text-red-400 mb-2">
              {t('settings.advanced.resetApplication')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {t('settings.advanced.resetWarning')}
            </p>
            
            {confirmReset && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-300 dark:border-red-800 mb-4">
                <p className="text-red-700 dark:text-red-400 font-medium mb-2">
                  {t('settings.advanced.confirmReset')}
                </p>
                <p className="text-sm text-gray-600 mb-3">
                  {t('settings.advanced.confirmResetDescription')}
                </p>
              </div>
            )}
            
            <button
              onClick={handleResetConfirm}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                confirmReset
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-white border border-red-300 text-red-600 hover:bg-red-50'
              }`}
            >
              <Trash2 size={16} />
              {confirmReset
                ? t('settings.advanced.confirmResetButton')
                : t('settings.advanced.resetButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
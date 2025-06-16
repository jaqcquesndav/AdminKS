import React from 'react';
import { useTheme } from '../../hooks/useTheme';

const DisplaySettings: React.FC = () => {
  const { theme, setTheme, layout, setLayout } = useTheme();

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as 'light' | 'dark' | 'system');
  };

  const handleLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLayout(event.target.value as 'compact' | 'comfortable');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Display Settings</h2>
      </div>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <label htmlFor="theme-select" className="text-sm font-medium text-gray-700">Theme</label>
          <select
            id="theme-select"
            value={theme}
            onChange={handleThemeChange}
            className="mt-1 block w-[180px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="layout-select" className="text-sm font-medium text-gray-700">Layout</label>
          <select
            id="layout-select"
            value={layout}
            onChange={handleLayoutChange}
            className="mt-1 block w-[180px] pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="compact">Compact</option>
            <option value="comfortable">Comfortable</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default DisplaySettings;

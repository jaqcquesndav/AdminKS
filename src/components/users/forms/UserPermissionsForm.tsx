import React from 'react';
import { useTranslation } from 'react-i18next';
import { PERMISSIONS, type Permission, type ApplicationPermission } from '../../../types/permissions';
import { AVAILABLE_APPLICATIONS } from '../../../types/permissions';

interface UserPermissionsFormProps {
  permissions: ApplicationPermission[];
  onChange: (permissions: ApplicationPermission[]) => void;
}

export function UserPermissionsForm({ permissions, onChange }: UserPermissionsFormProps) {
  const { t } = useTranslation();

  const handlePermissionChange = (applicationId: string, permission: Permission, checked: boolean) => {
    const newPermissions = [...permissions];
    const appPermission = newPermissions.find(p => p.applicationId === applicationId);
    
    if (checked) {
      if (appPermission) {
        appPermission.permissions = [...new Set([...appPermission.permissions, permission])];
      } else {
        newPermissions.push({ applicationId, permissions: [permission] });
      }
    } else {
      if (appPermission) {
        appPermission.permissions = appPermission.permissions.filter(p => p !== permission);
        if (appPermission.permissions.length === 0) {
          const index = newPermissions.findIndex(p => p.applicationId === applicationId);
          newPermissions.splice(index, 1);
        }
      }
    }
    
    onChange(newPermissions);
  };

  const hasPermission = (applicationId: string, permission: Permission) => {
    return permissions.some(p => 
      p.applicationId === applicationId && p.permissions.includes(permission)
    );
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {t('users.permissions.title')}
      </h3>
      
      <div className="space-y-8">
        {AVAILABLE_APPLICATIONS.map(app => (
          <div key={app.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">{app.name}</span>
            </div>
            
            <div className="space-x-4">
              {Object.entries(PERMISSIONS).map(([key, label]) => (
                <label key={key} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={hasPermission(app.id, key as Permission)}
                    onChange={(e) => handlePermissionChange(app.id, key as Permission, e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
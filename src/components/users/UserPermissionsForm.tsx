import React from 'react';
import { useTranslation } from 'react-i18next';
import { ERP_GROUP, FINANCE_GROUP } from '../../types/subscription';
import { PERMISSIONS, type Permission, type ApplicationPermission } from '../../types/permissions';

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
        {[ERP_GROUP, FINANCE_GROUP].map(group => (
          <div key={group.id} className="space-y-4">
            <h4 className="text-md font-medium text-gray-700">{group.name}</h4>
            
            <div className="grid grid-cols-1 gap-4">
              {group.applications.map(app => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{app.name}</span>
                  </div>
                  
                  <div className="space-x-4">
                    {Object.entries(PERMISSIONS).map(([permission, label]) => (
                      <label key={permission} className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={hasPermission(app.id, permission as Permission)}
                          onChange={(e) => handlePermissionChange(app.id, permission as Permission, e.target.checked)}
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
        ))}
      </div>
    </div>
  );
}
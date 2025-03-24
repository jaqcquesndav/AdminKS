import React from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, Shield, MapPin } from 'lucide-react';
import type { AuthUser } from '../../../types/auth';

interface ProfileDisplayProps {
  user: AuthUser;
}

export function ProfileDisplay({ user }: ProfileDisplayProps) {
  const { t } = useTranslation();

  // Get user initials safely
  const getInitials = () => {
    if (!user.name) return 'U';
    return user.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
          <span className="text-2xl font-medium text-white">
            {getInitials()}
          </span>
        </div>
        <div>
          <h3 className="text-xl font-medium">{user.name || t('common.user')}</h3>
          <p className="text-sm text-gray-500">{t(`users.roles.${user.role}`)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-3">
          <Mail className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">{t('settings.profile.email')}</p>
            <p className="font-medium">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Phone className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">{t('settings.profile.phone')}</p>
            <p className="font-medium">{user.phoneNumber || t('settings.profile.phoneNotSet')}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">{t('settings.profile.role')}</p>
            <p className="font-medium">{t(`users.roles.${user.role}`)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <MapPin className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">{t('settings.profile.location')}</p>
            <p className="font-medium">{user.location || t('settings.profile.locationNotSet')}</p>
          </div>
        </div>
      </div>

      {user.twoFactorEnabled && (
        <div className="mt-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-green-500 mr-2" />
            <p className="text-sm text-green-700">
              {t('settings.security.twoFactorEnabled')}
              {user.twoFactorMethod && (
                <span className="ml-1">
                  ({t(`settings.security.twoFactorMethods.${user.twoFactorMethod}`)})
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
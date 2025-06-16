import { useTranslation } from 'react-i18next';
import { Mail, Phone, Shield, Key, Calendar } from 'lucide-react';
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
        {user.picture ? (
          <img src={user.picture} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
        ) : (
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
            <span className="text-2xl font-medium text-white">
              {getInitials()}
            </span>
          </div>
        )}
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
          <Key className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">ID agent iKiotahub</p>
            <p className="font-medium">{user.idAgent || '-'}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <p className="text-sm text-gray-500">{t('settings.profile.validityEnd', 'Validité jusqu\'à')}</p>
            <p className="font-medium">{user.validityEnd ? new Date(user.validityEnd).toLocaleDateString() : '-'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
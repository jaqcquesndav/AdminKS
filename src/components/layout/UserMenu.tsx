import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth, useUserInfo } from '../../hooks/useAuth';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const userInfo = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const handleLogout = () => {
    logout();
  };

  if (!userInfo) return null;

  const getInitials = () => {
    if (!userInfo.name) return 'U';
    return userInfo.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {userInfo.picture ? (
          <img
            src={userInfo.picture}
            alt={userInfo.name}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials()}
            </span>
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
          {userInfo.name || t('common.user')}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {userInfo.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userInfo.email}
            </p>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/profile');
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <User className="w-4 h-4 mr-3" />
              {t('header.profile')}
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 mr-3" />
              {t('header.settings')}
            </button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {t('header.logout')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
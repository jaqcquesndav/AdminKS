import React from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NotificationsMenu } from './NotificationsMenu';
import { UserMenu } from './UserMenu';
import { ChatButton } from '../chat/ChatButton';
import { COMPANY_INFO } from '../../types/payment';
import { useUserInfo } from '../../hooks/useAuth';

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onThemeToggle: () => void;
  isDark: boolean;
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen, onThemeToggle, isDark }: HeaderProps) {
  const userInfo = useUserInfo();

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo et menu mobile */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <div className="ml-3">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{COMPANY_INFO.name}</h1>
            <p className="text-xs text-gray-500">{COMPANY_INFO.slogan}</p>
          </div>
        </div>

        {/* Logo desktop */}
        <div className="hidden lg:flex lg:items-center lg:flex-col lg:items-start">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{COMPANY_INFO.name}</h1>
          <p className="text-sm text-gray-500">{COMPANY_INFO.slogan}</p>
        </div>

        {/* Actions à droite */}
        <div className="flex items-center">
          {userInfo.isAdmin && (
            <span className="mr-4 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              Administrateur
            </span>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label="Changer le thème"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <ChatButton />
            <NotificationsMenu />
          </div>
          <div className="ml-2 sm:ml-4 pl-2 sm:pl-4 border-l border-gray-200 dark:border-gray-700">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NotificationsMenu } from './NotificationsMenu';
import { UserMenu } from './UserMenu';
import { ChatButton } from '../chat/ChatButton';
import { useUserInfo } from '../../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Add i18next import

interface HeaderProps {
  onMobileMenuToggle: () => void;
  isMobileMenuOpen: boolean;
  onThemeToggle: () => void;
  isDark: boolean;
}

export function Header({ onMobileMenuToggle, isMobileMenuOpen, onThemeToggle, isDark }: HeaderProps) {
  const { t } = useTranslation(); // Initialize the translation hook
  const userInfo = useUserInfo();
  const location = useLocation();
  
  // Determine the page title based on current path using translations
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return t('navigation.dashboard', 'Tableau de bord');
    if (path.startsWith('/users')) return t('navigation.users', 'Gestion des utilisateurs');
    if (path.startsWith('/company')) return t('navigation.company', 'Profil entreprise');
    if (path.startsWith('/settings')) return t('navigation.settings', 'Paramètres');
    if (path.startsWith('/customers')) return t('navigation.customers', 'Clients');
    if (path.startsWith('/finance')) return t('navigation.finance', 'Finance');
    if (path.startsWith('/reports')) return t('navigation.reports', 'Rapports');
    if (path.startsWith('/activities')) return t('navigation.activities', 'Activités');
    if (path.startsWith('/subscription')) return t('navigation.subscription', 'Abonnement');
    if (path.startsWith('/profile')) return t('navigation.profile', 'Profil');
    return t('common.adminTitle', 'Wanzo Admin');
  };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-30">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Mobile menu button and page title */}
        <div className="flex items-center">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 mr-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            aria-label={t('common.menu', 'Menu')}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
          <div>
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center">
          {userInfo.isSuperAdmin && (
            <span className="mr-4 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {t('users.roles.super_admin', 'Super Admin')}
            </span>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={onThemeToggle}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              aria-label={t('common.toggleTheme', 'Changer le thème')}
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
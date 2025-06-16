import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth, useUserInfo } from '../../hooks/useAuth';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { useTranslation } from 'react-i18next';

function LogoutConfirmModal({ isOpen, onClose, onLocal, onGlobal }: { isOpen: boolean; onClose: () => void; onLocal: () => void; onGlobal: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-xs">
        <h3 className="text-lg font-bold mb-2">Déconnexion</h3>
        <p className="mb-4 text-sm text-gray-700">Voulez-vous vous déconnecter seulement ici ou partout&nbsp;?</p>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded bg-gray-100">Annuler</button>
          <button onClick={onLocal} className="px-3 py-1 rounded bg-primary text-white">Seulement ici</button>
          <button onClick={onGlobal} className="px-3 py-1 rounded bg-red-600 text-white">Partout</button>
        </div>
      </div>
    </div>
  );
}

export function UserMenu() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout: localLogout } = useAuth();
  const { logout: auth0Logout } = useAuth0();
  const userInfo = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const handleLogoutLocal = () => {
    localLogout();
    setShowLogoutModal(false);
    setIsOpen(false);
    navigate('/login');
  };
  const handleLogoutGlobal = () => {
    localLogout();
    setShowLogoutModal(false);
    setIsOpen(false);
    auth0Logout({ logoutParams: { returnTo: window.location.origin + '/login' } });
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
            alt={userInfo.name || t('header.userMenu.defaultName', 'Utilisateur')}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {getInitials()}
            </span>
          </div>
        )}        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[120px] truncate">
          {userInfo.name || t('header.userMenu.defaultName', 'Utilisateur')}
        </span>
      </button>      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {userInfo.name || t('header.userMenu.defaultName', 'Utilisateur')}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {userInfo.email || t('header.userMenu.defaultEmail', 'Email non disponible')}
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
              {t('header.userMenu.profile', 'Mon Profil')} 
            </button>
            
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/settings');
              }}
              className="flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Settings className="w-4 h-4 mr-3" />
              {t('header.userMenu.settings', 'Paramètres')}
            </button>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700 py-1">
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <LogOut className="w-4 h-4 mr-3" />
              {t('header.userMenu.logout', 'Déconnexion')}
            </button>
          </div>
        </div>
      )}
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLocal={handleLogoutLocal}
        onGlobal={handleLogoutGlobal}
      />
    </div>
  );
}
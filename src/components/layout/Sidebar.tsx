import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Building2, CreditCard, Users, LayoutDashboard, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { COMPANY_INFO } from '../../types/payment';

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const navigation = [
  { name: 'Tableau de bord', icon: LayoutDashboard, path: '/' },
  { name: 'Entreprise', icon: Building2, path: '/company/profile' },
  { name: 'Souscriptions', icon: CreditCard, path: '/subscriptions' },
  { name: 'Utilisateurs', icon: Users, path: '/users' },
  { name: 'Paramètres', icon: Settings, path: '/settings' },
] as const;

const APP_VERSION = '1.0.0';

export function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  const sidebarWidth = isCollapsed && !isMobile ? 'w-20' : 'w-64';
  const sidebarPosition = isMobile 
    ? `fixed inset-y-0 left-0 z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`
    : 'relative transform translate-x-0';

  return (
    <>
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        id="sidebar"
        className={`
          ${sidebarWidth}
          ${sidebarPosition}
          bg-primary dark:bg-gray-800
          text-white
          flex flex-col
          h-full
          flex-shrink-0
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="p-4 border-b border-primary-dark/20 dark:border-gray-700">
          <div className={`flex items-center ${isCollapsed && !isMobile ? 'justify-center' : 'space-x-3'}`}>
            <div className="flex-shrink-0">
              <Building2 className="w-8 h-8 text-white/90" />
            </div>
            {(!isCollapsed || isMobile) && (
              <div>
                <h1 className="text-lg font-bold">{COMPANY_INFO.name}</h1>
                <p className="text-xs text-gray-300">v{APP_VERSION}</p>
              </div>
            )}
          </div>
        </div>

        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-6 bg-primary dark:bg-gray-800 rounded-full p-1 text-white hover:bg-primary-dark dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={isCollapsed ? 'Développer' : 'Réduire'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? onClose : undefined}
              className={`
                flex items-center px-4 py-3 text-sm rounded-md transition-colors duration-200
                ${location.pathname === item.path
                  ? 'bg-white/10 dark:bg-gray-700 text-white'
                  : 'text-white/80 hover:bg-white/5 dark:hover:bg-gray-700 hover:text-white'}
              `}
              title={isCollapsed && !isMobile ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {(!isCollapsed || isMobile) && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-dark/20 dark:border-gray-700">
          <div className="text-xs text-white/60 text-center">
            {(!isCollapsed || isMobile) && `${COMPANY_INFO.name} © ${new Date().getFullYear()}`}
          </div>
        </div>
      </aside>
    </>
  );
}
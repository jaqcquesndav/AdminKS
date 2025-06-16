import { useState, useEffect, ElementType, useCallback } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';
import { ChevronLeft, ChevronRight, ChevronDown, Building2, HelpCircle } from 'lucide-react';
import { COMPANY_INFO } from '../../types/payment';
import { getNavigationByRole, navigationConfig } from '../../config/navigation';
import { useUserInfo } from '../../hooks/useAuth';
import { UserRole } from '../../types/user';
import { NavigationItem } from '../../config/navigation';
import { useTranslation } from 'react-i18next'; // Add i18next import

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

const APP_VERSION = '1.0.0';

// Fonction pour obtenir l'icône Lucide à partir du nom de l'icône en string
const getLucideIcon = (iconName: string): ElementType => {
  // Map des icônes en cas d'incompatibilité entre les noms dans la config et les noms Lucide
  const iconMap: Record<string, keyof typeof LucideIcons> = {
    'home': 'Home',
    'briefcase': 'Briefcase',
    'building': 'Building2',
    'landmark': 'Landmark',
    'clock': 'Clock',
    'dollar-sign': 'DollarSign',
    'trending-up': 'TrendingUp',
    'credit-card': 'CreditCard',
    'layers': 'Layers',
    'file-text': 'FileText',
    'check-square': 'CheckSquare',
    'server': 'Server',
    'activity': 'Activity',
    'wifi': 'Wifi',
    'database': 'Database',
    'cpu': 'Cpu',
    'bell': 'Bell',
    'file': 'File',
    'settings': 'Settings',
    'package': 'Package',
    'trending-down': 'TrendingDown',
    'users': 'Users',
    'bar-chart-2': 'BarChart2',
    'sliders': 'Sliders'
  };
  
  // Récupérer le nom de l'icône mappé ou utiliser le nom original
  const mappedIconName = iconMap[iconName] || iconName as keyof typeof LucideIcons;
  
  // Récupérer le composant d'icône ou utiliser HelpCircle comme fallback
  return (LucideIcons[mappedIconName] as ElementType) || HelpCircle;
};

export function Sidebar({ isOpen, isMobile, onClose }: SidebarProps) {
  const { t } = useTranslation(); // Initialize the translation hook
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);  const userInfo = useUserInfo();
  
  // Utiliser directement le rôle mappé du hook useUserInfo pour garantir la cohérence
  const userRole = userInfo.role as UserRole;
  
  // Log pour déboguer - à supprimer en production
  useEffect(() => {
    console.log('Current user role for navigation:', userRole);
    console.log('User info:', userInfo);
    console.log('Is super admin?', userInfo.isSuperAdmin);
    console.log('Navigation items before filter:', navigationConfig);
    console.log('Navigation items after filter:', getNavigationByRole(userRole));
  }, [userRole, userInfo]);
  
  // Obtenir les éléments de navigation filtrés par le rôle de l'utilisateur
  // Si c'est un super admin, utiliser navigationConfig directement
  const navigationItems = userInfo.isSuperAdmin 
    ? navigationConfig 
    : getNavigationByRole(userRole);

  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(false);
    }
  }, [isMobile]);

  // Détermine si un élément est actif (route actuelle)
  const isItemActive = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    
    // Correction: Amélioration de la logique pour déterminer si un chemin est actif
    // Comparaison plus précise pour éviter les correspondances partielles incorrectes
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(`${path}/`));
  }, [location.pathname]);

  // Ouvre automatiquement les sous-menus contenant la route active
  useEffect(() => {
    // Vérifie si un élément de menu a un sous-élément actif (déplacé dans useEffect)
    const hasActiveChild = (item: NavigationItem) => {
      if (!item.subItems) return false;
      return item.subItems.some((subItem) => isItemActive(subItem.path));
    };
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const topLevelPath = `/${pathSegments[0]}`;
      
      navigationItems.forEach((item) => {
        if (item.path === topLevelPath || hasActiveChild(item)) {
          if (!expandedItems.includes(item.id)) {
            setExpandedItems(prev => [...prev, item.id]);
          }
        }
      });
    }
  }, [location.pathname, navigationItems, expandedItems, isItemActive]);

  // Gère l'expansion et la réduction d'un élément de menu
  const toggleExpand = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
    );
  };

  // Vérifie si un élément doit être affiché comme développé
  const isExpanded = (id: string) => {
    return expandedItems.includes(id);
  };

  // Ferme automatiquement le menu mobile lors du changement de route
  const handleNavigation = isMobile ? onClose : undefined;

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
          bg-[#197ca8] dark:bg-gray-800
          text-white
          flex flex-col
          h-full
          flex-shrink-0
          transition-all duration-300 ease-in-out
        `}
      >
        <div className="p-4 border-b border-[#156d93]/20 dark:border-gray-700">
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
            className="absolute -right-3 top-6 bg-[#197ca8] dark:bg-gray-800 rounded-full p-1 text-white hover:bg-[#156d93] dark:hover:bg-gray-700 transition-colors duration-200"
            aria-label={isCollapsed ? t('common.expand', 'Développer') : t('common.collapse', 'Réduire')}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = getLucideIcon(item.icon);
            const isActive = isItemActive(item.path);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isItemExpanded = isExpanded(item.id);
            
            // Vérifier si un sous-élément est actif
            const isSubItemActive = hasSubItems && 
              item.subItems?.some(subItem => isItemActive(subItem.path));
            
            return (
              <div key={item.id} className="space-y-1">
                {/* Élément de menu principal */}
                {hasSubItems ? (
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 text-sm rounded-md transition-colors duration-200
                      ${isActive || isSubItemActive
                        ? 'bg-white/10 dark:bg-gray-700 text-white'
                        : 'text-white/80 hover:bg-white/5 dark:hover:bg-gray-700 hover:text-white'}
                    `}
                    title={isCollapsed && !isMobile ? t(`navigation.${item.id}`, item.label) : undefined}
                  >
                    <div className="flex items-center">
                      <IconComponent className="w-5 h-5 flex-shrink-0" />
                      {(!isCollapsed || isMobile) && <span className="ml-3">{t(`navigation.${item.id}`, item.label)}</span>}
                    </div>
                    {(!isCollapsed || isMobile) && (
                      <ChevronDown 
                        className={`w-4 h-4 transition-transform duration-200 ${isItemExpanded ? 'rotate-180' : ''}`} 
                      />
                    )}
                  </button>
                ) : (
                  <NavLink
                    to={item.path}
                    onClick={handleNavigation}
                    className={`
                      flex items-center px-4 py-3 text-sm rounded-md transition-colors duration-200
                      ${isActive
                        ? 'bg-white/10 dark:bg-gray-700 text-white'
                        : 'text-white/80 hover:bg-white/5 dark:hover:bg-gray-700 hover:text-white'}
                    `}
                    title={isCollapsed && !isMobile ? t(`navigation.${item.id}`, item.label) : undefined}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {(!isCollapsed || isMobile) && <span className="ml-3">{t(`navigation.${item.id}`, item.label)}</span>}
                  </NavLink>
                )}

                {/* Sous-menus */}
                {hasSubItems && (!isCollapsed || isMobile) && isItemExpanded && (
                  <div className="pl-6 space-y-1 pt-1">
                    {item.subItems?.map(subItem => {
                      const SubIconComponent = getLucideIcon(subItem.icon);
                      
                      return (
                        <NavLink
                          to={subItem.path}
                          key={subItem.id}
                          onClick={handleNavigation}
                          className={`
                            flex items-center px-3 py-2 text-sm rounded-md transition-colors duration-200
                            ${isItemActive(subItem.path)
                              ? 'bg-white/10 dark:bg-gray-700 text-white'
                              : 'text-white/70 hover:bg-white/5 dark:hover:bg-gray-700 hover:text-white'}
                          `}
                        >
                          <SubIconComponent className="w-4 h-4 flex-shrink-0" />
                          <span className="ml-3">{t(`navigation.${subItem.id}`, subItem.label)}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#156d93]/20 dark:border-gray-700">
          <div className="text-xs text-white/60 text-center">
            {(!isCollapsed || isMobile) && `${COMPANY_INFO.name} © ${new Date().getFullYear()}`}
          </div>
        </div>
      </aside>
    </>
  );
}
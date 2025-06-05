// Configuration de la navigation pour le système d'administration Wanzo
import { UserRole } from '../types/user';

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  roles: UserRole[];
  subItems?: NavigationItem[];
}

export const navigationConfig: NavigationItem[] = [  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/dashboard',
    icon: 'home',
    roles: ['super_admin', 'cto', 'growth_finance', 'customer_support', 'content_manager'],
  },
  {
    id: 'customers',
    label: 'Clients',
    path: '/customers',
    icon: 'briefcase',
    roles: ['super_admin', 'growth_finance', 'customer_support'],
    subItems: [
      {
        id: 'customers-pme',
        label: 'PME',
        path: '/customers/pme',
        icon: 'building',
        roles: ['super_admin', 'growth_finance', 'customer_support'],
      },
      {
        id: 'customers-financial',
        label: 'Institutions Financières',
        path: '/customers/financial',
        icon: 'landmark',
        roles: ['super_admin', 'growth_finance', 'customer_support'],
      },
      {
        id: 'customers-pending',
        label: 'Comptes en Attente',
        path: '/customers/pending',
        icon: 'clock',
        roles: ['super_admin', 'growth_finance', 'customer_support'],
      }
    ]
  },
  {
    id: 'finance',
    label: 'Finances',
    path: '/finance',
    icon: 'dollar-sign',
    roles: ['super_admin', 'growth_finance'],
    subItems: [
      {
        id: 'finance-revenue',
        label: 'Revenus',
        path: '/finance/revenue',
        icon: 'trending-up',
        roles: ['super_admin', 'growth_finance'],
      },
      {
        id: 'finance-subscriptions',
        label: 'Abonnements',
        path: '/finance/subscriptions',
        icon: 'credit-card',
        roles: ['super_admin', 'growth_finance'],
      },
      {
        id: 'finance-tokens',
        label: 'Tokens & IA',
        path: '/finance/tokens',
        icon: 'layers',
        roles: ['super_admin', 'growth_finance'],
      },
      {
        id: 'finance-payments',
        label: 'Paiements',
        path: '/finance/payments',
        icon: 'file-text',
        roles: ['super_admin', 'growth_finance'],
      },
      {
        id: 'finance-manual',
        label: 'Paiements Manuels',
        path: '/finance/manual',
        icon: 'check-square',
        roles: ['super_admin', 'growth_finance'],
      }
    ]
  },
  {
    id: 'system',
    label: 'Système',
    path: '/system',
    icon: 'server',
    roles: ['super_admin', 'cto'],
    subItems: [
      {
        id: 'system-health',
        label: 'État du Système',
        path: '/system/health',
        icon: 'activity',
        roles: ['super_admin', 'cto'],
      },
      {
        id: 'system-api',
        label: 'Performance API',
        path: '/system/api',
        icon: 'wifi',
        roles: ['super_admin', 'cto'],
      },
      {
        id: 'system-database',
        label: 'Bases de Données',
        path: '/system/database',
        icon: 'database',
        roles: ['super_admin', 'cto'],
      },
      {
        id: 'system-ai',
        label: 'Configuration IA',
        path: '/system/ai',
        icon: 'cpu',
        roles: ['super_admin', 'cto'],
      },
      {
        id: 'system-alerts',
        label: 'Alertes',
        path: '/system/alerts',
        icon: 'bell',
        roles: ['super_admin', 'cto'],
      },
      {
        id: 'system-logs',
        label: 'Logs',
        path: '/system/logs',
        icon: 'file',
        roles: ['super_admin', 'cto'],
      }
    ]
  },
  {
    id: 'configuration',
    label: 'Configuration',
    path: '/configuration',
    icon: 'settings',
    roles: ['super_admin', 'cto', 'growth_finance'],
    subItems: [
      {
        id: 'configuration-plans',
        label: 'Plans & Tarifs',
        path: '/configuration/plans',
        icon: 'package',
        roles: ['super_admin', 'growth_finance'],
      },
      {
        id: 'configuration-tokens',
        label: 'Packages Tokens',
        path: '/configuration/tokens',
        icon: 'layers',
        roles: ['super_admin', 'growth_finance'],
      },
      {
        id: 'configuration-ai-costs',
        label: 'Coûts IA',
        path: '/configuration/ai-costs',
        icon: 'trending-down',
        roles: ['super_admin', 'cto', 'growth_finance'],
      }
    ]
  },
  {
    id: 'users',
    label: 'Utilisateurs Admin',
    path: '/users',
    icon: 'users',
    roles: ['super_admin'],
  },
  {
    id: 'reports',
    label: 'Rapports',
    path: '/reports',
    icon: 'bar-chart-2',
    roles: ['super_admin', 'growth_finance', 'cto'],
  },
  {
    id: 'settings',
    label: 'Paramètres',
    path: '/settings',
    icon: 'sliders',
    roles: ['super_admin', 'cto', 'growth_finance', 'customer_support', 'content_manager'],
  }
];

// Fonction pour filtrer les éléments de navigation en fonction du rôle de l'utilisateur
export const getNavigationByRole = (role: UserRole): NavigationItem[] => {
  // Si c'est un super admin, retourner tous les éléments sans filtrage
  if (role === 'super_admin') {
    return navigationConfig;
  }
  
  return navigationConfig
    .filter(item => item.roles.includes(role))
    .map(item => {
      if (item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(subItem => subItem.roles.includes(role))
        };
      }
      return item;
    });
};
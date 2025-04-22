import { useState, useEffect } from 'react';
import { TableItem } from '../components/dashboard/tables/UnifiedDataTable';

export function useDashboardTable(userRole: string) {
  const [items, setItems] = useState<TableItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Cette fonction simule la récupération des données depuis l'API
    const fetchTableData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Dans une véritable implémentation, ce serait un appel API
        // await api.get('/dashboard/unified-data');
        
        // Simulation d'une latence réseau
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Données factices pour le tableau
        const mockData: TableItem[] = [
          {
            id: 'client-1',
            type: 'client',
            title: 'Société Générale Asset Management',
            subtitle: 'Dossier d\'onboarding en attente',
            status: 'pending',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 jours avant
            customerType: 'financial',
            linkTo: '/customers/details/sg-asset'
          },
          {
            id: 'payment-1',
            type: 'payment',
            title: 'Paiement mensuel - BNP Paribas',
            subtitle: 'Facture #INV-2025-0412',
            status: 'approved',
            date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 jour avant
            amount: 1250.00,
            linkTo: '/finance/payments/INV-2025-0412'
          },
          {
            id: 'subscription-1',
            type: 'subscription',
            title: 'Renouvellement - Crédit Agricole',
            subtitle: 'Forfait Enterprise - 50 utilisateurs',
            status: 'pending',
            date: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(), // 12 heures avant
            amount: 4500.00,
            linkTo: '/subscription/renewals/ca-enterprise'
          },
          {
            id: 'activity-1',
            type: 'activity',
            title: 'Pic d\'utilisation API anormal',
            subtitle: 'Client: FinTech Solutions SAS',
            status: 'warning',
            date: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000).toISOString(), // 5 heures avant
            linkTo: '/reports/api-usage/fintech-solutions'
          },
          {
            id: 'client-2',
            type: 'client',
            title: 'PME Consulting SAS',
            subtitle: 'Validation des documents KYC',
            status: 'pending',
            date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 jours avant
            customerType: 'pme',
            linkTo: '/customers/details/pme-consulting'
          },
          {
            id: 'token-1',
            type: 'token',
            title: 'Achat de tokens supplémentaires',
            subtitle: 'Client: Nexity Finance',
            status: 'active',
            date: new Date(Date.now() - 0.1 * 24 * 60 * 60 * 1000).toISOString(), // 2 heures avant
            amount: 500.00,
            linkTo: '/finance/token-purchases/nexity-finance'
          },
          {
            id: 'payment-2',
            type: 'payment',
            title: 'Paiement trimestriel - Atelier Compta',
            subtitle: 'Facture #INV-2025-0410',
            status: 'rejected',
            date: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 jours avant
            amount: 750.00,
            linkTo: '/finance/payments/INV-2025-0410'
          },
          {
            id: 'client-3',
            type: 'client',
            title: 'AXA Banque',
            subtitle: 'Demande d\'accès API en attente',
            status: 'pending',
            date: new Date(Date.now() - 0.3 * 24 * 60 * 60 * 1000).toISOString(), // 7 heures avant
            customerType: 'financial',
            linkTo: '/customers/details/axa-banque'
          },
          {
            id: 'subscription-2',
            type: 'subscription',
            title: 'Nouvelle souscription - Cabinet Martin',
            subtitle: 'Forfait Professional - 5 utilisateurs',
            status: 'active',
            date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 jours avant
            amount: 1200.00,
            linkTo: '/subscription/details/cabinet-martin'
          },
          {
            id: 'activity-2',
            type: 'activity',
            title: 'Tentatives de connexion multiples',
            subtitle: 'Utilisateur: m.dupont@clientfinance.com',
            status: 'warning',
            date: new Date(Date.now() - 0.05 * 24 * 60 * 60 * 1000).toISOString(), // 1 heure avant
            linkTo: '/system/security-alerts/user-m-dupont'
          },
          {
            id: 'payment-3',
            type: 'payment',
            title: 'Paiement annuel - HSBC France',
            subtitle: 'Facture #INV-2025-0401',
            status: 'pending',
            date: new Date(Date.now() - 0.8 * 24 * 60 * 60 * 1000).toISOString(), // 19 heures avant
            amount: 9500.00,
            linkTo: '/finance/payments/INV-2025-0401'
          },
          {
            id: 'token-2',
            type: 'token',
            title: 'Utilisation élevée - Forfait dépassé',
            subtitle: 'Client: Groupe Bernard Finance',
            status: 'warning',
            date: new Date(Date.now() - 0.15 * 24 * 60 * 60 * 1000).toISOString(), // 3.5 heures avant
            amount: 350.00,
            linkTo: '/finance/token-usage/groupe-bernard'
          }
        ];

        // Filtrer les éléments selon le rôle utilisateur
        let filteredData = mockData;
        
        if (userRole === 'customer_success') {
          filteredData = mockData.filter(item => 
            item.type === 'client' || item.type === 'subscription');
        } else if (userRole === 'finance') {
          filteredData = mockData.filter(item => 
            item.type === 'payment' || item.type === 'subscription' || item.type === 'token');
        }
        
        // Tri par date (plus récent en premier)
        filteredData.sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setItems(filteredData);
      } catch (err) {
        console.error("Erreur lors du chargement des données du tableau:", err);
        setError("Impossible de charger les données du tableau. Veuillez réessayer plus tard.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTableData();
  }, [userRole]);

  return { items, isLoading, error };
}
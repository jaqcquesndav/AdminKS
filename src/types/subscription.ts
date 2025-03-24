export interface ApplicationGroup {
  id: string;
  name: string;
  description: string;
  applications: Application[];
  monthlyPrice: {
    usd: number;
    cdf: number;
  };
  yearlyPrice: {
    usd: number;
    cdf: number;
  };
  tokenBonus: {
    monthly: number;
    yearly: number;
  };
}

export interface Application {
  id: string;
  name: string;
  description: string;
  features: string[];
}

// Exchange rate: 1 USD = 2500 CDF (approximate)
const CDF_RATE = 2500;

export const ERP_GROUP: ApplicationGroup = {
  id: 'erp',
  name: 'ERP Suite',
  description: 'Suite complète de gestion d\'entreprise',
  applications: [
    {
      id: 'accounting',
      name: 'Comptabilité',
      description: 'Gestion comptable et financière',
      features: ['Grand livre', 'Journaux', 'États financiers', 'Rapports fiscaux']
    },
    {
      id: 'sales',
      name: 'Ventes',
      description: 'Gestion commerciale',
      features: ['Facturation', 'Devis', 'Gestion clients', 'Reporting commercial']
    },
    {
      id: 'inventory',
      name: 'Stocks',
      description: 'Gestion des stocks',
      features: ['Inventaire', 'Mouvements', 'Valorisation', 'Alertes']
    }
  ],
  monthlyPrice: {
    usd: 15,
    cdf: 15 * CDF_RATE
  },
  yearlyPrice: {
    usd: 150,
    cdf: 150 * CDF_RATE
  },
  tokenBonus: {
    monthly: 1000, // 1000 tokens gratuits par mois
    yearly: 15000  // 15000 tokens gratuits par an
  }
};

export const FINANCE_GROUP: ApplicationGroup = {
  id: 'finance',
  name: 'Solutions Financières',
  description: 'Suite d\'applications financières',
  applications: [
    {
      id: 'portfolio',
      name: 'Gestion de Portefeuille',
      description: 'Gestion des investissements',
      features: ['Suivi des actifs', 'Analyse de performance', 'Reporting']
    },
    {
      id: 'leasing',
      name: 'Gestion de Leasing',
      description: 'Solutions de crédit-bail',
      features: ['Contrats', 'Échéanciers', 'Facturation', 'Contentieux']
    }
  ],
  monthlyPrice: {
    usd: 20,
    cdf: 20 * CDF_RATE
  },
  yearlyPrice: {
    usd: 200,
    cdf: 200 * CDF_RATE
  },
  tokenBonus: {
    monthly: 1500, // 1500 tokens gratuits par mois
    yearly: 20000  // 20000 tokens gratuits par an
  }
};
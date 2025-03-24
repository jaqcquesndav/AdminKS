export const LEGAL_FORMS = {
  'SARL': 'Société à Responsabilité Limitée',
  'SA': 'Société Anonyme',
  'SURL': 'Société Unipersonnelle à Responsabilité Limitée',
  'SNC': 'Société en Nom Collectif',
  'SCS': 'Société en Commandite Simple',
  'COOP': 'Coopérative',
  'EI': 'Entreprise Individuelle'
} as const;

export type LegalForm = keyof typeof LEGAL_FORMS;

export const BUSINESS_SECTORS = [
  'Agriculture et élevage',
  'Mines et carrières',
  'Industries manufacturières',
  'Construction et BTP',
  'Commerce de gros et détail',
  'Transport et logistique',
  'Services financiers',
  'Technologies et télécommunications',
  'Education',
  'Santé',
  'Hôtellerie et restauration',
  'Services aux entreprises',
] as const;

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  address: string;
  coordinates: Coordinates;
  type: 'headquarters' | 'site' | 'store';
}

export interface Company {
  id: string;
  name: string;
  rccmNumber: string;
  nationalId: string;
  taxNumber: string;
  cnssNumber?: string;
  logo?: string;
  legalForm?: LegalForm;
  businessSector?: string;
  description?: string;
  address: {
    street: string;
    city: string;
    province: string;
    commune: string;
    quartier: string;
    coordinates: Coordinates;
  };
  locations: Location[];
  documents: {
    rccmFile?: string;
    nationalIdFile?: string;
    taxNumberFile?: string;
    cnssFile?: string;
  };
  contactEmail: string;
  contactPhone: string[];
  representativeName: string;
  representativeRole: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompanyRegistration {
  businessName: string;
  legalForm: LegalForm;
  sector: string;
  activities: string[];
  rccmNumber: string;
  nationalId: string;
  taxNumber: string;
  address: {
    street: string;
    city: string;
    province: string;
  };
  contactEmail: string;
  contactPhone: string;
}
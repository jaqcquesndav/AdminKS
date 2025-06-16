export type AdhaContextType =
  | 'etude_marche'
  | 'reglementation'
  | 'brevet'
  | 'annuaire'
  | 'cours'
  | 'module'
  | 'registre_prix'
  | 'tips'
  | 'autre';

export type ZoneCibleType = 'ville' | 'pays' | 'province';

export interface ZoneCible {
  type: ZoneCibleType;
  value: string;
}

export interface AdhaContextSource {
  id: string;
  titre: string;
  description: string;
  type: AdhaContextType;
  domaine: string;
  zoneCible: ZoneCible[]; // Multi-zones, ex: [{type: 'pays', value: 'RDC'}]
  niveau?: string; // ex: 'Débutant', 'Expert'
  canExpire?: boolean; // Si le document peut expirer
  dateDebut?: string; // Pour validité périodique
  dateFin?: string; // Pour validité périodique
  url: string; // URL Cloudinary
  downloadUrl?: string; // Pour téléchargement direct
  coverImageUrl?: string;
  tags?: string[];
  active: boolean; // Pour déploiement IA
  createdAt: string;
  updatedAt: string;
}

export const TAG_SUGGESTIONS = [
  'marché',
  'statistiques',
  'juridique',
  'innovation',
  'RDC',
  'Kinshasa',
  'agriculture',
  'industrie',
  'banque',
  'startup',
  'énergie',
  'mines',
  'commerce',
  'santé',
  'éducation',
  'export',
  'import',
  'PME',
  'financement',
  'formation',
  'loi',
  'fiscalité',
  'prix',
  'tendance',
  'analyse',
  'benchmark',
  'licence',
  'propriété intellectuelle',
  'open data',
  'public',
  'privé',
  'zone économique',
  'province',
  'ville',
  'Afrique',
  'international',
];

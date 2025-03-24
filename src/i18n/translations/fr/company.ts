export default {
  title: 'Entreprise',
  profile: {
    title: 'Profil de l\'entreprise',
    basicInfo: 'Informations générales',
    name: 'Raison sociale',
    rccm: {
      label: 'RCCM',
      placeholder: 'Ex: CD/GOMA/RCCM/23-B-00196'
    },
    nationalId: {
      label: 'Identification Nationale',
      placeholder: 'Ex: 19-H5300-N40995F'
    },
    taxNumber: {
      label: 'Numéro Impôt (NIF)',
      placeholder: 'Ex: A2321658S'
    },
    legalForm: 'Forme juridique',
    capital: 'Capital social',
    businessSector: 'Secteur d\'activité',
    employeeCount: 'Nombre d\'employés',
    description: 'Description',
    website: 'Site web',
    address: {
      title: 'Adresse',
      street: 'Avenue/Rue',
      city: 'Ville',
      province: 'Province',
      commune: 'Commune',
      quartier: 'Quartier'
    },
    contact: {
      title: 'Contact',
      email: 'Email',
      phone: 'Téléphone',
      addPhone: 'Ajouter un numéro'
    },
    socialMedia: 'Réseaux sociaux',
    products: {
      title: 'Produits',
      add: 'Ajouter un produit',
      namePlaceholder: 'Nom du produit',
      categoryPlaceholder: 'Catégorie',
      descriptionPlaceholder: 'Description'
    },
    services: {
      title: 'Services',
      add: 'Ajouter un service',
      namePlaceholder: 'Nom du service',
      categoryPlaceholder: 'Catégorie',
      descriptionPlaceholder: 'Description'
    }
  },
  documents: {
    title: 'Documents',
    rccm: {
      title: 'Registre du Commerce (RCCM)',
      description: 'Document officiel attestant de l\'enregistrement au registre du commerce',
      upload: 'Téléverser le RCCM'
    },
    nationalId: {
      title: 'Identification Nationale',
      description: 'Document d\'identification nationale de l\'entreprise',
      upload: 'Téléverser l\'Id. Nat'
    },
    taxNumber: {
      title: 'Numéro Impôt',
      description: 'Attestation de numéro impôt',
      upload: 'Téléverser le NIF'
    },
    status: {
      pending: 'En attente',
      verified: 'Vérifié',
      rejected: 'Rejeté'
    },
    errors: {
      fileTooBig: 'Le fichier est trop volumineux (max 5MB)',
      invalidType: 'Type de fichier non supporté',
      uploadFailed: 'Échec du téléversement'
    }
  }
};
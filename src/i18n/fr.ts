export default {
  header: {
    userMenu: {
      defaultName: 'Utilisateur',
      defaultEmail: 'Email non disponible',
      profile: 'Mon Profil',
      settings: 'Paramètres',
      logout: 'Déconnexion'
    }
  },
  // ... other translations
  company: {
    profile: {
      title: 'Profil de l\'entreprise',
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
      address: {
        title: 'Adresse',
        street: 'Avenue/Rue et numéro',
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
      representative: {
        title: 'Représentant légal',
        name: 'Nom complet',
        role: 'Fonction'
      }
    },
    registration: {
      title: 'Inscription de l\'entreprise',
      form: {
        businessInfo: {
          title: 'Informations de l\'entreprise',
          name: 'Raison sociale',
          legalForm: 'Forme juridique',
          sector: 'Secteur d\'activité',
          activities: 'Activités'
        },
        identification: {
          title: 'Identification',
          rccm: 'RCCM',
          nationalId: 'Id. Nat',
          taxNumber: 'NIF'
        },
        documents: {
          title: 'Documents',
          rccm: 'Registre de Commerce',
          nationalId: 'Identification Nationale',
          taxNumber: 'Attestation Fiscale',
          upload: 'Téléverser'
        }
      }
    }
  },
  customers: {
    title: 'Clients',
    newCustomer: 'Nouveau Client',
    errors: {
      loadFailed: 'Échec du chargement des clients.',
      loadDetailsFailed: 'Échec du chargement des détails du client.',
      createFailed: 'Échec de la création du client.',
      updateFailed: 'Échec de la mise à jour du client.',
      deleteFailed: 'Échec de la suppression du client.',
      documentUploadFailed: 'Échec du téléversement du document.',
      documentApproveFailed: 'Échec de l\'approbation du document.',
      documentRejectFailed: 'Échec du rejet du document.',
      validateFailed: 'Échec de la validation du client.',
      suspendFailed: 'Échec de la suspension du client.',
      reactivateFailed: 'Échec de la réactivation du client.',
      loadActivitiesFailed: 'Échec du chargement des activités du client.',
      loadStatsFailed: 'Échec du chargement des statistiques des clients.',
      loadDocumentsFailed: 'Échec du chargement des documents du client.'
    },
    notifications: {
      created: 'Client créé avec succès.',
      updated: 'Client mis à jour avec succès.',
      deleted: 'Client supprimé avec succès.',
      documentUploaded: 'Document téléversé avec succès.',
      documentApproved: 'Document approuvé avec succès.',
      documentRejected: 'Document rejeté avec succès.',
      validated: 'Client validé avec succès.',
      suspended: 'Client suspendu avec succès.',
      reactivated: 'Client réactivé avec succès.'
    },
    status: {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
      suspended: 'Suspendu'
    },
    type: {
      pme: 'PME',
      ge: 'Grande Entreprise', // Retained for consistency, though user mentioned financial institutions
      financial: 'Institution Financière', // Added based on user feedback
      individual: 'Particulier',
      other: 'Autre'
    }
  },
  users: {
    errors: {
      loadFailed: 'Échec du chargement des utilisateurs.',
      createFailed: 'Échec de la création de l\'utilisateur.',
      updateFailed: 'Échec de la mise à jour de l\'utilisateur.',
      deleteFailed: 'Échec de la suppression de l\'utilisateur.',
      loadSingleFailed: 'Échec du chargement des détails de l\'utilisateur.'
    },
    notifications: {
      created: 'Utilisateur créé avec succès.',
      updated: 'Utilisateur mis à jour avec succès.',
      deleted: 'Utilisateur supprimé avec succès.'
    }
  }
  // ... other translations
};
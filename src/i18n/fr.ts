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
    userTypes: {
      internal: 'Interne',
      external: 'Externe (Client)'
    },
    title: 'Gestion des Utilisateurs',
    add: 'Ajouter un Utilisateur',
    search: 'Rechercher un utilisateur...',
    form: {
      create: {
        title: 'Créer un Utilisateur',
        submit: 'Créer'
      },
      edit: {
        title: 'Modifier l\'Utilisateur'
      },
      name: 'Nom',
      email: 'Email',
      role: 'Rôle',
      status: 'Statut',
      userType: 'Type d\'utilisateur',
      customerAccountId: 'ID Compte Client',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      errors: {
        passwordsDontMatch: 'Les mots de passe ne correspondent pas.',
        passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères.',
        missingCustomerAccountId: 'Veuillez fournir un ID de compte client pour les utilisateurs externes.'
      }
    },
    status: {
      active: 'Actif',
      inactive: 'Inactif',
      pending: 'En attente',
      suspended: 'Suspendu'
    },
    details: {
      createdAt: 'Créé le',
      lastLogin: 'Dernière connexion',
      tabs: {
        activity: 'Activité',
        sessions: 'Sessions',
        permissions: 'Permissions'
      }
    },
    table: {
      name: 'Nom',
      email: 'Email',
      role: 'Rôle',
      status: 'Statut',
      company: 'Entreprise',
      customer: 'Client', // Ajouté pour la colonne client
      lastLogin: 'Dernière connexion',
      actions: 'Actions',
      internal: 'Wanzo (Interne)',
      unknown: 'Client Inconnu', // Ajouté pour client inconnu
    },
    actions: {
      edit: 'Modifier',
      delete: 'Supprimer',
      groupByCustomer: 'Grouper par Client', // Mise à jour de la terminologie
      ungroupByCustomer: 'Dégrouper par Client', // Mise à jour de la terminologie
      terminateSession: 'Terminer la Session',
    },
    notifications: {
      created: 'Utilisateur créé avec succès.',
      updated: 'Utilisateur mis à jour avec succès.',
      deleted: 'Utilisateur supprimé avec succès.',
      sessionTerminated: 'Session terminée avec succès.',
    },
    errors: {
      loadFailed: 'Échec du chargement des utilisateurs.',
      createFailed: 'Échec de la création de l\'utilisateur.',
      updateFailed: 'Échec de la mise à jour de l\'utilisateur.',
      deleteFailed: 'Échec de la suppression de l\'utilisateur.',
      loadSingleFailed: 'Échec du chargement des détails de l\'utilisateur.',
      missingFields: 'Veuillez remplir tous les champs obligatoires pour créer un utilisateur.',
      sessionTerminationFailed: 'Échec de la terminaison de la session.',
      invalidEmail: 'Veuillez saisir une adresse e-mail valide.',
      missingRequiredFields: 'Veuillez remplir tous les champs obligatoires.',
    },
    roles: {
      super_admin: 'Super Administrateur',
      cto: 'CTO',
      growth_finance: 'Croissance et Finance',
      customer_support: 'Support Client',
      content_manager: 'Gestionnaire de Contenu',
      company_admin: 'Administrateur d\'Entreprise',
      company_user: 'Utilisateur d\'Entreprise',
    },
  },
  common: {
    cancel: 'Annuler',
    save: 'Enregistrer',
    loading: 'Chargement...',
    close: 'Fermer', // Ajouté
    // ... other common translations
  },
  permissions: { // Traductions pour les permissions
    view_users: 'Voir les utilisateurs',
    manage_users: 'Gérer les utilisateurs',
    view_settings: 'Voir les paramètres',
    read: 'Lecture',
    write: 'Écriture',
    admin: 'Administration',
    create: 'Créer',
    update: 'Modifier',
    delete: 'Supprimer',
    export: 'Exporter',
    import: 'Importer',
    // Ajoutez d\'autres traductions de permissions spécifiques à votre application
  },
  userPermissions: { // Section pour le formulaire de permissions
    title: 'Gestion des permissions',
    applications: 'Applications',
    noApplications: 'Aucune application disponible',
    save: 'Enregistrer les permissions',
    cancel: 'Annuler',
    // Groupes d'applications
    groups: {
      erp: 'Suite ERP',
      finance: 'Solutions Financières'
    },
    // Applications
    apps: {
      accounting: 'Comptabilité',
      sales: 'Ventes',
      inventory: 'Stocks',
      portfolio: 'Gestion de Portefeuille',
      leasing: 'Gestion de Leasing'
    }
  },
  table: {
    name: 'Nom',
    email: 'Email',
    role: 'Rôle',
    status: 'Statut',
    company: 'Entreprise',
    lastLogin: 'Dernière connexion',
    actions: 'Actions',
    internal: 'Interne',
    groupByCompany: 'Grouper par entreprise',
    ungroupByCompany: 'Dégrouper par entreprise',
  }
  // ... other translations
};
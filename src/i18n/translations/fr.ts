const translations = {
  common: {
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer',
    loading: 'Chargement...',
    saving: 'Enregistrement...',
    deleting: 'Suppression...',
    days: 'jours',
    error: 'Erreur',
    yes: 'Oui',
    no: 'Non',
    confirm: 'Confirmer',
    back: 'Retour'
  },

  navigation: {
    dashboard: 'Tableau de bord',
    company: 'Entreprise',
    subscriptions: 'Abonnements',
    users: 'Utilisateurs',
    settings: 'Paramètres'
  },

  auth: {
    login: {
      title: 'Connexion',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      submit: 'Se connecter',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: 'Pas encore de compte ?',
      signUp: 'Créer un compte'
    },
    errors: {
      invalidCredentials: 'Email ou mot de passe incorrect',
      general: 'Une erreur est survenue'
    }
  },

  dashboard: {
    stats: {
      activeUsers: 'Utilisateurs actifs',
      activeSessions: 'Sessions actives',
      companies: 'Entreprises',
      subscriptions: 'Abonnements'
    },
    activity: {
      title: 'Activités récentes',
      noActivity: 'Aucune activité récente'
    },
    system: {
      title: 'État du système',
      status: {
        operational: 'Opérationnel',
        degraded: 'Dégradé',
        down: 'Hors service'
      }
    }
  },

  company: {
    profile: {
      title: 'Profil de l\'entreprise',
      edit: 'Modifier le profil',
      info: {
        basic: 'Informations générales',
        contact: 'Coordonnées',
        legal: 'Informations légales'
      }
    },
    registration: {
      title: 'Inscription de l\'entreprise',
      documents: {
        title: 'Documents légaux',
        rccm: {
          title: 'Registre du Commerce et du Crédit Mobilier (RCCM)',
          description: 'Document officiel attestant de l\'enregistrement de votre entreprise au registre du commerce',
          upload: 'Téléverser le certificat RCCM'
        },
        nationalId: {
          title: 'Identification Nationale',
          description: 'Numéro d\'identification nationale de votre entreprise',
          upload: 'Téléverser l\'attestation d\'identification nationale'
        },
        taxNumber: {
          title: 'Numéro d\'Impôt',
          description: 'Numéro d\'identification fiscale de votre entreprise',
          upload: 'Téléverser l\'attestation fiscale'
        }
      },
      form: {
        businessInfo: {
          title: 'Informations de l\'entreprise',
          name: 'Raison sociale',
          legalForm: 'Forme juridique',
          sector: 'Secteur d\'activité',
          activities: 'Activités'
        },
        contact: {
          title: 'Coordonnées',
          email: 'Email professionnel',
          phone: 'Téléphone',
          address: 'Adresse'
        }
      }
    },
    documents: {
      title: 'Documents',
      status: {
        pending: 'En attente',
        verified: 'Vérifié',
        rejected: 'Rejeté'
      },
      actions: {
        upload: 'Téléverser',
        download: 'Télécharger',
        delete: 'Supprimer'
      },
      errors: {
        fileTooBig: 'Le fichier est trop volumineux',
        invalidType: 'Type de fichier non supporté',
        uploadFailed: 'Échec du téléversement'
      }
    }
  },

  users: {
    title: 'Gestion des utilisateurs',
    actions: {
      create: 'Nouvel utilisateur',
      edit: 'Modifier',
      delete: 'Supprimer'
    },
    form: {
      title: {
        create: 'Créer un utilisateur',
        edit: 'Modifier l\'utilisateur'
      }
    },
    roles: {
      admin: 'Administrateur',
      user: 'Utilisateur',
      viewer: 'Lecteur'
    }
  },

  settings: {
    title: 'Paramètres',
    tabs: {
      profile: 'Profil',
      security: 'Sécurité',
      notifications: 'Notifications',
      display: 'Affichage',
      language: 'Langue',
      support: 'Support'
    },
    sections: {
      profile: 'Profil',
      security: 'Sécurité',
      notifications: 'Notifications',
      appearance: 'Apparence'
    },
    profile: {
      title: 'Profil administrateur',
      name: 'Nom',
      email: 'Email',
      role: 'Rôle',
      phone: 'Téléphone',
      edit: 'Modifier',
      save: 'Enregistrer',
      cancel: 'Annuler'
    },
    security: {
      title: 'Paramètres de sécurité',
      twoFactor: 'Authentification à deux facteurs',
      twoFactorDesc: 'Renforcez la sécurité de votre compte',
      password: 'Mot de passe',
      changePassword: 'Changer le mot de passe',
      sessions: 'Sessions actives',
      logoutAll: 'Déconnecter toutes les sessions'
    },
    notifications: {
      preferences: 'Préférences de notifications',
      email: 'Notifications par email',
      emailDescription: 'Recevoir les notifications importantes par email',
      push: 'Notifications push',
      pushDescription: 'Recevoir les notifications en temps réel',
      sms: 'Notifications SMS',
      smsDescription: 'Recevoir les notifications urgentes par SMS'
    },
    display: {
      theme: 'Thème',
      lightTheme: 'Clair',
      darkTheme: 'Sombre',
      systemTheme: 'Système',
      layout: 'Disposition',
      sidebarLayout: 'Menu latéral',
      topNavLayout: 'Navigation en haut'
    },
    language: {
      selectLanguage: 'Choisir la langue',
      dateFormat: 'Format de date'
    },
    support: {
      help: 'Aide et support',
      documentation: 'Documentation',
      documentationDesc: 'Consultez notre documentation détaillée',
      viewDocs: 'Voir la documentation',
      contactUs: 'Nous contacter',
      contactDesc: 'Notre équipe de support est à votre disposition',
      contactSupport: 'Contacter le support'
    }
  },

  notifications: {
    title: 'Notifications',
    empty: 'Aucune notification',
    markAllRead: 'Tout marquer comme lu',
    clear: 'Effacer tout'
  },

  modals: {
    delete: {
      title: 'Confirmation de suppression',
      message: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
      warning: 'Cette action est irréversible'
    },
    upload: {
      title: 'Téléverser un fichier',
      dragDrop: 'Glissez-déposez vos fichiers ici',
      or: 'ou',
      browse: 'Parcourir'
    }
  },

  forms: {
    validation: {
      required: 'Ce champ est requis',
      email: 'Adresse e-mail invalide',
      minLength: 'Minimum {{count}} caractères',
      maxLength: 'Maximum {{count}} caractères',
      passwordMatch: 'Les mots de passe ne correspondent pas'
    }
  },

  subscription: {
    title: 'Abonnements',
    plans: {
      monthly: 'Mensuel',
      yearly: 'Annuel',
      features: 'Fonctionnalités incluses'
    },
    payment: {
      title: 'Paiement',
      methods: {
        card: 'Carte bancaire',
        mobileMoney: 'Mobile Money',
        transfer: 'Virement bancaire'
      }
    }
  }
};

export default translations;
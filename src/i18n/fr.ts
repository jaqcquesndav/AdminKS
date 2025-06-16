export default {
  dashboard: {
    title: 'Tableau de bord Wanzo Admin',
    loadError: 'Erreur lors du chargement du tableau de bord',
    totalUsers: 'Utilisateurs Totaux',
    vsPreviousMonth: 'vs mois précédent',
    monthlyRevenue: 'Revenu Mensuel',
    tokensUsed: 'Tokens Utilisés',
    tokenCost: 'Coût des tokens',
    customerAccounts: 'Comptes Clients',
    systemHealth: 'Santé Système',
    operational: 'Opérationnel',
    attentionRequired: 'Attention Requise',
    pendingAccounts: 'Comptes en Attente',
    paymentsToValidate: 'Paiements à Valider',
    revenueEvolution: 'Évolution des revenus',
    aiTokenUsage: 'Utilisation des Tokens IA',
    recentActivity: 'Activité récente',
  },
  header: {
    userMenu: {
      defaultName: 'Utilisateur',
      defaultEmail: 'Email non disponible',
      profile: 'Mon Profil',
      settings: 'Paramètres',
      logout: 'Déconnexion'
    }  },
  common: { // Consolidated common translations
    locale: 'fr-FR',
    cancel: 'Annuler',
    save: 'Enregistrer',
    loading: 'Chargement...',
    close: 'Fermer',
    edit: 'Modifier',
    remove: 'Supprimer',
    on: 'sur',
    saveChanges: 'Enregistrer les modifications',
    back: 'Retour',
    print: 'Imprimer',
    export: 'Exporter',
    share: 'Partager',
    loadingPayments: 'Chargement des paiements...',
    downloadInitiated: 'Téléchargement des données en cours...',
    downloadSuccess: 'Liste des paiements téléchargée avec succès (simulation)',
    paginationResult: 'Page {{page}} sur {{totalPages}}',
    previous: 'Précédent',
    next: 'Suivant',
    page: 'Page',
    of: 'sur',
    results: 'résultats',
    paginationShowing: 'Affichage de',
    paginationTo: 'à',
    paginationOf: 'sur',
    notAvailable: 'N/D',
    allStatuses: 'Tous les statuts',
    download: 'Télécharger',
    viewDetails: 'Voir détails',
    approve: 'Approuver',
    reject: 'Rejeter',
    menu: 'Menu',
    toggleTheme: 'Changer le thème',
    expand: 'Développer',
    collapse: 'Réduire',
    adminTitle: 'Wanzo Admin',
    never: 'Jamais',
    unknown: 'Inconnu',
    delete: 'Supprimer',
    deleting: 'Suppression en cours...',
    loadingDelete: 'Suppression en cours...',
    retry: 'Réessayer',
    selectCurrency: 'Sélectionner une devise',
    // Add other common translations here if they are missing from the original common block
  },
  settings: {
    pageTitle: 'Paramètres Administrateur',
    tabs: {
      profile: 'Profil',
      currency: 'Devise',
      security: 'Sécurité',
      notifications: 'Notifications',
      display: 'Affichage',
      language: 'Langue & Date',
    },
    profile: {
      title: 'Profil Administrateur',
      updateSuccess: 'Profil mis à jour avec succès.',
      updateError: 'Erreur lors de la mise à jour du profil.',
      avatarSizeError: "L\\'image est trop grande (max 1Mo).",
      avatarTypeError: "Format d\\'image non supporté (JPG, PNG, GIF).",
      loadError: 'Erreur de chargement du profil :',
      editButton: 'Modifier',
      form: { 
        nameLabel: 'Nom complet',
        emailLabel: 'Email',
        phoneLabel: 'Téléphone',
        phonePlaceholder: '+243 999 999 999',
      },
      view: { 
        nameLabel: 'Nom complet',
        emailLabel: 'Email',
        phoneLabel: 'Téléphone',
        phoneNotDefined: 'Non défini',
      },
      kyc: { 
        title: "Documents d\\'identité",
        idCardLabel: "Carte d\\'identité ou Passeport",
        idCardUploaded: 'Document téléversé',
        idCardVerified: ' et vérifié',
        idCardPending: 'en attente de vérification', // Parenthèses supprimées
        idCardNotUploaded: 'Aucun document téléversé',
        updateIdCardButton: 'Mettre à jour',
        uploadIdCardButton: 'Téléverser',
        signatureLabel: 'Signature',
        signatureSaved: 'Signature enregistrée', // Nouvelle clé
        signatureSavedDate: 'Signature enregistrée le {date}',
        signatureNotSaved: 'Aucune signature enregistrée',
        signatureVerified: 'Signature vérifiée', // Ajouté pour cohérence
        signaturePending: 'Signature en attente', // Ajouté pour cohérence
        updateSignatureButton: 'Mettre à jour',
        signButton: 'Signer',
        signatureComingSoon: 'Fonctionnalité de signature à venir',
        idCard: { 
          fileTypeError: "Format de fichier non supporté. Utilisez JPG, PNG ou PDF.",
          fileSizeError: "Le fichier est trop volumineux. Maximum 5MB.",
          uploadSuccess: "Document d\\'identité téléversé avec succès.",
          uploadError: "Erreur lors du téléversement du document d\\'identité.",
        },
        signature: { 
          saveSuccess: 'Signature enregistrée avec succès.',
          saveError: "Erreur lors de l\\'enregistrement de la signature.",
        },
        signaturePad: {
          title: 'Fournir la Signature',
          description: 'Dessinez votre signature ci-dessous.',
          clear: 'Effacer',
          save: 'Enregistrer la Signature',
        }
      },
      avatarDetails: { // Renamed from 'avatar' to 'avatarDetails'
        change: "Changer l\\'avatar",
        requirements: "JPG, PNG, GIF jusqu\\'à 1Mo.",
        editor: {
          title: "Modifier l\\'avatar",
          cropPreviewAlt: "Aperçu du recadrage de l\\'avatar"
        }
      },
      edit: 'Modifier le Profil', 
      name: 'Nom Complet', 
      email: 'Adresse E-mail', 
      phone: 'Numéro de Téléphone', 
      position: 'Poste',
      role: 'Rôle',
      avatar: 'Photo de Profil', 
      avatarAlt: "Avatar de l\\'administrateur",
      changeAvatar: 'Changer', // This seems to be a duplicate of avatarDetails.change, review usage
    },
    currency: {
      currencyChanged: 'Devise changée en {currency}.',
      invalidRate: 'Taux de change invalide. Le taux doit être un nombre positif.',
      rateExists: 'Un taux manuel pour {currency} existe déjà.',
      rateAdded: 'Taux manuel pour {currency} ajouté avec succès.',
      fillAllFields: 'Veuillez remplir tous les champs pour le nouveau taux.',
      rateUpdated: 'Taux manuel pour {currency} mis à jour avec succès.',
      activeCurrency: 'Devise d\'Affichage Active',
      manualRates: 'Taux de Change Manuels',
      manualRatesDescription: "Définissez des taux de change manuels par rapport à votre devise d'affichage active. Ces taux remplaceront les taux du marché en direct à des fins d'affichage.",
      noManualRates: 'Aucun taux de change manuel défini.',
      addRateTitle: 'Ajouter un Nouveau Taux Manuel',
      currencyLabel: 'Devise',
      selectCurrency: 'Sélectionner une devise',
      rateLabel: 'Taux (1 {selectedCurrency} = X {activeCurrency})',
      ratePlaceholder: 'ex: 0.95',
      addRateButton: 'Ajouter Taux',
    },
    security: {
      loadError: 'Erreur de chargement des paramètres de sécurité.',
      updateSuccess: 'Paramètres de sécurité mis à jour avec succès.',
      updateError: 'Erreur lors de la mise à jour des paramètres de sécurité.', // Ajouté
      sessionTerminated: 'Session terminée avec succès.',
      allOtherSessionsTerminated: 'Toutes les autres sessions ont été terminées avec succès.',
      generalTitle: 'Sécurité Générale', // Peut-être trop générique, envisager des titres spécifiques pour les sections
      identityVerification: { // Ajouté pour le titre de la section KYC
        title: 'Vérification d\'Identité (KYC)',
      },
      twoFactorAuth: { // Ajouté pour la section 2FA
        title: 'Authentification à Deux Facteurs',
        description: 'Ajoutez une couche de sécurité supplémentaire à votre compte.',
        statusEnabled: 'La 2FA est Activée',
        statusDisabled: 'La 2FA est Désactivée',
        methodEmail: 'Email',
        methodSms: 'SMS',
        promptDisable: 'Désactivez pour supprimer cette couche de sécurité.',
        promptEnable: 'Activez pour renforcer la sécurité de votre compte.',
        enableButton: 'Activer la 2FA',
        disableButton: 'Désactiver la 2FA',
      },
      sessions: { // Ajouté pour la section Sessions Actives
        title: 'Sessions Actives',
        description: 'Gérez les appareils et navigateurs actuellement connectés à votre compte.',
        loadError: 'Échec du chargement des sessions actives.',
        terminateSuccess: 'Session terminée avec succès.',
        terminateError: 'Échec de la terminaison de la session.',
        terminateAllOthersButton: 'Déconnecter toutes les autres sessions',
        terminateAllOthersSuccess: 'Toutes les autres sessions ont été terminées avec succès.',
        terminateAllOthersError: 'Échec de la terminaison de toutes les autres sessions.',
        unknownDevice: 'Appareil Inconnu',
        currentSession: 'Actuelle',
        ipAddressLabel: 'IP :',
        lastAccessedLabel: 'Dernier accès :',
        terminateButton: 'Déconnecter',
        noOtherSessions: 'Aucune autre session active trouvée.',
      },
      loginHistory: { // Ajouté pour la section Historique de Connexion
        title: 'Historique de Connexion (10 derniers)',
        loadError: 'Échec du chargement de l\'historique de connexion.',
        dateHeader: 'Date',
        deviceHeader: 'Appareil/Navigateur',
        ipHeader: 'Adresse IP',
        statusHeader: 'Statut',
        statusSuccess: 'Réussie',
        statusFailed: 'Échouée',
        noHistory: 'Aucun historique de connexion trouvé.',
      },
      // Les suivants étaient présents avant, s'assurer qu'ils sont correctement mappés ou supprimés si couverts par de nouvelles clés
      twoFactorLabel: "Activer l'authentification à deux facteurs (2FA)", // Couvert par twoFactorAuth.title
      twoFactorDescription: "Augmentez la sécurité de votre compte en exigeant une deuxième forme de vérification.", // Couvert par twoFactorAuth.description
      noSettingsData: "Les données des paramètres de sécurité ne sont pas disponibles pour le moment.", // Message d'erreur général possible
      activeSessionsTitle: 'Sessions Actives', // Couvert par sessions.title
      terminateAllOtherSessions: 'Déconnecter toutes les autres sessions', // Couvert par sessions.terminateAllOthersButton
      // unknownDevice: 'Appareil Inconnu', // Couvert par sessions.unknownDevice
      // currentSession: 'Session actuelle', // Couvert par sessions.currentSession
      // lastAccessed: 'Dernier accès', // Couvert par sessions.lastAccessedLabel
      // terminateSession: 'Déconnecter', // Couvert par sessions.terminateButton
      // noActiveSessions: 'Aucune autre session active trouvée.', // Couvert par sessions.noOtherSessions
      // loginHistoryTitle: 'Historique de Connexion (10 derniers)', // Couvert par loginHistory.title
      // historyDate: 'Date', // Couvert par loginHistory.dateHeader
      // historyIp: 'Adresse IP', // Couvert par loginHistory.ipHeader
      // historyDevice: 'Appareil/Navigateur', // Couvert par loginHistory.deviceHeader
      // historyStatus: 'Statut', // Couvert par loginHistory.statusHeader
      // historySuccess: 'Réussie', // Couvert par loginHistory.statusSuccess
      // historyFailed: 'Échouée', // Couvert par loginHistory.statusFailed
      // noLoginHistory: "Aucun historique de connexion trouvé.", // Couvert par loginHistory.noHistory
    },
    notifications: {
      updateSuccess: 'Préférences de notification mises à jour avec succès.',
      updateError: 'Erreur lors de la mise à jour des préférences de notification.',
      loadError: 'Erreur de chargement des préférences de notification.',
      title: 'Préférences de Notification',
      description: 'Gérez les notifications que vous recevez.',
      emailNotifications: { // Renamed from email to emailNotifications
        title: "Notifications par Email",
        description: "Gérez vos préférences de notification par email."
      },
      securityAlerts: { // Renamed from security to securityAlerts
        title: "Alertes de Sécurité",
        description: "Recevez des notifications pour les événements de sécurité importants, comme les nouvelles connexions ou les changements de mot de passe."
      },
      productUpdates: { // Renamed from updates to productUpdates
        title: "Mises à Jour Produit & Nouvelles",
        description: "Restez informé des nouvelles fonctionnalités, améliorations et annonces."
      },
      toggle: 'Basculer la notification pour {type}',
      noPreferences: 'Aucune préférence de notification disponible.',
      types: { // Exemple, ajoutez-en d'autres selon vos types NotificationPreference
        NEW_USER_REGISTRATION: {
          label: 'Nouvelle Inscription Utilisateur',
          description: "Recevoir une notification lorsqu'un nouvel utilisateur s'inscrit.",
        },
        SUBSCRIPTION_CHANGE: {
          label: "Changement d'Abonnement",
          description: "Recevoir une notification pour les mises à niveau ou les rétrogradations d'abonnement.",
        },
        PAYMENT_RECEIVED: {
          label: 'Paiement Reçu',
          description: "Être notifié lorsqu'un paiement est traité avec succès.",
        },
        SYSTEM_ALERTS: {
            label: 'Alertes Système',
            description: 'Recevoir des alertes et annonces importantes à l\'échelle du système.'
        }
      }
    },
    display: { // Added display settings
      title: 'Paramètres d\\\'Affichage',
      themeLabel: 'Thème',
      themeLight: 'Clair',
      themeDark: 'Sombre',
      themeSystem: 'Système',
      layoutLabel: 'Mise en page',
      layoutCompact: 'Compacte',
      layoutComfortable: 'Confortable',
      themeUpdateSuccess: 'Thème mis à jour avec succès',
      themeUpdateError: 'Échec de la mise à jour du thème',
      layoutUpdateSuccess: 'Mise en page mise à jour avec succès',
      layoutUpdateError: 'Échec de la mise à jour de la mise en page',
    },
    language: { // Added language settings
      title: 'Paramètres de Langue et de Date',
      languageLabel: 'Langue',
      selectLanguagePlaceholder: 'Sélectionner la langue',
      english: 'Anglais',
      french: 'Français',
      dateFormatLabel: 'Format de Date',
      selectDateFormatPlaceholder: 'Sélectionner le format de date',
      languageChangeSuccess: 'Langue changée avec succès',
      languageChangeError: 'Erreur lors du changement de langue :',
      languageChangeActionError: 'changer la langue',
      dateFormatChangeSuccess: 'Format de date changé avec succès',
      dateFormatChangeError: 'Erreur lors du changement de format de date :',
      dateFormatChangeActionError: 'changer le format de date',
    },
    advanced: {
      title: 'Paramètres Avancés',
      exportData: 'Exporter les Données',
      exportDescription: 'Téléchargez les données de votre application dans différents formats.',
      exportFormat: 'Format d\\\'Exportation',
      exportButton: 'Exporter les Données',
      exportStarted: 'L\\\'exportation des données a commencé. Cela peut prendre quelques instants.',
      importData: 'Importer des Données',
      importWarning: 'L\\\'importation de données écrasera les paramètres et le contenu existants. Assurez-vous d\\\'avoir une sauvegarde.',
      dropFiles: 'Déposez les fichiers ici ou cliquez pour téléverser',
      supportedFormats: 'Formats supportés : JSON, CSV',
      browseFiles: 'Parcourir les Fichiers',
      importStarted: 'L\\\'importation des données a commencé. Cela peut prendre quelques instants.',
      resetApplication: 'Réinitialiser l\\\'Application',
      resetWarning: 'Cette action est irréversible. La réinitialisation supprimera toutes vos données et restaurera l\\\'application à son état par défaut.',
      resetButton: 'Réinitialiser les Données de l\\\'Application',
      confirmReset: 'Êtes-vous absolument sûr ?',
      confirmResetDescription: 'Cela supprimera définitivement toutes les données de l\\\'application. Cette action ne peut pas être annulée.',
      confirmResetButton: 'Oui, Tout Réinitialiser',
      resetComplete: 'L\\\'application a été réinitialisée avec succès.',
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
    addCustomer: 'Ajouter un Client',
    confirmDelete: 'Êtes-vous sûr de vouloir supprimer ce client ?',
    pme: {
      title: 'Clients PME',
      noCustomersFound: 'Aucun client PME trouvé',
      errors: {
        loadFailed: 'Échec du chargement des clients PME. Veuillez réessayer.'
      }
    },
    financial: {
      title: 'Clients Institutions Financières',
      noCustomersFound: 'Aucun client institution financière trouvé',
      errors: {
        loadFailed: 'Échec du chargement des clients institutions financières. Veuillez réessayer.'
      }
    },
    pending: {
      title: 'Clients en Attente',
      noCustomersFound: 'Aucun client en attente trouvé',
      loadError: 'Erreur lors du chargement des clients en attente',
      moreInfoMessage: 'Des informations supplémentaires sont requises',
      approveSuccess: 'Le client a été approuvé avec succès',
      approveError: 'Erreur lors de l\'approbation du client',
      rejectSuccess: 'Le client a été rejeté avec succès',
      rejectError: 'Erreur lors du rejet du client',
      requestInfoSuccess: 'Demande d\'informations supplémentaires envoyée',
      requestInfoError: 'Erreur lors de l\'envoi de la demande d\'informations',
      status: {
        verification: 'Vérification en Cours',
        approval: 'En Attente d\'Approbation',
        info: 'Informations Manquantes',
        payment: 'Paiement en Attente'
      },
      statusDescription: {
        verification: 'Vérification des informations en cours',
        approval: 'Nécessite une approbation manuelle',
        info: 'Informations supplémentaires requises',
        payment: 'En attente du premier paiement'
      },
      actions: {
        requestInfo: 'Demander plus d\'infos',
        approve: 'Approuver',
        reject: 'Rejeter',
        view: 'Voir détails'
      },
      confirmations: {
        approve: {
          title: 'Approuver le Client',
          message: 'Êtes-vous sûr de vouloir approuver ce client ? Cela le fera passer au statut actif.'
        },
        reject: {
          title: 'Rejeter le Client',
          message: 'Êtes-vous sûr de vouloir rejeter ce client ? Cette action ne peut pas être annulée.'
        },
        requestInfo: {
          title: 'Demander Plus d\'Informations',
          message: 'Cela notifiera le client que des informations supplémentaires sont requises et changera son statut en conséquence.'
        }
      }
    },
    columns: {
      name: 'Nom',
      email: 'Email',
      location: 'Localisation',
      status: 'Statut',
      actions: 'Actions',
      type: 'Type',
      accountManager: 'Responsable du Compte',
      created: 'Créé le',
      lastActivity: 'Dernière Activité',
      subscription: 'Abonnement'
    },
    actions: {
      view: 'Voir',
      edit: 'Modifier',
      delete: 'Supprimer',
      approve: 'Approuver',
      reject: 'Rejeter',
      suspend: 'Suspendre',
      reactivate: 'Réactiver',
      editNotImplemented: 'Fonctionnalité de modification à implémenter'
    },
    errors: {
      loadFailed: 'Échec du chargement des clients.',
      networkError: 'Impossible de charger les clients. Veuillez vérifier votre connexion réseau.',
      serverError: 'Le serveur a rencontré une erreur lors du chargement des clients.',
      loadDetailsFailed: 'Échec du chargement des détails du client.',
      createFailed: 'Échec de la création du client.',
      updateFailed: 'Échec de la mise à jour du client.',
      deleteFailed: 'Échec de la suppression du client.',
      documentUploadFailed: 'Échec du téléchargement du document.',
      documentApproveFailed: 'Échec de l\'approbation du document.',
      documentRejectFailed: 'Échec du rejet du document.',
      validateFailed: 'Échec de la validation du client.',
      suspendFailed: 'Échec de la suspension du client.',
      reactivateFailed: 'Échec de la réactivation du client.',
      loadActivitiesFailed: 'Échec du chargement des activités du client.',
      loadStatsFailed: 'Échec du chargement des statistiques du client.',
      loadDocumentsFailed: 'Échec du chargement des documents du client.',
      invalidId: 'ID client invalide.',
      loadDetailsFailedHook: 'Impossible de charger les détails du client via le hook.'
    },
    notifications: {
      created: 'Client créé avec succès.',
      updated: 'Client mis à jour avec succès.',
      deleted: 'Client supprimé avec succès.',
      documentUploaded: 'Document téléchargé avec succès.',
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
      suspended: 'Suspendu',
      all: 'Tous les Statuts'
    },
    type: {
      pme: 'PME',
      ge: 'Grande Entreprise',
      individual: 'Particulier',
      financial: 'Institution Financière',
      other: 'Autre'
    },
    notFound: {
      title: 'Client non trouvé',
      financialDetailsDescription: 'Le client avec l\'ID fourni n\'a pas été trouvé ou les données sont incomplètes.'
    },
    editNotAvailable: 'Modification impossible : client non chargé ou ID manquant.',
    create: {
      title: 'Créer un client PME',
      financialTitle: 'Créer une Institution Financière'
    },
    details: {
      title: 'Informations du Client',
      subtitle: 'Détails et coordonnées',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      website: 'Site Web',
      contactPerson: 'Personne de Contact',
      taxId: 'Numéro d\'Identification Fiscale',
      paymentMethod: 'Méthode de Paiement Préférée',
      createdAt: 'Date de Création',
      notes: 'Notes'
    },
    documents: {
      title: 'Documents Juridiques',
      pme: {
        description: 'Documents requis pour valider votre compte professionnel'
      },
      financial: {
        description: 'Document d\'approbation requis pour valider votre institution financière'
      },
      status: {
        uploading: 'Téléchargement...',
        approved: 'Approuvé',
        rejected: 'Rejeté',
        pendingReview: 'Vérification en cours',
        pending: 'En attente'
      },
      rejectionReason: 'Motif',
      actions: {
        add: 'Ajouter',
        view: 'Voir le document',
        resubmit: 'Soumettre à nouveau',
        approve: 'Approuver',
        reject: 'Rejeter'
      },
      toast: {
        uploadSuccess: 'Document téléchargé avec succès',
        uploadError: 'Erreur lors du téléchargement du document',
        rejectSuccess: 'Document rejeté avec succès',
        rejectError: 'Erreur lors du rejet du document',
        rejectionReasonRequired: 'Le motif de rejet est requis.'
      },
      errors: {
        uploadErrorLog: 'Erreur lors du téléchargement du document :'
      },
      modals: {
        rejectDocument: {
          title: 'Rejeter le Document',
          description: 'Veuillez fournir un motif de rejet.',
          reasonPlaceholder: 'Motif de rejet...'
        }
      },
      types: {
        rccm: 'Registre du Commerce (RCCM)',
        id_nat: 'Identité Nationale',
        nif: 'Numéro d\'Identification Fiscale',
        cnss: 'Caisse Nationale de Sécurité Sociale',
        inpp: 'Institut National de Préparation Professionnelle',
        patente: 'Patente Commerciale',
        agrement: 'Document d\'Agrément',
        contract: 'Contrat',
        agrementDescription: 'Document officiel certifiant votre institution financière',
        genericDescription: 'Document officiel requis pour la validation'
      }
    },
    form: {
      name: 'Nom de l\'entreprise',
      type: 'Type',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
      status: 'Statut',
      validationTitle: 'Validation du compte',
      validated: 'Validé',
      pendingValidation: 'Ce compte est en attente de validation. La validation permet au client d\'accéder à toutes les fonctionnalités.',
      validateAccount: 'Valider ce compte',
      validatedInfo: 'Ce compte a été validé le',
      revokeValidation: 'Révoquer la validation',
      ownerTitle: 'Utilisateur principal (Owner)',
      ownerInfo: 'L\'utilisateur principal aura tous les droits sur ce compte et pourra ajouter d\'autres utilisateurs.',
      owner: 'Propriétaire du compte',
      ownerTransferable: 'Cette propriété est transférable ultérieurement.',
      subscriptionTitle: 'Abonnement & Tokens',
      accountType: 'Type d\'abonnement',
      tokenAllocation: 'Allocation de tokens mensuelle',
      pmeTokenInfo: 'PMEs: 1 million de tokens/mois inclus avec les forfaits payants',
      financialTokenInfo: 'Institutions financières: 10 millions de tokens/mois inclus avec les forfaits payants',
      tokenPurchaseInfo: 'Les clients peuvent acheter des tokens supplémentaires au prix de 10 USD par million une fois leur allocation mensuelle épuisée.',
      billingContactTitle: 'Contact de facturation',
      billingContactName: 'Nom du contact',
      billingContactEmail: 'Email du contact',
      planTitle: 'Plan & Abonnement',
      plan: 'Plan',
      setTokens: {
        pme: 'Définir 1M',
        financial: 'Définir 10M'
      },
      selectUser: '-- Sélectionner un utilisateur --',
      selectPlan: '-- Sélectionner un plan --',
      accountTypes: {
        freemium: 'Freemium',
        standard: {
          pme: 'Standard PME',
          financial: 'Standard Financier'
        },
        premium: {
          pme: 'Premium PME',
          financial: 'Premium Financier'
        },
        enterprise: 'Enterprise Financier'
      }
    },
    users: {
      title: 'Utilisateurs',
      description: 'Gérer les utilisateurs du compte client',
      addUser: 'Inviter un utilisateur',
      searchPlaceholder: 'Rechercher par nom ou email...',
      filters: {
        allRoles: 'Tous les rôles',
        allStatuses: 'Tous les statuts'
      },
      roles: {
        admin: 'Administrateur',
        editor: 'Éditeur',
        viewer: 'Lecteur',
        finance: 'Finance'
      },
      statuses: {
        active: 'Actif',
        inactive: 'Suspendu',
        pending: 'En attente'
      },
      columns: {
        user: 'Utilisateur',
        role: 'Rôle',
        status: 'Statut',
        created: 'Créé le',
        lastLogin: 'Dernière connexion'
      },
      unnamed: 'Sans nom',
      owner: 'Propriétaire',
      neverLogged: 'Jamais connecté',
      noData: 'Donnée indisponible',
      noMatchingUsers: 'Aucun utilisateur ne correspond aux critères',
      noUsers: 'Aucun utilisateur trouvé',
      tryDifferentSearch: 'Essayez une recherche différente',
      addFirstUser: 'Pour ajouter un utilisateur, cliquez sur le bouton "Inviter un utilisateur".',
      actions: {
        resendInvite: 'Renvoyer l\'invitation',
        suspend: 'Suspendre',
        activate: 'Activer',
        remove: 'Supprimer',
        isOwner: 'Propriétaire du compte'
      },
      confirmations: {
        removeTitle: 'Supprimer l\'utilisateur',
        removeMessage: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.',
        removeButton: 'Supprimer',
        suspendTitle: 'Suspendre l\'utilisateur',
        suspendMessage: 'Êtes-vous sûr de vouloir suspendre cet utilisateur ? Il ne pourra plus accéder au système.',
        suspendButton: 'Suspendre',
        activateTitle: 'Activer l\'utilisateur',
        activateMessage: 'Êtes-vous sûr de vouloir activer cet utilisateur ? Il pourra accéder au système.',
        activateButton: 'Activer',
        resendTitle: 'Renvoyer l\'invitation',
        resendMessage: 'Voulez-vous renvoyer l\'email d\'invitation à cet utilisateur ?',
        resendButton: 'Renvoyer'
      },
      invite: {
        title: 'Inviter un utilisateur',
        description: 'Invitez un nouveau utilisateur à rejoindre',
        email: 'Adresse email',
        role: 'Rôle',
        sendInvite: 'Envoyer une invitation par email',
        message: 'Message personnalisé (optionnel)',
        messagePlaceholder: 'Ajoutez un message personnalisé à l\'email d\'invitation',
        submit: 'Inviter'
      }
    },
    subscription: {
      title: 'Abonnement & Facturation',
      noSubscription: 'Aucune donnée d\'abonnement disponible.',
      manage: 'Gérer l\'Abonnement',
      info: 'Détails de l\'Abonnement',
      plan: 'Plan',
      status: 'Statut',
      expiry: 'Expire le',
      nextBilling: 'Prochaine Facturation',
      billing: 'Informations de Facturation',
      contact: 'Nom du Contact',
      email: 'Email du Contact',
      lastPaymentDate: 'Dernier Paiement',
      amount: 'Montant Payé',
      viewInvoices: 'Voir Toutes les Factures',
      noPlan: 'N/A'
    },
    tokenUsage: {
      title: 'Utilisation des tokens',
      nextRenewal: 'Renouvellement: ',
      addTokens: 'Ajouter',
      lowTokens: 'Tokens restants faibles. Envisagez d\'ajouter plus de tokens.',
      pmeAllocation: 'PME: 1 million de tokens par mois inclus avec les forfaits payants.',
      financialAllocation: 'Institution financière: 10 millions de tokens par mois inclus avec les forfaits payants.',
      addTokensTitle: 'Ajouter des tokens pour',
      tokenAmount: 'Quantité de tokens',
      estimatedCost: 'Coût estimé: ',
      confirm: 'Confirmer l\'ajout',
      details: 'Détails d\'utilisation',
      allocated: 'Allocation',
      used: 'Utilisés',
      remaining: 'Restants',
      rate: 'Taux journalier moyen',
      processing: 'Traitement...'
    },
    transactions: {
      title: 'Historique des transactions',
      subtitle: 'Dernières transactions financières',
      filters: {
        allStatus: 'Tous les statuts',
        allTypes: 'Tous les types'
      },
      table: {
        type: 'Type',
        description: 'Description',
        date: 'Date',
        amount: 'Montant',
        status: 'Statut'
      },
      empty: {
        title: 'Pas de transactions',
        description: 'Aucune transaction trouvée pour ce client.'
      }
    }
  },
  customer: {
    types: {
      pme: 'PME',
      financial_institution: 'Institution Financière',
    },
    // ... other customer translations
  },
  notifications: {
    title: 'Notifications',
    markAllRead: 'Tout marquer comme lu',
    empty: 'Vous n\'avez aucune nouvelle notification.',
    realtime: {
      connected: 'Connexion temps réel active',
      disconnected: 'Connexion temps réel inactive, vérification des mises à jour en cours'
    },
    errors: {
      load: 'Erreur lors du chargement des notifications',
      markRead: 'Erreur lors du marquage de la notification comme lue',
      markAllRead: 'Erreur lors du marquage de toutes les notifications comme lues',
      delete: 'Erreur lors de la suppression de la notification',
    },
    types: {
      security: 'Alerte de Sécurité',
      warning: 'Avertissement',
      payment: 'Paiement Reçu',
      document: 'Mise à Jour de Document',
      info: 'Information',
      subscription: 'Mise à Jour d\'Abonnement',
      success: 'Succès',
      error: 'Erreur',
    }
  },
  transaction: {
    type: {
      payment: 'Paiement',
      refund: 'Remboursement',
      subscription: 'Abonnement',
      credit: 'Crédit'
    },
    descriptions: {
      premiumSubscription: 'Abonnement Premium - {{month}} {{year}}',
      partialRefund: 'Remboursement partiel - Service indisponible',
      extendedTestCredit: 'Crédit pour période de test prolongée'
    }
  },
  // ... other sections
  chat: {
    title: 'Support',
    closeChat: 'Fermer le chat',
    sendMessage: 'Envoyer un message',
    attachFile: 'Joindre un fichier',
    messagePlaceholder: 'Écrivez votre message ici...',
    fileUploadError: 'Erreur lors du téléchargement du fichier',
    connectingMessage: 'Connexion en cours...',
    typingIndicator: 'est en train d\'écrire...',
    connectionError: 'Erreur de connexion au chat',
    reconnectMessage: 'Tentative de reconnexion...',
    noMessages: 'Aucun message. Commencez la conversation !',
    welcomeMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    agentName: 'Support Wanzo',
    yourName: 'Vous',
    sendingMessage: 'Envoi...',
    failedToSend: 'Échec de l\'envoi. Cliquez pour réessayer.',
    attachmentTypes: 'Images, PDFs, Documents (.doc, .docx)',
    fileSizeLimit: 'Taille maximale du fichier : 5 Mo'
  },
  resetPasswordPage: {
    passwordResetSuccess: 'Mot de passe réinitialisé avec succès',
    errorResettingPassword: 'Une erreur est survenue lors de la réinitialisation du mot de passe',
  },
  resetPasswordForm: {
    title: 'Réinitialiser votre mot de passe',
    instruction: 'Entrez votre nouveau mot de passe ci-dessous',
    newPassword: 'Nouveau mot de passe',
    confirmPassword: 'Confirmer le mot de passe',
    passwordPlaceholder: 'Entrez votre nouveau mot de passe',
    confirmPasswordPlaceholder: 'Confirmez votre nouveau mot de passe',
    resetButton: 'Réinitialiser le mot de passe',
    passwordTooShort: 'Le mot de passe doit contenir au moins 8 caractères',
    passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
  },
  twoFactorVerificationPage: {
    title: 'Vérification en Deux Étapes',
    instruction: 'Entrez le code de vérification envoyé à votre {{method}}',
    verificationCode: 'Code de Vérification',
    codePlaceholder: 'Entrez le code ici',
    verifyButton: 'Vérifier',
    resendCode: 'Renvoyer le code',
    codeSent: 'Code de vérification envoyé. Vérifiez votre {{method}}.',
    invalidCode: 'Code invalide. Veuillez réessayer.',
    verificationSuccess: 'Vérification réussie. Vous êtes maintenant connecté.',
    verificationFailed: 'Échec de la vérification.',
    methodEmail: 'Email',
    methodSms: 'SMS',
  },
  payments: {
    title: 'Paiements',
    description: 'Gérer les paiements du compte client',
    makePayment: 'Effectuer un Paiement',
    paymentHistory: 'Historique des Paiements',
    paymentMethods: 'Méthodes de Paiement',
    addPaymentMethod: 'Ajouter une Méthode de Paiement',
    noPaymentsFound: 'Aucun paiement trouvé',
    paymentStatus: {
      completed: 'Complété',
      pending: 'En attente',
      failed: 'Échoué',
      canceled: 'Annulé',
      verified: 'Vérifié',
      rejected: 'Rejeté',
      unknown: 'Statut Inconnu', // Added for PaymentsPage
    },
    columns: {
      date: 'Date',
      amount: 'Montant',
      status: 'Statut',
      method: 'Méthode',
      reference: 'Référence',
      actions: 'Actions',
    },
    actions: {
      view: 'Voir',
      retry: 'Réessayer',
      cancel: 'Annuler',
    },
    notifications: {
      paymentSuccess: 'Paiement effectué avec succès.',
      paymentFailed: 'Échec du paiement.',
      paymentPending: 'Paiement en attente.',
      paymentCanceled: 'Paiement annulé.',
      paymentVerified: 'Paiement vérifié.',
      paymentRejected: 'Paiement rejeté.',
    },
    errors: {
      loadFailed: 'Échec du chargement des paiements.',
      networkError: 'Impossible de charger les paiements. Veuillez vérifier votre connexion réseau.',
      serverError: 'Le serveur a rencontré une erreur lors du chargement des paiements.',
      createFailed: 'Échec de la création du paiement.',
      updateFailed: 'Échec de la mise à jour du paiement.',
      deleteFailed: 'Échec de la suppression du paiement.',
      validateFailed: 'Échec de la validation du paiement.',
    },
    emptyState: {
      title: 'Aucun paiement trouvé',
      description: 'Aucun paiement n\'a encore été effectué pour ce client.',
    },
    paymentForm: {
      title: 'Effectuer un Paiement',
      amountLabel: 'Montant',
      methodLabel: 'Méthode de Paiement',
      referenceLabel: 'Référence',
      submitButton: 'Confirmer le Paiement',
      cancelButton: 'Annuler',
      paymentSuccessMessage: 'Votre paiement de {{amount}} a été effectué avec succès.',
      paymentErrorMessage: 'Une erreur est survenue lors du traitement de votre paiement.',
    },
  },  finance: {
    tokens: {
      title: 'Tokens & Utilisation IA',
      subtitle: 'Gérer et surveiller la consommation de tokens à travers les services',
      refreshMessage: 'Données de tokens actualisées avec succès',
      exportMessage: 'Exportation des données de tokens initiée',
      loading: 'Chargement des données de tokens...',
      noData: 'Aucune transaction de tokens trouvée',
      errorLoadingTitle: 'Erreur de Chargement des Données',
      errorLoadingMessage: 'Une erreur est survenue lors du chargement des données de tokens : {message}',
      tryAgain: 'Réessayer',
      filters: {
        searchPlaceholder: 'Rechercher par client, type de token...',
        allServices: 'Tous les Services',
        allTime: 'Toutes les Périodes',
        last7Days: 'Derniers 7 Jours',
        last30Days: 'Derniers 30 Jours',
        last90Days: 'Derniers 90 Jours',
        customRange: 'Période Personnalisée',
        refresh: 'Actualiser les Données',
        export: 'Exporter les Données'
      },
      serviceTypes: {
        text: 'Traitement de Texte',
        voice: 'Reconnaissance Vocale',
        image: 'Traitement d\'Images',
        chat: 'Chat IA',
        wanzo_credit: 'Crédit Wanzo',
        api_call: 'Appel API',
        storage_gb: 'Stockage GB',
        processing_unit: 'Unité de Traitement',
        generic: 'Token Générique',
        unknown: 'Service Inconnu'
      },
      table: {
        customer: 'Client',
        customerType: 'Type',
        date: 'Date',
        serviceType: 'Service',
        model: 'Type de Token',
        tokens: 'Tokens',
        cost: 'Coût',
        requests: 'Requêtes',
        actions: 'Actions'
      },
      actions: {
        delete: 'Supprimer',
        deleteNotImplemented: 'Fonctionnalité de suppression à venir'
      },
      pagination: {
        info: 'Affichage de {from} à {to} sur {total} entrées',
        prev: 'Précédent',
        next: 'Suivant'
      },
      convertedFrom: 'converti depuis {currency}'
    },
    revenue: {
      title: 'Analyse des Revenus',
      timeFrames: {
        month: 'Ce Mois-ci',
        quarter: 'Ce Trimestre',
        year: 'Cette Année',
      },
      errors: {
        loadErrorDefault: 'Erreur lors du chargement des données de revenus :',
        noDataTitle: 'Aucune Donnée de Revenus',
        noDataMessage: 'Impossible de charger les données de revenus pour le moment.',
      },
      info: {
        noDataToExport: 'Aucune donnée à exporter.',
      },
      success: {
        exportInitiated: 'Exportation des données de revenus initiée',
        dataRefreshed: 'Données de revenus mises à jour',
      },
      sections: {
        overview: 'Aperçu',
        breakdown: 'Répartition',
        trends: 'Tendances',
      },
      metrics: {
        totalRevenue: 'Revenu Total',
        recurringRevenue: 'Revenu Récurrent (MRR/ARR)',
        oneTimeRevenue: 'Revenu Unique',
        revenueGrowth: 'Croissance des Revenus',
        avgRevenuePerCustomer: 'Revenu Moyen / Client',
        customerLifetimeValue: 'Valeur Vie Client (CLV)',
        vsPreviousPeriod: 'vs. période précédente',
      },
      breakdownTitles: {
        byCategory: 'Revenus par Catégorie',
        byPlan: 'Revenus par Plan d\'Abonnement',
        byCustomerType: 'Revenus par Type de Client',
      },
      categoryNames: {
        subscriptions: 'Abonnements',
        additionalTokens: 'Tokens Supplémentaires',
        professionalServices: 'Services Professionnels',
      },
      planTypes: {
        starter: 'Starter',
        pro: 'Professionnel',
        enterprise: 'Entreprise',
        financial: 'Institution Financière',
      },
      customerTypes: {
        pme: 'PME',
        financial: 'Institution Financière',
      },
      charts: {
        revenueTrend: 'Tendance des Revenus au Fil du Temps',
        noData: 'Aucune donnée disponible pour le graphique',
        total: 'Total',
        recurring: 'Récurrent',
        oneTime: 'Unique',
      },
      tableHeaders: {
        category: 'Catégorie',
        planName: 'Nom du Plan',
        customerType: 'Type de Client',
        amount: 'Montant',
        percentage: 'Pourcentage',
        customers: 'Clients',
        period: 'Période',
      },
    },
  },
};
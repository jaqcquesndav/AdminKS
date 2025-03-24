export default {
  title: 'Paramètres',
  tabs: {
    profile: 'Profil',
    general: 'Général',
    security: 'Sécurité',
    notifications: 'Notifications'
  },
  profile: {
    title: 'Profil',
    description: 'Gérez vos informations personnelles',
    edit: {
      title: 'Modifier le profil',
      button: 'Modifier'
    },
    name: 'Nom complet',
    email: 'Adresse e-mail',
    phone: 'Téléphone',
    phoneNotSet: 'Non défini',
    location: 'Localisation',
    locationNotSet: 'Non définie',
    role: 'Rôle',
    avatar: {
      change: 'Changer l\'avatar',
      requirements: 'JPG, PNG ou GIF - Max 1MB',
      editor: {
        title: 'Modifier l\'avatar',
        crop: 'Recadrer l\'image'
      }
    }
  },
  security: {
    password: {
      title: 'Mot de passe',
      description: 'Modifiez votre mot de passe pour sécuriser votre compte',
      current: 'Mot de passe actuel',
      new: 'Nouveau mot de passe',
      confirm: 'Confirmer le nouveau mot de passe',
      change: 'Changer le mot de passe',
      mismatch: 'Les mots de passe ne correspondent pas',
      error: 'Erreur lors du changement de mot de passe'
    },
    twoFactor: {
      title: 'Authentification à deux facteurs',
      description: 'Ajoutez une couche de sécurité supplémentaire à votre compte',
      setup: 'Configurer'
    },
    deleteAccount: {
      title: 'Supprimer le compte',
      description: 'Cette action est irréversible et supprimera toutes vos données',
      button: 'Supprimer mon compte',
      warning: 'Attention : cette action est irréversible',
      confirmation: 'Tapez "SUPPRIMER" pour confirmer'
    }
  }
};
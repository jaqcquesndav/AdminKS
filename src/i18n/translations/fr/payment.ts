export default {
  methods: {
    card: {
      title: 'Carte bancaire',
      description: 'Paiement sécurisé par carte Visa ou Mastercard',
      form: {
        cardNumber: 'Numéro de carte',
        cardNumberPlaceholder: '4242 4242 4242 4242',
        expiryDate: 'Date d\'expiration',
        expiryDatePlaceholder: 'MM/AA',
        cvv: 'CVV',
        cvvPlaceholder: '123',
        cardholderName: 'Nom du titulaire',
        cardholderNamePlaceholder: 'Tel qu\'il apparaît sur la carte'
      }
    },
    mobileMoney: {
      title: 'Mobile Money',
      description: 'Paiement via M-PESA, Orange Money ou Airtel Money',
      form: {
        provider: 'Opérateur',
        phoneNumber: 'Numéro de téléphone',
        phoneNumberPlaceholder: '+243 999 999 999',
        pin: 'Code PIN',
        pinDescription: 'Entrez le code PIN reçu par SMS'
      }
    },
    paypal: {
      title: 'PayPal',
      description: 'Paiement sécurisé via PayPal',
      button: 'Payer avec PayPal'
    }
  },
  confirmation: {
    success: {
      title: 'Paiement réussi',
      message: 'Votre paiement a été traité avec succès'
    },
    error: {
      title: 'Échec du paiement',
      message: 'Une erreur est survenue lors du paiement'
    }
  },
  security: {
    ssl: 'Paiement sécurisé par cryptage SSL',
    verified: 'Transaction sécurisée et vérifiée'
  }
};
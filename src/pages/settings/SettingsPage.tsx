import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from 'lucide-react'; // Removed unused icons
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { SupportedCurrency } from '../../types/currency';
import { SUPPORTED_CURRENCIES } from '../../constants/currencyConstants';

// Composants temporaires pour éviter les erreurs
const AdminProfileSettings = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Admin Utilisateur',
    email: 'admin@example.com',
    phoneNumber: '+243 999 888 777',
    position: 'Administrateur principal'
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous pourriez implémenter la logique pour enregistrer les changements
    setTimeout(() => {
      setIsEditing(false);
      // Simuler une notification de succès
      alert(t('settings.profile.updateSuccess', 'Profil mis à jour avec succès'));
    }, 800);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">{t('settings.profile.title')}</h3>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            {t('settings.profile.edit')}
          </button>
        )}
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className="p-4 border rounded-lg space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.profile.name')}</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.profile.email')}</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.profile.phone', 'Téléphone')}</label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.profile.position', 'Poste')}</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-4 border rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
            <div>
              <p className="text-sm text-gray-500">{t('settings.profile.name')}</p>
              <p className="font-medium">{formData.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('settings.profile.email')}</p>
              <p className="font-medium">{formData.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('settings.profile.phone', 'Téléphone')}</p>
              <p className="font-medium">{formData.phoneNumber || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t('settings.profile.position', 'Poste')}</p>
              <p className="font-medium">{formData.position}</p>
            </div>
            <div className="col-span-full mt-2">
              <p className="text-sm text-gray-500">{t('settings.profile.role')}</p>
              <div className="mt-1 inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md">Administrateur</div>
            </div>
          </div>
        </div>
      )}
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-3">{t('settings.profile.avatar', 'Photo de profil')}</h4>
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            <User size={24} />
          </div>
          <div>
            <button className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors">
              {t('settings.profile.changeAvatar', 'Changer')}
            </button>
            <p className="text-xs text-gray-500 mt-1">JPG, GIF ou PNG. 1MB maximum.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  const { t } = useTranslation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{t('settings.security.title')}</h3>
      
      {/* Authentification à deux facteurs */}
      <div className="p-4 border rounded-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-medium">{t('settings.security.twoFactor')}</h4>
            <p className="text-sm text-gray-500">{t('settings.security.twoFactorDesc')}</p>
          </div>
          <div className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </div>
        </div>
        <button 
          className="text-sm text-primary hover:text-primary/80 transition-colors"
          onClick={() => alert(t('settings.security.setupTwoFactor', 'Configuration de l\'authentification à deux facteurs'))}
        >
          {t('settings.security.configureTwoFactor', 'Configurer l\'authentification à deux facteurs')}
        </button>
      </div>
      
      {/* Changement de mot de passe */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">{t('settings.security.password', 'Mot de passe')}</h4>
        <p className="text-sm text-gray-500 mb-4">
          {t('settings.security.passwordLastChanged', 'Dernier changement: 15/03/2025')}
        </p>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          onClick={() => setShowPasswordModal(true)}
        >
          {t('settings.security.changePassword', 'Changer le mot de passe')}
        </button>
      </div>
      
      {/* Sessions actives */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-4">{t('settings.security.sessions', 'Sessions actives')}</h4>
        
        <div className="space-y-3">
          {/* Session actuelle */}
          <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">Chrome sur Windows</p>
                <p className="text-xs text-gray-500">Kinshasa, RDC · {t('settings.security.currentSession', 'Session actuelle')}</p>
              </div>
              <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                {t('settings.security.active', 'Active')}
              </div>
            </div>
          </div>
          
          {/* Autres sessions */}
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">Firefox sur MacOS</p>
                <p className="text-xs text-gray-500">Kinshasa, RDC · {t('settings.security.lastActive', 'Dernière activité')}: 20/04/2025</p>
              </div>
              <button className="text-red-600 hover:text-red-800 text-xs">
                {t('settings.security.terminateSession', 'Terminer')}
              </button>
            </div>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-sm">Safari sur iPhone</p>
                <p className="text-xs text-gray-500">Kinshasa, RDC · {t('settings.security.lastActive', 'Dernière activité')}: 19/04/2025</p>
              </div>
              <button className="text-red-600 hover:text-red-800 text-xs">
                {t('settings.security.terminateSession', 'Terminer')}
              </button>
            </div>
          </div>
        </div>
        
        <button 
          className="mt-4 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition-colors"
        >
          {t('settings.security.logoutAll', 'Déconnecter toutes les sessions')}
        </button>
      </div>
      
      {/* Historique des connexions */}
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-4">{t('settings.security.loginHistory', 'Historique des connexions')}</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm py-2 border-b">
            <div>
              <p className="font-medium">22/04/2025 08:15</p>
              <p className="text-xs text-gray-500">Chrome sur Windows · Kinshasa, RDC</p>
            </div>
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              {t('settings.security.successful', 'Réussie')}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm py-2 border-b">
            <div>
              <p className="font-medium">21/04/2025 17:32</p>
              <p className="text-xs text-gray-500">Firefox sur MacOS · Kinshasa, RDC</p>
            </div>
            <div className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
              {t('settings.security.successful', 'Réussie')}
            </div>
          </div>
          
          <div className="flex justify-between items-center text-sm py-2 border-b">
            <div>
              <p className="font-medium">20/04/2025 10:45</p>
              <p className="text-xs text-gray-500">Chrome sur Windows · Paris, France</p>
            </div>
            <div className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
              {t('settings.security.failed', 'Échouée')}
            </div>
          </div>
        </div>
        
        <button className="mt-3 text-sm text-primary hover:underline">
          {t('settings.security.viewAllLogins', 'Voir tout l\'historique')}
        </button>
      </div>
      
      {/* Modal de changement de mot de passe (simplifié) */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-medium mb-4">{t('settings.security.changePassword', 'Changer le mot de passe')}</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.security.currentPassword', 'Mot de passe actuel')}</label>
                <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.security.newPassword', 'Nouveau mot de passe')}</label>
                <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('settings.security.confirmPassword', 'Confirmer le mot de passe')}</label>
                <input type="password" className="w-full p-2 border border-gray-300 rounded-md" />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button 
                  type="button" 
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                  onClick={() => setShowPasswordModal(false)}
                >
                  {t('common.cancel')}
                </button>
                <button 
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
                  onClick={() => {
                    setShowPasswordModal(false);
                    alert(t('settings.security.passwordChanged', 'Mot de passe modifié avec succès'));
                  }}
                >
                  {t('common.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Nouveau composant pour les notifications
const NotificationSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {t('settings.notifications.preferences')}
        </h3>
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">{t('settings.notifications.email')}</h4>
              <p className="text-sm text-gray-500">{t('settings.notifications.emailDescription')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">{t('settings.notifications.push')}</h4>
              <p className="text-sm text-gray-500">{t('settings.notifications.pushDescription')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">{t('settings.notifications.sms')}</h4>
              <p className="text-sm text-gray-500">{t('settings.notifications.smsDescription')}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Nouveau composant pour les préférences d'affichage
const DisplaySettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {t('settings.display.theme')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <div className="h-24 bg-white border-b mb-2"></div>
            <p className="text-center font-medium">{t('settings.display.lightTheme')}</p>
          </div>
          <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <div className="h-24 bg-gray-800 border-b mb-2"></div>
            <p className="text-center font-medium">{t('settings.display.darkTheme')}</p>
          </div>
          <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <div className="h-24 bg-gradient-to-b from-white to-gray-800 border-b mb-2"></div>
            <p className="text-center font-medium">{t('settings.display.systemTheme')}</p>
          </div>
        </div>
        
        <h3 className="text-lg font-medium mb-4 mt-8">
          {t('settings.display.layout')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <div className="h-24 flex mb-2">
              <div className="w-16 bg-gray-200 h-full"></div>
              <div className="flex-1 bg-white"></div>
            </div>
            <p className="text-center font-medium">{t('settings.display.sidebarLayout')}</p>
          </div>
          <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <div className="h-24 flex flex-col mb-2">
              <div className="h-8 bg-gray-200 w-full"></div>
              <div className="flex-1 bg-white"></div>
            </div>
            <p className="text-center font-medium">{t('settings.display.topNavLayout')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Nouveau composant pour les paramètres de langue
const LanguageSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* Section langue */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">
          {t('settings.language.selectLanguage')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors bg-primary/5">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🇫🇷</span>
              <div>
                <p className="font-medium">Français</p>
                <p className="text-sm text-gray-500">Langue française</p>
              </div>
              <div className="ml-auto">
                <div className="w-4 h-4 rounded-full bg-primary"></div>
              </div>
            </div>
          </div>
          <div className="border rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🇬🇧</span>
              <div>
                <p className="font-medium">English</p>
                <p className="text-sm text-gray-500">English language</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Format de date */}
      <div className="p-4 border rounded-lg">
        <h3 className="text-lg font-medium mb-4">
          {t('settings.language.dateFormat')}
        </h3>
        <div className="space-y-4">
          <div className="flex items-center p-3 border rounded-lg bg-primary/5">
            <input 
              type="radio" 
              id="format1" 
              name="dateFormat" 
              className="form-radio text-primary" 
              defaultChecked
            />
            <label htmlFor="format1" className="ml-2 flex-grow">DD/MM/YYYY<span className="text-sm text-gray-500 ml-2">Ex: 22/04/2025</span></label>
          </div>
          <div className="flex items-center p-3 border rounded-lg">
            <input 
              type="radio" 
              id="format2" 
              name="dateFormat" 
              className="form-radio text-primary" 
            />
            <label htmlFor="format2" className="ml-2 flex-grow">MM/DD/YYYY<span className="text-sm text-gray-500 ml-2">Ex: 04/22/2025</span></label>
          </div>
          <div className="flex items-center p-3 border rounded-lg">
            <input 
              type="radio" 
              id="format3" 
              name="dateFormat" 
              className="form-radio text-primary" 
            />
            <label htmlFor="format3" className="ml-2 flex-grow">YYYY-MM-DD<span className="text-sm text-gray-500 ml-2">Ex: 2025-04-22</span></label>
          </div>
        </div>
      </div>
    </div>
  );
};

// Nouveau composant pour le support et l'aide
const SupportSettings = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-medium mb-4">
          {t('settings.support.help', 'Help & Support')}
        </h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium mb-2">{t('settings.support.documentation', 'Documentation')}</h4>
            <p className="text-sm text-gray-600 mb-4">{t('settings.support.documentationDesc', 'Find detailed information and guides in our documentation.')}</p>
            <button className="btn btn-primary">
              {t('settings.support.viewDocs', 'View Documentation')}
            </button>          
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <h4 className="font-medium mb-2">{t('settings.support.contactUs', 'Contact Us')}</h4>
            <p className="text-sm text-gray-600 mb-4">{t('settings.support.contactDesc', 'Need further assistance? Get in touch with our support team.')}</p>
            <button className="btn btn-outline">
              {t('settings.support.contactSupport', 'Contact Support')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Nouveau composant pour les paramètres de devise
const CurrencySettings = () => {
  const { t } = useTranslation();
  const { 
    exchangeRates, 
    updateUserRate, 
    baseCurrency 
  } = useCurrencySettings();

  // Safely initialize with optional chaining and nullish coalescing
  const [cdfRate, setCdfRate] = useState<string>(exchangeRates?.CDF?.toString() ?? '1');
  const [fcfaRate, setFcfaRate] = useState<string>(exchangeRates?.FCFA?.toString() ?? '1');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Safely update with optional chaining and nullish coalescing
    setCdfRate(exchangeRates?.CDF?.toString() ?? '1');
    setFcfaRate(exchangeRates?.FCFA?.toString() ?? '1');
  }, [exchangeRates]);

  const handleSaveRates = async () => {
    setIsSaving(true);
    try {
      const cdf = parseFloat(cdfRate);
      const fcfa = parseFloat(fcfaRate);

      if (baseCurrency !== 'CDF' && !isNaN(cdf) && cdf > 0) {
        await updateUserRate('CDF', cdf);
      } else if (baseCurrency === 'CDF') {
        // Optionally inform user they can't change base currency rate here
      } else {
        alert(t('settings.currency.invalidCdfRate', 'Invalid CDF rate. Please enter a positive number.'));
      }

      if (baseCurrency !== 'FCFA' && !isNaN(fcfa) && fcfa > 0) {
        await updateUserRate('FCFA', fcfa);
      } else if (baseCurrency === 'FCFA') {
        // Optionally inform user they can't change base currency rate here
      } else {
        alert(t('settings.currency.invalidFcfaRate', 'Invalid FCFA rate. Please enter a positive number.'));
      }
      // Consider giving more specific feedback or a single success message
      alert(t('settings.currency.ratesUpdated', 'Exchange rates updated successfully.'));
    } catch (error) {
      console.error("Failed to update rates:", error);
      alert(t('settings.currency.ratesUpdateFailed', 'Failed to update exchange rates.'));
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">{t('settings.currency.title', 'Currency Settings')}</h3>
      
      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">{t('settings.currency.activeCurrency', 'Active Display Currency')}</h4>
        <CurrencySelector
          onChange={() => {}}
        />
        <p className="text-sm text-gray-500 mt-1">
          {t('settings.currency.activeCurrencyDesc', 'This is the currency used for displaying amounts throughout the application.')}
        </p>
      </div>

      <div className="p-4 border rounded-lg">
        <h4 className="font-medium mb-2">
          {t('settings.currency.manualExchangeRates', 'Manual Exchange Rates')} ({t('settings.currency.baseCurrency', 'Base:')} {baseCurrency})
        </h4>
        <p className="text-sm text-gray-500 mb-4">
          {t('settings.currency.manualExchangeRatesDesc', 'Set custom exchange rates relative to the base currency. These rates will be used for conversions if specific API rates are unavailable or overridden.')}
        </p>
        <div className="space-y-4">
          {baseCurrency !== 'CDF' && (
            <div>
              <label htmlFor="cdfRate" className="block text-sm font-medium text-gray-700">
                1 {baseCurrency} = 
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="cdfRate"
                  id="cdfRate"
                  className="focus:ring-primary focus:border-primary flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2"
                  value={cdfRate}
                  onChange={(e) => setCdfRate(e.target.value)}
                  min="0.000001"
                  step="any"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  CDF
                </span>
              </div>
            </div>
          )}
          {baseCurrency !== 'FCFA' && (
            <div>
              <label htmlFor="fcfaRate" className="block text-sm font-medium text-gray-700">
                1 {baseCurrency} = 
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="number"
                  name="fcfaRate"
                  id="fcfaRate"
                  className="focus:ring-primary focus:border-primary flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 p-2"
                  value={fcfaRate}
                  onChange={(e) => setFcfaRate(e.target.value)}
                  min="0.000001"
                  step="any"
                />
                <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                  FCFA
                </span>
              </div>
            </div>
          )}
          {(baseCurrency === 'CDF' || baseCurrency === 'FCFA') && SUPPORTED_CURRENCIES.filter((c: SupportedCurrency) => c !== baseCurrency).length === 0 && (
             <p className="text-sm text-gray-600">{t('settings.currency.noOtherCurrenciesToSet', 'All other supported currencies are currently set as the base currency.')}</p>
          )}
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSaveRates}
            disabled={isSaving || SUPPORTED_CURRENCIES.filter((c: SupportedCurrency) => c !== baseCurrency && (c === 'CDF' || c === 'FCFA')).length === 0}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? t('common.saving', 'Saving...') : t('common.saveChanges', 'Save Changes')}
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant principal SettingsPage
const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile'); // Default tab

  const tabs = [
    { id: 'profile', labelKey: 'settings.tabs.profile', component: <AdminProfileSettings /> },
    { id: 'security', labelKey: 'settings.tabs.security', component: <SecuritySettings /> },
    { id: 'notifications', labelKey: 'settings.tabs.notifications', component: <NotificationSettings /> },
    { id: 'display', labelKey: 'settings.tabs.display', component: <DisplaySettings /> },
    { id: 'language', labelKey: 'settings.tabs.language', component: <LanguageSettings /> },
    { id: 'currency', labelKey: 'settings.tabs.currency', component: <CurrencySettings /> },
    { id: 'support', labelKey: 'settings.tabs.support', component: <SupportSettings /> },
  ];

  const renderTabContent = () => {
    const currentTab = tabs.find(tab => tab.id === activeTab);
    return currentTab ? currentTab.component : <p>Select a tab</p>;
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">{t('settings.title', 'Settings')}</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Tab Navigation */}
        <div className="md:w-1/4">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${activeTab === tab.id 
                    ? 'bg-primary text-white' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
              >
                {t(tab.labelKey, tab.id.charAt(0).toUpperCase() + tab.id.slice(1))}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Tab Content */}
        <div className="md:w-3/4">
          <div className="bg-white shadow-md rounded-lg p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
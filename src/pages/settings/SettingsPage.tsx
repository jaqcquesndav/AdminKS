import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User, Shield, Bell, Globe, UploadCloud, HelpCircle, Palette, Edit3, LogOut, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'; // Removed ChevronRight, SettingsIcon, Info
import { useCurrencySettings } from '../../hooks/useCurrencySettings';
import { CurrencySelector } from '../../components/common/CurrencySelector';
import { SupportedCurrency } from '../../types/currency';
import { SUPPORTED_CURRENCIES } from '../../constants/currencyConstants';
import { useToast } from '../../hooks/useToast';
import { useAdminProfile } from '../../hooks/useAdminProfile';
import type { UserProfile } from '../../types/user';
import { useSecuritySettings } from '../../hooks/useSecuritySettings'; 
import type { ActiveSession, LoginAttempt } from '../../hooks/useSecuritySettings'; // Removed SecuritySettingsData
import { useNotificationPreferences } from '../../hooks/useNotificationPreferences'; 
import type { NotificationPreference } from '../../hooks/useNotificationPreferences'; 
import DisplaySettingsComponent from './DisplaySettings'; 
import LanguageSettingsComponent from './LanguageSettings'; 

const AdminProfileSettings = () => {
    const { t } = useTranslation();
    const { showToast } = useToast();
    const { 
      profile, 
      isLoading, 
      isUpdating, 
      error, 
      updateAdminProfile, 
      updateAdminAvatar,
    } = useAdminProfile();
  
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<Partial<UserProfile>>({});
    const fileInputRef = useRef<HTMLInputElement>(null);
  
    useEffect(() => {
      if (profile) {
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          position: profile.position || '',
        });
      }
    }, [profile]);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev: Partial<UserProfile>) => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!profile) return;
  
      const result = await updateAdminProfile(formData);
      if (result) {
        setIsEditing(false);
        showToast('success', t('settings.profile.updateSuccess', 'Profil mis à jour avec succès'));
      }
    };
  
    const handleCancelEdit = () => {
      setIsEditing(false);
      if (profile) {
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          position: profile.position || '',
        });
      }
    };
  
    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        if (file.size > 1024 * 1024) { 
          showToast('error', t('settings.profile.avatarSizeError', "L'image est trop grande (max 1MB)."));
          return;
        }
        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          showToast('error', t('settings.profile.avatarTypeError', "Format d'image non supporté (JPG, PNG, GIF)."));
          return;
        }
        await updateAdminAvatar(file);
      }
    };
  
    const triggerAvatarUpload = () => {
      fileInputRef.current?.click();
    };
  
    if (isLoading && !profile) {
      return <div className="flex justify-center items-center h-32"><div className="loader"></div></div>;
    }
  
    if (error && !profile) {
      return <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">{t('settings.profile.loadError', 'Erreur de chargement du profil:')} {error}</div>;
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">{t('settings.profile.title')}</h3>
          {!isEditing && profile && (
            <button 
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
            >
              <Edit3 size={16} className="mr-2" />
              {t('settings.profile.edit')}
            </button>
          )}
        </div>
        
        {isEditing && profile ? (
          <form onSubmit={handleSubmit} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-4 bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.name')}</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.email')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.phone', 'Téléphone')}</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.profile.position', 'Poste')}</label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                disabled={isUpdating}
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary transition-colors flex items-center"
                disabled={isUpdating}
              >
                {isUpdating && <div className="loader-small mr-2"></div>} 
                {t('common.save')}
              </button>
            </div>
          </form>
        ) : profile ? (
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.profile.name')}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.profile.email')}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.email || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.profile.phone', 'Téléphone')}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.phoneNumber || "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.profile.position', 'Poste')}</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{profile.position || '-'}</p>
              </div>
              <div className="col-span-full mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.profile.role')}</p>
                <div className="mt-1 inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-md">{profile.role || 'Administrateur'}</div>
              </div>
            </div>
          </div>
        ) : null}
  
        {profile && (
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">{t('settings.profile.avatar', 'Photo de profil')}</h4>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 overflow-hidden">
                {profile.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={t('settings.profile.avatarAlt', "Avatar de l'administrateur")} className="h-full w-full object-cover" />
                ) : (
                  <User size={24} />
                )}
              </div>
              <div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleAvatarChange} 
                  accept="image/png, image/jpeg, image/gif" 
                  className="hidden" 
                  disabled={isUpdating}
                />
                <button 
                  onClick={triggerAvatarUpload}
                  className="px-3 py-1 bg-primary text-white text-sm rounded hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary transition-colors flex items-center"
                  disabled={isUpdating || isLoading} 
                >
                  {isUpdating && <div className="loader-small mr-2"></div>}
                  <UploadCloud size={16} className="mr-2" />
                  {t('settings.profile.changeAvatar', 'Changer')}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">JPG, GIF ou PNG. 1MB maximum.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
const CurrencySettings = () => {
    const { t } = useTranslation();
    // Correctly destructure from useCurrencySettings: use 'loading', remove 'error'
    const { currency, manualRates, setCurrency, updateManualRate, addManualRate, removeManualRate, loading } = useCurrencySettings(); 
    const { showToast } = useToast();
    const [newRate, setNewRate] = useState({ currency: '', rate: '' });
    const [editingRate, setEditingRate] = useState<{ currency: string; rate: string } | null>(null);
  
    const handleCurrencyChange = (newSelectedCurrency: SupportedCurrency) => {
      setCurrency(newSelectedCurrency);
      showToast('success', t('settings.currency.currencyChanged', { currency: newSelectedCurrency }));
    };
  
    const handleAddRate = () => {
      if (newRate.currency && newRate.rate) {
        const rateValue = parseFloat(newRate.rate);
        if (isNaN(rateValue) || rateValue <= 0) {
          showToast('error', t('settings.currency.invalidRate'));
          return;
        }
        if (manualRates.find(r => r.currency === newRate.currency)) {
          showToast('error', t('settings.currency.rateExists', { currency: newRate.currency }));
          return;
        }
        addManualRate(newRate.currency as SupportedCurrency, rateValue);
        showToast('success', t('settings.currency.rateAdded', { currency: newRate.currency }));
        setNewRate({ currency: '', rate: '' });
      } else {
        showToast('error', t('settings.currency.fillAllFields'));
      }
    };
  
    const handleUpdateRate = () => {
      if (editingRate && editingRate.currency && editingRate.rate) {
        const rateValue = parseFloat(editingRate.rate);
        if (isNaN(rateValue) || rateValue <= 0) {
          showToast('error', t('settings.currency.invalidRate'));
          return;
        }
        updateManualRate(editingRate.currency as SupportedCurrency, rateValue);
        showToast('success', t('settings.currency.rateUpdated', { currency: editingRate.currency }));
        setEditingRate(null);
      } else {
        showToast('error', t('settings.currency.fillAllFields'));
      }
    };
  
    const startEditRate = (currency: SupportedCurrency, rate: number) => {
      setEditingRate({ currency, rate: rate.toString() });
    };

    if (loading) { // Use 'loading' here
        return <div className="flex justify-center items-center h-32"><div className="loader"></div></div>;
    }
  
    return (
      <div className="space-y-6">
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{t('settings.currency.activeCurrency')}</h3>
          <CurrencySelector
            // currency prop is implicitly handled by useCurrencySettings within CurrencySelector
            onSelectCurrency={handleCurrencyChange} 
          />
        </div>
  
        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">{t('settings.currency.manualRates')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('settings.currency.manualRatesDescription')}
          </p>
          
          <div className="space-y-3 mb-6">
            {manualRates.map((rate) => (
              <div key={rate.currency} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{rate.currency}</span>
                  <span className="text-gray-600 dark:text-gray-400 mx-2">-&gt;</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{currency}</span>
                </div>
                {editingRate && editingRate.currency === rate.currency ? (
                  <div className="flex items-center space-x-2">
                    <input 
                      type="number"
                      value={editingRate.rate}
                      onChange={(e) => setEditingRate({...editingRate, rate: e.target.value})}
                      className="w-24 p-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      placeholder={t('settings.currency.ratePlaceholder')}
                      step="any"
                    />
                    <button onClick={handleUpdateRate} className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600">
                      {t('common.save')}
                    </button>
                    <button onClick={() => setEditingRate(null)} className="px-2 py-1 bg-gray-300 text-gray-700 text-xs rounded hover:bg-gray-400">
                      {t('common.cancel')}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-700 dark:text-gray-300">{`1 ${rate.currency} = ${rate.rate.toFixed(4)} ${currency}`}</span>
                    <button onClick={() => startEditRate(rate.currency, rate.rate)} className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600">
                      {t('common.edit')}
                    </button>
                    <button onClick={() => removeManualRate(rate.currency)} className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600">
                      {t('common.remove')}
                    </button>
                  </div>
                )}
              </div>
            ))}
            {manualRates.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.currency.noManualRates')}</p>
            )}
          </div>
  
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-md font-medium mb-2 text-gray-900 dark:text-gray-100">{t('settings.currency.addRateTitle')}</h4>
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <label htmlFor="new-currency" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.currency.currencyLabel')}</label>
                <select 
                  id="new-currency"
                  value={newRate.currency}
                  onChange={(e) => setNewRate({...newRate, currency: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">{t('settings.currency.selectCurrency')}</option>
                  {SUPPORTED_CURRENCIES.filter(c => c !== currency && !manualRates.find(r => r.currency === c)).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="flex-grow">
                <label htmlFor="new-rate" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{t('settings.currency.rateLabel', { activeCurrency: currency })}</label>
                <input 
                  id="new-rate"
                  type="number"
                  value={newRate.rate}
                  onChange={(e) => setNewRate({...newRate, rate: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder={t('settings.currency.ratePlaceholder')}
                  step="any"
                />
              </div>
              <button 
                onClick={handleAddRate}
                className="px-4 py-2 bg-primary text-white text-sm rounded-md hover:bg-primary/90 dark:bg-primary-dark dark:hover:bg-primary"
              >
                {t('settings.currency.addRateButton')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
};
  
const SecuritySettings = () => {
    const { t } = useTranslation();
    const {
      securitySettings,
      activeSessions,
      loginHistory,
      isLoading, // Changed from isLoadingSettings, isLoadingSessions, isLoadingHistory
      error,
      updateTwoFactorAuth,
      terminateSession,
      terminateAllOtherSessions,
      fetchActiveSessions,
      fetchLoginHistory,
      fetchSecuritySettings
    } = useSecuritySettings();
    const { showToast } = useToast();
  
    // Local state for 2FA, initialized from hook's data
    const [twoFactorEnabledLocal, setTwoFactorEnabledLocal] = useState(false);

    useEffect(() => {
      // Fetch all data on component mount
      fetchSecuritySettings();
      fetchActiveSessions();
      fetchLoginHistory();
    }, [fetchSecuritySettings, fetchActiveSessions, fetchLoginHistory]);
  
    useEffect(() => {
      if (securitySettings) {
        setTwoFactorEnabledLocal(securitySettings.twoFactorEnabled);
      }
    }, [securitySettings]);
  
    const handleSaveSecuritySettings = async () => {
      const result = await updateTwoFactorAuth(twoFactorEnabledLocal);
      if (result) {
        showToast('success', t('settings.security.updateSuccess'));
      } else {
        if (securitySettings) setTwoFactorEnabledLocal(securitySettings.twoFactorEnabled);
      }
    };
  
    const handleTerminateSession = async (sessionId: string) => {
      const success = await terminateSession(sessionId);
      if (success) {
        showToast('success', t('settings.security.sessionTerminated'));
        fetchActiveSessions(); // Refresh sessions list
      }
    };

    const handleTerminateAllOtherSessions = async () => {
        const success = await terminateAllOtherSessions();
        if (success) {
            showToast('success', t('settings.security.allOtherSessionsTerminated'));
            fetchActiveSessions(); // Refresh sessions list
        }
    }
  
    // Use generic isLoading, assuming it's true if any primary data is still loading
    if (isLoading && !securitySettings && activeSessions.length === 0 && loginHistory.length === 0) {
      return <div className="flex justify-center items-center h-32"><div className="loader"></div></div>;
    }
  
    // Error display if error occurred and not loading, and no data is present
    if (error && !securitySettings && activeSessions.length === 0 && loginHistory.length === 0 && !isLoading) {
      return <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50 flex items-center"><AlertTriangle size={20} className="mr-2"/> {t('settings.security.loadError')} {error}</div>;
    }
  
    return (
      <div className="space-y-8">
        <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{t('settings.security.generalTitle')}</h3>
          {/* Loader for security settings section */}
          {isLoading && !securitySettings ? (
             <div className="flex justify-center items-center h-20"><div className="loader"></div></div>
          ) : securitySettings ? (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center">
                    <input
                        id="twoFactorEnabled"
                        type="checkbox"
                        checked={twoFactorEnabledLocal}
                        onChange={() => setTwoFactorEnabledLocal(!twoFactorEnabledLocal)}
                        className="h-4 w-4 text-primary focus:ring-primary/50 border-gray-300 rounded"
                        disabled={isLoading} // Use generic isLoading
                    />
                    <label htmlFor="twoFactorEnabled" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t('settings.security.twoFactorLabel')}
                    </label>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {t('settings.security.twoFactorDescription')}
                    </p>
                </div>
                </div>
                <div className="mt-6 flex justify-end">
                    <button
                    onClick={handleSaveSecuritySettings}
                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
                    disabled={isLoading || (securitySettings?.twoFactorEnabled === twoFactorEnabledLocal)} // Use generic isLoading
                    >
                    {isLoading && <div className="loader-small mr-2"></div>}
                    {t('common.saveChanges')}
                    </button>
                </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.security.noSettingsData')}</p>
          )}
        </div>
  
        <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('settings.security.activeSessionsTitle')}</h3>
            {activeSessions.filter(s => !s.isCurrent).length > 0 && (
                 <button 
                    onClick={handleTerminateAllOtherSessions}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors flex items-center"
                    disabled={isLoading} // Use generic isLoading
                >
                    <LogOut size={14} className="mr-1" /> {t('settings.security.terminateAllOtherSessions')}
                </button>
            )}
          </div>
          {/* Loader for active sessions section */}
          {isLoading && activeSessions.length === 0 ? (
            <div className="flex justify-center items-center h-20"><div className="loader"></div></div>
          ) : activeSessions.length > 0 ? (
            <ul className="space-y-3">
              {activeSessions.map((session: ActiveSession) => (
                <li key={session.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">
                      {session.device || t('settings.security.unknownDevice')} ({session.ipAddress})
                      {session.isCurrent && <span className="ml-2 text-xs bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 px-2 py-0.5 rounded-full">{t('settings.security.currentSession')}</span>}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {session.browser && session.os ? `${session.browser} ${t('common.on')} ${session.os} - ` : ''}
                      {t('settings.security.lastAccessed')}: {new Date(session.lastActive).toLocaleString()}
                    </p>
                  </div>
                  {!session.isCurrent && (
                    <button 
                      onClick={() => handleTerminateSession(session.id)}
                      className="mt-2 sm:mt-0 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors flex items-center"
                      disabled={isLoading} // Use generic isLoading
                    >
                     <LogOut size={14} className="mr-1" /> {t('settings.security.terminateSession')}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.security.noActiveSessions')}</p>
          )}
        </div>
    
        <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">{t('settings.security.loginHistoryTitle')}</h3>
          {/* Loader for login history section */}
          {isLoading && loginHistory.length === 0 ? (
            <div className="flex justify-center items-center h-20"><div className="loader"></div></div>
          ) : loginHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.historyDate')}</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.historyIp')}</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.historyDevice')}</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.historyStatus')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {loginHistory.slice(0, 10).map((attempt: LoginAttempt) => ( 
                    <tr key={attempt.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{new Date(attempt.date).toLocaleString()}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{attempt.ipAddress}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{attempt.device || t('settings.security.unknownDevice')}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        {attempt.status === 'successful' ? (
                          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100">
                            <CheckCircle size={14} className="mr-1" />
                            {t('settings.security.historySuccess')}
                          </span>
                        ) : (
                          <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100">
                            <XCircle size={14} className="mr-1" />
                            {t('settings.security.historyFailed')}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.security.noLoginHistory')}</p>
          )}
        </div>
      </div>
    );
};
  
const NotificationSettings = () => {
    const { t } = useTranslation();
    // preferences from hook is the source of truth, currentPreferences is for local edits
    const { preferences, isLoading, isUpdating, error, updateAllNotificationPreferences, fetchNotificationPreferences } = useNotificationPreferences();
    const { showToast } = useToast();
  
    const [currentPreferences, setCurrentPreferences] = useState<NotificationPreference[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
  
    useEffect(() => {
      fetchNotificationPreferences(); // Fetch on mount
    }, [fetchNotificationPreferences]);

    useEffect(() => {
      if (preferences) {
        setCurrentPreferences(JSON.parse(JSON.stringify(preferences))); // Deep copy for editing
        setHasChanges(false);
      }
    }, [preferences]);
  
    const handleTogglePreference = (preferenceId: string) => { // Changed from type to preferenceId
      setCurrentPreferences(prev =>
        prev.map(p =>
          p.id === preferenceId ? { ...p, isEnabled: !p.isEnabled } : p
        )
      );
      setHasChanges(true);
    };
  
    const handleSavePreferences = async () => {
      const result = await updateAllNotificationPreferences(currentPreferences); 
      if (result) {
        showToast('success', t('settings.notifications.updateSuccess'));
        setHasChanges(false); 
        // preferences will be updated by the hook's useEffect, which will update currentPreferences
      } else {
        // Error is handled by the hook's showToast
        // Optionally revert:
        // if (preferences) setCurrentPreferences(JSON.parse(JSON.stringify(preferences)));
        // setHasChanges(false);
      }
    };

    const handleCancelChanges = () => {
        if (preferences) {
            setCurrentPreferences(JSON.parse(JSON.stringify(preferences)));
            setHasChanges(false);
        }
    }
  
    if (isLoading && currentPreferences.length === 0) {
      return <div className="flex justify-center items-center h-32"><div className="loader"></div></div>;
    }
  
    if (error && currentPreferences.length === 0 && !isLoading) {
      return <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50 flex items-center"><AlertTriangle size={20} className="mr-2"/>{t('settings.notifications.loadError')} {error}</div>;
    }
  
    return (
      <div className="space-y-6">
        <div className="p-4 sm:p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
          <h3 className="text-lg font-medium mb-1 text-gray-900 dark:text-gray-100">{t('settings.notifications.title')}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('settings.notifications.description')}</p>
          
          {isLoading && currentPreferences.length === 0 ? (
             <div className="flex justify-center items-center h-20"><div className="loader"></div></div>
          ) : currentPreferences.length > 0 ? (
            <div className="space-y-5">
              {currentPreferences.map(pref => (
                <div key={pref.id} className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div>
                    <label htmlFor={`notification-${pref.id}`} className="font-medium text-gray-700 dark:text-gray-300">{pref.label || t(`settings.notifications.types.${pref.id}.label`, pref.id.replace(/_/g, ' '))}</label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{pref.description || t(`settings.notifications.types.${pref.id}.description`, `Receive notifications for ${pref.id.toLowerCase().replace(/_/g, ' ')}.`)}</p>
                  </div>
                  <button 
                    id={`notification-${pref.id}`}
                    onClick={() => handleTogglePreference(pref.id)} // Use pref.id
                    className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                      pref.isEnabled ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    disabled={isUpdating}
                  >
                    <span className="sr-only">{t('settings.notifications.toggle', { type: pref.label })}</span>
                    <span className={`inline-block w-4 h-4 transform bg-white dark:bg-gray-300 rounded-full transition-transform ${
                        pref.isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
             <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.notifications.noPreferences')}</p>
          )}
    
          {currentPreferences.length > 0 && (
            <div className="mt-8 flex justify-end space-x-3">
              {hasChanges && (
                <button
                    onClick={handleCancelChanges}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    disabled={isUpdating}
                >
                    {t('common.cancel')}
                </button>
              )}
              <button
                onClick={handleSavePreferences}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex items-center"
                disabled={isUpdating || !hasChanges}
              >
                {isUpdating && <div className="loader-small mr-2"></div>}
                {t('common.saveChanges')}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  

const SettingsPage = () => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('profile');
  
    const tabs = [
      { id: 'profile', labelKey: 'settings.tabs.profile', icon: User, component: <AdminProfileSettings /> },
      { id: 'currency', labelKey: 'settings.tabs.currency', icon: Globe, component: <CurrencySettings /> },
      { id: 'security', labelKey: 'settings.tabs.security', icon: Shield, component: <SecuritySettings /> },
      { id: 'notifications', labelKey: 'settings.tabs.notifications', icon: Bell, component: <NotificationSettings /> },
      { id: 'display', labelKey: 'settings.tabs.display', icon: Palette, component: <DisplaySettingsComponent /> },
      { id: 'language', labelKey: 'settings.tabs.language', icon: HelpCircle, component: <LanguageSettingsComponent /> },
    ];
  
    const activeComponent = tabs.find(tab => tab.id === activeTab)?.component;
  
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {t('settings.pageTitle', 'Paramètres Administrateur')}
          </h1>
        </header>
        
        <div className="flex flex-col lg:flex-row lg:space-x-8">
          <aside className="lg:w-1/4 mb-8 lg:mb-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors
                    ${activeTab === tab.id 
                      ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
                    }`
                  }
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                >
                  <tab.icon size={18} className="mr-3" />
                  {t(tab.labelKey, tab.id.charAt(0).toUpperCase() + tab.id.slice(1))}
                </button>
              ))}
            </nav>
          </aside>
  
          <main className="lg:w-3/4">
            <div className="bg-white dark:bg-gray-800 shadow sm:rounded-lg">
              <div className="p-4 sm:p-6">
                {activeComponent ? activeComponent : <div className="text-center py-10">{t('common.loading', 'Chargement...')}</div>}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  };
  
  export default SettingsPage;
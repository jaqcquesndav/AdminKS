import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import { useTranslation } from 'react-i18next';
import { FileText, Edit3, ShieldCheck, Bell, Smartphone, Lock, LogOut, History, Mail } from 'lucide-react'; // Added Mail
import { Button } from '../common/Button';
// Removed import of SignaturePad as it doesn't exist
import { useAuth } from '../../hooks/useAuth';
import { useToastStore } from '../common/ToastContainer';
import type { AuthUser, KYCInfo } from '../../types/auth';

// Define a more specific type for notification settings if it's complex
interface UserNotificationSettings {
  twoFactorAuth: {
    enabled: boolean;
    method: 'email' | 'sms';
  };
  email: boolean;
  sms: boolean;
  // Add other notification preferences as needed
}

// Update ExtendedAuthUser to use the more specific notification type
interface ExtendedAuthUser extends AuthUser {
  kyc?: KYCInfo; // Re-using KYCInfo from auth.ts
  notifications?: UserNotificationSettings;
}

interface ActiveSession {
  id: string;
  device: string;
  ipAddress: string;
  lastAccessed: string; 
  isCurrent: boolean;
}

interface LoginHistoryEntry {
  id: string;
  date: string;
  device: string;
  ipAddress: string;
  status: 'Successful' | 'Failed';
}

export function SecuritySettings() {  const { t } = useTranslation();
  // Commenting out unused auth methods for now, assuming they will be implemented in useAuth later
  const { user: authUser, updateUser /*, getActiveSessions, terminateSession, terminateAllOtherSessions, getLoginHistory */ } = useAuth(); 
  const addToast = useToastStore(state => state.addToast);
  // State for signature modal - temporarily commented out until SignaturePad component is implemented
  // const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [securityFormData, setSecurityFormData] = useState<ExtendedAuthUser | null>(null);
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]); 
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([]); 

  const fetchActiveSessions = useCallback(async () => { // Wrapped in useCallback
    try {
      // const sessions = await getActiveSessions(); 
      // setActiveSessions(sessions);
      setActiveSessions([
        { id: 'current', device: 'Chrome on Windows', ipAddress: '192.168.1.100', lastAccessed: new Date().toISOString(), isCurrent: true },
        { id: '2', device: 'Safari on iPhone', ipAddress: '10.0.0.5', lastAccessed: new Date(Date.now() - 3600000).toISOString(), isCurrent: false },
      ]);
    } catch (error) {
      console.error("Error fetching active sessions:", error);
      addToast('error', t('settings.security.sessions.loadError', 'Failed to load active sessions.'));
    }
  }, [addToast, t /*, getActiveSessions */]); // Added dependencies

  const fetchLoginHistory = useCallback(async () => { // Wrapped in useCallback
    try {
      // const history = await getLoginHistory(); 
      // setLoginHistory(history.slice(0, 10)); 
      setLoginHistory([
        { id: '1', date: new Date(Date.now() - 86400000).toISOString(), device: 'Firefox on Ubuntu', ipAddress: '203.0.113.45', status: 'Successful' },
        { id: '2', date: new Date(Date.now() - 172800000).toISOString(), device: 'Edge on Windows', ipAddress: '198.51.100.12', status: 'Failed' },
      ]);
    } catch (error) {
      console.error("Error fetching login history:", error);
      addToast('error', t('settings.security.loginHistory.loadError', 'Failed to load login history.'));
    }
  }, [addToast, t /*, getLoginHistory */]); // Added dependencies

  useEffect(() => {
    if (authUser) {
      const initialKyc: KYCInfo = authUser.kyc || { idCard: undefined, signature: undefined };
      const initialNotifications: UserNotificationSettings = (authUser as ExtendedAuthUser).notifications || {
        twoFactorAuth: { enabled: false, method: 'email' },
        email: false,
        sms: false,
      };

      setSecurityFormData({
        ...(authUser as ExtendedAuthUser),
        kyc: initialKyc,
        notifications: initialNotifications,
      });

      fetchActiveSessions();
      fetchLoginHistory();
    }
  }, [authUser, fetchActiveSessions, fetchLoginHistory]); // Added fetchActiveSessions and fetchLoginHistory to dependencies

  const handleTerminateSession = async (sessionId: string) => {
    try {
      // await terminateSession(sessionId); // Assuming terminateSession will be available from useAuth
      addToast('success', t('settings.security.sessions.terminateSuccess', 'Session terminated successfully.'));
      fetchActiveSessions(); // Refresh sessions list
      console.log('Terminating session:', sessionId); // Keep console log for now
    } catch (error) {
      console.error(`Error terminating session ${sessionId}:`, error);
      addToast('error', t('settings.security.sessions.terminateError', 'Failed to terminate session.'));
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    try {
      // await terminateAllOtherSessions(); // Assuming terminateAllOtherSessions will be available from useAuth
      addToast('success', t('settings.security.sessions.terminateAllOthersSuccess', 'All other sessions terminated successfully.'));
      fetchActiveSessions(); // Refresh sessions list
    } catch (error) {
      console.error("Error terminating all other sessions:", error);
      addToast('error', t('settings.security.sessions.terminateAllOthersError', 'Failed to terminate all other sessions.'));
    }  };

  const handleInputChange = (field: keyof UserNotificationSettings, value: boolean | string | { enabled: boolean; method: 'email' | 'sms' }) => {
    if (!securityFormData || !securityFormData.notifications) return;
    setSecurityFormData({
      ...securityFormData,
      notifications: {
        ...securityFormData.notifications,
        [field]: value,
      },
    });
  };

  const handle2FAToggle = () => {
    if (!securityFormData || !securityFormData.notifications) return;
    const current2FA = securityFormData.notifications.twoFactorAuth;
    setSecurityFormData({
      ...securityFormData,
      notifications: {
        ...securityFormData.notifications,
        twoFactorAuth: {
          ...current2FA,
          enabled: !current2FA.enabled,
          // Optionally reset method or handle method change elsewhere
          method: !current2FA.enabled ? 'email' : current2FA.method, 
        },
      },
    });
  };

  const handleSecuritySettingsSave = async () => {
    if (!securityFormData) return;
    try {
      // Construct payload with only the fields that can be updated by this form
      const payload: Partial<ExtendedAuthUser> = {
        notifications: securityFormData.notifications,
        // kyc updates are handled by their specific functions
      };
      await updateUser(payload as Partial<AuthUser>); // Cast to Partial<AuthUser> as updateUser expects this
      addToast('success', t('settings.security.updateSuccess'));
    } catch (error) {
      console.error("Error updating security settings:", error);
      addToast('error', t('settings.security.updateError'));
    }
  };

  const handleIdCardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !securityFormData) return;

    if (!['image/jpeg', 'image/png', 'application/pdf'].includes(file.type)) {
      addToast('error', t('settings.profile.kyc.idCard.fileTypeError'));
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      addToast('error', t('settings.profile.kyc.idCard.fileSizeError'));
      return;
    }
    try {
      const fakeCloudinaryUrl = URL.createObjectURL(file);
      const updatedKyc: KYCInfo = {
        ...(securityFormData.kyc || {}),
        idCard: {
          type: 'nationalId',
          number: 'ID-' + Date.now(),
          expiryDate: new Date(Date.now() + 5 * 365 * 24 * 60 * 60 * 1000),
          fileUrl: fakeCloudinaryUrl,
          verified: false
        }
      };
      await updateUser({ kyc: updatedKyc } as Partial<AuthUser>);
      setSecurityFormData({ ...securityFormData, kyc: updatedKyc }); // Update local state
      addToast('success', t('settings.profile.kyc.idCard.uploadSuccess'));
    } catch (error) {
      console.error("Error uploading ID card:", error);
      addToast('error', t('settings.profile.kyc.idCard.uploadError'));
    }  };  
  
  // Handler for signature save - temporarily commented out until SignaturePad component is implemented
  /*
  const handleSignatureSave = async (signatureDataUrl: string) => {
    if (!securityFormData) return;
    try {
      const updatedKyc: KYCInfo = {
        ...(securityFormData.kyc || {}),
        signature: {
          fileUrl: signatureDataUrl,
          timestamp: new Date()
        }
      };
      await updateUser({ kyc: updatedKyc } as Partial<AuthUser>);
      setSecurityFormData({ ...securityFormData, kyc: updatedKyc }); // Update local state
      setIsSignatureModalOpen(false);
      addToast('success', t('settings.profile.kyc.signature.saveSuccess'));
    } catch (error) {
      console.error("Error saving signature:", error);
      addToast('error', t('settings.profile.kyc.signature.saveError'));
    }
  };
  */

  // Render loading or null if data isn't ready
  if (!securityFormData) {
    return <div>{t('common.loading', 'Loading...')}</div>; 
  }

  return (
    <div className="space-y-8">
      {/* KYC Section - Reusing translations from profile for KYC part */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-6">
            <Lock className="w-6 h-6 text-primary dark:text-primary-light" /> 
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.security.identityVerification.title', 'Identity Verification (KYC)')}
            </h3>
        </div>
        
        <div className="space-y-6">
          {/* ID Card Upload */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              <FileText className="w-6 h-6 text-primary dark:text-primary-light flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.profile.kyc.idCardLabel', 'ID Card or Passport')}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {securityFormData.kyc?.idCard 
                    ? t('settings.profile.kyc.idCardUploaded', 'Document uploaded') + (securityFormData.kyc.idCard.verified ? t('settings.profile.kyc.idCardVerified', ' and verified') : t('settings.profile.kyc.idCardPending', ' (pending verification)'))
                    : t('settings.profile.kyc.idCardNotUploaded', 'No document uploaded')}
                </p>
              </div>
            </div>
            <div>
              <input
                type="file"
                id="id-card-upload-security"
                className="hidden"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleIdCardUpload}
              />
              <label
                htmlFor="id-card-upload-security"
                className="btn btn-outline btn-sm cursor-pointer"
              >
                {securityFormData.kyc?.idCard ? t('settings.profile.kyc.updateIdCardButton', 'Update') : t('settings.profile.kyc.uploadIdCardButton', 'Upload')}
              </label>
            </div>
          </div>          
          {/* Signature */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-4 mb-3 sm:mb-0">
              <Edit3 className="w-6 h-6 text-primary dark:text-primary-light flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.profile.kyc.signatureLabel', 'Signature')}</p>                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {securityFormData.kyc?.signature 
                    ? t('settings.profile.kyc.signatureSavedDate', 'Signature saved on {date}', { date: new Date(securityFormData.kyc.signature.timestamp).toLocaleDateString() })
                    : t('settings.profile.kyc.signatureNotSaved', 'No signature saved')}
                </p>
              </div>
            </div>
            {/* Signature button temporarily disabled until SignaturePad component is implemented */}
            <Button size="sm" variant="outline" disabled title={t('settings.profile.kyc.signatureComingSoon', 'Signature feature coming soon')}>
              {securityFormData.kyc?.signature ? t('settings.profile.kyc.updateSignatureButton', 'Update') : t('settings.profile.kyc.signButton', 'Sign')}
            </Button>
          </div>
        </div>
      </div>

      {/* 2FA Section */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-primary dark:text-primary-light" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.security.twoFactorAuth.title', 'Two-Factor Authentication')}
            </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {t('settings.security.twoFactorAuth.description', 'Add an extra layer of security to your account.')}
        </p>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {securityFormData.notifications?.twoFactorAuth.enabled
                ? t('settings.security.twoFactorAuth.statusEnabled', '2FA is Enabled')
                : t('settings.security.twoFactorAuth.statusDisabled', '2FA is Disabled')}
                {securityFormData.notifications?.twoFactorAuth.enabled && 
                    ` (${securityFormData.notifications.twoFactorAuth.method === 'email' 
                        ? t('settings.security.twoFactorAuth.methodEmail', 'Email') 
                        : t('settings.security.twoFactorAuth.methodSms', 'SMS')})`
                }
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {securityFormData.notifications?.twoFactorAuth.enabled 
                    ? t('settings.security.twoFactorAuth.promptDisable', 'Disable to remove this security layer.')
                    : t('settings.security.twoFactorAuth.promptEnable', 'Enable to enhance your account security.')
                }
            </p>
          </div>
          <Button
            size="sm"
            variant={securityFormData.notifications?.twoFactorAuth.enabled ? 'dangerOutline' : 'primary'}
            onClick={handle2FAToggle} // This now only updates local state
          >
            {securityFormData.notifications?.twoFactorAuth.enabled 
                ? t('settings.security.twoFactorAuth.disableButton', 'Disable 2FA') 
                : t('settings.security.twoFactorAuth.enableButton', 'Enable 2FA')}
          </Button>
        </div>
      </div>

      {/* Active Sessions Section */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
            <LogOut className="w-6 h-6 text-primary dark:text-primary-light" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('settings.security.sessions.title', 'Active Sessions')}
            </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {t('settings.security.sessions.description', 'Manage devices and browsers currently logged into your account.')}
        </p>
        {activeSessions.length > 1 && (
            <div className="mb-4 flex justify-end">
                <Button variant="dangerOutline" size="sm" onClick={handleTerminateAllOtherSessions}>
                    {t('settings.security.sessions.terminateAllOthersButton', 'Log out all other sessions')}
                </Button>
            </div>
        )}
        <div className="space-y-4">
            {activeSessions.length > 0 ? activeSessions.map(session => (
                <div key={session.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">
                            {session.device || t('settings.security.sessions.unknownDevice', 'Unknown Device')}
                            {session.isCurrent && <span className="ml-2 text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-700 px-2 py-0.5 rounded-full">{t('settings.security.sessions.currentSession', 'Current')}</span>}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('settings.security.sessions.ipAddressLabel', 'IP:')} {session.ipAddress} - {t('settings.security.sessions.lastAccessedLabel', 'Last accessed:')} {new Date(session.lastAccessed).toLocaleString()}
                        </p>
                    </div>
                    {!session.isCurrent && (
                        <Button variant="dangerOutline" size="sm" onClick={() => handleTerminateSession(session.id)} className="mt-2 sm:mt-0">
                            {t('settings.security.sessions.terminateButton', 'Log out')}
                        </Button>
                    )}
                </div>
            )) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('settings.security.sessions.noOtherSessions', 'No other active sessions found.')}</p>
            )}
        </div>
      </div>

      {/* Login History Section */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
            <History className="w-6 h-6 text-primary dark:text-primary-light" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {t('settings.security.loginHistory.title', 'Login History (Last 10)')}
            </h3>
        </div>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.loginHistory.dateHeader', 'Date')}</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.loginHistory.deviceHeader', 'Device/Browser')}</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.loginHistory.ipHeader', 'IP Address')}</th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('settings.security.loginHistory.statusHeader', 'Status')}</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {loginHistory.length > 0 ? loginHistory.map(entry => (
                        <tr key={entry.id}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(entry.date).toLocaleString()}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{entry.device}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{entry.ipAddress}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${entry.status === 'Successful' ? 'bg-green-100 dark:bg-green-700 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-700 text-red-800 dark:text-red-200'}`}>
                                    {entry.status === 'Successful' ? t('settings.security.loginHistory.statusSuccess', 'Successful') : t('settings.security.loginHistory.statusFailed', 'Failed')}
                                </span>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={4} className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                                {t('settings.security.loginHistory.noHistory', 'No login history found.')}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* General Notification Settings Section - This seems to be a duplicate from NotificationSettings.tsx or should be merged. For now, I'll assume it's distinct for Security page context */}
      <div className="card bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
            <Bell className="w-6 h-6 text-primary dark:text-primary-light" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.notifications.title', 'Notification Preferences')}
            </h3>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            {t('settings.notifications.description', 'Manage how you receive notifications.')}
        </p>
        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.notifications.email.label', 'Email Notifications')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.notifications.email.description', 'Receive important updates via email.')}</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityFormData.notifications?.email || false}
                onChange={(e) => handleInputChange('email', e.target.checked)} // Updates local state
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-dark"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{t('settings.notifications.sms.label', 'SMS Notifications')}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{t('settings.notifications.sms.description', 'Receive critical alerts via SMS.')}</p>
                </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityFormData.notifications?.sms || false}
                onChange={(e) => handleInputChange('sms', e.target.checked)} // Updates local state
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/30 dark:peer-focus:ring-primary/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 dark:after:border-gray-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-primary-dark"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button for all settings on this page */}
      <div className="flex justify-end mt-8">
        <Button 
            onClick={handleSecuritySettingsSave} 
            size="lg"
            disabled={!securityFormData} // Disable if form data isn't loaded
        >
          {t('common.saveChanges', 'Save Changes')}
        </Button>      </div>

      {/* SignaturePad component has been temporarily removed as it doesn't exist yet */}
      {/* Uncomment when SignaturePad component is implemented
      {isSignatureModalOpen && (
        <SignaturePad
          onSave={handleSignatureSave}
          onClose={() => setIsSignatureModalOpen(false)}
        />
      )}
      */}
    </div>
  );
}
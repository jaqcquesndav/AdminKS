import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Link, Github, Slack, Google, RefreshCcw } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

type IntegrationStatus = 'connected' | 'disconnected' | 'pending';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: IntegrationStatus;
  icon: React.ReactNode;
  lastSyncDate?: string;
}

export const IntegrationsSettings: React.FC = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Connect repositories for project management integration',
      status: 'connected',
      icon: <Github />,
      lastSyncDate: '2025-04-20T14:32:00'
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Connect Slack for notifications and team updates',
      status: 'disconnected',
      icon: <Slack />
    },
    {
      id: 'google',
      name: 'Google Workspace',
      description: 'Connect calendar and documents for seamless workflow',
      status: 'connected',
      icon: <Google />,
      lastSyncDate: '2025-04-21T09:15:00'
    },
    {
      id: 'custom',
      name: 'Custom API',
      description: 'Configure custom API integrations',
      status: 'disconnected',
      icon: <Link />
    }
  ]);

  const toggleConnection = (id: string) => {
    setIntegrations(integrations.map(integration => {
      if (integration.id === id) {
        const newStatus: IntegrationStatus = integration.status === 'connected' ? 'disconnected' : 'connected';
        
        showToast({
          title: newStatus === 'connected' 
            ? t('settings.integrations.connectedSuccess', { name: integration.name })
            : t('settings.integrations.disconnectedSuccess', { name: integration.name }),
          type: newStatus === 'connected' ? 'success' : 'info'
        });

        return {
          ...integration,
          status: newStatus,
          lastSyncDate: newStatus === 'connected' ? new Date().toISOString() : undefined
        };
      }
      return integration;
    }));
  };

  const syncIntegration = (id: string) => {
    setIntegrations(integrations.map(integration => {
      if (integration.id === id) {
        showToast({
          title: t('settings.integrations.syncStarted', { name: integration.name }),
          description: t('settings.integrations.syncInProgress'),
          type: 'info'
        });

        // In a real app, this would trigger an actual sync
        setTimeout(() => {
          showToast({
            title: t('settings.integrations.syncComplete', { name: integration.name }),
            type: 'success'
          });

          setIntegrations(prev => prev.map(item => 
            item.id === id 
              ? { ...item, lastSyncDate: new Date().toISOString() }
              : item
          ));
        }, 2000);

        return integration;
      }
      return integration;
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{t('settings.integrations.title')}</h2>
        <p className="text-gray-600">{t('settings.integrations.description')}</p>
      </div>

      <div className="grid gap-6">
        {integrations.map(integration => (
          <div 
            key={integration.id}
            className="border rounded-lg p-6 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {integration.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium">{integration.name}</h3>
                  <p className="text-gray-600 text-sm">{integration.description}</p>
                  {integration.status === 'connected' && integration.lastSyncDate && (
                    <p className="text-xs text-gray-500 mt-1">
                      {t('settings.integrations.lastSync')}: {formatDate(integration.lastSyncDate)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {integration.status === 'connected' && (
                  <button
                    onClick={() => syncIntegration(integration.id)}
                    className="p-2 text-gray-600 hover:text-primary hover:bg-gray-100 rounded-full transition-colors"
                    title={t('settings.integrations.sync')}
                  >
                    <RefreshCcw size={18} />
                  </button>
                )}

                <div className="flex items-center">
                  <button
                    onClick={() => toggleConnection(integration.id)}
                    className={`
                      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 
                      transition-colors duration-200 ease-in-out
                      ${integration.status === 'connected' ? 'border-primary bg-primary' : 'border-gray-200 bg-gray-200'}
                    `}
                  >
                    <span className={`
                      pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow
                      transition duration-200 ease-in-out
                      ${integration.status === 'connected' ? 'translate-x-5' : 'translate-x-0'}
                    `} />
                  </button>
                </div>
              </div>
            </div>
            
            {integration.status === 'connected' && (
              <div className="mt-4 flex items-center gap-1 text-sm text-green-600">
                <Check size={16} />
                <span>{t('settings.integrations.connected')}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-medium mb-4">{t('settings.integrations.addNew')}</h3>
        <button 
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Link size={16} />
          {t('settings.integrations.connectNew')}
        </button>
      </div>
    </div>
  );
};
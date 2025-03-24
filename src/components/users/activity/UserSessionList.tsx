import React from 'react';
import { useTranslation } from 'react-i18next';
import { Monitor, Clock, XCircle } from 'lucide-react';
import type { UserSession } from '../../../types/activity';

interface UserSessionListProps {
  sessions: UserSession[];
  onTerminate: (sessionId: string) => void;
}

export function UserSessionList({ sessions, onTerminate }: UserSessionListProps) {
  const { t } = useTranslation();

  const formatDuration = (startDate: Date, endDate: Date = new Date()) => {
    const diff = endDate.getTime() - startDate.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Sessions actives</h3>
      
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-4">
              <Monitor className="w-5 h-5 text-gray-400" />
              
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {session.applicationName}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500">
                    {session.userAgent}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-500">
                    {session.ipAddress}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatDuration(session.startedAt)}
              </div>

              {session.status === 'active' && (
                <button
                  onClick={() => onTerminate(session.id)}
                  className="p-1 text-gray-400 hover:text-red-500"
                  title="Terminer la session"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { useState } from 'react';
import type { AdhaContextSource } from '../../../types/adhaContext';

interface Props {
  sources: AdhaContextSource[];
  isLoading: boolean;
  error: string | null;
  onEdit: (source: AdhaContextSource) => void;
  onDelete: (id: string) => void;
  onToggleActive?: (id: string, active: boolean) => void;
  onDownload?: (source: AdhaContextSource) => void;
}

export function AdhaContextCardGrid({ sources, isLoading, error, onEdit, onDelete, onToggleActive, onDownload }: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {isLoading ? (
        Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded animate-pulse" />
        ))
      ) : error ? (
        <div className="col-span-full text-center text-red-500 py-8">{error}</div>
      ) : sources.length === 0 ? (
        <div className="col-span-full text-center text-gray-400 py-8">Aucune source</div>
      ) : (
        sources.map(source => (
          <div key={source.id} className="bg-white rounded shadow p-4 flex flex-col relative">
            <div className="relative mb-2">
              <img src={source.coverImageUrl || 'https://placehold.co/400x200?text=No+Image'} alt="cover" className="h-32 w-full object-cover rounded" />
              <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold ${source.active ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>{source.active ? 'Actif' : 'Inactif'}</span>
              <button
                className="absolute top-2 right-2 p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setOpenMenuId(openMenuId === source.id ? null : source.id)}
                aria-label="Actions"
                tabIndex={0}
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>
              </button>
              {openMenuId === source.id && (
                <div className="absolute right-0 z-50 mt-2 w-44 bg-white border border-gray-200 rounded shadow-lg">
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => { setOpenMenuId(null); onEdit(source); }}
                  >
                    <span className="material-icons text-base">edit</span> Éditer
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => { setOpenMenuId(null); if (onDownload) onDownload(source); }}
                    disabled={!source.downloadUrl}
                  >
                    <span className="material-icons text-base">download</span> Télécharger
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => { setOpenMenuId(null); onDelete(source.id); }}
                  >
                    <span className="material-icons text-base">delete</span> Supprimer
                  </button>
                  <button
                    className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => { setOpenMenuId(null); if (onToggleActive) onToggleActive(source.id, !source.active); }}
                  >
                    <span className="material-icons text-base">{source.active ? 'toggle_off' : 'toggle_on'}</span> {source.active ? 'Désactiver' : 'Activer'}
                  </button>
                </div>
              )}
            </div>
            <div className="font-bold text-lg mb-1 line-clamp-1">{source.titre}</div>
            <div className="text-xs text-gray-500 mb-1">{source.type} | {source.domaine}</div>
            <div className="text-xs text-gray-500 mb-1">Zones : {source.zoneCible?.map(z => `${z.type}: ${z.value}`).join(', ')}</div>
            {source.canExpire && (
              <div className="text-xs text-orange-600 mb-1">Validité : {source.dateDebut} - {source.dateFin}</div>
            )}
            <div className="flex flex-wrap gap-1 mb-2">
              {(source.tags || []).map(tag => (
                <span key={tag} className="bg-primary text-white px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
            <div className="text-sm mb-2 line-clamp-2">{source.description}</div>
          </div>
        ))
      )}
    </div>
  );
}

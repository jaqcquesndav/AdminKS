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

export function AdhaContextTable({ sources, isLoading, error, onEdit, onDelete, onToggleActive, onDownload }: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2">Titre</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Domaine</th>
            <th className="px-4 py-2">Zone</th>
            <th className="px-4 py-2">Date validité</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <td key={j} className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-full" />
                  </td>
                ))}
              </tr>
            ))
          ) : error ? (
            <tr><td colSpan={6} className="text-center text-red-500 py-8">{error}</td></tr>
          ) : sources.length === 0 ? (
            <tr><td colSpan={6} className="text-center text-gray-400 py-8">Aucune source</td></tr>
          ) : (
            sources.map(source => (
              <tr key={source.id}>
                <td className="px-4 py-2 font-medium">{source.titre}</td>
                <td className="px-4 py-2">{source.type}</td>
                <td className="px-4 py-2">{source.domaine}</td>
                <td className="px-4 py-2">{source.zoneCible?.map(z => z.value).join(', ')}</td>
                <td className="px-4 py-2">{source.dateDebut || '-'}</td>
                <td className="px-4 py-2 relative">
                  <button
                    className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    onClick={() => handleMenu(source.id)}
                    aria-label="Actions"
                    tabIndex={0}
                  >
                    {/* Icône trois points verticale SVG */}
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
                        onClick={() => {
                          setOpenMenuId(null);
                          if (onDownload) onDownload(source);
                        }}
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
                        onClick={() => {
                          setOpenMenuId(null);
                          if (onToggleActive) onToggleActive(source.id, !source.active);
                        }}
                      >
                        <span className="material-icons text-base">{source.active ? 'toggle_off' : 'toggle_on'}</span> {source.active ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

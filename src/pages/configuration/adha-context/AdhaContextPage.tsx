import { useState, useEffect } from 'react';
import { useAdhaContext } from '../../../hooks/useAdhaContext';
import { AdhaContextTable } from '../../../components/configuration/adha-context/AdhaContextTable';
import { AdhaContextCardGrid } from '../../../components/configuration/adha-context/AdhaContextCardGrid';
import { AdhaContextFormModal } from '../../../components/configuration/adha-context/AdhaContextFormModal';
import { AdhaContextFilterBar } from '../../../components/configuration/adha-context/AdhaContextFilterBar';
import type { AdhaContextSource } from '../../../types/adhaContext';

export function AdhaContextPage() {
  const { sources, isLoading, error, fetchSources, createSource, updateSource, removeSource } = useAdhaContext();
  const [view, setView] = useState<'table' | 'cards'>('table');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSource, setEditingSource] = useState<AdhaContextSource | null>(null);
  const [filters, setFilters] = useState<Record<string, string | string[] | undefined>>({});

  useEffect(() => {
    fetchSources(filters);
  }, [fetchSources, filters]);

  const handleAdd = () => {
    setEditingSource(null);
    setIsFormOpen(true);
  };
  const handleEdit = (source: AdhaContextSource) => {
    setEditingSource(source);
    setIsFormOpen(true);
  };
  const handleDelete = async (id: string) => {
    await removeSource(id);
  };
  const handleFormSubmit = async (data: Partial<AdhaContextSource>, file?: File | null) => {
    if (file) {
      // upload Cloudinary ici (service professionnel)
      const uploadResult = await import('../../../services/adha-context/adhaContextService').then(s => s.adhaContextService.uploadFile(file));
      data.url = uploadResult.url;
      if (uploadResult.coverImageUrl) data.coverImageUrl = uploadResult.coverImageUrl;
    }
    if (editingSource) {
      await updateSource(editingSource.id, data);
    } else {
      await createSource(data);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Adha Contexte</h1>
        <div className="flex gap-2">
          <button onClick={handleAdd} className="px-4 py-2 bg-primary text-white rounded">Ajouter une source</button>
          <button
            onClick={() => setView('table')}
            className={`p-2 rounded ${view === 'table' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
            aria-label="Vue tableau"
          >
            {/* Icône liste */}
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor"/><rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor"/><rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor"/></svg>
          </button>
          <button
            onClick={() => setView('cards')}
            className={`p-2 rounded ${view === 'cards' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}`}
            aria-label="Vue cartes"
          >
            {/* Icône grille */}
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="13" y="4" width="7" height="7" rx="2" fill="currentColor"/><rect x="4" y="13" width="7" height="7" rx="2" fill="currentColor"/><rect x="13" y="13" width="7" height="7" rx="2" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
      <AdhaContextFilterBar filters={filters} setFilters={setFilters} />
      {view === 'table' ? (
        <AdhaContextTable sources={sources} isLoading={isLoading} error={error} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <AdhaContextCardGrid sources={sources} isLoading={isLoading} error={error} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      {isFormOpen && (
        <AdhaContextFormModal
          source={editingSource}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}

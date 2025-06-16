import { useState, useCallback } from 'react';
import { adhaContextService } from '../services/adha-context/adhaContextService';
import type { AdhaContextSource } from '../types/adhaContext';

export function useAdhaContext() {
  const [sources, setSources] = useState<AdhaContextSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSources = useCallback(async (filters?: Record<string, string | string[] | undefined>) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await adhaContextService.getAll(filters);
      setSources(data);
    } catch {
      setError('Erreur lors du chargement des sources');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSource = useCallback(async (data: Partial<AdhaContextSource>) => {
    setIsLoading(true);
    setError(null);
    try {
      const created = await adhaContextService.create(data);
      setSources(prev => [created, ...prev]);
      return created;
    } catch {
      setError('Erreur lors de la création');
      throw new Error('Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSource = useCallback(async (id: string, data: Partial<AdhaContextSource>) => {
    setIsLoading(true);
    setError(null);
    try {
      const updated = await adhaContextService.update(id, data);
      setSources(prev => prev.map(s => s.id === id ? updated : s));
      return updated;
    } catch {
      setError('Erreur lors de la modification');
      throw new Error('Erreur lors de la modification');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeSource = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await adhaContextService.remove();
      setSources([]); // Mock: tout supprimer
    } catch {
      setError('Erreur lors de la suppression');
      throw new Error('Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    sources,
    isLoading,
    error,
    fetchSources,
    createSource,
    updateSource,
    removeSource,
  };
}

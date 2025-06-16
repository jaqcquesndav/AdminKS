import type { AdhaContextSource } from '../../types/adhaContext';

// Simule les appels API (à remplacer par de vrais endpoints backend)
const MOCK_SOURCES: AdhaContextSource[] = [];

export const adhaContextService = {
  async getAll(filters?: Record<string, unknown>): Promise<AdhaContextSource[]> {
    // TODO: call backend, params filtrage
    let data = MOCK_SOURCES;
    if (filters) {
      if (filters.type) data = data.filter(s => s.type === filters.type);
      if (filters.domaine) data = data.filter(s => s.domaine?.toLowerCase().includes((filters.domaine as string).toLowerCase()));
      if (filters.zoneType) data = data.filter(s => s.zoneCible?.some(z => z.type === filters.zoneType));
      if (filters.zoneValue) data = data.filter(s => s.zoneCible?.some(z => z.value.toLowerCase().includes((filters.zoneValue as string).toLowerCase())));
      if (filters.niveau) data = data.filter(s => s.niveau === filters.niveau);
      if (filters.active === 'true') data = data.filter(s => s.active);
      if (filters.active === 'false') data = data.filter(s => !s.active);
      if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) data = data.filter(s => s.tags?.some(t => (filters.tags as string[]).includes(t)));
      if (filters.expire === 'true') data = data.filter(s => s.canExpire && s.dateFin && new Date(s.dateFin) < new Date());
      if (filters.expire === 'false') data = data.filter(s => !s.canExpire || (s.dateFin && new Date(s.dateFin) >= new Date()));
      if (filters.dateValidite) data = data.filter(s => s.dateDebut && new Date(s.dateDebut) >= new Date(filters.dateValidite as string));
      if (filters.search) {
        const q = (filters.search as string).toLowerCase();
        data = data.filter(s =>
          s.titre.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.domaine?.toLowerCase().includes(q) ||
          s.tags?.some(t => t.toLowerCase().includes(q))
        );
      }
    }
    return data;
  },
  async create(data: Partial<AdhaContextSource>): Promise<AdhaContextSource> {
    // TODO: call backend
    return { ...(data as AdhaContextSource), id: 'new', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  },
  async update(id: string, data: Partial<AdhaContextSource>): Promise<AdhaContextSource> {
    // TODO: call backend
    return { ...(data as AdhaContextSource), id, updatedAt: new Date().toISOString() };
  },
  async remove(): Promise<void> {
    // TODO: call backend
  },
  async uploadFile(file: File): Promise<{ url: string; coverImageUrl?: string }> {
    // TODO: upload to Cloudinary and return url(s)
    const url = 'https://cloudinary.com/fake-url/' + file.name;
    let coverImageUrl: string | undefined;
    if (file.name.endsWith('.pdf')) {
      coverImageUrl = 'https://placehold.co/400x200/EEE/333?text=PDF+Thumbnail';
    } else if (file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
      coverImageUrl = 'https://placehold.co/400x200/EEE/333?text=Word+Thumbnail';
    }
    return { url, coverImageUrl };
  },
};

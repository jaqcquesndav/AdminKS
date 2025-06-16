import { TAG_SUGGESTIONS } from '../../../types/adhaContext';

const ZONE_TYPES = [
  { label: 'Tous types de zone', value: '' },
  { label: 'Pays', value: 'pays' },
  { label: 'Province', value: 'province' },
  { label: 'Ville', value: 'ville' },
];

const NIVEAUX = [
  '', 'Débutant', 'Intermédiaire', 'Expert'
];

interface Props {
  filters: Record<string, string | string[] | undefined>;
  setFilters: (f: Record<string, string | string[] | undefined>) => void;
}

export function AdhaContextFilterBar({ filters, setFilters }: Props) {
  // Gestion multi-tags
  const handleTagToggle = (tag: string) => {
    const tags = Array.isArray(filters.tags) ? filters.tags : [];
    setFilters({
      ...filters,
      tags: tags.includes(tag) ? tags.filter(t => t !== tag) : [...tags, tag],
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <input
        placeholder="Recherche..."
        className="border p-2 rounded"
        value={filters.search || ''}
        onChange={e => setFilters({ ...filters, search: e.target.value })}
      />
      <select
        value={filters.type || ''}
        onChange={e => setFilters({ ...filters, type: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">Tous types</option>
        <option value="etude_marche">Étude de marché</option>
        <option value="reglementation">Réglementation</option>
        <option value="brevet">Brevet</option>
        <option value="annuaire">Annuaire</option>
        <option value="cours">Cours</option>
        <option value="module">Module</option>
        <option value="registre_prix">Registre de prix</option>
        <option value="tips">Tips entrepreneur</option>
        <option value="autre">Autre</option>
      </select>
      {/* Zone cible avancée */}
      <select
        value={filters.zoneType || ''}
        onChange={e => setFilters({ ...filters, zoneType: e.target.value })}
        className="border p-2 rounded"
      >
        {ZONE_TYPES.map(z => <option key={z.value} value={z.value}>{z.label}</option>)}
      </select>
      <input
        placeholder="Zone (ex: RDC, Kinshasa...)"
        className="border p-2 rounded"
        value={filters.zoneValue || ''}
        onChange={e => setFilters({ ...filters, zoneValue: e.target.value })}
      />
      {/* Domaine */}
      <input
        placeholder="Domaine"
        className="border p-2 rounded"
        value={filters.domaine || ''}
        onChange={e => setFilters({ ...filters, domaine: e.target.value })}
      />
      {/* Niveau */}
      <select
        value={filters.niveau || ''}
        onChange={e => setFilters({ ...filters, niveau: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">Tous niveaux</option>
        {NIVEAUX.filter(n => n).map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      {/* Statut actif/inactif */}
      <select
        value={filters.active || ''}
        onChange={e => setFilters({ ...filters, active: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">Tous statuts</option>
        <option value="true">Actif</option>
        <option value="false">Inactif</option>
      </select>
      {/* Expire */}
      <select
        value={filters.expire || ''}
        onChange={e => setFilters({ ...filters, expire: e.target.value })}
        className="border p-2 rounded"
      >
        <option value="">Tous (expire ou non)</option>
        <option value="true">Expiré</option>
        <option value="false">Non expiré</option>
      </select>
      {/* Tags multi-select */}
      <div className="flex flex-wrap gap-1 items-center">
        {TAG_SUGGESTIONS.slice(0, 8).map(tag => (
          <button
            key={tag}
            type="button"
            className={`px-2 py-1 rounded text-xs border ${Array.isArray(filters.tags) && filters.tags.includes(tag) ? 'bg-primary text-white border-primary' : 'bg-gray-100 border-gray-300'}`}
            onClick={() => handleTagToggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {/* Date validité (après) */}
      <input
        type="date"
        placeholder="Validité après..."
        className="border p-2 rounded"
        value={filters.dateValidite || ''}
        onChange={e => setFilters({ ...filters, dateValidite: e.target.value })}
      />
    </div>
  );
}

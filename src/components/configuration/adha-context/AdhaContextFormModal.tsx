import { useState } from 'react';
import type { AdhaContextSource, ZoneCible, ZoneCibleType } from '../../../types/adhaContext';
import { TAG_SUGGESTIONS } from '../../../types/adhaContext';

interface Props {
  source: AdhaContextSource | null;
  onClose: () => void;
  onSubmit: (data: Partial<AdhaContextSource>, file?: File | null) => void;
}

const ZONE_TYPES: { label: string; value: ZoneCibleType }[] = [
  { label: 'Ville', value: 'ville' },
  { label: 'Pays', value: 'pays' },
  { label: 'Province', value: 'province' },
];
const RDC_SUGGESTIONS: ZoneCible[] = [
  { type: 'pays', value: 'RDC' },
  { type: 'ville', value: 'Kinshasa' },
  { type: 'province', value: 'Kinshasa' },
  { type: 'province', value: 'Haut-Katanga' },
  { type: 'province', value: 'Kasaï' },
];

export function AdhaContextFormModal({ source, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<Partial<AdhaContextSource>>({
    ...source,
    zoneCible: source?.zoneCible || [RDC_SUGGESTIONS[0]],
    tags: source?.tags || [],
    canExpire: source?.canExpire ?? false,
    active: source?.active ?? true,
  });
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [tagInput, setTagInput] = useState('');

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
  };
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setFile(e.target.files[0]);
  };

  // Zone cible
  const handleAddZone = () => {
    setForm(f => ({ ...f, zoneCible: [...(f.zoneCible || []), { type: 'pays' as ZoneCibleType, value: '' }] }));
  };
  const handleZoneChange = (idx: number, key: keyof ZoneCible, value: string) => {
    setForm(f => ({
      ...f,
      zoneCible: (f.zoneCible || []).map((z, i) => i === idx ? { ...z, [key]: key === 'type' ? value as ZoneCibleType : value } : z),
    }));
  };
  const handleRemoveZone = (idx: number) => {
    setForm(f => ({ ...f, zoneCible: (f.zoneCible || []).filter((_, i) => i !== idx) }));
  };

  // Tags
  const handleAddTag = (tag: string) => {
    if (!tag.trim() || (form.tags || []).includes(tag)) return;
    setForm(f => ({ ...f, tags: [...(f.tags || []), tag] }));
    setTagInput('');
  };
  const handleRemoveTag = (tag: string) => {
    setForm(f => ({ ...f, tags: (f.tags || []).filter(t => t !== tag) }));
  };

  // Dates périodiques
  const handleExpireSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, canExpire: e.target.checked }));
  };

  // Activer/désactiver
  const handleActiveSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, active: e.target.checked }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form, file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded shadow-lg p-4 sm:p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto space-y-4"
      >
        <h2 className="text-xl font-bold mb-2">{source ? 'Modifier' : 'Ajouter'} une source</h2>
        {/* Drag & drop */}
        <div
          className={`border-2 border-dashed rounded p-4 text-center cursor-pointer ${dragActive ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
          onDrop={handleDrop}
          onDragOver={handleDrag}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
        >
          {file ? (
            <div className="flex flex-col items-center">
              <span className="font-medium">{file.name}</span>
              <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} Ko</span>
              <button type="button" className="text-red-500 mt-1" onClick={() => setFile(null)}>Retirer</button>
            </div>
          ) : (
            <>
              <span className="text-gray-500">Glissez-déposez un fichier ici ou </span>
              <label className="text-primary underline cursor-pointer">
                choisissez un fichier
                <input type="file" accept=".pdf,.xlsx,.csv,.txt,.doc,.docx" onChange={handleFile} className="hidden" />
              </label>
            </>
          )}
        </div>
        {/* Titre, description, domaine */}
        <input name="titre" value={form.titre || ''} onChange={handleChange} placeholder="Titre" className="w-full border p-2 rounded" required />
        <textarea name="description" value={form.description || ''} onChange={handleChange} placeholder="Description" className="w-full border p-2 rounded" />
        <input name="domaine" value={form.domaine || ''} onChange={handleChange} placeholder="Domaine métier" className="w-full border p-2 rounded" />
        {/* Zones cibles */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Zones cibles</span>
            <button type="button" className="text-primary text-sm" onClick={handleAddZone}>+ Ajouter une zone</button>
          </div>
          {(form.zoneCible || []).map((z, idx) => (
            <div key={idx} className="flex gap-2 mb-1">
              <select value={z.type} onChange={e => handleZoneChange(idx, 'type', e.target.value)} className="border p-2 rounded">
                {ZONE_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <input value={z.value} onChange={e => handleZoneChange(idx, 'value', e.target.value)} placeholder="Nom (ex: Kinshasa, RDC)" className="border p-2 rounded flex-1" />
              <button type="button" className="text-red-500" onClick={() => handleRemoveZone(idx)}>Supprimer</button>
            </div>
          ))}
          {/* Suggestions rapides RDC */}
          <div className="flex flex-wrap gap-2 mt-1">
            {RDC_SUGGESTIONS.map((z, i) => (
              <button type="button" key={i} className="bg-gray-100 px-2 py-1 rounded text-xs" onClick={() => setForm(f => ({ ...f, zoneCible: [...(f.zoneCible || []), { type: z.type as ZoneCibleType, value: z.value }] }))}>{z.type}: {z.value}</button>
            ))}
          </div>
        </div>
        {/* Niveau */}
        <input name="niveau" value={form.niveau || ''} onChange={handleChange} placeholder="Niveau (optionnel)" className="w-full border p-2 rounded" />
        {/* Type */}
        <select name="type" value={form.type || ''} onChange={handleChange} className="w-full border p-2 rounded" required>
          <option value="">Type</option>
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
        {/* Périodicité */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="canExpire" checked={!!form.canExpire} onChange={handleExpireSwitch} />
          <label htmlFor="canExpire">Ce document expire</label>
        </div>
        {form.canExpire && (
          <div className="flex gap-2">
            <input name="dateDebut" type="date" value={form.dateDebut || ''} onChange={handleChange} className="border p-2 rounded flex-1" placeholder="Date début" />
            <input name="dateFin" type="date" value={form.dateFin || ''} onChange={handleChange} className="border p-2 rounded flex-1" placeholder="Date fin" />
          </div>
        )}
        {/* Tags avec suggestions */}
        <div>
          <div className="flex flex-wrap gap-2 mb-1">
            {(form.tags || []).map(tag => (
              <span key={tag} className="bg-primary text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                {tag}
                <button type="button" className="ml-1" onClick={() => handleRemoveTag(tag)}>×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => (e.key === 'Enter' || e.key === ',') && (handleAddTag(tagInput), e.preventDefault())}
              placeholder="Ajouter un tag"
              className="border p-2 rounded flex-1"
            />
            <button type="button" onClick={() => handleAddTag(tagInput)} className="bg-primary text-white px-2 py-1 rounded">Ajouter</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {TAG_SUGGESTIONS.filter(s => !(form.tags || []).includes(s)).slice(0, 10).map(s => (
              <button type="button" key={s} className="bg-gray-100 px-2 py-1 rounded text-xs" onClick={() => handleAddTag(s)}>{s}</button>
            ))}
          </div>
        </div>
        {/* Activer comme contexte IA */}
        <div className="flex items-center gap-2">
          <input type="checkbox" id="active" checked={!!form.active} onChange={handleActiveSwitch} />
          <label htmlFor="active">Activer comme contexte IA</label>
        </div>
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Annuler</button>
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded">Enregistrer</button>
        </div>
      </form>
    </div>
  );
}

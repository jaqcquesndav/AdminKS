import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Modal } from '../common/Modal';
import type { Location } from '../../types/company';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationPickerProps {
  onSelect: (location: Location) => void;
  onClose: () => void;
}

function MapEvents({ onLocationChange }: { onLocationChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function LocationPicker({ onSelect, onClose }: LocationPickerProps) {
  const { t } = useTranslation();
  const [location, setLocation] = useState<Location>({
    address: '',
    coordinates: { lat: -1.6734, lng: 29.2386 }, // Coordonnées par défaut de Goma
    type: 'headquarters'
  });

  const handleLocationChange = async (lat: number, lng: number) => {
    try {
      // Utiliser l'API de géocodage inverse de OpenStreetMap
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      
      setLocation(prev => ({
        ...prev,
        address: data.display_name,
        coordinates: { lat, lng }
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'adresse:', error);
      setLocation(prev => ({
        ...prev,
        coordinates: { lat, lng }
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelect(location);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Sélectionner une localisation"
    >
      <div className="p-6 space-y-6">
        {/* Carte interactive */}
        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer
            center={[location.coordinates.lat, location.coordinates.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[location.coordinates.lat, location.coordinates.lng]} />
            <MapEvents onLocationChange={handleLocationChange} />
          </MapContainer>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <input
              type="text"
              value={location.address}
              onChange={(e) => setLocation(prev => ({ ...prev, address: e.target.value }))}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Latitude</label>
              <input
                type="number"
                step="any"
                value={location.coordinates.lat}
                onChange={(e) => setLocation(prev => ({
                  ...prev,
                  coordinates: { ...prev.coordinates, lat: parseFloat(e.target.value) }
                }))}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Longitude</label>
              <input
                type="number"
                step="any"
                value={location.coordinates.lng}
                onChange={(e) => setLocation(prev => ({
                  ...prev,
                  coordinates: { ...prev.coordinates, lng: parseFloat(e.target.value) }
                }))}
                className="input"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
            >
              Confirmer
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
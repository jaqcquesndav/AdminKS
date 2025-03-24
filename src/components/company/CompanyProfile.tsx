import React from 'react';
import { useTranslation } from 'react-i18next';
import { Building2, Mail, Phone, MapPin, FileText } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { Company } from '../../types/company';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pour les icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CompanyProfileProps {
  company: Company;
  onEdit: () => void;
}

// Coordonnées par défaut (Goma)
const DEFAULT_COORDINATES = {
  lat: -1.6734,
  lng: 29.2386
};

export function CompanyProfile({ company, onEdit }: CompanyProfileProps) {
  const { t } = useTranslation();

  const locationTypes = {
    headquarters: 'Siège social',
    site: 'Site d\'exploitation',
    store: 'Point de vente'
  };

  // Utiliser les coordonnées de l'entreprise ou les coordonnées par défaut
  const coordinates = company.address?.coordinates || DEFAULT_COORDINATES;

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* En-tête avec logo */}
      <div className="p-6 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={company.name} 
              className="w-16 h-16 rounded-lg object-cover"
            />
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-8 h-8 text-gray-400" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold">{company.name}</h2>
            <p className="text-sm text-gray-500">
              {company.businessSector || 'Secteur non spécifié'}
            </p>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary-dark"
        >
          Modifier
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Informations légales */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Informations légales</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">RCCM</p>
              <p className="font-medium">{company.rccmNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID. NAT</p>
              <p className="font-medium">{company.nationalId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">NIF</p>
              <p className="font-medium">{company.taxNumber}</p>
            </div>
            {company.cnssNumber && (
              <div>
                <p className="text-sm text-gray-500">CNSS</p>
                <p className="font-medium">{company.cnssNumber}</p>
              </div>
            )}
          </div>

          {/* Documents */}
          {company.documents && Object.keys(company.documents).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Documents</h4>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(company.documents).map(([type, url]) => url && (
                  <a
                    key={type}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                  >
                    <FileText className="w-5 h-5 text-gray-400 mr-2" />
                    <span className="text-sm">{type}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contact et adresse */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Contact</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-gray-400" />
              <span>{company.contactEmail}</span>
            </div>
            {company.contactPhone.map((phone, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>{phone}</span>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Adresse du siège</h4>
            <div className="flex items-start space-x-2">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p>{company.address.street}</p>
                <p>{company.address.quartier}, {company.address.commune}</p>
                <p>{company.address.city}, {company.address.province}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carte des localisations */}
      <div className="p-6 border-t">
        <h3 className="text-lg font-medium mb-4">Localisations</h3>
        <div className="h-96 rounded-lg overflow-hidden">
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* Siège social */}
            <Marker position={[coordinates.lat, coordinates.lng]}>
              <Popup>
                <strong>Siège social</strong>
                <p>{company.address.street}</p>
                <p>{company.address.city}, {company.address.province}</p>
              </Popup>
            </Marker>

            {/* Autres localisations */}
            {company.locations?.map((location, index) => (
              <Marker key={index} position={[location.coordinates.lat, location.coordinates.lng]}>
                <Popup>
                  <strong>{locationTypes[location.type]}</strong>
                  <p>{location.address}</p>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
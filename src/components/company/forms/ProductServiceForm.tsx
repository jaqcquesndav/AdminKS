import React from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2 } from 'lucide-react';
import type { Product, Service } from '../../../types/company';

interface ProductServiceFormProps {
  products: Product[];
  services: Service[];
  onProductsChange: (products: Product[]) => void;
  onServicesChange: (services: Service[]) => void;
}

export function ProductServiceForm({
  products,
  services,
  onProductsChange,
  onServicesChange
}: ProductServiceFormProps) {
  const { t } = useTranslation();

  const addProduct = () => {
    onProductsChange([
      ...products,
      { id: crypto.randomUUID(), name: '', description: '', category: '' }
    ]);
  };

  const addService = () => {
    onServicesChange([
      ...services,
      { id: crypto.randomUUID(), name: '', description: '', category: '' }
    ]);
  };

  const updateProduct = (id: string, field: keyof Product, value: string) => {
    onProductsChange(
      products.map(p => p.id === id ? { ...p, [field]: value } : p)
    );
  };

  const updateService = (id: string, field: keyof Service, value: string) => {
    onServicesChange(
      services.map(s => s.id === id ? { ...s, [field]: value } : s)
    );
  };

  const removeProduct = (id: string) => {
    onProductsChange(products.filter(p => p.id !== id));
  };

  const removeService = (id: string) => {
    onServicesChange(services.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Products Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('company.profile.products.title')}</h3>
          <button
            type="button"
            onClick={addProduct}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('company.profile.products.add')}
          </button>
        </div>

        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                  placeholder={t('company.profile.products.namePlaceholder')}
                  className="input"
                />
                <input
                  type="text"
                  value={product.category}
                  onChange={(e) => updateProduct(product.id, 'category', e.target.value)}
                  placeholder={t('company.profile.products.categoryPlaceholder')}
                  className="input"
                />
                <input
                  type="text"
                  value={product.description}
                  onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                  placeholder={t('company.profile.products.descriptionPlaceholder')}
                  className="input"
                />
              </div>
              <button
                type="button"
                onClick={() => removeProduct(product.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">{t('company.profile.services.title')}</h3>
          <button
            type="button"
            onClick={addService}
            className="flex items-center text-sm text-indigo-600 hover:text-indigo-500"
          >
            <Plus className="w-4 h-4 mr-1" />
            {t('company.profile.services.add')}
          </button>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <div key={service.id} className="flex gap-4 items-start">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="text"
                  value={service.name}
                  onChange={(e) => updateService(service.id, 'name', e.target.value)}
                  placeholder={t('company.profile.services.namePlaceholder')}
                  className="input"
                />
                <input
                  type="text"
                  value={service.category}
                  onChange={(e) => updateService(service.id, 'category', e.target.value)}
                  placeholder={t('company.profile.services.categoryPlaceholder')}
                  className="input"
                />
                <input
                  type="text"
                  value={service.description}
                  onChange={(e) => updateService(service.id, 'description', e.target.value)}
                  placeholder={t('company.profile.services.descriptionPlaceholder')}
                  className="input"
                />
              </div>
              <button
                type="button"
                onClick={() => removeService(service.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
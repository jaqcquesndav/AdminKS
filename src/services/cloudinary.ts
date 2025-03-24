import { useToastStore } from '../components/common/ToastContainer';

const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
}

export const cloudinaryService = {
  async upload(file: File, folder: string = 'general'): Promise<CloudinaryResponse> {
    // Check if Cloudinary is properly configured
    if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || !import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
      console.warn('Cloudinary configuration missing. Using mock upload in development mode.');
      
      // In development, return a mock response
      if (import.meta.env.DEV) {
        return {
          secure_url: URL.createObjectURL(file),
          public_id: `mock-${Date.now()}`,
          format: file.type.split('/')[1] || 'unknown',
          resource_type: file.type.split('/')[0] || 'image'
        };
      }
      
      throw new Error('Configuration Cloudinary manquante');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);

    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Échec du téléversement vers Cloudinary');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erreur Cloudinary:', error);
      
      // In development, fallback to local URL
      if (import.meta.env.DEV) {
        console.warn('Fallback to local URL in development mode');
        return {
          secure_url: URL.createObjectURL(file),
          public_id: `mock-${Date.now()}`,
          format: file.type.split('/')[1] || 'unknown',
          resource_type: file.type.split('/')[0] || 'image'
        };
      }
      
      throw new Error('Échec du téléversement du fichier');
    }
  },

  getMediaUrl(publicId: string, options: { width?: number; height?: number; quality?: number } = {}) {
    if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) {
      // In development, return the publicId if it's a full URL (from mock upload)
      if (import.meta.env.DEV && publicId.startsWith('blob:')) {
        return publicId;
      }
      throw new Error('Configuration Cloudinary manquante');
    }

    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    
    const transformationString = transformations.length > 0 
      ? transformations.join(',') + '/'
      : '';

    return `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}${publicId}`;
  }
};
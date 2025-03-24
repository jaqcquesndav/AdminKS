import api from './client';
import { cloudinaryService } from '../cloudinary';
import type { Document } from '../../types/document';

export const documentsApi = {
  upload: async (file: File, type: Document['type']): Promise<Document> => {
    // Upload to Cloudinary first
    const cloudinaryResponse = await cloudinaryService.upload(file, 'documents');

    // Then send document metadata to our API
    const formData = new FormData();
    formData.append('type', type);
    formData.append('fileUrl', cloudinaryResponse.secure_url);
    formData.append('publicId', cloudinaryResponse.public_id);
    formData.append('mimeType', file.type);
    formData.append('fileSize', file.size.toString());

    const response = await api.post('/documents/upload', formData);
    return response.data;
  },

  getAll: async (): Promise<Document[]> => {
    const response = await api.get('/documents');
    return response.data;
  },

  getById: async (id: string): Promise<Document> => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  verify: async (id: string): Promise<Document> => {
    const response = await api.post(`/documents/${id}/verify`);
    return response.data;
  },

  reject: async (id: string, reason: string): Promise<Document> => {
    const response = await api.post(`/documents/${id}/reject`, { reason });
    return response.data;
  }
};
import apiClient from './client';
import { cloudinaryService } from '../cloudinary';
import type { Document, DocumentUpload } from '../../types/document';

interface DocumentListResponse {
  documents: Document[];
  totalCount: number;
}

export const documentsApi = {
  // Obtenir tous les documents
  getAll: async (params?: { 
    companyId?: string; 
    type?: Document['type']; 
    status?: Document['status'] 
  }): Promise<DocumentListResponse> => {
    const response = await apiClient.get('/documents', { params });
    return response.data;
  },

  // Obtenir un document par son ID
  getById: async (id: string): Promise<Document> => {
    const response = await apiClient.get(`/documents/${id}`);
    return response.data;
  },

  // Télécharger un document
  downloadDocument: async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`/documents/${id}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Téléverser un document
  uploadDocument: async (documentData: DocumentUpload): Promise<Document> => {
    try {
      // Upload to Cloudinary first
      const cloudinaryResponse = await cloudinaryService.upload(
        documentData.file, 
        `documents/${documentData.type.toLowerCase()}`
      );
      
      // Send only the metadata and Cloudinary URL to the backend
      const documentMetadata = {
        type: documentData.type,
        companyId: documentData.companyId,
        fileUrl: cloudinaryResponse.secure_url,
        publicId: cloudinaryResponse.public_id,
        fileName: documentData.file.name,
        fileType: documentData.file.type,
        fileSize: documentData.file.size
      };

      const response = await apiClient.post('/documents/upload', documentMetadata);
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Supprimer un document
  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // Mettre à jour le statut d'un document
  updateDocumentStatus: async (id: string, status: Document['status']): Promise<Document> => {
    const response = await apiClient.put(`/documents/${id}/status`, { status });
    return response.data;
  },

  // Obtenir les documents d'une entreprise
  getCompanyDocuments: async (companyId: string): Promise<DocumentListResponse> => {
    const response = await apiClient.get(`/companies/${companyId}/documents`);
    return response.data;
  },

  // Téléverser plusieurs documents
  uploadMultipleDocuments: async (documents: DocumentUpload[]): Promise<Document[]> => {
    try {
      const uploadPromises = documents.map(async (doc) => {
        // Upload each file to Cloudinary
        const cloudinaryResponse = await cloudinaryService.upload(
          doc.file,
          `documents/${doc.type.toLowerCase()}`
        );
        
        // Return the metadata for each file
        return {
          type: doc.type,
          companyId: doc.companyId,
          fileUrl: cloudinaryResponse.secure_url,
          publicId: cloudinaryResponse.public_id,
          fileName: doc.file.name,
          fileType: doc.file.type,
          fileSize: doc.file.size
        };
      });
      
      // Wait for all Cloudinary uploads to complete
      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Send the metadata to the backend
      const response = await apiClient.post('/documents/upload-multiple', { documents: uploadedFiles });
      return response.data;
    } catch (error) {
      console.error('Error uploading multiple documents:', error);
      throw error;
    }
  }
};

export default documentsApi;
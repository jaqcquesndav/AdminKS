import { API_ENDPOINTS, replaceUrlParams } from './config';
import apiClient from './client';
import { Document, DocumentUploadResponse } from '../../types/document';

export const documentsApi = {
  /**
   * Get all documents for a company
   * @param companyId - The company ID
   */
  getDocuments: async (companyId: string): Promise<Document[]> => {
    const url = replaceUrlParams(API_ENDPOINTS.DOCUMENTS, { companyId });
    const response = await apiClient.get<Document[]>(url);
    return response.data;
  },

  /**
   * Get document by ID
   * @param documentId - The document ID
   */
  getDocumentById: async (documentId: string): Promise<Document> => {
    const url = replaceUrlParams(API_ENDPOINTS.DOCUMENT_DETAIL, { documentId });
    const response = await apiClient.get<Document>(url);
    return response.data;
  },

  /**
   * Upload a new document
   * @param companyId - The company ID
   * @param formData - Form data containing the document file and metadata
   */
  uploadDocument: async (companyId: string, formData: FormData): Promise<DocumentUploadResponse> => {
    const url = replaceUrlParams(API_ENDPOINTS.UPLOAD_DOCUMENT, { companyId });
    const response = await apiClient.post<DocumentUploadResponse>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Update document status
   * @param documentId - The document ID
   * @param status - The new status
   */
  updateDocumentStatus: async (documentId: string, status: string): Promise<Document> => {
    const url = replaceUrlParams(API_ENDPOINTS.DOCUMENT_STATUS, { documentId });
    const response = await apiClient.patch<Document>(url, { status });
    return response.data;
  },

  /**
   * Delete a document
   * @param documentId - The document ID
   */
  deleteDocument: async (documentId: string): Promise<void> => {
    const url = replaceUrlParams(API_ENDPOINTS.DOCUMENT_DETAIL, { documentId });
    await apiClient.delete(url);
  }
};
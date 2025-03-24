export interface Document {
  id: string;
  type: 'rccm' | 'nationalId' | 'taxNumber';
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: Date;
  status: 'pending' | 'verified' | 'rejected';
  companyId: string;
}

export interface DocumentUpload {
  file: File;
  type: Document['type'];
  companyId: string;
}
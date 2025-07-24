export interface Lease {
  id: number;
  originalFileName: string;
  uploadedAt: string;
  filePath?: string;
  userId?: number;
  parsedText?: string;
}

export interface LeaseStoreState {
  quickLookLeaseId: number | null;
  quickLookLoading: boolean;
  quickLookError: string | null;
  uploading: boolean;
}

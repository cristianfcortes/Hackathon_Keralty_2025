export type RecordStatus = 'pending' | 'completed' | 'cancelled';

export interface Record {
  id: string;
  title: string;
  description?: string;
  status: RecordStatus;
  createdAt: number;
  updatedAt: number;
  dueDate?: number;
  category?: string;
  relatedLandmarkId?: string;
}

export interface RecordsStorage {
  version: number;
  records: Record[];
  lastUpdated: number;
}


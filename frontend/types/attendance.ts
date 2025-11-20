export interface AttendanceConfirmation {
  landmarkId: string;
  confirmedAt: number;
  sessionId: string;
}

export interface AttendanceStorage {
  version: number;
  confirmations: AttendanceConfirmation[];
  lastUpdated: number;
}


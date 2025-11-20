# Client-Side Storage API Contract

**Type**: TypeScript Interfaces  
**Purpose**: Define contracts for client-side storage operations (localStorage)

## Overview

This document defines the TypeScript interfaces and function signatures for client-side storage operations. All storage uses browser localStorage API.

## Storage Utilities

### Records Storage

**Location**: `frontend/lib/storage/records.ts`

**Interface**:
```typescript
interface RecordsStorageAPI {
  // Get all records
  getAllRecords(): Promise<Record[]>;
  
  // Get a single record by ID
  getRecord(id: string): Promise<Record | null>;
  
  // Create a new record
  createRecord(record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>): Promise<Record>;
  
  // Update an existing record
  updateRecord(id: string, updates: Partial<Omit<Record, 'id' | 'createdAt'>>): Promise<Record>;
  
  // Delete a record
  deleteRecord(id: string): Promise<void>;
  
  // Get records by status
  getRecordsByStatus(status: Record['status']): Promise<Record[]>;
  
  // Get records related to a landmark
  getRecordsByLandmark(landmarkId: string): Promise<Record[]>;
}
```

**Error Handling**:
- `StorageError`: Thrown when localStorage is unavailable (private browsing mode)
- `RecordNotFoundError`: Thrown when record ID doesn't exist
- `ValidationError`: Thrown when record data is invalid

---

### Attendance Storage

**Location**: `frontend/lib/storage/attendance.ts`

**Interface**:
```typescript
interface AttendanceStorageAPI {
  // Get all confirmations
  getAllConfirmations(): Promise<AttendanceConfirmation[]>;
  
  // Get confirmations for a specific landmark
  getConfirmationsByLandmark(landmarkId: string): Promise<AttendanceConfirmation[]>;
  
  // Check if user has confirmed attendance at a landmark
  hasConfirmed(landmarkId: string): Promise<boolean>;
  
  // Confirm attendance at a landmark
  confirmAttendance(landmarkId: string): Promise<AttendanceConfirmation>;
  
  // Remove confirmation (optional - for undo functionality)
  removeConfirmation(landmarkId: string): Promise<void>;
  
  // Get confirmation count for a landmark
  getConfirmationCount(landmarkId: string): Promise<number>;
}
```

**Error Handling**:
- `StorageError`: Thrown when localStorage is unavailable
- `InvalidLandmarkError`: Thrown when landmark ID doesn't exist

---

## Storage Schema

### Records Storage Schema

**Key**: `user_records`  
**Format**: JSON string

```typescript
interface RecordsStorageData {
  version: number;              // Schema version (for migrations)
  records: Record[];
  lastUpdated: number;          // Timestamp of last modification
}
```

### Attendance Storage Schema

**Key**: `attendance_confirmations`  
**Format**: JSON string

```typescript
interface AttendanceStorageData {
  version: number;              // Schema version (for migrations)
  confirmations: AttendanceConfirmation[];
  lastUpdated: number;          // Timestamp of last modification
}
```

## Validation Rules

### Record Validation

```typescript
function validateRecord(record: Partial<Record>): ValidationResult {
  // Required fields
  if (!record.title || record.title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }
  
  if (record.title.length > 200) {
    return { valid: false, error: 'Title must be 200 characters or less' };
  }
  
  // Status validation
  if (record.status && !['pending', 'completed', 'cancelled'].includes(record.status)) {
    return { valid: false, error: 'Invalid status' };
  }
  
  // Timestamp validation
  if (record.createdAt && (isNaN(record.createdAt) || record.createdAt < 0)) {
    return { valid: false, error: 'Invalid createdAt timestamp' };
  }
  
  return { valid: true };
}
```

### Attendance Validation

```typescript
function validateAttendance(confirmation: Partial<AttendanceConfirmation>): ValidationResult {
  if (!confirmation.landmarkId || confirmation.landmarkId.trim().length === 0) {
    return { valid: false, error: 'Landmark ID is required' };
  }
  
  if (!confirmation.confirmedAt || isNaN(confirmation.confirmedAt)) {
    return { valid: false, error: 'Invalid timestamp' };
  }
  
  return { valid: true };
}
```

## Error Types

```typescript
class StorageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StorageError';
  }
}

class RecordNotFoundError extends Error {
  constructor(id: string) {
    super(`Record with ID ${id} not found`);
    this.name = 'RecordNotFoundError';
  }
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

class InvalidLandmarkError extends Error {
  constructor(landmarkId: string) {
    super(`Landmark with ID ${landmarkId} not found`);
    this.name = 'InvalidLandmarkError';
  }
}
```

## Migration Strategy

### Version Management

```typescript
interface StorageVersion {
  version: number;
  migrate: (oldData: any) => any;
}

const migrations: StorageVersion[] = [
  {
    version: 1,
    migrate: (data) => data  // Initial version, no migration needed
  },
  // Future migrations added here
];
```

### Migration Process

1. Read data from localStorage
2. Check version number
3. If version < current, run migrations sequentially
4. Save migrated data with new version
5. Return migrated data

## Implementation Requirements

1. **Error Handling**: All functions must handle localStorage unavailability gracefully
2. **Type Safety**: Use TypeScript interfaces for all data structures
3. **Validation**: Validate all data before storing
4. **Migration**: Support schema versioning and migration
5. **Performance**: Batch operations when possible
6. **Testing**: Unit tests for all storage functions

## Usage Examples

### Records API Usage

```typescript
import { recordsStorage } from '@/lib/storage/records';

// Create a record
const newRecord = await recordsStorage.createRecord({
  title: 'Visit Central Park',
  description: 'Check out the new accessibility features',
  status: 'pending',
  relatedLandmarkId: 'landmark-001'
});

// Get all records
const allRecords = await recordsStorage.getAllRecords();

// Update record
const updated = await recordsStorage.updateRecord(newRecord.id, {
  status: 'completed'
});

// Delete record
await recordsStorage.deleteRecord(newRecord.id);
```

### Attendance API Usage

```typescript
import { attendanceStorage } from '@/lib/storage/attendance';

// Confirm attendance
const confirmation = await attendanceStorage.confirmAttendance('landmark-001');

// Check if confirmed
const hasConfirmed = await attendanceStorage.hasConfirmed('landmark-001');

// Get all confirmations
const allConfirmations = await attendanceStorage.getAllConfirmations();
```


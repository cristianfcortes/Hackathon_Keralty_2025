# Data Model: Accessible Landmark Platform Website

**Feature**: 001-accessible-landmark-platform  
**Date**: 2025-01-27  
**Purpose**: Define data structures and entity relationships

## Overview

This static website uses two data storage approaches:
1. **Embedded static data**: Landmarks and medical professionals (JSON files, loaded at build time)
2. **Client-side storage**: User-specific data (records, attendance confirmations) stored in localStorage

## Entities

### 1. Landmark (Embedded Static Data)

**Source**: `frontend/data/landmarks.json` (embedded at build time)  
**Storage**: Static JSON file, imported in components  
**Purpose**: Reference points displayed on the interactive map

**Structure**:
```typescript
interface Landmark {
  id: string;                    // Unique identifier (e.g., "landmark-001")
  name: string;                   // Display name (e.g., "Central Park")
  description: string;            // Detailed description of the location
  coordinates: {
    lat: number;                  // Latitude (-90 to 90)
    lng: number;                  // Longitude (-180 to 180)
  };
  address?: string;               // Optional human-readable address
  category?: string;              // Optional category (e.g., "park", "hospital", "landmark")
  imageUrl?: string;             // Optional image URL
  accessibilityInfo?: {          // Optional accessibility details
    wheelchairAccessible: boolean;
    hearingAssistance: boolean;
    visualAssistance: boolean;
    notes?: string;               // Additional accessibility notes
  };
}
```

**Validation Rules**:
- `id` must be unique across all landmarks
- `name` is required and non-empty
- `coordinates.lat` must be between -90 and 90
- `coordinates.lng` must be between -180 and 180
- `description` is required and non-empty

**Example**:
```json
{
  "id": "landmark-001",
  "name": "Central Medical Center",
  "description": "A modern medical facility with full accessibility features",
  "coordinates": {
    "lat": 40.7589,
    "lng": -73.9851
  },
  "address": "123 Main Street, New York, NY 10001",
  "category": "medical",
  "accessibilityInfo": {
    "wheelchairAccessible": true,
    "hearingAssistance": true,
    "visualAssistance": true,
    "notes": "Sign language interpreters available upon request"
  }
}
```

---

### 2. Attendance Confirmation (Client-Side Storage)

**Source**: User interaction (button click in landmark modal)  
**Storage**: localStorage (key: `attendance_confirmations`)  
**Purpose**: Track user's attendance confirmations at landmarks

**Structure**:
```typescript
interface AttendanceConfirmation {
  landmarkId: string;            // Reference to landmark.id
  confirmedAt: number;          // Timestamp (milliseconds since epoch)
  sessionId: string;            // Browser session identifier (for tracking)
}

// Storage format (localStorage)
interface AttendanceStorage {
  confirmations: AttendanceConfirmation[];
  lastUpdated: number;           // Last modification timestamp
}
```

**Validation Rules**:
- `landmarkId` must reference an existing landmark
- `confirmedAt` must be a valid timestamp
- `sessionId` is generated per browser session

**State Transitions**:
- **Initial**: No confirmation exists
- **Confirmed**: User clicks attendance button → confirmation created
- **Re-confirmed**: User clicks again → update existing confirmation timestamp (or create new if different session)

**Storage Key**: `attendance_confirmations`  
**Format**: JSON string of `AttendanceStorage` object

---

### 3. Record (Client-Side Storage)

**Source**: User-created to-do list items  
**Storage**: localStorage (key: `user_records`)  
**Purpose**: Personal task/appointment management

**Structure**:
```typescript
interface Record {
  id: string;                    // Unique identifier (UUID or timestamp-based)
  title: string;                 // Record title/name
  description?: string;           // Optional detailed description
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: number;             // Creation timestamp
  updatedAt: number;             // Last update timestamp
  dueDate?: number;              // Optional due date timestamp
  category?: string;             // Optional category
  relatedLandmarkId?: string;    // Optional link to landmark
}

// Storage format (localStorage)
interface RecordsStorage {
  records: Record[];
  lastUpdated: number;
}
```

**Validation Rules**:
- `id` must be unique within user's records
- `title` is required and non-empty (max 200 characters)
- `status` must be one of: 'pending', 'completed', 'cancelled'
- `createdAt` and `updatedAt` must be valid timestamps
- `relatedLandmarkId` must reference existing landmark if provided

**State Transitions**:
- **Created**: User adds new record → status: 'pending'
- **Updated**: User modifies record → update `updatedAt` timestamp
- **Completed**: User marks as done → status: 'completed'
- **Cancelled**: User cancels → status: 'cancelled'
- **Deleted**: User removes record → remove from storage

**Storage Key**: `user_records`  
**Format**: JSON string of `RecordsStorage` object

---

### 4. Medical Professional (Embedded Static Data)

**Source**: `frontend/data/professionals.json` (embedded at build time)  
**Storage**: Static JSON file, imported in components  
**Purpose**: Directory of medical industry professionals

**Structure**:
```typescript
interface MedicalProfessional {
  id: string;                    // Unique identifier
  name: string;                   // Full name
  title: string;                  // Professional title (e.g., "Dr.", "RN")
  specialty: string;             // Medical specialty (e.g., "Cardiology", "General Practice")
  organization?: string;         // Optional organization/hospital name
  contact: {
    email?: string;              // Optional email
    phone?: string;              // Optional phone number
    address?: string;            // Optional physical address
    website?: string;           // Optional website URL
  };
  languages?: string[];          // Optional languages spoken
  accessibilityServices?: {     // Optional accessibility services
    signLanguage: boolean;
    wheelchairAccessible: boolean;
    hearingAssistance: boolean;
  };
  bio?: string;                 // Optional professional biography
}
```

**Validation Rules**:
- `id` must be unique across all professionals
- `name` is required and non-empty
- `title` is required
- `specialty` is required
- At least one contact method should be provided

**Example**:
```json
{
  "id": "prof-001",
  "name": "Jane Smith",
  "title": "Dr.",
  "specialty": "Cardiology",
  "organization": "Central Medical Center",
  "contact": {
    "email": "jane.smith@medicalcenter.com",
    "phone": "+1-555-0123",
    "address": "123 Main Street, New York, NY 10001"
  },
  "languages": ["English", "Spanish", "ASL"],
  "accessibilityServices": {
    "signLanguage": true,
    "wheelchairAccessible": true,
    "hearingAssistance": true
  }
}
```

---

### 5. Chat Message (In-Memory / Client-Side)

**Source**: User input and AI API responses  
**Storage**: Component state (React state) or sessionStorage (optional persistence)  
**Purpose**: Chat conversation history

**Structure**:
```typescript
interface ChatMessage {
  id: string;                    // Unique message identifier
  role: 'user' | 'assistant';    // Message sender
  content: string;               // Message text
  timestamp: number;             // Message timestamp
  landmarkContext?: string[];    // Optional landmark IDs referenced
}

// Optional: Store in sessionStorage for page refresh persistence
interface ChatHistory {
  messages: ChatMessage[];
  sessionId: string;
}
```

**Validation Rules**:
- `id` must be unique within conversation
- `role` must be 'user' or 'assistant'
- `content` is required and non-empty
- `timestamp` must be valid

**Storage**: 
- Primary: React component state (cleared on page navigation)
- Optional: sessionStorage (key: `chat_history`) for persistence across page refreshes

---

## Data Relationships

```
Landmark (embedded)
  └── Referenced by: AttendanceConfirmation.landmarkId
  └── Referenced by: Record.relatedLandmarkId
  └── Referenced by: ChatMessage.landmarkContext

MedicalProfessional (embedded)
  └── No direct relationships (standalone directory)

AttendanceConfirmation (localStorage)
  └── References: Landmark.id

Record (localStorage)
  └── Optional reference: Landmark.id

ChatMessage (in-memory/sessionStorage)
  └── Optional reference: Landmark.id[]
```

## Data Flow

### Landmark Data Flow
1. **Build time**: `landmarks.json` → imported in map component
2. **Runtime**: Component reads embedded data → displays on map
3. **User interaction**: Click landmark → show modal with data

### Attendance Confirmation Flow
1. **User action**: Click "Confirm Attendance" button
2. **Create**: Generate `AttendanceConfirmation` object
3. **Store**: Save to localStorage under `attendance_confirmations`
4. **Read**: Load from localStorage on page load
5. **Display**: Show confirmation status in landmark modal

### Records Flow
1. **Create**: User adds new record → generate ID, set status 'pending'
2. **Store**: Save to localStorage under `user_records`
3. **Read**: Load from localStorage on records page load
4. **Update**: Modify record → update `updatedAt`, save to localStorage
5. **Delete**: Remove from array, save to localStorage

### Chat Flow
1. **User input**: User types message → create `ChatMessage` with role 'user'
2. **API call**: Send to AI service (external API)
3. **Response**: Receive AI response → create `ChatMessage` with role 'assistant'
4. **Store**: Add to conversation state (optional: sessionStorage)
5. **Display**: Render messages in chat interface

## Storage Utilities

### localStorage Keys
- `attendance_confirmations`: Attendance confirmation data
- `user_records`: User's to-do list records
- `chat_history`: (Optional) Chat conversation history

### Data Migration Strategy
- Version stored with data: `{ version: 1, data: {...} }`
- On load: Check version, migrate if needed
- Migration functions in `frontend/lib/storage/migrations.ts`

## Type Definitions Location

Type definitions will be created in:
- `frontend/types/landmark.ts`: Landmark interface
- `frontend/types/professional.ts`: MedicalProfessional interface
- `frontend/types/record.ts`: Record interface
- `frontend/types/chat.ts`: ChatMessage interface
- `frontend/types/attendance.ts`: AttendanceConfirmation interface

# Data Model: Route Calculation Feature

**Phase**: 1 - Design & Contracts  
**Date**: 2025-11-20  
**Status**: Complete

---

## Overview

This document defines all TypeScript interfaces, types, and data structures for the route calculation feature. All models are designed for client-side use within a statically-exported Next.js application.

---

## Core Types

### 1. RoutePoint

**Purpose**: Represents a geographic coordinate

```typescript
export interface RoutePoint {
  /** Latitude in decimal degrees */
  lat: number;
  
  /** Longitude in decimal degrees */
  lng: number;
}
```

**Validation Rules**:
- `lat`: Must be between -90 and 90
- `lng`: Must be between -180 and 180

**Usage**: Origin and destination points for route calculation

---

### 2. TransportMode

**Purpose**: Defines available transportation modes

```typescript
export type TransportMode = 'foot' | 'bike' | 'car';
```

**Values**:
- `'foot'`: Walking/pedestrian routing
- `'bike'`: Bicycle routing
- `'car'`: Automobile routing

**Default**: `'foot'`

---

### 3. RouteManeuver

**Purpose**: Describes a single navigation action

```typescript
export interface RouteManeuver {
  /** Type of maneuver (turn, continue, arrive, etc.) */
  type: string;
  
  /** Direction modifier (left, right, slight, sharp) */
  modifier?: string;
  
  /** Geographic location of the maneuver [lng, lat] */
  location: [number, number];
}
```

**Maneuver Types**:
- `'depart'`: Start of route
- `'turn'`: Turn at intersection
- `'continue'`: Continue straight
- `'merge'`: Merge onto road
- `'roundabout'`: Enter roundabout
- `'fork'`: Road splits
- `'arrive'`: End of route

**Modifiers** (when applicable):
- `'left'`: Turn left
- `'right'`: Turn right
- `'slight left'`: Slight left turn
- `'slight right'`: Slight right turn
- `'sharp left'`: Sharp left turn
- `'sharp right'`: Sharp right turn

---

### 4. RouteStep

**Purpose**: Represents a single step in route instructions

```typescript
export interface RouteStep {
  /** Distance of this step in meters */
  distance: number;
  
  /** Duration of this step in seconds */
  duration: number;
  
  /** Human-readable instruction in Spanish */
  instruction: string;
  
  /** Name of the road/street (empty if unnamed) */
  name: string;
  
  /** Navigation maneuver for this step */
  maneuver: RouteManeuver;
}
```

**Validation Rules**:
- `distance`: Must be >= 0
- `duration`: Must be >= 0
- `instruction`: Non-empty string
- `name`: Can be empty string for unnamed roads

**Example**:
```typescript
{
  distance: 245,
  duration: 59,
  instruction: "Gira a la izquierda",
  name: "Calle Principal",
  maneuver: {
    type: "turn",
    modifier: "left",
    location: [-75.5133, 5.0700]
  }
}
```

---

### 5. Route

**Purpose**: Complete route information from origin to destination

```typescript
export interface Route {
  /** Total distance in meters */
  distance: number;
  
  /** Total duration in seconds */
  duration: number;
  
  /** Route geometry as array of [lng, lat] coordinates */
  geometry: [number, number][];
  
  /** Turn-by-turn instructions */
  steps: RouteStep[];
  
  /** Human-readable summary (e.g., "5.2 km - 12 min") */
  summary: string;
}
```

**Validation Rules**:
- `distance`: Must be > 0
- `duration`: Must be > 0
- `geometry`: Must have at least 2 points
- `steps`: Must have at least 1 step
- `summary`: Non-empty string

**Coordinate Format Note**: 
- OSRM returns [lng, lat] format
- Leaflet expects [lat, lng] format
- Conversion required when rendering

**Example**:
```typescript
{
  distance: 5234,
  duration: 720,
  geometry: [
    [-75.5133, 5.0700],
    [-75.5140, 5.0710],
    // ... more coordinates
  ],
  steps: [
    { distance: 245, duration: 59, ... },
    { distance: 180, duration: 43, ... },
  ],
  summary: "5.2 km - 12 min"
}
```

---

### 6. RoutingResponse

**Purpose**: Complete API response from routing service

```typescript
export interface RoutingResponse {
  /** Array of calculated routes (primary + alternatives) */
  routes: Route[];
  
  /** Waypoints used for routing */
  waypoints: Waypoint[];
}
```

**Notes**:
- `routes[0]` is always the primary/fastest route
- `routes[1...]` are alternative routes (if requested)
- Most requests will return only 1 route

---

### 7. Waypoint

**Purpose**: Named point along a route

```typescript
export interface Waypoint {
  /** Geographic location [lng, lat] */
  location: [number, number];
  
  /** Human-readable name of the waypoint */
  name: string;
}
```

**Usage**: Start and end points of calculated routes

---

## State Management Types

### 8. RoutingState

**Purpose**: Hook state for route calculation

```typescript
export interface RoutingState {
  /** Currently displayed route (null if no route) */
  currentRoute: Route | null;
  
  /** Alternative routes (empty if none) */
  alternativeRoutes: Route[];
  
  /** Loading state during API call */
  loading: boolean;
  
  /** Error if route calculation failed */
  error: Error | null;
  
  /** Current transport mode */
  mode: TransportMode;
}
```

**State Transitions**:
```
Idle → Loading → Success (currentRoute set)
                → Error (error set)
Success → Idle (clearRoute called)
        → Loading (mode changed, recalculating)
```

---

### 9. CachedRoute

**Purpose**: Stored route in localStorage

```typescript
export interface CachedRoute {
  /** The calculated route */
  route: Route;
  
  /** Timestamp when cached (milliseconds since epoch) */
  timestamp: number;
  
  /** Origin coordinates as string "lat,lng" */
  origin: string;
  
  /** Destination coordinates as string "lat,lng" */
  destination: string;
  
  /** Transport mode used */
  mode: TransportMode;
}
```

**Storage Key Format**:
```typescript
`route:${origin.lat},${origin.lng}:${dest.lat},${dest.lng}:${mode}`
```

**Expiration**: 24 hours from `timestamp`

---

## Error Types

### 10. RoutingError

**Purpose**: Base error class for routing failures

```typescript
export class RoutingError extends Error {
  /** Unique error code */
  readonly code: string;
  
  /** Whether this error is retryable */
  readonly retryable: boolean;
  
  constructor(
    message: string,
    code: string,
    retryable: boolean = false
  ) {
    super(message);
    this.name = 'RoutingError';
    this.code = code;
    this.retryable = retryable;
  }
}
```

**Error Codes**:
- `NETWORK_ERROR`: Network connection failed
- `API_ERROR`: OSRM API returned error
- `NO_ROUTE`: No route found between points
- `INVALID_LOCATION`: Coordinates invalid or too far from roads
- `TIMEOUT`: Request took too long

---

### 11. Specific Error Classes

```typescript
export class NetworkError extends RoutingError {
  constructor() {
    super(
      'Sin conexión a internet. Verifica tu conexión.',
      'NETWORK_ERROR',
      true // retryable
    );
  }
}

export class NoRouteError extends RoutingError {
  constructor(message: string = 'No se encontró una ruta disponible') {
    super(message, 'NO_ROUTE', false);
  }
}

export class InvalidLocationError extends RoutingError {
  constructor() {
    super(
      'La ubicación está demasiado lejos de calles transitables',
      'INVALID_LOCATION',
      false
    );
  }
}

export class TimeoutError extends RoutingError {
  constructor() {
    super(
      'La solicitud tardó demasiado. Intenta de nuevo.',
      'TIMEOUT',
      true
    );
  }
}
```

---

## Component Props

### 12. RoutePanelProps

**Purpose**: Props for route information panel component

```typescript
export interface RoutePanelProps {
  /** Current calculated route (null if none) */
  route: Route | null;
  
  /** Loading state */
  loading: boolean;
  
  /** Error state */
  error: Error | null;
  
  /** Current transport mode */
  currentMode: TransportMode;
  
  /** Callback when mode changes */
  onModeChange: (mode: TransportMode) => void;
  
  /** Callback when panel closes */
  onClose: () => void;
  
  /** Callback to open in native maps app */
  onOpenInMaps: () => void;
}
```

---

## Helper Types

### 13. TransportModeInfo

**Purpose**: UI display information for transport modes

```typescript
export interface TransportModeInfo {
  mode: TransportMode;
  icon: string;
  label: string;
}

export const TRANSPORT_MODES: TransportModeInfo[] = [
  { mode: 'foot', icon: '🚶', label: 'A pie' },
  { mode: 'bike', icon: '🚴', label: 'Bicicleta' },
  { mode: 'car', icon: '🚗', label: 'Auto' },
];
```

---

### 14. Platform

**Purpose**: Detected device platform for map integration

```typescript
export type Platform = 'ios' | 'android' | 'web';
```

**Detection Logic**: Based on `navigator.userAgent`

---

## Utility Types

### 15. Coordinates

**Purpose**: Flexible coordinate representation

```typescript
// Leaflet format [lat, lng]
export type LeafletCoord = [number, number];

// OSRM/GeoJSON format [lng, lat]
export type GeoJSONCoord = [number, number];

// Conversion helpers
export function toLeaflet(coord: GeoJSONCoord): LeafletCoord {
  return [coord[1], coord[0]];
}

export function toGeoJSON(coord: LeafletCoord): GeoJSONCoord {
  return [coord[1], coord[0]];
}
```

---

## Data Flow

```
User Interaction
      ↓
RoutePoint (origin, destination)
      ↓
OSRM Service (calculateRoute)
      ↓
RoutingResponse
      ↓
Route (primary)
      ↓
RoutingState (currentRoute)
      ↓
RoutePanel Component
      ↓
User sees: Distance, Duration, Steps
```

---

## Validation Functions

### Distance Validation

```typescript
export function isValidDistance(meters: number): boolean {
  return meters >= 0 && meters <= 1000000; // Max 1000km
}
```

### Duration Validation

```typescript
export function isValidDuration(seconds: number): boolean {
  return seconds >= 0 && seconds <= 86400; // Max 24 hours
}
```

### Coordinate Validation

```typescript
export function isValidCoordinate(point: RoutePoint): boolean {
  return (
    point.lat >= -90 &&
    point.lat <= 90 &&
    point.lng >= -180 &&
    point.lng <= 180
  );
}
```

---

## Type Guards

```typescript
export function isRoute(obj: any): obj is Route {
  return (
    obj &&
    typeof obj.distance === 'number' &&
    typeof obj.duration === 'number' &&
    Array.isArray(obj.geometry) &&
    Array.isArray(obj.steps) &&
    typeof obj.summary === 'string'
  );
}

export function isRoutingError(error: unknown): error is RoutingError {
  return error instanceof RoutingError;
}
```

---

## File Organization

All types will be defined in:

```
frontend/
└── types/
    └── routing.ts    # All routing-related types
```

**Exports**:
```typescript
// Main types
export type { RoutePoint, Route, RouteStep, RoutingResponse };
export type { TransportMode, RouteManeuver, Waypoint };

// State types
export type { RoutingState, CachedRoute };

// Component types
export type { RoutePanelProps };

// Helper types
export type { Platform, TransportModeInfo };
export { TRANSPORT_MODES };

// Error classes
export { RoutingError, NetworkError, NoRouteError, InvalidLocationError, TimeoutError };

// Utilities
export { isValidDistance, isValidDuration, isValidCoordinate };
export { toLeaflet, toGeoJSON };
export { isRoute, isRoutingError };
```

---

## Dependencies

**Runtime**:
- None (pure TypeScript types)

**Development**:
- TypeScript 5.x (already present)

---

**Data Model Complete**: 2025-11-20  
**Status**: Ready for implementation


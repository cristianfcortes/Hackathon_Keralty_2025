// Types for route calculation feature

/**
 * Represents a geographic coordinate point
 */
export interface RoutePoint {
  /** Latitude in decimal degrees (-90 to 90) */
  lat: number;
  
  /** Longitude in decimal degrees (-180 to 180) */
  lng: number;
}

/**
 * Available transportation modes for routing
 */
export type TransportMode = 'foot' | 'bike' | 'car';

/**
 * Describes a navigation maneuver
 */
export interface RouteManeuver {
  /** Type of maneuver (turn, continue, arrive, etc.) */
  type: string;
  
  /** Direction modifier (left, right, slight, sharp) */
  modifier?: string;
  
  /** Geographic location of the maneuver [lng, lat] */
  location: [number, number];
}

/**
 * Represents a single step in route instructions
 */
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

/**
 * Complete route information from origin to destination
 */
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

/**
 * Waypoint used in routing
 */
export interface Waypoint {
  /** Geographic location [lng, lat] */
  location: [number, number];
  
  /** Human-readable name of the waypoint */
  name: string;
}

/**
 * Complete API response from routing service
 */
export interface RoutingResponse {
  /** Array of calculated routes (primary + alternatives) */
  routes: Route[];
  
  /** Waypoints used for routing */
  waypoints: Waypoint[];
}

/**
 * Hook state for route calculation
 */
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

/**
 * Cached route stored in localStorage
 */
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

/**
 * Props for route information panel component
 */
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

/**
 * UI display information for transport modes
 */
export interface TransportModeInfo {
  mode: TransportMode;
  icon: string;
  label: string;
}

/**
 * Available transport modes with display info
 */
export const TRANSPORT_MODES: TransportModeInfo[] = [
  { mode: 'foot', icon: '🚶', label: 'A pie' },
  { mode: 'bike', icon: '🚴', label: 'Bicicleta' },
  { mode: 'car', icon: '🚗', label: 'Auto' },
];

/**
 * Detected device platform for map integration
 */
export type Platform = 'ios' | 'android' | 'web';

// Error Classes

/**
 * Base error class for routing failures
 */
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

/**
 * Network connection error
 */
export class NetworkError extends RoutingError {
  constructor() {
    super(
      'Sin conexión a internet. Verifica tu conexión.',
      'NETWORK_ERROR',
      true
    );
  }
}

/**
 * No route found between points
 */
export class NoRouteError extends RoutingError {
  constructor(message: string = 'No se encontró una ruta disponible') {
    super(message, 'NO_ROUTE', false);
  }
}

/**
 * Invalid location coordinates
 */
export class InvalidLocationError extends RoutingError {
  constructor() {
    super(
      'La ubicación está demasiado lejos de calles transitables',
      'INVALID_LOCATION',
      false
    );
  }
}

/**
 * Request timeout error
 */
export class TimeoutError extends RoutingError {
  constructor() {
    super(
      'La solicitud tardó demasiado. Intenta de nuevo.',
      'TIMEOUT',
      true
    );
  }
}

// Validation Functions

/**
 * Validates if distance is within acceptable range
 */
export function isValidDistance(meters: number): boolean {
  return meters >= 0 && meters <= 1000000; // Max 1000km
}

/**
 * Validates if duration is within acceptable range
 */
export function isValidDuration(seconds: number): boolean {
  return seconds >= 0 && seconds <= 86400; // Max 24 hours
}

/**
 * Validates if coordinates are within valid bounds
 */
export function isValidCoordinate(point: RoutePoint): boolean {
  return (
    point.lat >= -90 &&
    point.lat <= 90 &&
    point.lng >= -180 &&
    point.lng <= 180
  );
}

// Coordinate Conversion

/**
 * Leaflet format [lat, lng]
 */
export type LeafletCoord = [number, number];

/**
 * OSRM/GeoJSON format [lng, lat]
 */
export type GeoJSONCoord = [number, number];

/**
 * Converts GeoJSON coordinates to Leaflet format
 */
export function toLeaflet(coord: GeoJSONCoord): LeafletCoord {
  return [coord[1], coord[0]];
}

/**
 * Converts Leaflet coordinates to GeoJSON format
 */
export function toGeoJSON(coord: LeafletCoord): GeoJSONCoord {
  return [coord[1], coord[0]];
}

// Type Guards

/**
 * Type guard to check if object is a valid Route
 */
export function isRoute(obj: unknown): obj is Route {
  const route = obj as Route;
  return (
    route !== null &&
    typeof route === 'object' &&
    typeof route.distance === 'number' &&
    typeof route.duration === 'number' &&
    Array.isArray(route.geometry) &&
    Array.isArray(route.steps) &&
    typeof route.summary === 'string'
  );
}

/**
 * Type guard to check if error is a RoutingError
 */
export function isRoutingError(error: unknown): error is RoutingError {
  return error instanceof RoutingError;
}


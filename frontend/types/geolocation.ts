export interface GeolocationPosition {
  lat: number;
  lng: number;
}

export interface GeolocationState {
  position: GeolocationPosition | null;
  accuracy: number | null;
  error: GeolocationPositionError | null;
  loading: boolean;
  permission: 'prompt' | 'granted' | 'denied' | 'unavailable';
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean;
}

export const DEFAULT_GEOLOCATION_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  watch: false,
};


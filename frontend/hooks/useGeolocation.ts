import { useState, useEffect, useCallback, useRef } from 'react';
import type { 
  GeolocationPosition, 
  GeolocationOptions,
  GeolocationState 
} from '@/types/geolocation';

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
  watch: false,
};

export function useGeolocation(options: GeolocationOptions = DEFAULT_OPTIONS) {
  const [state, setState] = useState<GeolocationState>({
    position: null,
    accuracy: null,
    error: null,
    loading: false,
    permission: 'prompt',
  });

  const watchIdRef = useRef<number | null>(null);

  // Check if geolocation is available
  const isGeolocationAvailable = typeof window !== 'undefined' && 'geolocation' in navigator;

  // Success handler
  const handleSuccess = useCallback((position: GeolocationPosition) => {
    setState((prev) => ({
      ...prev,
      position: {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      },
      accuracy: position.coords.accuracy,
      error: null,
      loading: false,
      permission: 'granted',
    }));
  }, []);

  // Error handler
  const handleError = useCallback((error: GeolocationPositionError) => {
    setState((prev) => ({
      ...prev,
      error,
      loading: false,
      permission: error.code === error.PERMISSION_DENIED ? 'denied' : prev.permission,
    }));
  }, []);

  // Request single location
  const requestLocation = useCallback(() => {
    if (!isGeolocationAvailable) {
      setState((prev) => ({
        ...prev,
        permission: 'unavailable',
        error: {
          code: 0,
          message: 'Geolocation is not supported by your browser',
        } as GeolocationPositionError,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      }
    );
  }, [isGeolocationAvailable, options, handleSuccess, handleError]);

  // Start watching position
  const watchPosition = useCallback(() => {
    if (!isGeolocationAvailable) {
      setState((prev) => ({
        ...prev,
        permission: 'unavailable',
      }));
      return;
    }

    if (watchIdRef.current !== null) {
      return; // Already watching
    }

    setState((prev) => ({ ...prev, loading: true }));

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      }
    );
  }, [isGeolocationAvailable, options, handleSuccess, handleError]);

  // Stop watching position
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  // Auto-request if watch is enabled
  useEffect(() => {
    if (options.watch) {
      watchPosition();
    }
  }, [options.watch, watchPosition]);

  return {
    ...state,
    requestLocation,
    watchPosition,
    stopWatching,
    isAvailable: isGeolocationAvailable,
  };
}

// Helper function to get error message
export function getGeolocationErrorMessage(error: GeolocationPositionError | null): string {
  if (!error) return '';

  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Permiso de ubicación denegado. Por favor, habilita los permisos de ubicación en tu navegador.';
    case error.POSITION_UNAVAILABLE:
      return 'No se pudo obtener tu ubicación. Verifica tu conexión GPS o WiFi.';
    case error.TIMEOUT:
      return 'Tiempo de espera agotado al obtener tu ubicación. Intenta de nuevo.';
    default:
      return 'Error desconocido al obtener tu ubicación.';
  }
}

// Helper to get accuracy quality
export function getAccuracyQuality(accuracy: number | null): {
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  color: string;
  label: string;
} {
  if (!accuracy) {
    return { quality: 'poor', color: '#EF4444', label: 'Desconocida' };
  }

  if (accuracy < 20) {
    return { quality: 'excellent', color: '#10B981', label: 'Excelente' };
  }
  if (accuracy < 50) {
    return { quality: 'good', color: '#EAB308', label: 'Buena' };
  }
  if (accuracy < 100) {
    return { quality: 'fair', color: '#F97316', label: 'Aceptable' };
  }
  return { quality: 'poor', color: '#EF4444', label: 'Pobre' };
}


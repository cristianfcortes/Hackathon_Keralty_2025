// Custom React hook for route calculation and management

import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  Route,
  RoutePoint,
  TransportMode,
  RoutingState,
  CachedRoute,
} from '@/types/routing';
import { calculateRoute, getCacheKey } from '@/lib/routing/osrm';
import { isRoutingError } from '@/types/routing';

/**
 * Configuration options for useRouting hook
 */
interface UseRoutingOptions {
  /** Initial transport mode */
  initialMode?: TransportMode;
  
  /** Enable route caching in localStorage */
  enableCache?: boolean;
  
  /** Cache expiration time in milliseconds (default: 1 hour) */
  cacheExpirationMs?: number;
  
  /** Callback when route is successfully calculated */
  onRouteCalculated?: (route: Route) => void;
  
  /** Callback when error occurs */
  onError?: (error: Error) => void;
}

/**
 * Hook return value
 */
interface UseRoutingReturn extends RoutingState {
  /** Calculate a new route */
  calculateNewRoute: (origin: RoutePoint, destination: RoutePoint) => Promise<void>;
  
  /** Change transport mode */
  setMode: (mode: TransportMode) => void;
  
  /** Clear current route */
  clearRoute: () => void;
  
  /** Retry last failed calculation */
  retry: () => Promise<void>;
}

/**
 * LocalStorage key for route cache
 */
const CACHE_STORAGE_KEY = 'keralty:route-cache';

/**
 * Default cache expiration: 1 hour
 */
const DEFAULT_CACHE_EXPIRATION_MS = 60 * 60 * 1000;

/**
 * Custom hook para cálculo y gestión de rutas
 * 
 * @param options - Opciones de configuración
 * @returns Estado y funciones para gestionar rutas
 */
export function useRouting(options: UseRoutingOptions = {}): UseRoutingReturn {
  const {
    initialMode = 'foot',
    enableCache = true,
    cacheExpirationMs = DEFAULT_CACHE_EXPIRATION_MS,
    onRouteCalculated,
    onError,
  } = options;

  // Estado del hook
  const [state, setState] = useState<RoutingState>({
    currentRoute: null,
    alternativeRoutes: [],
    loading: false,
    error: null,
    mode: initialMode,
  });

  // Referencias para último cálculo (para retry)
  const lastOriginRef = useRef<RoutePoint | null>(null);
  const lastDestinationRef = useRef<RoutePoint | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentModeRef = useRef<TransportMode>(initialMode);

  // Mantener currentModeRef sincronizado con state.mode
  useEffect(() => {
    currentModeRef.current = state.mode;
  }, [state.mode]);

  /**
   * Limpia la ruta actual y reset del estado
   */
  const clearRoute = useCallback(() => {
    // Cancelar cualquier petición en curso
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setState((prev) => ({
      ...prev,
      currentRoute: null,
      alternativeRoutes: [],
      error: null,
    }));

    lastOriginRef.current = null;
    lastDestinationRef.current = null;
  }, []);

  /**
   * Lee una ruta del cache de localStorage
   */
  const getFromCache = useCallback(
    (origin: RoutePoint, destination: RoutePoint, mode: TransportMode): Route | null => {
      if (!enableCache) return null;

      try {
        const cacheKey = getCacheKey(origin, destination, mode);
        const cached = localStorage.getItem(`${CACHE_STORAGE_KEY}:${cacheKey}`);

        if (!cached) return null;

        const cachedRoute: CachedRoute = JSON.parse(cached);
        const now = Date.now();

        // Verificar si el cache expiró
        if (now - cachedRoute.timestamp > cacheExpirationMs) {
          localStorage.removeItem(`${CACHE_STORAGE_KEY}:${cacheKey}`);
          return null;
        }

        return cachedRoute.route;
      } catch (error) {
        console.warn('Error reading route cache:', error);
        return null;
      }
    },
    [enableCache, cacheExpirationMs]
  );

  /**
   * Guarda una ruta en el cache de localStorage
   */
  const saveToCache = useCallback(
    (origin: RoutePoint, destination: RoutePoint, mode: TransportMode, route: Route) => {
      if (!enableCache) return;

      try {
        const cacheKey = getCacheKey(origin, destination, mode);
        const cached: CachedRoute = {
          route,
          timestamp: Date.now(),
          origin: `${origin.lat},${origin.lng}`,
          destination: `${destination.lat},${destination.lng}`,
          mode,
        };

        localStorage.setItem(`${CACHE_STORAGE_KEY}:${cacheKey}`, JSON.stringify(cached));
      } catch (error) {
        console.warn('Error saving route cache:', error);
      }
    },
    [enableCache]
  );

  /**
   * Calcula una nueva ruta entre dos puntos
   */
  const calculateNewRoute = useCallback(
    async (origin: RoutePoint, destination: RoutePoint) => {
      // Cancelar cualquier petición anterior
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Crear nuevo controller para esta petición
      abortControllerRef.current = new AbortController();

      // Actualizar referencias para retry
      lastOriginRef.current = origin;
      lastDestinationRef.current = destination;

      // Set loading state
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        // Intentar obtener del cache primero
        const currentMode = currentModeRef.current;
        const cachedRoute = getFromCache(origin, destination, currentMode);
        if (cachedRoute) {
          setState((prev) => ({
            ...prev,
            currentRoute: cachedRoute,
            loading: false,
            error: null,
          }));

          onRouteCalculated?.(cachedRoute);
          return;
        }

        // Llamar a la API de OSRM
        const response = await calculateRoute(
          origin,
          destination,
          currentMode,
          abortControllerRef.current.signal
        );

        // Tomar la primera ruta como principal
        const primaryRoute = response.routes[0];
        const alternatives = response.routes.slice(1);

        // Guardar en cache
        saveToCache(origin, destination, currentMode, primaryRoute);

        // Actualizar estado
        setState((prev) => ({
          ...prev,
          currentRoute: primaryRoute,
          alternativeRoutes: alternatives,
          loading: false,
          error: null,
        }));

        onRouteCalculated?.(primaryRoute);
      } catch (error) {
        const routingError = error as Error;

        // No actualizar estado si fue cancelado
        if (routingError.message === 'Petición cancelada') {
          return;
        }

        setState((prev) => ({
          ...prev,
          currentRoute: null,
          alternativeRoutes: [],
          loading: false,
          error: routingError,
        }));

        onError?.(routingError);
      }
    },
    [getFromCache, saveToCache, onRouteCalculated, onError]
  );

  /**
   * Cambia el modo de transporte y recalcula si hay una ruta activa
   */
  const setMode = useCallback(
    async (newMode: TransportMode) => {
      setState((prev) => ({ ...prev, mode: newMode }));
      // Actualizar el ref inmediatamente
      currentModeRef.current = newMode;

      // Si hay una ruta activa, recalcular con el nuevo modo
      if (lastOriginRef.current && lastDestinationRef.current) {
        await calculateNewRoute(lastOriginRef.current, lastDestinationRef.current);
      }
    },
    [calculateNewRoute]
  );

  /**
   * Reintenta el último cálculo fallido
   */
  const retry = useCallback(async () => {
    if (lastOriginRef.current && lastDestinationRef.current) {
      await calculateNewRoute(lastOriginRef.current, lastDestinationRef.current);
    }
  }, [calculateNewRoute]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    ...state,
    calculateNewRoute,
    setMode,
    clearRoute,
    retry,
  };
}


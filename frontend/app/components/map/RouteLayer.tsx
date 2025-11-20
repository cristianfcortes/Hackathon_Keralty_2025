'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Route } from '@/types/routing';
import { toLeaflet } from '@/types/routing';

/**
 * Props for RouteLayer component
 */
interface RouteLayerProps {
  /** The calculated route to display */
  route: Route | null;
  
  /** Leaflet map instance */
  map: L.Map | null;
  
  /** Color for the route line */
  color?: string;
  
  /** Width of the route line in pixels */
  weight?: number;
  
  /** Opacity of the route line (0-1) */
  opacity?: number;
  
  /** Whether to automatically fit map bounds to route */
  fitBounds?: boolean;
  
  /** Padding for fitBounds (pixels) */
  fitBoundsPadding?: [number, number];
}

/**
 * Component that renders a calculated route on the Leaflet map
 * 
 * This component:
 * - Displays the route geometry as a polyline
 * - Adds start and end markers
 * - Optionally fits the map bounds to show the entire route
 * - Cleans up layers when route changes or unmounts
 */
export default function RouteLayer({
  route,
  map,
  color = '#2563EB', // blue-600
  weight = 5,
  opacity = 0.7,
  fitBounds = true,
  fitBoundsPadding = [50, 50],
}: RouteLayerProps) {
  // Refs to store Leaflet layers
  const polylineRef = useRef<L.Polyline | null>(null);
  const startMarkerRef = useRef<L.Marker | null>(null);
  const endMarkerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map || !route) {
      // Clear existing layers if no route
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
      if (endMarkerRef.current) {
        endMarkerRef.current.remove();
        endMarkerRef.current = null;
      }
      return;
    }

    // Remove existing layers
    if (polylineRef.current) {
      polylineRef.current.remove();
    }
    if (startMarkerRef.current) {
      startMarkerRef.current.remove();
    }
    if (endMarkerRef.current) {
      endMarkerRef.current.remove();
    }

    // Convert GeoJSON coordinates [lng, lat] to Leaflet [lat, lng]
    const coordinates = route.geometry.map(toLeaflet);

    // Create polyline for the route
    const polyline = L.polyline(coordinates, {
      color,
      weight,
      opacity,
      className: 'route-polyline',
    }).addTo(map);

    polylineRef.current = polyline;

    // Create start marker (green circle)
    if (coordinates.length > 0) {
      const startIcon = L.divIcon({
        html: `
          <div style="
            width: 16px;
            height: 16px;
            background-color: #10B981;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        className: 'route-start-marker',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });

      const startMarker = L.marker(coordinates[0], {
        icon: startIcon,
        zIndexOffset: 100,
      })
        .bindPopup('Inicio')
        .addTo(map);

      startMarkerRef.current = startMarker;
    }

    // Create end marker (red flag)
    if (coordinates.length > 1) {
      const endIcon = L.divIcon({
        html: `
          <div style="
            font-size: 24px;
            line-height: 1;
            filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
          ">🏁</div>
        `,
        className: 'route-end-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 24],
      });

      const endMarker = L.marker(coordinates[coordinates.length - 1], {
        icon: endIcon,
        zIndexOffset: 100,
      })
        .bindPopup('Destino')
        .addTo(map);

      endMarkerRef.current = endMarker;
    }

    // Fit bounds to show entire route
    if (fitBounds && coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, {
        padding: fitBoundsPadding,
        maxZoom: 16, // Don't zoom in too close
        animate: true,
        duration: 0.8,
      });
    }

    // Cleanup function
    return () => {
      if (polylineRef.current) {
        polylineRef.current.remove();
        polylineRef.current = null;
      }
      if (startMarkerRef.current) {
        startMarkerRef.current.remove();
        startMarkerRef.current = null;
      }
      if (endMarkerRef.current) {
        endMarkerRef.current.remove();
        endMarkerRef.current = null;
      }
    };
  }, [map, route, color, weight, opacity, fitBounds, fitBoundsPadding]);

  // This component doesn't render anything in React - it's all Leaflet
  return null;
}


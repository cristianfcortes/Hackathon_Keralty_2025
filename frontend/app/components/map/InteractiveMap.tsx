'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Landmark } from '@/types/landmark';
import { getAriaProps } from '@/lib/accessibility/aria';
import { getHeartIconHTML } from './HeartIcon';
import { getUserLocationIconHTML } from './UserLocationIcon';
import CenterLocationButton from './CenterLocationButton';
import { useGeolocation, getGeolocationErrorMessage } from '@/hooks/useGeolocation';

interface InteractiveMapProps {
  landmarks: Landmark[];
  onMarkerClick: (landmark: Landmark) => void;
  center?: [number, number];
  zoom?: number;
  showUserLocation?: boolean;
  showLocationButton?: boolean;
  trackUserLocation?: boolean;
  locationCircleRadius?: number;
}

const defaultCenter: [number, number] = [5.0700, -75.5133]; // Manizales, Colombia
const defaultZoom = 13;

// Create custom heart icon based on landmark category
const createHeartIcon = (category?: string) => {
  const iconHTML = getHeartIconHTML(category, 36);
  
  return L.divIcon({
    html: iconHTML,
    className: 'custom-heart-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

export default function InteractiveMap({
  landmarks,
  onMarkerClick,
  center = defaultCenter,
  zoom = defaultZoom,
  showUserLocation = true,
  showLocationButton = true,
  trackUserLocation = false,
  locationCircleRadius = 100,
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isCentered, setIsCentered] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const userCircleRef = useRef<L.Circle | null>(null);
  
  // Geolocation hook
  const {
    position: userPosition,
    accuracy,
    error: geoError,
    loading: geoLoading,
    requestLocation,
  } = useGeolocation({ watch: trackUserLocation });

  const mapAriaProps = useMemo(
    () =>
      getAriaProps({
        label: 'Interactive map showing landmarks',
        role: 'application',
      }),
    []
  );


  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Center map on user location
  const centerOnUser = () => {
    if (userPosition && mapInstanceRef.current) {
      // If we already have position, just center the map
      mapInstanceRef.current.flyTo([userPosition.lat, userPosition.lng], 16, {
        duration: 1.5,
      });
      setIsCentered(true);
      
      // Reset centered state after a delay
      setTimeout(() => setIsCentered(false), 3000);
    } else {
      // Request location if we don't have it yet
      requestLocation();
    }
  };

  useEffect(() => {
    if (!isMounted || !mapContainerRef.current) return;

    // Only initialize if not already initialized
    if (!mapInstanceRef.current) {
      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        keyboard: true,
        scrollWheelZoom: true,
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Set ARIA attributes
      const container = map.getContainer();
      if (container) {
        container.setAttribute('role', 'application');
        container.setAttribute('aria-label', 'Interactive map showing landmarks');
        container.setAttribute('tabindex', '0');
      }

      mapInstanceRef.current = map;
    }

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for landmarks
    const mapInstance = mapInstanceRef.current;
    if (mapInstance) {
      landmarks.forEach((landmark) => {
        const heartIcon = createHeartIcon(landmark.category);
        const marker = L.marker([landmark.coordinates.lat, landmark.coordinates.lng], {
          icon: heartIcon,
        });

        marker.on('click', () => onMarkerClick(landmark));

        const popupContent = `
          <div>
            <h3 style="font-weight: 600; margin-bottom: 4px;">${landmark.name}</h3>
            <p style="font-size: 14px; color: #4b5563; margin-bottom: 8px;">${landmark.description}</p>
            <button 
              onclick="window.dispatchEvent(new CustomEvent('landmark-click', { detail: '${landmark.id}' }))"
              style="margin-top: 8px; padding: 4px 12px; background-color: #2563eb; color: white; border-radius: 4px; font-size: 14px; border: none; cursor: pointer;"
              onmouseover="this.style.backgroundColor='#1d4ed8'"
              onmouseout="this.style.backgroundColor='#2563eb'"
              aria-label="View details for ${landmark.name}"
            >
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(mapInstance);
        markersRef.current.push(marker);
      });
    }

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
      }
    };
  }, [isMounted, landmarks, center, zoom, onMarkerClick]);

  // Handle user location marker and circle
  useEffect(() => {
    if (!isMounted || !mapInstanceRef.current || !showUserLocation || !userPosition) {
      return;
    }

    const map = mapInstanceRef.current;

    // Remove existing user marker and circle
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }
    if (userCircleRef.current) {
      userCircleRef.current.remove();
    }

    // Create circle overlay for location radius
    userCircleRef.current = L.circle([userPosition.lat, userPosition.lng], {
      radius: locationCircleRadius,
      color: '#3B82F6',
      fillColor: '#3B82F6',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '5, 5',
      className: 'user-location-circle',
    }).addTo(map);

    // Create user location marker
    const userIcon = L.divIcon({
      html: getUserLocationIconHTML(48),
      className: 'user-location-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
      popupAnchor: [0, -24],
    });

    userMarkerRef.current = L.marker([userPosition.lat, userPosition.lng], {
      icon: userIcon,
      zIndexOffset: 1000,
    }).addTo(map);

    // Add popup with accuracy info
    if (accuracy) {
      const accuracyText = accuracy < 20 
        ? `Excelente (±${Math.round(accuracy)}m)` 
        : accuracy < 50 
          ? `Buena (±${Math.round(accuracy)}m)` 
          : accuracy < 100 
            ? `Aceptable (±${Math.round(accuracy)}m)` 
            : `Pobre (±${Math.round(accuracy)}m)`;
      
      userMarkerRef.current.bindPopup(`
        <div style="text-align: center;">
          <strong>Tu ubicación</strong><br/>
          <span style="font-size: 12px; color: #666;">
            Precisión: ${accuracyText}
          </span>
        </div>
      `);
    }

    // Cleanup
    return () => {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      if (userCircleRef.current) {
        userCircleRef.current.remove();
        userCircleRef.current = null;
      }
    };
  }, [isMounted, userPosition, accuracy, showUserLocation, locationCircleRadius]);

  // Handle popup button clicks
  useEffect(() => {
    const handleLandmarkClick = (event: Event) => {
      const customEvent = event as CustomEvent;
      const landmarkId = customEvent.detail;
      const landmark = landmarks.find((l) => l.id === landmarkId);
      if (landmark) {
        onMarkerClick(landmark);
      }
    };

    window.addEventListener('landmark-click', handleLandmarkClick);

    return () => {
      window.removeEventListener('landmark-click', handleLandmarkClick);
    };
  }, [landmarks, onMarkerClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center h-screen w-full bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen relative" {...mapAriaProps}>
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }} className="z-0" />
      
      {/* Center Location Button */}
      {showLocationButton && (
        <div className="absolute bottom-24 right-4 z-[1000]">
          <CenterLocationButton
            onCenter={centerOnUser}
            loading={geoLoading}
            disabled={false}
            error={geoError ? getGeolocationErrorMessage(geoError) : null}
            isCentered={isCentered}
          />
        </div>
      )}

      {/* Geolocation Error Message */}
      {geoError && showUserLocation && (
        <div 
          className="absolute top-20 right-4 z-[1000] bg-red-50 border-2 border-red-200 rounded-lg p-4 shadow-lg max-w-xs animate-fade-in"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-3">
            <svg
              className="h-6 w-6 text-red-600 flex-shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                {getGeolocationErrorMessage(geoError)}
              </p>
              <button
                onClick={requestLocation}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              >
                Reintentar
              </button>
            </div>
            <button
              onClick={() => {}}
              className="text-red-400 hover:text-red-600 focus:outline-none"
              aria-label="Cerrar mensaje de error"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

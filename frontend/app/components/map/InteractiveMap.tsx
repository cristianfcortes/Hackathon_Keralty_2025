'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Landmark } from '@/types/landmark';
import { getAriaProps } from '@/lib/accessibility/aria';

interface InteractiveMapProps {
  landmarks: Landmark[];
  onMarkerClick: (landmark: Landmark) => void;
  center?: [number, number];
  zoom?: number;
}

const defaultCenter: [number, number] = [5.0700, -75.5133]; // Manizales, Colombia
const defaultZoom = 13;

// Fix for default marker icon in Next.js
const createCustomIcon = () => {
  return new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

export default function InteractiveMap({
  landmarks,
  onMarkerClick,
  center = defaultCenter,
  zoom = defaultZoom,
}: InteractiveMapProps) {
  const [isMounted, setIsMounted] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const mapAriaProps = useMemo(
    () =>
      getAriaProps({
        label: 'Interactive map showing landmarks',
        role: 'application',
      }),
    []
  );

  const customIcon = useMemo(() => createCustomIcon(), []);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        const marker = L.marker([landmark.coordinates.lat, landmark.coordinates.lng], {
          icon: customIcon,
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
  }, [isMounted, landmarks, customIcon, center, zoom, onMarkerClick]);

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
    </div>
  );
}

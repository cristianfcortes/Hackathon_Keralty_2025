'use client';

import dynamic from 'next/dynamic';
import type { Landmark } from '@/types/landmark';
import type { Route, TransportMode } from '@/types/routing';

interface MapWrapperProps {
  landmarks: Landmark[];
  onMarkerClick: (landmark: Landmark) => void;
  center?: [number, number];
  zoom?: number;
  selectedLandmark?: Landmark | null;
  enableRouting?: boolean;
  onRouteCalculated?: (route: Route | null, loading: boolean, error: Error | null, mode: TransportMode) => void;
  onModeChange?: (mode: TransportMode) => void;
  onOpenInMaps?: () => void;
  currentMode?: TransportMode;
}

// Dynamically import InteractiveMap with SSR disabled
const InteractiveMap = dynamic(() => import('./InteractiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Cargando mapa...</p>
      </div>
    </div>
  ),
});

export default function MapWrapper(props: MapWrapperProps) {
  return <InteractiveMap {...props} />;
}


'use client';

import { useState, useCallback } from 'react';
import MapWrapper from './components/map/MapWrapper';
import LandmarkModal from './components/map/LandmarkModal';
import KeryCharacter from './components/KeryCharacter';
import EnergyBar from './components/energy/EnergyBar';
import { useLandmarks } from '@/hooks/useLandmarks';
import { useAttendance } from '@/hooks/useAttendance';
import { useEnergy } from '@/hooks/useEnergy';
import type { Landmark } from '@/types/landmark';
import type { Route, TransportMode } from '@/types/routing';

export default function Home() {
  const { landmarks, loading, error } = useLandmarks();
  const { confirmAttendance, hasConfirmed: checkHasConfirmed } = useAttendance();
  const { energy, maxEnergy, score, increaseEnergy } = useEnergy();
  const [selectedLandmark, setSelectedLandmark] = useState<Landmark | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmedLandmarks, setConfirmedLandmarks] = useState<Set<string>>(new Set());
  
  // Routing state
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<Error | null>(null);
  const [transportMode, setTransportMode] = useState<TransportMode>('foot');

  const handleMarkerClick = useCallback((landmark: Landmark) => {
    setSelectedLandmark(landmark);
    setIsModalOpen(true);
    
    // Increase energy for visiting a landmark
    increaseEnergy(10, 10);
    
    // Check if already confirmed
    checkHasConfirmed(landmark.id).then((confirmed) => {
      if (confirmed) {
        setConfirmedLandmarks((prev) => new Set(prev).add(landmark.id));
      }
    });
  }, [checkHasConfirmed, increaseEnergy]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedLandmark(null);
    // Clear route when modal closes
    setCurrentRoute(null);
    setRouteError(null);
  }, []);

  const handleRouteCalculated = useCallback(
    (route: Route | null, loading: boolean, error: Error | null, mode: TransportMode) => {
      setCurrentRoute(route);
      setRouteLoading(loading);
      setRouteError(error);
      setTransportMode(mode);
    },
    []
  );

  const handleConfirmAttendance = useCallback(
    async (landmarkId: string) => {
      try {
        await confirmAttendance(landmarkId);
        setConfirmedLandmarks((prev) => new Set(prev).add(landmarkId));
        
        // Reward for confirming attendance
        increaseEnergy(20, 25);
      } catch (error) {
        console.error('Failed to confirm attendance:', error);
        // Error handling could show a toast notification here
      }
    },
    [confirmAttendance, increaseEnergy]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" role="status" aria-live="polite">
        <p>Cargando mapa...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="p-4 bg-red-100 border border-red-400 rounded m-4"
        role="alert"
        aria-live="assertive"
      >
        <p className="text-red-700">Error al cargar lugares: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <MapWrapper
        landmarks={landmarks}
        onMarkerClick={handleMarkerClick}
        selectedLandmark={isModalOpen ? selectedLandmark : null}
        enableRouting={true}
        onRouteCalculated={handleRouteCalculated}
        onModeChange={setTransportMode}
      />
      
      {/* Energy Bar - Top right Corner */}
      <div className="absolute top-4 right-4 z-[1000] animate-fade-in">
        <EnergyBar
          currentEnergy={energy}
          maxEnergy={maxEnergy}
          score={score}
        />
      </div>
      
      <LandmarkModal
        landmark={selectedLandmark}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirmAttendance={handleConfirmAttendance}
        hasConfirmed={selectedLandmark ? confirmedLandmarks.has(selectedLandmark.id) : false}
        route={currentRoute}
        routeLoading={routeLoading}
        routeError={routeError}
        currentMode={transportMode}
        onModeChange={setTransportMode}
        onOpenInMaps={() => {
          // The handleOpenInMaps is handled in InteractiveMap
        }}
      />
      <KeryCharacter />
    </div>
  );
}


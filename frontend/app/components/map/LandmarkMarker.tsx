'use client';

import { useCallback } from 'react';
import type { Landmark } from '@/types/landmark';
import { handleActivation } from '@/lib/accessibility/keyboard';

interface LandmarkMarkerProps {
  landmark: Landmark;
  onClick: (landmark: Landmark) => void;
  isSelected?: boolean;
}

export default function LandmarkMarker({
  landmark,
  onClick,
  isSelected = false,
}: LandmarkMarkerProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      handleActivation(event.nativeEvent, () => onClick(landmark));
    },
    [landmark, onClick]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(landmark)}
      onKeyDown={handleKeyDown}
      aria-label={`${landmark.name} - Click to view details`}
      className={`cursor-pointer ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      {/* Marker is handled by Leaflet Marker component */}
      {/* This component is for additional keyboard accessibility */}
    </div>
  );
}


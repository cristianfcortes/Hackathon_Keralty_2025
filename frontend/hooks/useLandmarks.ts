'use client';

import { useState, useEffect } from 'react';
import type { Landmark } from '@/types/landmark';
import landmarksData from '@/data/landmarks.json';

export function useLandmarks() {
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Load embedded landmark data
      const loadedLandmarks = landmarksData as Landmark[];
      setLandmarks(loadedLandmarks);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load landmarks'));
      setLoading(false);
    }
  }, []);

  const getLandmarkById = (id: string): Landmark | undefined => {
    return landmarks.find(landmark => landmark.id === id);
  };

  return {
    landmarks,
    loading,
    error,
    getLandmarkById,
  };
}


'use client';

import { useState, useEffect, useCallback } from 'react';
import { attendanceStorage } from '@/lib/storage/attendance';
import type { AttendanceConfirmation } from '@/types/attendance';

export function useAttendance() {
  const [confirmations, setConfirmations] = useState<AttendanceConfirmation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadConfirmations();
  }, []);

  const loadConfirmations = async () => {
    try {
      setLoading(true);
      const allConfirmations = await attendanceStorage.getAllConfirmations();
      setConfirmations(allConfirmations);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load attendance confirmations'));
    } finally {
      setLoading(false);
    }
  };

  const confirmAttendance = useCallback(async (landmarkId: string): Promise<AttendanceConfirmation> => {
    try {
      const confirmation = await attendanceStorage.confirmAttendance(landmarkId);
      await loadConfirmations(); // Reload to get updated list
      return confirmation;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to confirm attendance');
      setError(error);
      throw error;
    }
  }, []);

  const hasConfirmed = useCallback(async (landmarkId: string): Promise<boolean> => {
    try {
      return await attendanceStorage.hasConfirmed(landmarkId);
    } catch (err) {
      console.error('Failed to check attendance:', err);
      return false;
    }
  }, []);

  const removeConfirmation = useCallback(async (landmarkId: string): Promise<void> => {
    try {
      await attendanceStorage.removeConfirmation(landmarkId);
      await loadConfirmations();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to remove confirmation');
      setError(error);
      throw error;
    }
  }, []);

  return {
    confirmations,
    loading,
    error,
    confirmAttendance,
    hasConfirmed,
    removeConfirmation,
  };
}


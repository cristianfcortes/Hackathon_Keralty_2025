'use client';

import { useState, useEffect, useCallback } from 'react';
import { recordsStorage } from '@/lib/storage/records';
import type { Record, RecordStatus } from '@/types/record';

export function useRecords() {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    try {
      setLoading(true);
      const allRecords = await recordsStorage.getAllRecords();
      setRecords(allRecords);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load records'));
    } finally {
      setLoading(false);
    }
  };

  const createRecord = useCallback(async (
    record: Omit<Record, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Record> => {
    try {
      const newRecord = await recordsStorage.createRecord(record);
      await loadRecords();
      return newRecord;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to create record');
      setError(error);
      throw error;
    }
  }, []);

  const updateRecord = useCallback(async (
    id: string,
    updates: Partial<Omit<Record, 'id' | 'createdAt'>>
  ): Promise<Record> => {
    try {
      const updatedRecord = await recordsStorage.updateRecord(id, updates);
      await loadRecords();
      return updatedRecord;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update record');
      setError(error);
      throw error;
    }
  }, []);

  const deleteRecord = useCallback(async (id: string): Promise<void> => {
    try {
      await recordsStorage.deleteRecord(id);
      await loadRecords();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to delete record');
      setError(error);
      throw error;
    }
  }, []);

  const getRecordsByStatus = useCallback(async (status: RecordStatus): Promise<Record[]> => {
    try {
      return await recordsStorage.getRecordsByStatus(status);
    } catch (err) {
      console.error('Failed to get records by status:', err);
      return [];
    }
  }, []);

  const getRecordsByLandmark = useCallback(async (landmarkId: string): Promise<Record[]> => {
    try {
      return await recordsStorage.getRecordsByLandmark(landmarkId);
    } catch (err) {
      console.error('Failed to get records by landmark:', err);
      return [];
    }
  }, []);

  return {
    records,
    loading,
    error,
    createRecord,
    updateRecord,
    deleteRecord,
    getRecordsByStatus,
    getRecordsByLandmark,
    reload: loadRecords,
  };
}


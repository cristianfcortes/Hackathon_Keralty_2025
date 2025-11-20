'use client';

import { useState } from 'react';
import RecordsList from '../components/records/RecordsList';
import { useRecords } from '@/hooks/useRecords';
import type { Record } from '@/types/record';

export default function RecordsPage() {
  const { records, loading, error, createRecord, updateRecord, deleteRecord } = useRecords();
  const [newRecordTitle, setNewRecordTitle] = useState('');
  const [newRecordDescription, setNewRecordDescription] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecordTitle.trim()) return;

    try {
      await createRecord({
        title: newRecordTitle.trim(),
        description: newRecordDescription.trim(),
        status: 'pending',
      });
      setNewRecordTitle('');
      setNewRecordDescription('');
    } catch (err) {
      console.error('Failed to create record:', err);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Record>) => {
    try {
      await updateRecord(id, updates);
    } catch (err) {
      console.error('Failed to update record:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      try {
        await deleteRecord(id);
      } catch (err) {
        console.error('Failed to delete record:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div role="alert" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Error: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Patrocinadores</h1>

      <form onSubmit={handleCreate} className="mb-6 bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Agrega un activo en salud que ayude a la comunidad</h2>
        <div className="space-y-2">
          <input
            type="text"
            value={newRecordTitle}
            onChange={(e) => setNewRecordTitle(e.target.value)}
            placeholder="nombre del activo"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="New record title"
            required
            maxLength={200}
          />
          <textarea
            value={newRecordDescription}
            onChange={(e) => setNewRecordDescription(e.target.value)}
            placeholder="Descripción (optional)"
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            aria-label="New record description"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Agregar
          </button>
        </div>
      </form>

      <RecordsList records={records} onUpdate={handleUpdate} onDelete={handleDelete} />
    </div>
  );
}


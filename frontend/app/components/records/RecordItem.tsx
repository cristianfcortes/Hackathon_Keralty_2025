'use client';

import { useState } from 'react';
import type { Record } from '@/types/record';

interface RecordItemProps {
  record: Record;
  onUpdate: (id: string, updates: Partial<Record>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function RecordItem({ record, onUpdate, onDelete }: RecordItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(record.title);
  const [description, setDescription] = useState(record.description || '');

  const handleSave = async () => {
    if (title.trim()) {
      await onUpdate(record.id, { title: title.trim(), description: description.trim() });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setTitle(record.title);
    setDescription(record.description || '');
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && !isEditing) {
      onDelete(record.id);
    } else if (e.key === 'Enter' && !isEditing) {
      setIsEditing(true);
    } else if (e.key === 'Escape' && isEditing) {
      handleCancel();
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };

  return (
    <div
      className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
      onKeyDown={handleKeyDown}
      role="listitem"
      aria-label={`Record: ${record.title}, Status: ${record.status}`}
    >
      {isEditing ? (
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Record title"
            autoFocus
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            aria-label="Record description"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Save record"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Cancel editing"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold">{record.title}</h3>
            {record.description && (
              <p className="text-gray-600 text-sm mt-1">{record.description}</p>
            )}
            <div className="flex gap-2 mt-2">
              <span
                className={`px-2 py-1 rounded text-xs ${statusColors[record.status]}`}
                aria-label={`Status: ${record.status}`}
              >
                {record.status}
              </span>
              {record.relatedLandmarkId && (
                <span className="text-xs text-gray-500">Linked to landmark</span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Edit record: ${record.title}`}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(record.id)}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
              aria-label={`Delete record: ${record.title}`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


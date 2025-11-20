'use client';

import type { Record } from '@/types/record';
import RecordItem from './RecordItem';
import { getAriaProps } from '@/lib/accessibility/aria';

interface RecordsListProps {
  records: Record[];
  onUpdate: (id: string, updates: Partial<Record>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function RecordsList({
  records,
  onUpdate,
  onDelete,
}: RecordsListProps) {
  const listAriaProps = getAriaProps({
    label: 'Lista de tareas',
    role: 'list',
  });

  if (records.length === 0) {
    return (
      <div className="text-center py-12" role="status" aria-live="polite">
        <p className="text-gray-500">Aún no hay registros. ¡Crea tu primer registro para comenzar!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-2" {...listAriaProps}>
      {records.map((record) => (
        <li key={record.id}>
          <RecordItem record={record} onUpdate={onUpdate} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}


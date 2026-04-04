'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { crmPost } from '../lib/api-client';

export function IncidentActions({ id, assignedToDefault = '', currentRole }: { id: string; assignedToDefault?: string; currentRole?: 'admin' | 'supervisor' | 'agent' }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [assignedTo, setAssignedTo] = useState(assignedToDefault);
  const [error, setError] = useState('');
  const canManage = currentRole === 'admin' || currentRole === 'supervisor';

  const run = (fn: () => Promise<unknown>) => {
    setError('');
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e: any) {
        setError(e?.message || 'Error');
      }
    });
  };

  if (!canManage) return null;

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <button disabled={pending} onClick={() => run(() => crmPost(`/incidents/${id}/resolve`))} className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-white disabled:opacity-50">Resolver</button>
        <button disabled={pending} onClick={() => run(() => crmPost(`/incidents/${id}/reopen`))} className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-white disabled:opacity-50">Reabrir</button>
      </div>
      <div className="flex gap-2">
        <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Asignar a..." className="flex-1 rounded-lg border border-neutral-800 bg-black px-3 py-2 text-xs text-white" />
        <button disabled={pending || !assignedTo.trim()} onClick={() => run(() => crmPost(`/incidents/${id}/assign`, { assignedTo }))} className="rounded-lg border border-neutral-700 px-3 py-2 text-xs text-white disabled:opacity-50">Asignar</button>
      </div>
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

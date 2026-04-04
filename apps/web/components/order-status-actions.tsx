'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { crmPost } from '../lib/api-client';

export function OrderStatusActions({ id, path }: { id: string; path: '/orders' | '/reservations' }) {
  const router = useRouter();
  const [status, setStatus] = useState('pending_validation');
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-2">
      <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white">
        <option value="pending_validation">Pendiente validación</option>
        <option value="in_review">En revisión</option>
        <option value="approved">Aprobado</option>
        <option value="closed">Cerrado</option>
      </select>
      <button
        disabled={pending}
        onClick={() => startTransition(async () => { await crmPost(`${path}/${id}/status`, { status }); router.refresh(); })}
        className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white disabled:opacity-50"
      >
        Guardar
      </button>
    </div>
  );
}

'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { crmPost } from '../lib/api-client';

export function BlacklistForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [reason, setReason] = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  return (
    <form
      className="grid gap-2 md:grid-cols-[1fr_2fr_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        setError('');
        startTransition(async () => {
          try {
            await crmPost('/blacklist', { phone, reason, createdBy: 'crm' });
            setPhone('');
            setReason('');
            router.refresh();
          } catch (err: any) {
            setError(err?.message || 'No se pudo agregar');
          }
        });
      }}
    >
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Número" className="rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white" />
      <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo" className="rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white" />
      <button disabled={pending || !phone.trim()} className="rounded-xl border border-red-700 bg-red-700/20 px-4 py-2 text-sm text-white disabled:opacity-50">Agregar</button>
      {error ? <p className="text-sm text-red-400 md:col-span-3">{error}</p> : null}
    </form>
  );
}

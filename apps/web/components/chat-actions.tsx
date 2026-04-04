'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { crmPost } from '../lib/api-client';

type Props = {
  phone: string;
  botEnabled: boolean;
  humanTakeover: boolean;
  blacklisted: boolean;
  currentRole?: 'admin' | 'supervisor' | 'agent';
};

export function ChatActions({ phone, botEnabled, humanTakeover, blacklisted, currentRole }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [note, setNote] = useState('');
  const [reason, setReason] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');

  const canManage = currentRole === 'admin' || currentRole === 'supervisor';
  const canTakeover = canManage || currentRole === 'agent';

  const run = (fn: () => Promise<unknown>) => {
    setError('');
    startTransition(async () => {
      try {
        await fn();
        router.refresh();
      } catch (e: any) {
        setError(e?.message || 'Ocurrió un error');
      }
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-2 sm:grid-cols-2">
        {canManage ? (
          <button disabled={pending} onClick={() => run(() => crmPost(`/chats/${phone}/bot/${botEnabled ? 'disable' : 'enable'}`))} className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
            {botEnabled ? 'Apagar bot en este chat' : 'Encender bot en este chat'}
          </button>
        ) : null}

        {canTakeover ? (
          <button disabled={pending} onClick={() => run(() => crmPost(`/chats/${phone}/${humanTakeover ? 'release' : 'takeover'}`, humanTakeover ? undefined : { assignedTo }))} className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
            {humanTakeover ? 'Liberar takeover' : 'Tomar chat como humano'}
          </button>
        ) : null}

        {canManage ? (
          <button disabled={pending} onClick={() => run(() => crmPost(`/chats/${phone}/reset-context`))} className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
            Reiniciar contexto del chat
          </button>
        ) : null}

        {canManage ? (
          <button disabled={pending} onClick={() => run(() => blacklisted ? crmPost(`/blacklist/${phone}`, undefined, 'DELETE') : crmPost('/blacklist', { phone, reason: reason || 'Agregado desde chat', createdBy: 'crm' }))} className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
            {blacklisted ? 'Quitar de blacklist' : 'Agregar a blacklist'}
          </button>
        ) : null}
      </div>

      {canTakeover && !humanTakeover ? (
        <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Asignar takeover a..." className="w-full rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white outline-none" />
      ) : null}

      {canManage ? (
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motivo blacklist" className="w-full rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white outline-none" />
      ) : null}

      <div className="flex gap-2">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Agregar nota interna" className="flex-1 rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white outline-none" />
        <button disabled={pending || !note.trim()} onClick={() => run(async () => { await crmPost(`/chats/${phone}/notes`, { note, createdBy: 'crm' }); setNote(''); })} className="rounded-xl border border-red-700 bg-red-700/20 px-3 py-2 text-sm text-white hover:bg-red-700/30 disabled:opacity-50">
          Guardar nota
        </button>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

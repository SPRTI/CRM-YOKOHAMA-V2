'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { crmPost } from '../lib/api-client';

type Props = {
  botEnabled: boolean;
  maintenanceMode: boolean;
  currentRole?: 'admin' | 'supervisor' | 'agent';
};

export function SettingsActions({ botEnabled, maintenanceMode, currentRole }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const isAdmin = currentRole === 'admin';
  const canManage = currentRole === 'admin' || currentRole === 'supervisor';

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
          <button disabled={pending} onClick={() => run(() => crmPost('/settings/bot/enabled', { enabled: !botEnabled }))} className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
            {botEnabled ? 'Apagar bot global' : 'Encender bot global'}
          </button>
        ) : null}
        {canManage ? (
          <button disabled={pending} onClick={() => run(() => crmPost('/settings/maintenance', { enabled: !maintenanceMode }))} className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">
            {maintenanceMode ? 'Quitar mantenimiento' : 'Activar mantenimiento'}
          </button>
        ) : null}
        {isAdmin ? (
          <button disabled={pending} onClick={() => run(() => crmPost('/chats/reset-all'))} className="rounded-xl border border-red-700 bg-red-700/20 px-3 py-2 text-sm text-white hover:bg-red-700/30 disabled:opacity-50">
            Reiniciar todos los contextos
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

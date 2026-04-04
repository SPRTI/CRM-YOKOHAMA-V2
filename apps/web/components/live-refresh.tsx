'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function LiveRefresh({ seconds = 12 }: { seconds?: number }) {
  const router = useRouter();
  const [enabled, setEnabled] = useState(true);
  const [last, setLast] = useState(Date.now());

  useEffect(() => {
    if (!enabled) return;
    const id = setInterval(() => {
      router.refresh();
      setLast(Date.now());
    }, seconds * 1000);
    return () => clearInterval(id);
  }, [enabled, router, seconds]);

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-500">
      <button onClick={() => { router.refresh(); setLast(Date.now()); }} className="rounded-lg border border-neutral-800 px-2 py-1 text-neutral-300 hover:text-white">Actualizar</button>
      <button onClick={() => setEnabled((v) => !v)} className="rounded-lg border border-neutral-800 px-2 py-1 text-neutral-300 hover:text-white">
        {enabled ? `Auto ${seconds}s: ON` : 'Auto refresh: OFF'}
      </button>
      <span>Última actualización: {new Date(last).toLocaleTimeString()}</span>
    </div>
  );
}

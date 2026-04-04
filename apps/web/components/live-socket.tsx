'use client';

import { useEffect, useMemo, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';

export function LiveSocket({ namespace = '/realtime' }: { namespace?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [lastEvent, setLastEvent] = useState<string>('Esperando eventos…');

  const socketUrl = useMemo(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011/api';
    return api.replace(/\/api\/?$/, '');
  }, []);

  useEffect(() => {
    let socket: Socket | null = io(`${socketUrl}${namespace}`, {
      transports: ['websocket', 'polling'],
      withCredentials: false,
    });

    socket.on('connect', () => setStatus('connected'));
    socket.on('disconnect', () => setStatus('disconnected'));
    socket.on('crm:refresh', (payload) => {
      setLastEvent(`${payload?.event || 'evento'} · ${new Date().toLocaleTimeString()}`);
      router.refresh();
    });

    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [namespace, router, socketUrl]);

  return (
    <div className="flex items-center gap-2 text-xs text-neutral-500">
      <span
        className={`inline-flex h-2.5 w-2.5 rounded-full ${
          status === 'connected' ? 'bg-green-500' : status === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
        }`}
      />
      <span>
        {status === 'connected' ? 'Tiempo real ON' : status === 'connecting' ? 'Conectando realtime…' : 'Realtime OFF'}
      </span>
      <span className="hidden md:inline">• {lastEvent}</span>
    </div>
  );
}

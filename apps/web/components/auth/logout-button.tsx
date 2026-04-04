'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await fetch('/api/session/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
      }}
      className="mt-6 w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 hover:text-white"
    >
      Cerrar sesión
    </button>
  );
}

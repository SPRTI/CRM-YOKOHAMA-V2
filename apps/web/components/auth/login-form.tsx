'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
          const res = await fetch('/api/session/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (!res.ok) throw new Error('Credenciales inválidas');
          router.push('/dashboard');
          router.refresh();
        } catch (err: any) {
          setError(err?.message || 'No se pudo iniciar sesión');
        } finally {
          setLoading(false);
        }
      }}
    >
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Correo" className="w-full rounded-xl border border-neutral-800 bg-black px-3 py-2 text-white" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Contraseña" className="w-full rounded-xl border border-neutral-800 bg-black px-3 py-2 text-white" />
      <button disabled={loading} className="w-full rounded-xl border border-red-700 bg-red-700/20 px-4 py-2 text-white disabled:opacity-50">{loading ? 'Ingresando...' : 'Ingresar'}</button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </form>
  );
}

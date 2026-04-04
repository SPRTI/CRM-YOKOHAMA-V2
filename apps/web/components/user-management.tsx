'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { crmPost } from '../lib/api-client';

type User = {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'supervisor' | 'agent';
  isActive: boolean;
  createdAt: string;
};

export function UserCreateForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'agent' });
  const [error, setError] = useState('');

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="space-y-3 rounded-2xl border border-neutral-800 p-4">
      <h3 className="text-sm font-medium text-white">Crear usuario</h3>
      <div className="grid gap-2 md:grid-cols-2">
        <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Nombre completo" className="rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white" />
        <input value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="Correo" className="rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white" />
        <input value={form.password} onChange={(e) => update('password', e.target.value)} type="password" placeholder="Contraseña" className="rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white" />
        <select value={form.role} onChange={(e) => update('role', e.target.value)} className="rounded-xl border border-neutral-800 bg-black px-3 py-2 text-sm text-white">
          <option value="agent">Agente</option>
          <option value="supervisor">Supervisor</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button
        disabled={pending || !form.fullName || !form.email || !form.password}
        onClick={() => startTransition(async () => {
          try {
            setError('');
            await crmPost('/auth/users', form);
            setForm({ fullName: '', email: '', password: '', role: 'agent' });
            router.refresh();
          } catch (e: any) {
            setError(e?.message || 'No se pudo crear el usuario');
          }
        })}
        className="rounded-xl border border-red-700 bg-red-700/20 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {pending ? 'Creando…' : 'Crear usuario'}
      </button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

export function UserTable({ users }: { users: User[] }) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string>('');
  const [error, setError] = useState('');

  const patchUser = async (id: string, payload: Partial<User> & { password?: string }) => {
    try {
      setError('');
      setPendingId(id);
      await crmPost(`/auth/users/${id}`, payload as any, 'PATCH');
      router.refresh();
    } catch (e: any) {
      setError(e?.message || 'No se pudo actualizar el usuario');
    } finally {
      setPendingId('');
    }
  };

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-neutral-800">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-950 text-neutral-400">
            <tr>
              <th className="px-4 py-3 text-left">Nombre</th>
              <th className="px-4 py-3 text-left">Correo</th>
              <th className="px-4 py-3 text-left">Rol</th>
              <th className="px-4 py-3 text-left">Activo</th>
              <th className="px-4 py-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-neutral-800">
                <td className="px-4 py-3">{user.fullName}</td>
                <td className="px-4 py-3 text-neutral-300">{user.email}</td>
                <td className="px-4 py-3">
                  <select
                    defaultValue={user.role}
                    disabled={pendingId === user.id}
                    onChange={(e) => patchUser(user.id, { role: e.target.value as any })}
                    className="rounded-lg border border-neutral-800 bg-black px-2 py-1 text-xs text-white"
                  >
                    <option value="agent">agent</option>
                    <option value="supervisor">supervisor</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="px-4 py-3">{user.isActive ? 'Sí' : 'No'}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button disabled={pendingId === user.id} onClick={() => patchUser(user.id, { isActive: !user.isActive })} className="rounded-lg border border-neutral-700 px-3 py-1 text-xs text-white disabled:opacity-50">
                      {user.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}

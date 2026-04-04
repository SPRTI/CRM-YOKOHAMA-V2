import Link from 'next/link';
import { LogoutButton } from './auth/logout-button';
import { getSessionUser } from '../lib/auth';

export async function Sidebar() {
  const user = await getSessionUser();
  const items = [
    { href: '/dashboard', label: 'Dashboard', roles: ['admin', 'supervisor', 'agent'] },
    { href: '/chats', label: 'Chats', roles: ['admin', 'supervisor', 'agent'] },
    { href: '/orders', label: 'Pedidos', roles: ['admin', 'supervisor', 'agent'] },
    { href: '/reservations', label: 'Reservas', roles: ['admin', 'supervisor', 'agent'] },
    { href: '/incidents', label: 'Incidencias', roles: ['admin', 'supervisor', 'agent'] },
    { href: '/blacklist', label: 'Blacklist', roles: ['admin', 'supervisor'] },
    { href: '/settings', label: 'Configuración', roles: ['admin', 'supervisor'] },
    { href: '/audit', label: 'Auditoría', roles: ['admin', 'supervisor'] },
    { href: '/integrations', label: 'Integraciones', roles: ['admin', 'supervisor'] },
    { href: '/users', label: 'Usuarios', roles: ['admin'] },
    { href: '/history', label: 'Historial', roles: ['admin', 'supervisor', 'agent'] },
  ];

  const visible = items.filter((item) => !user?.role || item.roles.includes(user.role));

  return (
    <aside className="hidden w-72 border-r border-neutral-900 bg-neutral-950 p-6 md:block">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Aeternum</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Yokohama CRM</h1>
        {user ? <p className="mt-2 text-sm text-neutral-400">{user.fullName} · {user.role}</p> : null}
      </div>
      <nav className="space-y-2">
        {visible.map((item) => (
          <Link key={item.href} href={item.href} className="block rounded-xl px-4 py-3 text-sm text-neutral-300 transition hover:bg-neutral-900 hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
      <LogoutButton />
    </aside>
  );
}

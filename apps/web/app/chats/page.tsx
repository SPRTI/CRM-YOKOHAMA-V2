import Link from 'next/link';
import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { StatusBadge } from '../../components/status-badge';
import { LiveRefresh } from '../../components/live-refresh';
import { LiveSocket } from '../../components/live-socket';

export default async function ChatsPage({ searchParams }: { searchParams?: Promise<{ q?: string; status?: string; branch?: string; bot?: string }> }) {
  const sp = (await searchParams) || {};
  const qs = new URLSearchParams();
  if (sp.q) qs.set('q', sp.q);
  if (sp.status) qs.set('status', sp.status);
  if (sp.branch) qs.set('branch', sp.branch);
  if (sp.bot) qs.set('bot', sp.bot);

  const chats = (await crmFetch(`/chats${qs.toString() ? `?${qs.toString()}` : ''}`).catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Inbox de chats</h2>
            <p className="text-neutral-400">Conversaciones, estado del bot, takeover humano y operación.</p>
          </div>
          <div className="flex flex-col gap-3 xl:items-end">
            <LiveSocket />
            <LiveRefresh seconds={10} />
            <form className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto_auto]">
              <input name="q" defaultValue={sp.q || ''} placeholder="Buscar por número, nombre o mensaje" className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white" />
              <select name="status" defaultValue={sp.status || ''} className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white">
                <option value="">Todos</option>
                <option value="with_agent">Con agente</option>
                <option value="blacklist">Blacklist</option>
                <option value="incident">Con incidencia</option>
              </select>
              <select name="branch" defaultValue={sp.branch || ''} className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white">
                <option value="">Todas las sucursales</option>
                <option value="Heredia">Heredia</option>
                <option value="Cartago">Cartago</option>
                <option value="San Pedro">San Pedro</option>
              </select>
              <select name="bot" defaultValue={sp.bot || ''} className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white">
                <option value="">Bot ON/OFF</option>
                <option value="enabled">Bot encendido</option>
                <option value="disabled">Bot apagado</option>
              </select>
              <button className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white">Filtrar</button>
            </form>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-950 text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Estado</th>
                <th className="px-4 py-3 text-left">Intención</th>
                <th className="px-4 py-3 text-left">Sucursal</th>
                <th className="px-4 py-3 text-left">Último mensaje</th>
                <th className="px-4 py-3 text-left">Actualización</th>
              </tr>
            </thead>
            <tbody>
              {chats.map((chat) => (
                <tr key={chat.phone} className="border-t border-neutral-800 align-top hover:bg-neutral-950/40">
                  <td className="px-4 py-3">
                    <Link href={`/chats/${chat.phone}`} className="block">
                      <p className="font-medium text-neutral-100">{chat.displayName}</p>
                      <p className="text-xs text-neutral-500">{chat.phone}</p>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <StatusBadge tone={chat.botEnabled ? 'green' : 'red'}>{chat.botEnabled ? 'Bot ON' : 'Bot OFF'}</StatusBadge>
                      {chat.humanTakeover ? <StatusBadge tone="blue">Con agente</StatusBadge> : null}
                      {chat.blacklisted ? <StatusBadge tone="red">Blacklist</StatusBadge> : null}
                      {chat.openIncidents > 0 ? <StatusBadge tone="yellow">Incidencias {chat.openIncidents}</StatusBadge> : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-neutral-300">{chat.currentIntent || 'general'}</td>
                  <td className="px-4 py-3 text-neutral-300">{chat.branch || '—'}</td>
                  <td className="px-4 py-3 text-neutral-300">
                    <div className="max-w-[420px] whitespace-pre-wrap line-clamp-3">{chat.lastMessage || 'Sin mensaje reciente'}</div>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">{chat.lastMessageAt ? new Date(chat.lastMessageAt).toLocaleString() : '—'}</td>
                </tr>
              ))}
              {!chats.length ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-neutral-500">No hay chats que coincidan con el filtro.</td></tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
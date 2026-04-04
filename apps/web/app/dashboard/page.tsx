import Link from 'next/link';
import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { MetricCard } from '../../components/metric-card';
import { SectionCard } from '../../components/section-card';
import { StatusBadge } from '../../components/status-badge';
import { LiveRefresh } from '../../components/live-refresh';
import { LiveSocket } from '../../components/live-socket';

export default async function DashboardPage() {
  const overview: any = await crmFetch('/settings/overview').catch(() => null);
  const chats = (await crmFetch('/chats').catch(() => [])) as any[];
  const incidents = (await crmFetch('/incidents').catch(() => [])) as any[];
  const orders = (await crmFetch('/orders').catch(() => [])) as any[];
  const reservations = (await crmFetch('/reservations').catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-bold">Yokohama CRM</h1>
            <p className="text-neutral-400">Centro de control del bot, chats, incidencias y operación.</p>
          </div>
          <LiveSocket />
            <LiveRefresh seconds={12} />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <StatusBadge tone={overview?.settings?.botEnabled ? 'green' : 'red'}>{overview?.settings?.botEnabled ? 'Bot ON' : 'Bot OFF'}</StatusBadge>
          <StatusBadge tone={overview?.settings?.maintenanceMode ? 'yellow' : 'neutral'}>{overview?.settings?.maintenanceMode ? 'Mantenimiento ON' : 'Mantenimiento OFF'}</StatusBadge>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard title="Chats" value={overview?.totals?.chats ?? chats.length} />
          <MetricCard title="Incidencias" value={overview?.totals?.incidents ?? incidents.length} />
          <MetricCard title="Pedidos borrador" value={orders.length} helper="Pendientes de validación humana" />
          <MetricCard title="Reservas borrador" value={reservations.length} helper="Seguimiento pendiente" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <SectionCard title="Chats recientes">
            <ul className="space-y-3">
              {chats.slice(0, 8).map((chat) => (
                <li key={chat.phone} className="rounded-xl border border-neutral-800 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <Link href={`/chats/${chat.phone}`} className="font-medium text-white hover:underline">{chat.displayName}</Link>
                      <p className="text-xs text-neutral-500">{chat.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      {chat.humanTakeover ? <StatusBadge tone="blue">Agente</StatusBadge> : null}
                      {chat.openIncidents > 0 ? <StatusBadge tone="yellow">Incidencia</StatusBadge> : null}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-300">{chat.lastMessage || 'Sin mensaje reciente'}</p>
                </li>
              ))}
            </ul>
          </SectionCard>

          <SectionCard title="Incidencias recientes">
            <ul className="space-y-3">
              {incidents.slice(0, 8).map((incident) => (
                <li key={incident.id} className="rounded-xl border border-neutral-800 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-white">{incident.phone}</p>
                    <div className="flex gap-2">
                      <StatusBadge tone={incident.severity === 'high' ? 'red' : incident.severity === 'medium' ? 'yellow' : 'neutral'}>{incident.severity}</StatusBadge>
                      <StatusBadge tone={incident.status === 'resolved' ? 'green' : incident.status === 'in_review' ? 'blue' : 'yellow'}>{incident.status}</StatusBadge>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-neutral-300">{incident.summary || 'Sin resumen'}</p>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}
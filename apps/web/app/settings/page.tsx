import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { SectionCard } from '../../components/section-card';
import { SettingsActions } from '../../components/settings-actions';
import { StatusBadge } from '../../components/status-badge';
import { LiveSocket } from '../../components/live-socket';
import { requireRole } from '../../lib/auth';

export default async function SettingsPage() {
  const currentUser = await requireRole(['admin', 'supervisor']);
  const overview: any = await crmFetch('/settings/overview').catch(() => null);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-4"><LiveSocket /></div>
        <h2 className="mb-6 text-2xl font-semibold">Configuración del bot</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="Estado global">
            <div className="mb-4 flex flex-wrap gap-2">
              <StatusBadge tone={overview?.settings?.botEnabled ? 'green' : 'red'}>{overview?.settings?.botEnabled ? 'Bot activo' : 'Bot apagado'}</StatusBadge>
              <StatusBadge tone={overview?.settings?.maintenanceMode ? 'yellow' : 'neutral'}>{overview?.settings?.maintenanceMode ? 'Mantenimiento ON' : 'Mantenimiento OFF'}</StatusBadge>
            </div>
            <ul className="space-y-2">
              <li>Chats con takeover: <span className="text-white">{overview?.totals?.withAgent ?? 0}</span></li>
              <li>Chats con bot apagado: <span className="text-white">{overview?.totals?.botDisabled ?? 0}</span></li>
              <li>Pedidos pendientes: <span className="text-white">{overview?.totals?.ordersPending ?? 0}</span></li>
              <li>Reservas pendientes: <span className="text-white">{overview?.totals?.reservationsPending ?? 0}</span></li>
            </ul>
            <div className="mt-4">
              <SettingsActions botEnabled={Boolean(overview?.settings?.botEnabled)} maintenanceMode={Boolean(overview?.settings?.maintenanceMode)} currentRole={currentUser?.role as any} />
            </div>
          </SectionCard>

          <SectionCard title="Actividad reciente del CRM">
            <ul className="space-y-2 text-sm text-neutral-300">
              {(overview?.latestAudit || []).map((item: any) => (
                <li key={item.id} className="rounded-xl border border-neutral-800 p-3">
                  <p className="font-medium text-white">{item.action}</p>
                  <p className="text-neutral-400">{item.entityType}{item.entityId ? ` · ${item.entityId}` : ''}</p>
                  <p className="mt-1 text-xs text-neutral-500">{item.actor || 'crm'} · {new Date(item.createdAt).toLocaleString()}</p>
                </li>
              ))}
              {!overview?.latestAudit?.length ? <li className="text-neutral-500">Sin actividad reciente.</li> : null}
            </ul>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

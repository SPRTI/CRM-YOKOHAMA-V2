import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { SectionCard } from '../../components/section-card';
import { LiveRefresh } from '../../components/live-refresh';
import { LiveSocket } from '../../components/live-socket';
import { requireRole } from '../../lib/auth';

export default async function AuditPage() {
  await requireRole(['admin', 'supervisor']);
  const logs = (await crmFetch('/audit?limit=200').catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Auditoría</h2>
            <p className="text-sm text-neutral-400">Acciones internas del CRM y cambios operativos.</p>
          </div>
          <div className="flex items-center gap-3">
            <LiveSocket />
            <LiveRefresh seconds={15} />
          </div>
        </div>
        <SectionCard title="Eventos recientes">
          <div className="space-y-3">
            {logs.map((item) => (
              <div key={item.id} className="rounded-xl border border-neutral-800 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-white">{item.action}</p>
                  <span className="text-xs text-neutral-500">{new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <p className="mt-1 text-sm text-neutral-400">{item.entityType}{item.entityId ? ` · ${item.entityId}` : ''}</p>
                <p className="mt-1 text-xs text-neutral-500">Actor: {item.actor || 'crm'}</p>
                {item.payload ? (
                  <pre className="mt-3 overflow-auto rounded-lg bg-neutral-950 p-3 text-xs text-neutral-300">{JSON.stringify(item.payload, null, 2)}</pre>
                ) : null}
              </div>
            ))}
            {!logs.length ? <p className="text-sm text-neutral-500">Sin auditoría reciente.</p> : null}
          </div>
        </SectionCard>
      </main>
    </div>
  );
}

import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { IncidentActions } from '../../components/incident-actions';
import { StatusBadge } from '../../components/status-badge';
import { LiveRefresh } from '../../components/live-refresh';
import { LiveSocket } from '../../components/live-socket';
import { requireRole } from '../../lib/auth';

export default async function IncidentsPage() {
  const currentUser = await requireRole(['admin', 'supervisor', 'agent']);
  const incidents = (await crmFetch('/incidents').catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Incidencias</h2>
            <p className="text-neutral-400">Quejas, problemas y seguimiento operativo.</p>
          </div>
          <LiveSocket />
          <LiveRefresh seconds={12} />
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {incidents.map((incident) => (
            <div key={incident.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-white">{incident.phone}</h3>
                <StatusBadge tone={incident.severity === 'high' ? 'red' : incident.severity === 'medium' ? 'yellow' : 'neutral'}>{incident.severity}</StatusBadge>
              </div>
              <div className="mt-2 flex gap-2">
                <StatusBadge tone={incident.status === 'resolved' ? 'green' : incident.status === 'in_review' ? 'blue' : 'yellow'}>{incident.status}</StatusBadge>
                {incident.branch ? <StatusBadge>{incident.branch}</StatusBadge> : null}
              </div>
              <p className="mt-3 text-sm text-neutral-300">{incident.summary || 'Sin resumen'}</p>
              <p className="mt-2 text-xs text-neutral-500">Asignado: {incident.assignedTo || '—'}</p>
              <p className="mt-1 text-xs text-neutral-500">Actualizado: {new Date(incident.updatedAt).toLocaleString()}</p>
              <div className="mt-3">
                <IncidentActions id={incident.id} assignedToDefault={incident.assignedTo || ''} currentRole={currentUser?.role as any} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

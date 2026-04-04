import { Sidebar } from '../../../components/sidebar';
import { crmFetch, baseUrl } from '../../../lib/api';
import { SectionCard } from '../../../components/section-card';
import { ChatActions } from '../../../components/chat-actions';
import { StatusBadge } from '../../../components/status-badge';
import { LiveRefresh } from '../../../components/live-refresh';
import { IncidentActions } from '../../../components/incident-actions';
import { LiveSocket } from '../../../components/live-socket';
import { requireRole } from '../../../lib/auth';

export default async function ChatDetailPage({ params }: { params: Promise<{ phone: string }> }) {
  const { phone } = await params;
  const currentUser = await requireRole(['admin', 'supervisor', 'agent']);
  const chat: any = await crmFetch(`/chats/${phone}`).catch(() => null);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Chat {phone}</h1>
            <p className="text-neutral-400">Detalle de conversación, estado, incidencias y control operativo.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LiveSocket />
            <LiveRefresh seconds={8} />
            <a href={`${baseUrl}/chats/${phone}/export.txt`} className="rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:text-white">Exportar TXT</a>
            <a href={`${baseUrl}/chats/${phone}/export.json`} className="rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:text-white">Exportar JSON</a>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <StatusBadge tone={chat?.control?.botEnabled ?? true ? 'green' : 'red'}>{chat?.control?.botEnabled ?? true ? 'Bot ON' : 'Bot OFF'}</StatusBadge>
          {chat?.control?.humanTakeover ? <StatusBadge tone="blue">Atención humana</StatusBadge> : null}
          {chat?.blacklist ? <StatusBadge tone="red">Blacklist</StatusBadge> : null}
          {(chat?.incidents || []).some((i: any) => i.status !== 'resolved') ? <StatusBadge tone="yellow">Incidencia abierta</StatusBadge> : null}
          {chat?.state?.branch ? <StatusBadge>{chat.state.branch}</StatusBadge> : null}
          {chat?.state?.current_intent ? <StatusBadge tone="neutral">{chat.state.current_intent}</StatusBadge> : null}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
          <SectionCard title="Mensajes">
            <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              {(chat?.messages || []).map((message: any) => (
                <div key={message.id} className={`max-w-[85%] rounded-2xl p-3 ${message.from_me ? 'ml-auto bg-red-600/20' : 'bg-neutral-800'}`}>
                  <p className="text-xs text-neutral-500">{message.from_me ? 'Bot' : message.push_name || 'Cliente'} · {new Date(message.created_at).toLocaleString()}</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-100">{message.text}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="Acciones del chat">
              <ChatActions phone={phone} botEnabled={chat?.control?.botEnabled ?? true} humanTakeover={Boolean(chat?.control?.humanTakeover)} blacklisted={Boolean(chat?.blacklist)} currentRole={currentUser?.role as any} />
            </SectionCard>

            <SectionCard title="Estado del chat">
              <ul className="space-y-2">
                <li>Cliente: <span className="text-white">{chat?.state?.customer_name || chat?.phone || '—'}</span></li>
                <li>Sucursal: <span className="text-white">{chat?.state?.branch || '—'}</span></li>
                <li>Intención: <span className="text-white">{chat?.state?.current_intent || 'general'}</span></li>
                <li>Servicio: <span className="text-white">{chat?.state?.service_type || '—'}</span></li>
                <li>Pago: <span className="text-white">{chat?.state?.payment_method || '—'}</span></li>
                <li>Asignado a: <span className="text-white">{chat?.control?.assignedTo || '—'}</span></li>
                <li>Mensajes totales: <span className="text-white">{chat?.metrics?.total_messages ?? 0}</span></li>
                <li>Entrantes: <span className="text-white">{chat?.metrics?.inbound_messages ?? 0}</span></li>
                <li>Salientes: <span className="text-white">{chat?.metrics?.outbound_messages ?? 0}</span></li>
              </ul>
            </SectionCard>

            <SectionCard title="Notas internas">
              <ul className="space-y-2 text-sm text-neutral-300">
                {(chat?.notes || []).map((note: any) => (
                  <li key={note.id} className="rounded-xl border border-neutral-800 p-3">
                    <p>{note.note}</p>
                    <p className="mt-1 text-xs text-neutral-500">{note.createdBy || 'crm'} · {new Date(note.createdAt).toLocaleString()}</p>
                  </li>
                ))}
                {!chat?.notes?.length ? <li className="text-neutral-500">Sin notas internas.</li> : null}
              </ul>
            </SectionCard>

            <SectionCard title="Borradores detectados">
              {chat?.latestOrderDraft || chat?.latestReservationDraft ? (
                <div className="space-y-3">
                  {chat?.latestOrderDraft ? (
                    <div className="space-y-1 rounded-xl border border-neutral-800 p-3">
                      <p className="font-medium text-white">Pedido</p>
                      <p className="whitespace-pre-wrap">{chat.latestOrderDraft.itemsSummary || 'Sin resumen'}</p>
                      <p className="text-xs text-neutral-500">Estado: {chat.latestOrderDraft.status} · {new Date(chat.latestOrderDraft.updatedAt).toLocaleString()}</p>
                    </div>
                  ) : null}
                  {chat?.latestReservationDraft ? (
                    <div className="space-y-1 rounded-xl border border-neutral-800 p-3">
                      <p className="font-medium text-white">Reserva</p>
                      <p className="whitespace-pre-wrap">{chat.latestReservationDraft.observations || 'Sin observaciones'}</p>
                      <p className="text-xs text-neutral-500">Estado: {chat.latestReservationDraft.status} · {new Date(chat.latestReservationDraft.updatedAt).toLocaleString()}</p>
                    </div>
                  ) : null}
                </div>
              ) : (
                <p className="text-neutral-400">Sin borrador detectado.</p>
              )}
            </SectionCard>

            <SectionCard title="Incidencias y decisiones">
              <div className="space-y-3">
                {(chat?.incidents || []).map((incident: any) => (
                  <div key={incident.id} className="rounded-xl border border-neutral-800 p-3">
                    <div className="mb-2 flex items-center gap-2">
                      <StatusBadge tone={incident.status === 'resolved' ? 'green' : incident.status === 'in_review' ? 'blue' : 'yellow'}>{incident.status}</StatusBadge>
                      <StatusBadge tone={incident.severity === 'high' ? 'red' : incident.severity === 'medium' ? 'yellow' : 'neutral'}>{incident.severity}</StatusBadge>
                    </div>
                    <p className="text-sm text-neutral-300">{incident.summary || 'Sin resumen'}</p>
                    <div className="mt-3"><IncidentActions id={incident.id} assignedToDefault={incident.assignedTo || ''} currentRole={currentUser?.role as any} /></div>
                  </div>
                ))}
                {(chat?.decisions || []).slice(-5).map((decision: any, idx: number) => (
                  <div key={`${decision.created_at}-${idx}`} className="rounded-xl border border-neutral-800 p-3 text-sm text-neutral-300">
                    <p className="font-medium text-white">Decisión IA: {decision.label || decision.decision || '—'}</p>
                    <p>Motivo: {decision.reason || '—'}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </main>
    </div>
  );
}

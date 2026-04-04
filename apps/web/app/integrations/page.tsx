import { Sidebar } from '../../components/sidebar';
import { SectionCard } from '../../components/section-card';
import { LiveSocket } from '../../components/live-socket';
import { requireRole } from '../../lib/auth';

export default async function IntegrationsPage() {
  await requireRole(['admin', 'supervisor']);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Integraciones</h2>
            <p className="text-sm text-neutral-400">Puntos de integración entre CRM, n8n y el bot.</p>
          </div>
          <LiveSocket />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <SectionCard title="n8n → CRM">
            <ul className="space-y-2 text-sm text-neutral-300">
              <li>• <code>GET /integrations/n8n/control-state/:phone</code></li>
              <li>• <code>POST /integrations/n8n/decision</code></li>
              <li>• <code>POST /integrations/n8n/order-draft</code></li>
              <li>• <code>POST /integrations/n8n/reservation-draft</code></li>
            </ul>
          </SectionCard>
          <SectionCard title="Regla operativa recomendada">
            <p className="text-sm text-neutral-300">
              Antes de responder, n8n debe consultar el control-state del número. Si <code>shouldBotReply</code> es false,
              debe guardar inbound y terminar sin responder.
            </p>
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

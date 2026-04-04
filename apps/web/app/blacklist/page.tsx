import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { BlacklistForm } from '../../components/blacklist-form';
import { requireRole } from '../../lib/auth';
import { LiveSocket } from '../../components/live-socket';

export default async function BlacklistPage() {
  await requireRole(['admin', 'supervisor']);
  const blacklist = (await crmFetch('/blacklist').catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Blacklist</h2>
            <p className="text-sm text-neutral-400">Números que nunca deben recibir respuesta del bot.</p>
          </div>
          <LiveSocket />
        </div>
        <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <BlacklistForm />
        </div>
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-950 text-neutral-400">
              <tr>
                <th className="px-4 py-3 text-left">Número</th>
                <th className="px-4 py-3 text-left">Motivo</th>
                <th className="px-4 py-3 text-left">Activo</th>
              </tr>
            </thead>
            <tbody>
              {blacklist.map((item) => (
                <tr key={item.id} className="border-t border-neutral-800">
                  <td className="px-4 py-3 text-neutral-100">{item.phone}</td>
                  <td className="px-4 py-3 text-neutral-300">{item.reason || '—'}</td>
                  <td className="px-4 py-3 text-neutral-300">{item.active ? 'Sí' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

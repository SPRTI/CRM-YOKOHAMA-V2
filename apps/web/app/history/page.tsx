import { Sidebar } from '../../components/sidebar';
import { crmFetch, baseUrl } from '../../lib/api';

export default async function HistoryPage({ searchParams }: { searchParams?: Promise<{ phone?: string }> }) {
  const sp = (await searchParams) || {};
  const phone = sp.phone || '';
  const chat: any = phone ? await crmFetch(`/chats/${phone}`).catch(() => null) : null;
  const txt = chat?.messages?.map((m: any) => `${m.from_me ? 'BOT' : (m.push_name || 'CLIENTE')} [${new Date(m.created_at).toLocaleString()}]\n${m.text || ''}`).join('\n\n') || '';

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Historial ligero</h2>
            <p className="text-neutral-400">Consulta rápida y exportación de conversaciones.</p>
          </div>
          {phone ? (
            <div className="flex gap-2">
              <a href={`${baseUrl}/chats/${phone}/export.txt`} className="rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:text-white">Descargar TXT</a>
              <a href={`${baseUrl}/chats/${phone}/export.json`} className="rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-300 hover:text-white">Descargar JSON</a>
            </div>
          ) : null}
        </div>
        <form className="mb-6 flex gap-2">
          <input name="phone" defaultValue={phone} placeholder="Buscar por número" className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-white" />
          <button className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-white">Buscar</button>
        </form>
        <textarea readOnly value={txt} className="min-h-[65vh] w-full rounded-2xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-200" />
      </main>
    </div>
  );
}

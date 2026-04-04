import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { OrderStatusActions } from '../../components/order-status-actions';
import { LiveSocket } from '../../components/live-socket';

export default async function ReservationsPage() {
  const reservations = (await crmFetch('/reservations').catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-4"><LiveSocket /></div>
        <h2 className="mb-6 text-2xl font-semibold">Reservas borrador</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reservations.map((item) => (
            <div key={item.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-white">{item.customerName || item.phone}</h3>
                <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">{item.status}</span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-neutral-300">
                <p>• Teléfono: {item.phone}</p>
                <p>• Sucursal: {item.branch || '—'}</p>
                <p>• Personas: {item.peopleCount || '—'}</p>
                <p>• Fecha: {item.reservationDate || '—'}</p>
                <p>• Hora: {item.reservationTime || '—'}</p>
                {item.observations ? <p className="whitespace-pre-wrap">• Observaciones: {item.observations}</p> : null}
              </div>
              <div className="mt-4">
                <OrderStatusActions id={item.id} path="/reservations" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
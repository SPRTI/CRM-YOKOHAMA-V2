import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { OrderStatusActions } from '../../components/order-status-actions';
import { LiveSocket } from '../../components/live-socket';

export default async function OrdersPage() {
  const orders = (await crmFetch('/orders').catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-4"><LiveSocket /></div>
        <h2 className="mb-6 text-2xl font-semibold">Pedidos borrador</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-white">{order.customerName || order.phone}</h3>
                <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">{order.status}</span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-neutral-300">
                <p>• Teléfono: {order.phone}</p>
                <p>• Sucursal: {order.branch || '—'}</p>
                <p>• Servicio: {order.serviceType || '—'}</p>
                <p>• Pago: {order.paymentMethod || '—'}</p>
                {order.deliveryAddress ? <p>• Dirección: {order.deliveryAddress}</p> : null}
                {order.itemsSummary ? <p className="whitespace-pre-wrap">• Resumen: {order.itemsSummary}</p> : null}
              </div>
              <div className="mt-4">
                <OrderStatusActions id={order.id} path="/orders" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
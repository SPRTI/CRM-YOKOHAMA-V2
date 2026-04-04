import { Sidebar } from '../../components/sidebar';
import { crmFetch } from '../../lib/api';
import { LiveSocket } from '../../components/live-socket';
import { SectionCard } from '../../components/section-card';
import { UserCreateForm, UserTable } from '../../components/user-management';
import { requireRole } from '../../lib/auth';

export default async function UsersPage() {
  await requireRole(['admin']);
  const users = (await crmFetch('/auth/users').catch(() => [])) as any[];

  return (
    <div className="flex min-h-screen bg-black text-white">
      <Sidebar />
      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Usuarios CRM</h1>
            <p className="text-neutral-400">Administradores, supervisores y agentes.</p>
          </div>
          <LiveSocket />
        </div>
        <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <SectionCard title="Gestión de usuarios">
            <UserCreateForm />
          </SectionCard>
          <SectionCard title="Usuarios registrados">
            <UserTable users={users} />
          </SectionCard>
        </div>
      </main>
    </div>
  );
}

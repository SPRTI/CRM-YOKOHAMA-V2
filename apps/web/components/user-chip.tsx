import { getSessionUser } from '../lib/auth';

export async function UserChip() {
  const user = await getSessionUser();
  if (!user) return null;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-300">
      <p className="font-medium text-white">{user.fullName || user.email}</p>
      <p className="text-xs uppercase tracking-wide text-neutral-500">{user.role}</p>
    </div>
  );
}

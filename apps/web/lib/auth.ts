import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export type CrmRole = 'admin' | 'supervisor' | 'agent';
export type SessionUser = { id?: string; email?: string; fullName?: string; role?: CrmRole; isActive?: boolean } | null;

export async function getSessionUser(): Promise<SessionUser> {
  try {
    const store = await cookies();
    const raw = store.get('crm_user')?.value;
    if (!raw) return null;
    return JSON.parse(decodeURIComponent(raw));
  } catch {
    return null;
  }
}

export function canManageUsers(role?: string) {
  return role === 'admin';
}

export function canManageSettings(role?: string) {
  return role === 'admin' || role === 'supervisor';
}

export function canManageBlacklist(role?: string) {
  return role === 'admin' || role === 'supervisor';
}

export function canViewAudit(role?: string) {
  return role === 'admin' || role === 'supervisor';
}

export function canViewIntegrations(role?: string) {
  return role === 'admin' || role === 'supervisor';
}

export function canManageIncidents(role?: string) {
  return role === 'admin' || role === 'supervisor' || role === 'agent';
}

export function canReleaseTakeover(role?: string) {
  return role === 'admin' || role === 'supervisor';
}

export function canManageChatControls(role?: string) {
  return role === 'admin' || role === 'supervisor';
}

export async function requireRole(allowed: CrmRole[]) {
  const user = await getSessionUser();
  if (!user?.role || !allowed.includes(user.role)) {
    redirect('/dashboard');
  }
  return user;
}

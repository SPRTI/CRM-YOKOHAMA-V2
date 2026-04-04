import { cookies } from 'next/headers';

export const baseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011/api';

async function getServerToken() {
  const store = await cookies();
  return store.get('crm_token')?.value || '';
}

export async function crmFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getServerToken();
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  if (!res.ok) throw new Error(`CRM API ${res.status}: ${await res.text()}`);
  return res.json();
}

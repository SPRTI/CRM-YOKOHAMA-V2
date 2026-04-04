'use client';

const clientBaseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:3011/api';

function getClientToken() {
  if (typeof document === 'undefined') return '';
  return document.cookie.split('; ').find((v) => v.startsWith('crm_token='))?.split('=')[1] || '';
}

export async function crmRequest<T>(path: string, method: 'POST' | 'DELETE' | 'PATCH', body?: unknown): Promise<T> {
  const token = getClientToken();
  const res = await fetch(`${clientBaseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) throw new Error(`CRM API ${res.status}: ${await res.text()}`);
  return res.json();
}

export async function crmPost<T>(path: string, body?: unknown, method: 'POST' | 'DELETE' | 'PATCH' = 'POST'): Promise<T> {
  return crmRequest<T>(path, method, body);
}

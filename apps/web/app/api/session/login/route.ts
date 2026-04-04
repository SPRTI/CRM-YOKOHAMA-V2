import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3011/api';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) return NextResponse.json({ message: await res.text() }, { status: res.status });

  const data = await res.json();
  const next = NextResponse.json(data);
  next.cookies.set('crm_token', data.accessToken, { httpOnly: false, sameSite: 'lax', path: '/' });
  next.cookies.set('crm_user', encodeURIComponent(JSON.stringify(data.user)), { httpOnly: false, sameSite: 'lax', path: '/' });
  return next;
}

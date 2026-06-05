import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // simple check: cookie presence means logged in (cookie set by /api/admin/login)
  // @ts-ignore
  const cookieHeader = (req as any).headers?.get?.('cookie') || ''
  const match = cookieHeader.match(/elcasereno_admin=([^;]+)/)
  const token = match ? decodeURIComponent(match[1]) : null
  if (token) return NextResponse.json({ ok: true })
  return NextResponse.json({ ok: false }, { status: 401 })
}

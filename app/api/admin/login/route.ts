import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { user, pass } = await req.json()
    const ADMIN_USER = process.env.ADMIN_USER || 'admin'
    const ADMIN_PASS = process.env.ADMIN_PASS || ''
    if (!ADMIN_PASS) return NextResponse.json({ ok: false, error: 'ADMIN_PASS not configured' }, { status: 500 })

    if (user !== ADMIN_USER || pass !== ADMIN_PASS) return NextResponse.json({ ok: false, error: 'invalid' }, { status: 401 })

    const token = String(Date.now())

    const res = NextResponse.json({ ok: true })
    res.cookies.set('elcasereno_admin', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 })
    return res
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

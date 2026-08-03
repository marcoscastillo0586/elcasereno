import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_USER = process.env.ADMIN_USER || 'admin'
const ADMIN_PASS = process.env.ADMIN_PASS || ''

function unauthorized() {
  return new NextResponse('Unauthorized', {
    status: 401,
  })
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/api/admin/login' || pathname === '/api/admin/check' || pathname === '/api/admin/logout') {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (!pathname.startsWith('/api/admin')) {
    return NextResponse.next()
  }

  const cookie = req.cookies.get('elcasereno_admin')?.value
  if (cookie) return NextResponse.next()

  return unauthorized()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}

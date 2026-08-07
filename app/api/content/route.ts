import { NextResponse } from 'next/server'
import { readSiteContent } from '@/lib/siteContent'

export const runtime = 'nodejs'
// Sin esto, Next.js congela la respuesta en el build (la marca como estática)
// y nunca vuelve a leer data/site-content.json: los cambios guardados por el
// admin quedarían invisibles hasta el próximo "npm run build".
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  return NextResponse.json(readSiteContent(), {
    headers: { 'Cache-Control': 'no-store' },
  })
}

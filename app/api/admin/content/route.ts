import { NextResponse } from 'next/server'
import { readSiteContent, writeSiteContent, SiteContent } from '@/lib/siteContent'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const patch = await req.json() as Partial<SiteContent>
    const current = readSiteContent()

    if (patch.noticias && patch.noticias.length !== current.noticias.length) {
      return NextResponse.json({ ok: false, error: 'noticias_count_fixed' }, { status: 400 })
    }

    const updated: SiteContent = { ...current, ...patch }
    writeSiteContent(updated)
    return NextResponse.json({ ok: true, content: updated })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

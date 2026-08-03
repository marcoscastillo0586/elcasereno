import { NextResponse } from 'next/server'
import { readSiteContent } from '@/lib/siteContent'

export const runtime = 'nodejs'

export async function GET() {
  return NextResponse.json(readSiteContent())
}

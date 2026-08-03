import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { filePath } = await req.json()
    if (!filePath || typeof filePath !== 'string') {
      return NextResponse.json({ ok: false, error: 'No file path provided' }, { status: 400 })
    }

    const publicDir = path.join(process.cwd(), 'public')

    let relPath = filePath.trim()
    if (relPath.startsWith('/')) relPath = relPath.slice(1)

    let targetPath: string
    if (relPath.startsWith('images/') || relPath.startsWith('videos/')) {
      targetPath = path.join(publicDir, ...relPath.split('/'))
    } else {
      targetPath = path.join(publicDir, 'images', 'clientes', relPath)
    }

    const resolved = path.resolve(targetPath)
    if (!resolved.startsWith(publicDir)) {
      return NextResponse.json({ ok: false, error: 'Invalid path' }, { status: 403 })
    }

    let deleted = false
    if (fs.existsSync(resolved)) {
      fs.unlinkSync(resolved)
      deleted = true
    }

    const ext = path.extname(resolved)
    if (ext && ext !== '.webp') {
      const webpPath = resolved.slice(0, -ext.length) + '.webp'
      if (fs.existsSync(webpPath)) {
        try { fs.unlinkSync(webpPath) } catch { /* ignore */ }
      }
    }

    return NextResponse.json({ ok: true, deleted })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

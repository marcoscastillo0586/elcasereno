import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase() || '.bin'
  const base = path.basename(originalName, ext)
  const cleanBase = base
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return `${cleanBase || 'uploaded'}${ext}`
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const requestedTarget = formData.get('target') ? String(formData.get('target')) : undefined

    if (!file || typeof file === 'string') {
      return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 })
    }

    const publicImages = path.join(process.cwd(), 'public', 'images')
    const publicVideos = path.join(process.cwd(), 'public', 'videos')
    if (!fs.existsSync(publicImages)) fs.mkdirSync(publicImages, { recursive: true })
    if (!fs.existsSync(publicVideos)) fs.mkdirSync(publicVideos, { recursive: true })

    const original = file.name || 'uploaded'
    const ext = path.extname(original) || '.bin'
    const mime = (file.type || '').toLowerCase()
    const fileSize = file.size || 0

    const isImage = mime.startsWith('image') || ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext.toLowerCase())
    const isVideo = mime.startsWith('video') || ['.mp4', '.mov', '.webm', '.ogv'].includes(ext.toLowerCase())

    const MAX_IMAGE = 5 * 1024 * 1024 // 5MB
    const MAX_VIDEO = 50 * 1024 * 1024 // 50MB

    if (!isImage && !isVideo) {
      return NextResponse.json({
        ok: false,
        error: 'invalid_format',
        message: 'Formato no soportado. Formatos permitidos: PNG, JPG, JPEG, WEBP, GIF para imágenes (máx. 5 MB) y MP4, MOV, WEBM para videos (máx. 50 MB).'
      }, { status: 400 })
    }

    if (isImage && fileSize > MAX_IMAGE) {
      return NextResponse.json({
        ok: false,
        error: 'image_too_large',
        message: 'La imagen supera el tamaño máximo permitido (5 MB). Formatos permitidos: PNG, JPG, JPEG, WEBP, GIF.'
      }, { status: 413 })
    }
    if (isVideo && fileSize > MAX_VIDEO) {
      return NextResponse.json({
        ok: false,
        error: 'video_too_large',
        message: 'El video supera el tamaño máximo permitido (50 MB). Formatos permitidos: MP4, MOV, WEBM.'
      }, { status: 413 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    if (isImage) {
      const safeOriginalName = sanitizeFilename(file.name || 'uploaded')
      let relPath: string
      if (requestedTarget) {
        const stripped = requestedTarget.startsWith('images/') ? requestedTarget.slice('images/'.length) : requestedTarget
        const segments = stripped.split(/[/\\]/).map(s => path.basename(s)).filter(s => s && s !== '.' && s !== '..')
        let rel = segments.length > 0 ? segments.join('/') : ''
        const hasExtension = path.extname(rel) !== ''
        if (!hasExtension) {
          rel = rel ? `${rel}/${safeOriginalName}` : safeOriginalName
        }
        relPath = rel
      } else {
        relPath = safeOriginalName
      }

      let target = path.join(publicImages, ...relPath.split('/'))
      const targetDir = path.dirname(target)
      if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true })

      if (fs.existsSync(target) && requestedTarget && path.extname(requestedTarget) === '') {
        const fileExt = path.extname(target)
        const baseName = path.basename(target, fileExt)
        const newFilename = `${baseName}-${Date.now().toString().slice(-4)}${fileExt}`
        target = path.join(targetDir, newFilename)
        relPath = path.relative(publicImages, target).replace(/\\/g, '/')
      }

      fs.writeFileSync(target, buffer)
      return NextResponse.json({ ok: true, file: `/images/${relPath}` })
    }

    if (isVideo) {
      let filename: string
      if (requestedTarget) {
        if (requestedTarget === 'hero') {
          filename = `hero${ext}`
        } else {
          const base = path.basename(requestedTarget)
          filename = base || `hero-${Date.now()}${ext}`
        }
      } else {
        filename = `hero-${Date.now()}${ext}`
      }

      // remove previous hero.* files to avoid accumulation when overwriting hero
      try {
        const existing = fs.readdirSync(publicVideos)
        for (const f of existing) {
          if (f.startsWith('hero')) {
            try { fs.unlinkSync(path.join(publicVideos, f)) } catch { /* ignore */ }
          }
        }
      } catch (e) {
        // ignore
      }

      const target = path.join(publicVideos, filename)
      fs.writeFileSync(target, buffer)
      return NextResponse.json({ ok: true, file: `/videos/${filename}` })
    }

    const filename = `uploaded-${Date.now()}${ext}`
    const target = path.join(publicImages, filename)
    fs.writeFileSync(target, buffer)
    return NextResponse.json({ ok: true, file: `/images/${filename}` })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const form = formidable({ multiples: false })
  const publicImages = path.join(process.cwd(), 'public', 'images')
  const publicVideos = path.join(process.cwd(), 'public', 'videos')
  if (!fs.existsSync(publicImages)) fs.mkdirSync(publicImages, { recursive: true })
  if (!fs.existsSync(publicVideos)) fs.mkdirSync(publicVideos, { recursive: true })

  // parse multipart form in a promise
  const parsed = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) return reject(err)
      resolve({ fields, files })
    })
  })

  const { fields, files } = parsed
  const file = files?.file
  if (!file) {
    return NextResponse.json({ ok: false, error: 'No file uploaded' }, { status: 400 })
  }

  const tempPath = file.filepath || file.path || file.file
  const original = file.originalFilename || file.name || tempPath
  const ext = path.extname(original) || '.bin'
  const mime = (file.mimetype || '').toLowerCase()

  const isImage = mime.startsWith('image') || ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext.toLowerCase())
  const isVideo = mime.startsWith('video') || ['.mp4', '.mov', '.webm', '.ogv'].includes(ext.toLowerCase())

  try {
    const requestedTarget = (fields && fields.target) ? String(fields.target) : undefined

    const fileSize = Number(file.size) || 0
    const MAX_IMAGE = 5 * 1024 * 1024 // 5MB
    const MAX_VIDEO = 50 * 1024 * 1024 // 50MB

    if (isImage && fileSize > MAX_IMAGE) {
      return NextResponse.json({ ok: false, error: 'image_too_large' }, { status: 413 })
    }
    if (isVideo && fileSize > MAX_VIDEO) {
      return NextResponse.json({ ok: false, error: 'video_too_large' }, { status: 413 })
    }

    if (isImage) {
      let filename: string
      if (requestedTarget) {
        // sanitize provided target and disallow traversal
        const base = path.basename(requestedTarget)
        filename = base || `uploaded-${Date.now()}${ext}`
      } else {
        filename = `uploaded-${Date.now()}${ext}`
      }
      const target = path.join(publicImages, filename)
      fs.copyFileSync(tempPath, target)
      fs.chmodSync(target, 0o644)
      return NextResponse.json({ ok: true, file: `/images/${filename}` })
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
        // ignore errors reading directory
      }

      const target = path.join(publicVideos, filename)
      fs.copyFileSync(tempPath, target)
      fs.chmodSync(target, 0o644)
      return NextResponse.json({ ok: true, file: `/videos/${filename}` })
    }

    // fallback: save into images
    const filename = `uploaded-${Date.now()}${ext}`
    const target = path.join(publicImages, filename)
    fs.copyFileSync(tempPath, target)
    fs.chmodSync(target, 0o644)
    return NextResponse.json({ ok: true, file: `/images/${filename}` })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 })
  }
}

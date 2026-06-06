'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const upload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return setMsg('Seleccioná un archivo')
    setLoading(true)
    setMsg(null)
    const form = new FormData()
    form.append('video', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      const data = await res.json()
      if (data.ok) {
        setMsg('Video cargado: ' + data.file)
        // force reload hero video by appending timestamp
        const vid = document.getElementById('hero-video') as HTMLVideoElement | null
        if (vid) {
          vid.pause()
          vid.querySelectorAll('source').forEach(s => s.remove())
          const source = document.createElement('source')
          source.src = data.file + '?t=' + Date.now()
          source.type = 'video/mp4'
          vid.appendChild(source)
          vid.load()
          vid.play().catch(() => null)
        }
      } else {
        setMsg('Error: ' + (data.error || 'unknown'))
      }
    } catch (err: any) {
      setMsg('Error: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-[#111] border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Admin: Hero Video</h1>
        <p className="text-sm text-gray-400 mb-4">Cargá un nuevo video para el hero. El archivo reemplazará al actual hero.* en <code>/public/videos</code>.</p>
        <form onSubmit={upload} className="space-y-4">
          <input type="file" accept="video/*" onChange={(ev) => setFile(ev.target.files ? ev.target.files[0] : null)} />
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="bg-yellow-400 text-black px-4 py-2 rounded">{loading ? 'Cargando...' : 'Subir y aplicar'}</button>
          </div>
        </form>
        {msg && <p className="mt-4 text-sm">{msg}</p>}
        <div className="mt-6">
          <p className="text-xs text-gray-400 mb-2">Video actual (preview):</p>
          <video id="hero-preview" controls className="w-full bg-black rounded">
            <source src="/videos/hero.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  )
}

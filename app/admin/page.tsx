'use client'

import { useState, useEffect } from 'react'

function getYouTubeId(url: string): string | null {
  if (!url) return null
  const clean = url.trim()
  const match = clean.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/)
  if (match && match[2].length === 11) return match[2]
  if (clean.length === 11 && !clean.includes('/') && !clean.includes('.')) return clean
  return null
}

export default function AdminPage() {
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [videoId, setVideoId] = useState('iCbLZh_3MyA')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(j => {
      const saved = j?.heroVideoId
      if (saved) {
        setVideoId(saved)
        setYoutubeUrl(`https://youtube.com/shorts/${saved}`)
      } else {
        setYoutubeUrl('https://youtube.com/shorts/iCbLZh_3MyA')
      }
    }).catch(() => setYoutubeUrl('https://youtube.com/shorts/iCbLZh_3MyA'))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = getYouTubeId(youtubeUrl)
    if (!id) {
      setMsg('URL de YouTube no válida. Ingresá un enlace válido como: https://youtube.com/shorts/iCbLZh_3MyA')
      return
    }
    const resp = await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ heroVideoId: id }),
    })
    const data = await resp.json()
    if (!data.ok) {
      setMsg('No se pudo guardar: ' + (data.error || 'unknown'))
      return
    }
    setVideoId(id)
    window.dispatchEvent(new CustomEvent('casereno-hero-update', { detail: id }))
    setMsg('¡Video de portada actualizado exitosamente!')
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-[#111] border border-gray-800 rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4">Admin: Hero Video (YouTube)</h1>
        <p className="text-sm text-gray-400 mb-4">Ingresá la URL del video de YouTube o Short para la portada.</p>
        <form onSubmit={handleSave} className="space-y-4">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/shorts/..."
            className="w-full px-4 py-2 bg-[#222] border border-gray-700 rounded text-white text-sm focus:outline-none focus:border-yellow-400"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded text-sm font-semibold hover:bg-yellow-300 transition">
              Guardar video
            </button>
          </div>
        </form>
        {msg && <p className="mt-4 text-sm text-yellow-400">{msg}</p>}
        <div className="mt-6">
          <p className="text-xs text-gray-400 mb-2">Vista previa actual:</p>
          <iframe
            id="hero-preview"
            src={`https://www.youtube.com/embed/${videoId}?controls=1`}
            title="Hero Video Preview"
            className="w-full aspect-video bg-black rounded border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

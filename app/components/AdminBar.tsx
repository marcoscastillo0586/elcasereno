'use client'

import { useEffect, useState } from 'react'

export default function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/check').then(r => r.json()).then(j => {
      if (j && j.ok) setIsAdmin(true)
    }).catch(() => { })
  }, [])

  useEffect(() => {
    if (!isAdmin) return
    if (editMode) attachOverlays()
    else detachOverlays()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editMode, isAdmin])

  useEffect(() => {
    // Hide/show WhatsApp float when edit mode toggles
    const whatsappBtn = document.querySelector('a[href*="wa.me"]')
    if (whatsappBtn) {
      if (editMode) (whatsappBtn as HTMLElement).style.display = 'none'
      else (whatsappBtn as HTMLElement).style.display = ''
    }
  }, [editMode])

  function attachOverlays() {
    const targets: { el: Element; type: 'image' | 'video' }[] = []
    const hero = document.querySelector('#hero-video')
    if (hero) targets.push({ el: hero, type: 'video' })
    document.querySelectorAll('.cliente-logo, .admin-editable').forEach(el => targets.push({ el, type: 'image' }))

    targets.forEach(t => {
      const parent = t.el as HTMLElement
      parent.style.position = parent.style.position || 'relative'
      if (parent.querySelector('.admin-overlay-btn')) return
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'admin-overlay-btn'
      btn.title = 'Agregar / reemplazar media'
      btn.innerText = '+'
      btn.onclick = () => openFileDialog(t)
      Object.assign(btn.style, {
        position: 'absolute', right: '8px', top: '8px', zIndex: 60,
        width: '34px', height: '34px', borderRadius: '8px', background: '#111', color: '#facc15', border: '1px solid #333', fontSize: '20px', cursor: 'pointer'
      })
      parent.appendChild(btn)
    })
  }

  function detachOverlays() {
    document.querySelectorAll('.admin-overlay-btn').forEach(b => b.remove())
  }

  function openFileDialog(t: { el: Element; type: 'image' | 'video' }) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = t.type === 'video' ? 'video/*' : 'image/*'
    input.onchange = async () => {
      const file = input.files && input.files[0]
      if (!file) return
      const fd = new FormData()
      fd.append('file', file)
      // attach a target so server can overwrite known files
      if (t.type === 'video') {
        fd.append('target', 'hero')
      } else {
        const img = (t.el as HTMLElement).querySelector('img') as HTMLImageElement | null
        if (img && img.src && img.src.startsWith('/images/')) {
          const parts = img.src.split('/')
          const name = parts[parts.length - 1]
          fd.append('target', `images/${name}`)
        }
      }
      const resp = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await resp.json()
      if (data.ok && data.file) {
        if (t.type === 'image') {
          const img = (t.el as HTMLElement).querySelector('img') as HTMLImageElement | null
          if (img) img.src = data.file + '?t=' + Date.now()
        } else {
          const video = t.el as HTMLVideoElement
          // attempt to update source
          const firstSource = video.querySelector('source')
          if (firstSource) {
            (firstSource as HTMLSourceElement).src = data.file + '?t=' + Date.now()
            video.load()
            video.play().catch(() => null)
          } else {
            const source = document.createElement('source')
            source.src = data.file + '?t=' + Date.now()
            video.appendChild(source)
            video.load()
            video.play().catch(() => null)
          }
        }
      } else {
        alert('Upload failed: ' + (data.error || 'unknown'))
      }
    }
    input.click()
  }

  async function doLogin() {
    setShowLogin(true)
  }

  function dispatchAddLogo(src: string, name: string) {
    window.dispatchEvent(new CustomEvent('admin:addLogo', { detail: { src, name } }))
  }

  async function handleAddLogo() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files && input.files[0]
      if (!file) return
      const fd = new FormData()
      fd.append('file', file)
      const fileName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      const resp = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await resp.json()
      if (data.ok && data.file) {
        dispatchAddLogo(data.file, fileName || 'Nuevo cliente')
        setToast('Logo agregado')
        setTimeout(() => setToast(null), 3000)
      } else {
        alert('Upload failed: ' + (data.error || 'unknown'))
      }
    }
    input.click()
  }

  function getYouTubeId(url: string): string | null {
    if (!url) return null
    const clean = url.trim()
    const match = clean.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/)
    if (match && match[2].length === 11) return match[2]
    if (clean.length === 11 && !clean.includes('/') && !clean.includes('.')) return clean
    return null
  }

  function handleChangeHeroVideo() {
    const currentId = localStorage.getItem('casereno-hero-youtube-id') || 'iCbLZh_3MyA'
    const currentUrl = `https://youtube.com/shorts/${currentId}`
    const inputUrl = prompt('Ingresá la URL del video de YouTube para la portada:', currentUrl)
    if (!inputUrl) return

    const videoId = getYouTubeId(inputUrl)
    if (!videoId) {
      alert('URL de YouTube no válida. Ingresá un enlace válido como: https://youtube.com/shorts/iCbLZh_3MyA')
      return
    }

    localStorage.setItem('casereno-hero-youtube-id', videoId)
    window.dispatchEvent(new CustomEvent('casereno-hero-update', { detail: videoId }))

    const heroIframe = document.querySelector('#hero-video') as HTMLIFrameElement | null
    if (heroIframe) {
      heroIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`
    }

    setToast('Video de portada actualizado')
    setTimeout(() => setToast(null), 3000)
  }

  return (
    <>
      <div className="w-full flex items-center justify-between gap-4 py-2">
        <button
          onClick={isAdmin ? () => setEditMode(s => !s) : doLogin}
          title={isAdmin ? (editMode ? 'Desactivar edición' : 'Activar edición de medios') : 'Entrar como administrador'}
          className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border text-[10px] font-bold transition-all duration-200 ${isAdmin && editMode ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-[#1a1a1a] text-[#888] border-[#333] hover:text-white'}`}
          aria-label={isAdmin ? (editMode ? 'Desactivar edición' : 'Activar edición de medios') : 'Entrar como administrador'}
        >
          A
        </button>
        {isAdmin ? (
          <div className="flex items-center gap-2 text-xs">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  title="Desactivar edición"
                  className="text-[#888] border border-[#333] px-2 py-1 rounded-md text-xs transition-all hover:text-white hover:border-[#555]"
                >
                  Salir
                </button>
                <button onClick={handleAddLogo} title="Agregar nuevo logo" className="text-[#888] border border-[#333] px-2 py-1 rounded-md text-xs transition-all hover:text-white hover:border-[#555]">Logo</button>
                <button onClick={handleChangeHeroVideo} title="Cambiar video inicial" className="text-[#888] border border-[#333] px-2 py-1 rounded-md text-xs transition-all hover:text-white hover:border-[#555]">Video</button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {showLogin ? (
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: '80px', zIndex: 90, display: 'flex', justifyContent: 'center' }}>
          <div className="bg-white rounded-lg p-4 shadow-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-2">Login admin</h3>
            <div className="flex flex-col gap-2">
              <input value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="Usuario" className="px-3 py-2 border rounded" />
              <input value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Contraseña" type="password" className="px-3 py-2 border rounded" />
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowLogin(false)} className="px-3 py-1 rounded border">Cancelar</button>
                <button onClick={async () => {
                  try {
                    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user: loginUser, pass: loginPass }) })
                    const j = await res.json()
                    if (j && j.ok) {
                      setIsAdmin(true)
                      setEditMode(true)
                      attachOverlays()
                      setShowLogin(false)
                      setToast('Ingreso exitoso')
                      setTimeout(() => setToast(null), 3000)
                    } else {
                      alert('Login falló')
                    }
                  } catch (e) { alert('Error en login') }
                }} className="px-3 py-1 rounded bg-yellow-400 text-black">Entrar</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {toast ? (
        <div style={{ position: 'fixed', right: 16, bottom: 88, zIndex: 100 }} className="bg-black/90 text-white px-4 py-2 rounded-md shadow">{toast}</div>
      ) : null}
    </>
  )
}

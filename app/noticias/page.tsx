'use client'

import { useState, useEffect } from 'react'
import { Menu, X, ArrowLeft, Calendar, Tag, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import AdminBar from '../components/AdminBar'

type Noticia = {
  id: number
  fecha: string
  categoria: string
  titulo: string
  resumen: string
  imagen: string
}

const defaultNoticias: Noticia[] = [
  {
    id: 1,
    fecha: '2025-06-01',
    categoria: 'Flota',
    titulo: 'Incorporamos 5 nuevas unidades a nuestra flota',
    resumen: 'Seguimos creciendo. Sumamos 5 nuevas unidades S-WAY con equipo de frío Carrier de última generación, reforzando nuestra capacidad operativa en todo el país.',
    imagen: '/images/casereno-flota.png',
  },
  {
    id: 2,
    fecha: '2025-05-15',
    categoria: 'Operaciones',
    titulo: 'Nueva sede operativa en Ezeiza, Buenos Aires',
    resumen: 'Inauguramos nuestra sucursal en Ezeiza para fortalecer la cobertura en el área metropolitana y el sur del país.',
    imagen: '/images/casereno-bandera.jpg.jpeg',
  },
  {
    id: 3,
    fecha: '2025-04-10',
    categoria: 'Empresa',
    titulo: 'Centro de distribución en Riachuelo, Corrientes',
    resumen: 'Nuestro nuevo centro logístico en Riachuelo nos permite optimizar los tiempos de carga y descarga para toda la región del litoral.',
    imagen: '/images/casereno-flota.png',
  },
]

// Color fijo por posición de la novedad (1ª, 2ª, 3ª), no por el texto de la
// categoría — así el admin puede escribir cualquier categoría sin que la
// etiqueta se quede gris.
const categoriaColorByPosition = [
  'bg-yellow-400/15 text-yellow-600 border border-yellow-400/30',
  'bg-blue-400/15 text-blue-600 border border-blue-400/30',
  'bg-green-400/15 text-green-600 border border-green-400/30',
]

function formatFecha(fecha: string) {
  const parsed = new Date(fecha)
  if (isNaN(parsed.getTime())) return fecha
  return parsed.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Noticias() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [noticias, setNoticias] = useState<Noticia[]>(defaultNoticias)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('casereno-theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('casereno-theme', theme)
  }, [theme])

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(j => {
      if (j?.noticias) setNoticias(j.noticias)
    }).catch(() => { /* keep hardcoded defaults */ })

    fetch('/api/admin/check').then(r => r.json()).then(j => { if (j?.ok) setIsAdmin(true) }).catch(() => { })

    const onMode = (e: Event) => {
      const detail = (e as CustomEvent).detail as { isAdmin?: boolean; editMode?: boolean }
      if (typeof detail?.isAdmin === 'boolean') setIsAdmin(detail.isAdmin)
      if (typeof detail?.editMode === 'boolean') setEditMode(detail.editMode)
    }
    window.addEventListener('casereno-admin-editmode', onMode)

    const onPhotoUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail as { id: number; url: string }
      if (!detail?.id || !detail?.url) return
      setNoticias(prev => {
        const next = prev.map(n => n.id === detail.id ? { ...n, imagen: detail.url } : n)
        persist(next)
        return next
      })
    }
    window.addEventListener('casereno-noticia-photo-update', onPhotoUpdate)

    return () => {
      window.removeEventListener('casereno-admin-editmode', onMode)
      window.removeEventListener('casereno-noticia-photo-update', onPhotoUpdate)
    }
  }, [])

  function persist(list: Noticia[]) {
    fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ noticias: list }),
    }).then(res => {
      if (!res.ok) {
        alert(res.status === 401
          ? 'Tu sesión de administrador venció. Volvé a iniciar sesión y repetí el cambio.'
          : 'No se pudo guardar el cambio en el servidor. Probá de nuevo en unos segundos.')
      }
    }).catch(() => {
      alert('No se pudo guardar el cambio: revisá tu conexión a internet.')
    })
  }

  function updateNoticia(id: number, patch: Partial<Noticia>) {
    setNoticias(prev => {
      const next = prev.map(n => n.id === id ? { ...n, ...patch } : n)
      persist(next)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">

      {/* NAV */}
      <nav className="bg-black/92 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-yellow-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[68px]">
            <div className="flex items-center gap-4">
              <img
                src={theme === 'light' ? '/images/logos/casereno.png' : '/images/logos/caserenoBlancoCorriente.png'}
                alt="El Casereño Logo"
                className="h-10 w-auto"
              />
            </div>
            <div className="hidden md:flex items-baseline gap-8">
              <Link href="/" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200 flex items-center gap-1.5">
                <ArrowLeft size={14} />
                Volver al inicio
              </Link>
              <Link href="/#nosotros" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200">Nosotros</Link>
              <Link href="/#diferencial" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200">Servicios</Link>
              <Link href="/#contacto" className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200">Contacto</Link>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 p-1.5 rounded-md" title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Link href="/#contacto" className="bg-yellow-400 text-black text-sm font-medium px-5 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200">
                Contactanos
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-2">
              <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 p-1.5">
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-yellow-400 focus:outline-none">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-yellow-400 flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium">
              <ArrowLeft size={14} /> Volver al inicio
            </Link>
            <Link href="/#nosotros" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Nosotros</Link>
            <Link href="/#diferencial" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Servicios</Link>
            <Link href="/#contacto" onClick={() => setIsMenuOpen(false)} className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">Contacto</Link>
          </div>
        )}
      </nav>

      {/* HEADER */}
      <div className="bg-[#161616] border-b border-[#2a2a2a] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">Novedades</h1>
          <p className="text-[#666] text-base mt-3 max-w-xl">Todo lo nuevo que pasa en El Casereño: nuevas unidades, sedes, actividades y más.</p>
        </div>
      </div>

      {/* NOTICIAS */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map((noticia, index) => (
            <article key={noticia.id} className="relative bg-[#1e1e1e] rounded-2xl border border-white/7 overflow-hidden hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300">
              <div className="admin-editable relative h-48 overflow-hidden" data-noticia-id={noticia.id}>
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                {editMode && isAdmin ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        value={noticia.categoria}
                        onChange={e => updateNoticia(noticia.id, { categoria: e.target.value })}
                        placeholder="Categoría"
                        className="w-1/2 bg-[#111] border border-gray-700 rounded px-2 py-1 text-xs text-[#ffffff] focus:outline-none focus:border-yellow-400"
                      />
                      <input
                        type="date"
                        value={noticia.fecha}
                        onChange={e => updateNoticia(noticia.id, { fecha: e.target.value })}
                        className="w-1/2 bg-[#111] border border-gray-700 rounded px-2 py-1 text-xs text-[#ffffff] focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                    <input
                      value={noticia.titulo}
                      onChange={e => updateNoticia(noticia.id, { titulo: e.target.value })}
                      placeholder="Título"
                      className="w-full bg-[#111] border border-gray-700 rounded px-2 py-1.5 text-sm font-bold text-[#ffffff] focus:outline-none focus:border-yellow-400"
                    />
                    <textarea
                      value={noticia.resumen}
                      onChange={e => updateNoticia(noticia.id, { resumen: e.target.value })}
                      placeholder="Información / resumen"
                      rows={3}
                      className="w-full bg-[#111] border border-gray-700 rounded px-2 py-1.5 text-sm text-[#ffffff] resize-none focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${categoriaColorByPosition[index % categoriaColorByPosition.length]}`}>
                        <Tag size={9} className="inline mr-1" />{noticia.categoria}
                      </span>
                      <span className="text-[#999] text-[11px] flex items-center gap-1">
                        <Calendar size={10} />
                        {formatFecha(noticia.fecha)}
                      </span>
                    </div>
                    <h2 className="text-white font-bold text-base leading-snug mb-2">{noticia.titulo}</h2>
                    <p className="text-[#666] text-sm leading-relaxed">{noticia.resumen}</p>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#2a1f0e] border-t border-[#5a3618] py-8 px-8 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 text-center">
          <img src="/images/logos/grupojlg.png" alt="Grupo JLG" className="h-8 w-auto" />
          <Link href="/" className="text-[#c9a882] text-sm hover:text-[#f5c422] transition-colors flex items-center gap-1.5">
            <ArrowLeft size={13} /> Volver al sitio principal
          </Link>
          <span className="text-[#c9a882] text-xs">© {new Date().getFullYear()} Transporte El Casereño S.A. Todos los derechos reservados</span>
          <AdminBar />
        </div>
      </footer>

    </div>
  )
}

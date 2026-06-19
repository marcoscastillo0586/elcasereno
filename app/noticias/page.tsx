'use client'

import { useState } from 'react'
import { Menu, X, ArrowLeft, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

const noticias = [
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

const categoriaColor: Record<string, string> = {
  Flota: 'bg-yellow-400/15 text-yellow-600 border border-yellow-400/30',
  Operaciones: 'bg-blue-400/15 text-blue-600 border border-blue-400/30',
  Empresa: 'bg-green-400/15 text-green-600 border border-green-400/30',
}

function formatFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Noticias() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f5f5f5]">

      {/* NAV */}
      <nav className="bg-black/92 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-yellow-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[68px]">
            <div className="flex items-center gap-4">
              <img src="/images/logo.png" alt="El Casereño Logo" className="h-9 w-auto scale-[2.05]" />
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
              <Link href="/#contacto" className="bg-yellow-400 text-black text-sm font-medium px-5 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200">
                Contactanos
              </Link>
            </div>
            <div className="md:hidden">
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
      <div className="bg-white border-b border-[#e8e8e8] py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-600 mb-2">Novedades</p>
          <h1 className="text-4xl md:text-5xl font-black text-[#111] tracking-tight leading-tight">Últimas noticias</h1>
          <p className="text-[#666] text-base mt-3 max-w-xl">Todo lo nuevo que pasa en El Casereño: nuevas unidades, sedes, actividades y más.</p>
        </div>
      </div>

      {/* NOTICIAS */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticias.map(noticia => (
            <article key={noticia.id} className="bg-white rounded-2xl border border-[#e8e8e8] overflow-hidden hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 overflow-hidden">
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${categoriaColor[noticia.categoria]}`}>
                    <Tag size={9} className="inline mr-1" />{noticia.categoria}
                  </span>
                  <span className="text-[#999] text-[11px] flex items-center gap-1">
                    <Calendar size={10} />
                    {formatFecha(noticia.fecha)}
                  </span>
                </div>
                <h2 className="text-[#111] font-bold text-base leading-snug mb-2">{noticia.titulo}</h2>
                <p className="text-[#666] text-sm leading-relaxed">{noticia.resumen}</p>
              </div>
            </article>
          ))}
        </div>

        {noticias.length === 0 && (
          <div className="text-center py-24">
            <p className="text-[#999] text-lg">No hay noticias por el momento.</p>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-[#2a1f0e] border-t border-[#5a3618] py-8 px-8 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-3 text-center">
          <img src="/images/logos/grupojlg.png" alt="Grupo JLG" className="h-8 w-auto" />
          <Link href="/" className="text-[#c9a882] text-sm hover:text-[#f5c422] transition-colors flex items-center gap-1.5">
            <ArrowLeft size={13} /> Volver al sitio principal
          </Link>
          <span className="text-[#c9a882] text-xs">© {new Date().getFullYear()} Transporte El Casereño S.A. Todos los derechos reservados</span>
        </div>
      </footer>

    </div>
  )
}

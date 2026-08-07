'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, X, CheckCircle, Thermometer, Globe, Shield, Clock, Users, Star, Sun, Moon, Camera, MapPin } from 'lucide-react'
import MapArgentina from './components/MapArgentina'
import AdminBar from './components/AdminBar'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const statsRef = useRef<HTMLDivElement>(null)
  const [counters, setCounters] = useState({ units: 0, years: 0, offices: 0, countries: 0 })
  const [theme, setTheme] = useState<'dark' | 'light'>('light')
  const [selectedItem, setSelectedItem] = useState<{ year: string; title: string; desc: string; photos?: string[] } | null>(null)
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0)
  const autoTimelineRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [heroVideoId, setHeroVideoId] = useState('iCbLZh_3MyA')
  const timelineContainerRef = useRef<HTMLDivElement>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    fetch('/api/admin/check').then(r => r.json()).then(j => {
      if (j?.ok) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
        setEditMode(false)
      }
    }).catch(() => {
      setIsAdmin(false)
      setEditMode(false)
    })
    const onMode = (e: Event) => {
      const detail = (e as CustomEvent).detail as { isAdmin?: boolean; editMode?: boolean }
      if (typeof detail?.isAdmin === 'boolean') setIsAdmin(detail.isAdmin)
      if (typeof detail?.editMode === 'boolean') setEditMode(detail.editMode)
    }
    window.addEventListener('casereno-admin-editmode', onMode)
    return () => window.removeEventListener('casereno-admin-editmode', onMode)
  }, [])

  function persistContent(patch: Partial<{ heroVideoId: string; clientLogos: { src: string; name: string }[]; timelinePhotos: Record<string, string[]>; historiaGallery: string[] }>) {
    fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
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

  useEffect(() => {
    const saved = localStorage.getItem('casereno-theme') as 'dark' | 'light' | null
    if (saved) setTheme(saved)

    const handleUpdate = (e: Event) => {
      const customEv = e as CustomEvent
      if (customEv.detail) setHeroVideoId(customEv.detail)
    }
    window.addEventListener('casereno-hero-update', handleUpdate)
    return () => window.removeEventListener('casereno-hero-update', handleUpdate)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('casereno-theme', theme)
  }, [theme])

  useEffect(() => {
    const check = () => {
      itemRefs.current.forEach((ref, index) => {
        if (!ref || visibleItems.has(index)) return
        const rect = ref.getBoundingClientRect()
        if (rect.top < window.innerHeight - 60) {
          setVisibleItems(prev => new Set(Array.from(prev).concat(index)))
        }
      })
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [visibleItems])

  useEffect(() => {
    const targets = { units: 55, years: 19, offices: 3, countries: 6 }
    let animTimer: ReturnType<typeof setInterval>
    let loopTimer: ReturnType<typeof setInterval>

    const runAnimation = () => {
      setCounters({ units: 0, years: 0, offices: 0, countries: 0 })
      const steps = 60
      const intervalMs = 2000 / steps
      let step = 0
      clearInterval(animTimer)
      animTimer = setInterval(() => {
        step++
        const p = step / steps
        const ease = 1 - Math.pow(1 - p, 3)
        setCounters({
          units: Math.round(targets.units * ease),
          years: Math.round(targets.years * ease),
          offices: Math.round(targets.offices * ease),
          countries: Math.round(targets.countries * ease),
        })
        if (step >= steps) clearInterval(animTimer)
      }, intervalMs)
    }

    runAnimation()
    loopTimer = setInterval(runAnimation, 9000)
    return () => { clearInterval(animTimer); clearInterval(loopTimer) }
  }, [])

  useEffect(() => {
    if (!selectedItem) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedItem(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selectedItem])

  const startAutoTimeline = () => {
    if (autoTimelineRef.current) clearInterval(autoTimelineRef.current)
    autoTimelineRef.current = setInterval(() => {
      setActiveTimelineIndex(prev => (prev + 1) % timeline.length)
    }, 4500)
  }

  useEffect(() => {
    startAutoTimeline()
    return () => { if (autoTimelineRef.current) clearInterval(autoTimelineRef.current) }
  }, [])

  useEffect(() => {
    const container = timelineContainerRef.current
    const activeEl = itemRefs.current[activeTimelineIndex]
    if (!container || !activeEl) return
    const containerRect = container.getBoundingClientRect()
    const elRect = activeEl.getBoundingClientRect()
    const scrollOffset = elRect.left - containerRect.left - containerRect.width / 2 + elRect.width / 2
    container.scrollBy({ left: scrollOffset, behavior: 'smooth' })
  }, [activeTimelineIndex])

  const handleTimelineClick = (index: number) => {
    setActiveTimelineIndex(index)
    startAutoTimeline()
  }

  const features = [
    "19 años de experiencia",
    "Cobertura nacional e internacional",
    "Más de 55 unidades térmicas Carrier",
    "Seguro de carga completo",
    "Empresa familiar con compromiso",
    "Atención personalizada",
    "Documentación internacional vigente",
  ]

  const timeline = [
    { year: '1983', title: 'Grupo JLG', desc: 'Fundación del Autoservicio y Supermercado por José Luis Gorbeña y Verónica Roverano', photos: ['https://picsum.photos/seed/jlg83a/600/400', 'https://picsum.photos/seed/jlg83b/600/400'] },
    { year: '2006', title: 'Primeros camiones', desc: 'Foco en distribución de arándanos con 2 camiones desde Concordia', photos: ['https://picsum.photos/seed/cas06a/600/400', 'https://picsum.photos/seed/cas06b/600/400'] },
    { year: '2007', title: 'Nace El Casereño', desc: 'Fundación formal de Transporte El Casereño S.A. con 4 unidades en Monte Caseros', photos: ['/images/casereno-bandera.jpg.jpeg', 'https://picsum.photos/seed/cas07b/600/400'] },
    { year: '2009', title: 'Expansión Brasil', desc: 'Inicio de operaciones de logística internacional con Brasil', photos: ['https://picsum.photos/seed/cas09a/600/400', 'https://picsum.photos/seed/cas09b/600/400'] },
    { year: '2012', title: 'Región ampliada', desc: 'Expansión a Uruguay, Chile y Paraguay. Fortalecimiento logística nacional', photos: ['https://picsum.photos/seed/cas12a/600/400', 'https://picsum.photos/seed/cas12b/600/400'] },
    { year: '2017', title: '+30 unidades', desc: 'Crecimiento sostenido de la flota a más de 30 unidades', photos: ['/images/casereno-flota.png', 'https://picsum.photos/seed/cas17b/600/400'] },
    { year: '2023', title: 'Nueva sede central', desc: 'Inauguración de la nueva casa central en Monte Caseros, Corrientes', photos: ['https://picsum.photos/seed/cas23a/600/400', 'https://picsum.photos/seed/cas23b/600/400'] },
    { year: '2024', title: '+55 unidades', desc: 'Flota de más de 55 unidades modernas con equipo frío Carrier', photos: ['/images/casereno-flota.png', '/images/casereno-bandera.jpg.jpeg'] },
    { year: '2025', title: 'Seguimos creciendo', desc: 'Nuevo centro de distribución en Riachuelo y sede en Ezeiza, Buenos Aires', photos: ['https://picsum.photos/seed/cas25a/600/400', 'https://picsum.photos/seed/cas25b/600/400'] },
  ]

  const [timelinePhotoOverrides, setTimelinePhotoOverrides] = useState<Record<string, string[]>>({})
  const [clientLogos, setClientLogos] = useState([
    { src: 'puro-sol.png', name: 'PuroSol' },
    { src: 'surfrigo.png', name: 'Surfrigo' },
  ])
  const [historiaGallery, setHistoriaGallery] = useState<string[]>([
    '/images/casereno1.png',
    '/images/casereno2.png',
    '/images/casereno3.png',
    '/images/casereno5.png',
  ])
  const [galleryLightbox, setGalleryLightbox] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(j => {
      if (j?.heroVideoId) setHeroVideoId(j.heroVideoId)
      if (j?.timelinePhotos) setTimelinePhotoOverrides(j.timelinePhotos)
      if (j?.clientLogos) setClientLogos(j.clientLogos)
      if (j?.historiaGallery) setHistoriaGallery(j.historiaGallery)
    }).catch(() => { /* keep hardcoded defaults */ })
  }, [])

  useEffect(() => {
    const onHistoriaPhotoUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail as { index: number; url: string }
      if (detail?.index == null || !detail?.url) return
      setHistoriaGallery(prev => {
        const next = prev.map((src, i) => i === detail.index ? detail.url : src)
        persistContent({ historiaGallery: next })
        return next
      })
    }
    window.addEventListener('casereno-historia-photo-update', onHistoriaPhotoUpdate)
    return () => window.removeEventListener('casereno-historia-photo-update', onHistoriaPhotoUpdate)
  }, [])

  function updateClientLogoName(index: number, name: string) {
    setClientLogos(prev => {
      const next = prev.map((l, i) => i === index ? { ...l, name } : l)
      persistContent({ clientLogos: next })
      return next
    })
  }

  function deleteClientLogo(index: number) {
    if (!confirm('¿Eliminar este logo de cliente?')) return
    const logoToDelete = clientLogos[index]
    if (logoToDelete && logoToDelete.src) {
      fetch('/api/admin/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filePath: logoToDelete.src }),
      }).catch(() => { /* ignore deletion error */ })
    }
    setClientLogos(prev => {
      const next = prev.filter((_, i) => i !== index)
      persistContent({ clientLogos: next })
      return next
    })
  }

  useEffect(() => {
    const onPhotoUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail as { year: string; index: number; url: string }
      if (!detail?.year || detail.index == null || !detail.url) return
      setTimelinePhotoOverrides(prev => {
        const base = prev[detail.year] || timeline.find(t => t.year === detail.year)?.photos || []
        const next = [...base]
        next[detail.index] = detail.url
        const updated = { ...prev, [detail.year]: next }
        persistContent({ timelinePhotos: updated })
        return updated
      })
    }
    window.addEventListener('casereno-timeline-photo-update', onPhotoUpdate)

    const onAddLogo = (event: Event) => {
      const detail = (event as CustomEvent).detail as { src: string; name?: string }
      if (!detail?.src) return
      const src = detail.src
      const name = detail.name || detail.src.split('/').pop()?.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ') || 'Nuevo cliente'
      setClientLogos(prev => {
        const next = [...prev, { src, name }]
        persistContent({ clientLogos: next })
        return next
      })
    }
    window.addEventListener('admin:addLogo', onAddLogo as EventListener)

    const onLogoPhotoUpdate = (event: Event) => {
      const detail = (event as CustomEvent).detail as { index: number; url: string }
      if (detail?.index == null || !detail?.url) return
      setClientLogos(prev => {
        const next = prev.map((l, i) => i === detail.index ? { ...l, src: detail.url } : l)
        persistContent({ clientLogos: next })
        return next
      })
    }
    window.addEventListener('casereno-logo-photo-update', onLogoPhotoUpdate)

    return () => {
      window.removeEventListener('casereno-timeline-photo-update', onPhotoUpdate)
      window.removeEventListener('admin:addLogo', onAddLogo as EventListener)
      window.removeEventListener('casereno-logo-photo-update', onLogoPhotoUpdate)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const diferencial = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      title: 'Flotas refrigeradas',
      desc: '+55 unidades con equipos de frío Carrier de nueva generación. Temperatura controlada garantizada en cada viaje.',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Amplia cobertura',
      desc: 'Argentina, Brasil, Uruguay, Chile, Paraguay y Bolivia. Foco especial en centro y norte del país con cargas diarias.',
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Documentación al día',
      desc: 'Todas las unidades con mantenimiento constante y documentación nacional e internacional actualizada.',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Cargas diarias',
      desc: 'Modalidad punto a punto o reparticiones. Servicio continuo con alta disponibilidad de unidades.',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Empresa familiar',
      desc: 'Creemos en la palabra y las relaciones a largo plazo. Atención personalizada desde el primer contacto.',
    },
    {
      icon: <Star className="w-5 h-5" />,
      title: '+19 años de trayectoria',
      desc: 'Seriedad, honestidad y responsabilidad desde el primer día. Más de 40 clientes activos en todo el país.',
    },
  ]

  const tiposUnidades = [
    { title: 'Tractores', img: '/images/flota/tractores.jpg' },
    { title: 'Semiremolques Térmicos', img: '/images/flota/semiremolques-termicos.jpg' },
    { title: 'Chasis / Acoplados', img: '/images/flota/chasis-acoplados.jpg' },
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d] overflow-x-hidden w-full max-w-full">

      {/* NAV */}
      <nav className="bg-black/92 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-yellow-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[68px]">
            <a href="#" className="flex items-center">
              <img
                src={theme === 'light' ? '/images/logos/casereno.png' : '/images/logos/caserenoBlancoCorriente.png'}
                alt="El Casereño Logo"
                className="h-10 w-auto"
              />
            </a>
            <div className="hidden md:flex items-baseline gap-8">
              {[['#nosotros', 'Nosotros'], ['#diferencial', 'Servicios'], ['#flota', 'Flota'], ['#sedes', 'Sedes'], ['#clientes', 'Clientes'], ['/noticias', 'Novedades'], ['#trabajá', 'Trabajá con nosotros']].map(([href, label]) => (
                <a key={href} href={href} className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200">{label}</a>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 p-1.5 rounded-md" title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a href="#contacto" className="bg-yellow-400 text-black text-sm font-medium px-5 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200">Contactanos</a>
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
            {[['#nosotros', 'Nosotros'], ['#diferencial', 'Servicios'], ['#flota', 'Flota'], ['#sedes', 'Sedes'], ['#clientes', 'Clientes'], ['/noticias', 'Novedades'], ['#trabajá', 'Trabajá con nosotros']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">{label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="inicio" className="relative min-h-screen text-white flex flex-col">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            id="hero-video"
            src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&loop=1&playlist=${heroVideoId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`}
            title="Hero Video"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] max-w-none border-0 pointer-events-none"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>

        <div className="relative flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-24">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <h1 className="sr-only">Transporte El Casereño S.A. — Transporte de cargas nacional e internacional en Monte Caseros, Corrientes</h1>
              <img
                src="/images/logos/caserenoBlanco.png"
                alt="Transporte El Casereño"
                className="mb-6 w-[95vw] max-w-[1200px] h-auto drop-shadow-2xl"
              />
              <div className="inline-flex items-center gap-2 bg-yellow-400/12 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                <span className="text-yellow-400 text-xs font-medium tracking-wide">Monte Caseros, Corrientes · Argentina</span>
              </div>
              <p className="font-balloon text-gray-300 text-base md:text-lg mb-10 leading-relaxed">
                Transporte Nacional e Internacional.<br />
                Conectando destinos con confianza y responsabilidad.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <a href="#contacto">
                  <button className="bg-yellow-400 text-black px-8 py-3.5 rounded-lg font-bold text-base hover:bg-yellow-300 transition-all duration-200 hover:scale-105">
                    Contactanos
                  </button>
                </a>
                <a href="#nosotros">
                  <button className="border border-white/25 text-white px-8 py-3.5 rounded-lg font-bold text-base hover:border-yellow-400 hover:text-yellow-400 transition-all duration-200">
                    Conocé la empresa
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div ref={statsRef} className="relative border-t border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-5">
            <div className="grid grid-cols-2 sm:grid-cols-4">
              {[
                { value: counters.units, prefix: '+', label: 'Unidades activas' },
                { value: counters.years, prefix: '', label: 'Años de experiencia' },
                { value: counters.countries, prefix: '', label: 'Países de cobertura' },
                { value: counters.offices, prefix: '', label: 'Sedes operativas' },
              ].map((stat, i) => (
                <div key={i} className="px-6 py-2 text-center border-r border-white/10 last:border-r-0 [&:nth-child(2)]:border-r-0 sm:[&:nth-child(2)]:border-r">
                  <span className="text-yellow-400 text-3xl font-black block leading-none tabular-nums">{stat.prefix}{stat.value}</span>
                  <span className="text-gray-400 text-xs mt-1 block">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FRANJA AMARILLA */}
      <div className="bg-yellow-400 py-4 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-start sm:justify-center gap-x-10 gap-y-2">
          {[
            'Transporte temperatura controlada',
            'Cobertura nacional e internacional',
            'Cargas diarias punto a punto',
            'Equipos Carrier nueva generación',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium text-black">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* NOSOTROS */}
      <section id="nosotros" className="py-24 bg-[#161616]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-400 mb-2">Quiénes somos</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Una historia de familia<br />y camino
            </h2>
            <div className="flex flex-wrap gap-3 mt-6">
              {['Seriedad', 'Honestidad', 'Responsabilidad'].map(valor => (
                <span key={valor} className="border border-yellow-400/40 text-yellow-400 text-xs font-medium px-4 py-1.5 rounded-full tracking-widest hover:bg-yellow-400/10 hover:border-yellow-400 transition-all duration-300 cursor-default">
                  {valor}
                </span>
              ))}
            </div>
          </div>

          {/* Timeline horizontal */}
          <div ref={timelineContainerRef} className="mb-14 overflow-x-auto timeline-scroll bg-[#111111] rounded-2xl px-4 py-6 border border-white/5">
            <div className="relative flex min-w-[680px]">
              <div className="timeline-line absolute left-0 right-0 h-px bg-yellow-400/20" style={{ top: '38px' }}></div>
              <div className="timeline-scanner absolute left-0 right-0 h-px" style={{ top: '38px' }}></div>
              {timeline.map((item, index) => {
                const isVisible = visibleItems.has(index)
                const isActive = activeTimelineIndex === index
                return (
                  <div key={index} ref={el => { itemRefs.current[index] = el }} className="flex-1 flex flex-col items-center px-1.5">
                    <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-10px)', transition: 'opacity 0.5s ease, transform 0.5s ease', transitionDelay: `${index * 70}ms` }} className="h-7 flex items-center mb-1">
                      <span style={{ color: isActive ? '#F5C422' : '#92600a' }} className="font-black text-xs sm:text-sm transition-colors duration-300">{item.year}</span>
                    </div>
                    <div className="relative z-10 mb-3 w-3 h-3">
                      {isActive && <div className="absolute inset-0 rounded-full bg-yellow-400/60 animate-ping" />}
                      {isVisible && !isActive && <div className="absolute inset-0 rounded-full bg-yellow-400/50 timeline-dot-seq-ring" style={{ animationDelay: `${index * 600}ms` }} />}
                      <div style={{
                        transition: 'transform 0.4s ease, box-shadow 0.4s ease',
                        transitionDelay: `${index * 70}ms`,
                        transform: isVisible ? (isActive ? 'scale(1.4)' : 'scale(1)') : 'scale(0.2)',
                        boxShadow: isActive ? '0 0 20px rgba(250,204,21,1)' : isVisible ? '0 0 8px rgba(250,204,21,0.4)' : 'none'
                      }} className={`w-3 h-3 rounded-full border-2 border-yellow-400 ${isVisible ? 'bg-yellow-400' : 'bg-[#161616]'}`} />
                    </div>
                    <div
                      onClick={() => handleTimelineClick(index)}
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? (isActive ? 'translateY(0) scale(1.05)' : 'translateY(0) scale(1)') : 'translateY(22px) scale(0.95)',
                        transition: 'opacity 0.6s ease, transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease, background-color 0.4s ease',
                        transitionDelay: isActive ? '0ms' : `${index * 70 + 100}ms`,
                        boxShadow: isActive ? '0 8px 32px rgba(250,204,21,0.25)' : 'none',
                        borderColor: isActive ? 'rgba(250,204,21,0.7)' : undefined,
                        backgroundColor: isActive ? '#1a1200' : '#ffffff',
                        zIndex: isActive ? 10 : undefined,
                      }}
                      className={`timeline-card ${isActive ? 'timeline-card-active' : 'timeline-card-inactive'} bg-[#1e1e1e] border border-gray-800 rounded-xl p-2.5 w-full cursor-pointer relative`}
                    >
                      <h3 style={{ color: isActive ? '#ffffff' : '#333333' }} className="font-bold text-xs leading-tight transition-colors duration-300">{item.title}</h3>
                      <p style={{ color: isActive ? '#cccccc' : '#666666' }} className={`text-xs mt-1 leading-relaxed transition-colors duration-300 ${isActive ? '' : 'line-clamp-2'}`}>{item.desc}</p>
                      {/* "Ver fotos" deshabilitado a pedido del cliente: todavía no cuenta con las fotos
                          de cada hito. Descomentar cuando estén disponibles para reactivar el modal.
                      <div
                        className="flex items-center gap-1 mt-2 w-fit"
                        onClick={e => { e.stopPropagation(); setSelectedItem(item) }}
                      >
                        <Camera size={9} style={{ color: isActive ? '#F5C422' : '#92600a' }} className="transition-colors duration-300" />
                        <span style={{ color: isActive ? '#F5C422' : '#92600a' }} className="text-[9px] transition-colors duration-300 underline underline-offset-2">Ver fotos</span>
                      </div>
                      */}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Galería de fotos de la historia */}
          <div className="grid grid-cols-2 gap-4 mb-14">
            <div className="flex flex-col gap-4">
              <div
                className="admin-editable group relative h-52 rounded-2xl overflow-hidden border border-white/6 cursor-zoom-in hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300"
                data-historia-index={0}
                onClick={() => setGalleryLightbox(historiaGallery[0])}
              >
                <img src={historiaGallery[0]} alt="Historia El Casereño 1" className="w-full h-full object-cover" />
              </div>
              <div
                className="admin-editable group relative aspect-square rounded-2xl overflow-hidden border border-white/6 cursor-zoom-in hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300"
                data-historia-index={2}
                onClick={() => setGalleryLightbox(historiaGallery[2])}
              >
                <img src={historiaGallery[2]} alt="Historia El Casereño 3" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="flex flex-col gap-4 mt-10">
              <div
                className="admin-editable group relative aspect-square rounded-2xl overflow-hidden border border-white/6 cursor-zoom-in hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300"
                data-historia-index={1}
                onClick={() => setGalleryLightbox(historiaGallery[1])}
              >
                <img src={historiaGallery[1]} alt="Historia El Casereño 2" className="w-full h-full object-cover" />
              </div>
              <div
                className="admin-editable group relative h-48 rounded-2xl overflow-hidden border border-white/6 cursor-zoom-in hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300"
                data-historia-index={3}
                onClick={() => setGalleryLightbox(historiaGallery[3])}
              >
                <img src={historiaGallery[3]} alt="Historia El Casereño 4" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

          {/* Contenido */}
          <div className="w-full">
            <p className="text-gray-400 text-base leading-relaxed mb-5 text-justify">
              Fundada en 2007 por José Luis Gorbeña en Monte Caseros, Corrientes, El Casereño nació de una visión simple: que la fruta fina del litoral merecía llegar fresca a destino. Empezamos transportando arándanos con 3 camiones. Hoy somos más de 55 unidades y seguimos siendo la misma familia.
            </p>
            <p className="text-gray-400 text-base leading-relaxed mb-8 text-justify">
              Operamos con cargas diarias en modalidad punto a punto o reparticiones, cubriendo todo el territorio argentino y países limítrofes.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIRNOS */}
      <section id="diferencial" className="py-24 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-400 mb-2">Por qué elegirnos</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">Nuestro diferencial competitivo</h2>
            <p className="text-gray-500 text-base max-w-xl">Más de 19 años de experiencia nacional e internacional, comprometidos en brindar un servicio de carga en tiempo y calidad.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diferencial.map((card, i) => (
              <div key={i} className="group bg-[#161616] border border-white/6 rounded-xl p-6 hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300 cursor-default">
                <div className="w-11 h-11 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4 text-yellow-400 transition-all duration-300 group-hover:bg-yellow-400/20 group-hover:scale-110 group-hover:rotate-6">
                  {card.icon}
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{card.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUESTRA FLOTA */}
      <section id="flota" className="py-24 bg-[#161616]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-400 mb-2">Nuestra flota</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">Capacidad para cada necesidad</h2>
            <p className="text-gray-500 text-base max-w-xl">Todas las unidades equipadas con frío Carrier, en constante mantenimiento y disponibles para carga inmediata.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { num: '+55', label: 'Unidades totales' },
              { num: '95%', label: 'Flotas refrigeradas' },
              { num: '3', label: 'Sedes operativas' },
              { num: '6', label: 'Países de cobertura' },
            ].map((n, i) => (
              <div key={i} className="group bg-[#1a1a1a] border border-[#2a2a2a] rounded-[12px] p-5 text-center hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300 cursor-default">
                <span className="text-[#F5C422] text-4xl font-black block leading-none transition-transform duration-300 group-hover:scale-110">{n.num}</span>
                <span className="text-[#888] text-xs mt-2 block">{n.label}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-6">Tipos de unidades</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {tiposUnidades.map(t => (
                <div key={t.title} className="group rounded-[12px] overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] hover:border-yellow-400/40 hover:-translate-y-1 transition-all duration-300">
                  <div className="p-5 pb-4">
                    <h3 className="text-white font-bold text-lg leading-tight tracking-tight mb-3">{t.title}</h3>
                    <div className="h-px bg-[#2a2a2a]" />
                  </div>
                  <div className="admin-editable relative aspect-[4/3] overflow-hidden">
                    <img
                      src={t.img}
                      alt={t.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NUESTRAS SEDES */}
      <section id="sedes" className="py-24 bg-[#161616]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-cyan-400 mb-2">Nuestras sedes</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">Cobertura nacional y regional</h2>
            <p className="text-gray-500 text-base max-w-xl">Operamos con sedes propias y sucursales estratégicas para garantizar entregas rápidas en todo el país.</p>
          </div>

          {/* Mapa izquierda · Sedes + Cobertura derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6">

            {/* Mapa */}
            <div className="relative isolate z-0 bg-[#07101a] rounded-3xl overflow-hidden border border-cyan-500/10 h-[420px] lg:h-[560px]">
              <MapArgentina />
            </div>

            {/* Columna derecha: sedes */}
            <div className="flex flex-col gap-3 lg:h-[560px]">

              {/* Sedes */}
              {[
                { title: 'SEDE CENTRAL', desc: 'Monte Caseros, Corrientes', address: 'Av. Libertador nº 1520', address2: 'Próximamente: Ruta Provincial 129 - KM 1,7', labelColor: '#F5C422', lat: -30.2624734, lng: -57.6436151 },
                { title: 'SUCURSAL RIACHUELO', desc: 'Corrientes', address: 'Ruta Nacional nº 12 - KM 1013', labelColor: '#4A9EBF', lat: -27.6330156, lng: -58.7380877 },
                { title: 'SUCURSAL EZEIZA', desc: 'Buenos Aires', address: 'Av. Constitución (KM 33 de Autopista Ezeiza-Cañuelas)', labelColor: '#4ABF7A', lat: -34.8324837, lng: -58.5127149 },
              ].map((s, i) => (
                <div key={i} className="flex-1 flex flex-col rounded-[12px] border border-[#2a2a2a] p-3.5 bg-[#1a1a1a] hover:-translate-y-1 hover:shadow-[0_6px_24px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default" style={{ '--hover-border': s.labelColor } as React.CSSProperties}>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full mb-2 text-[11px] font-semibold uppercase tracking-[1px]" style={{ color: s.labelColor, border: `1px solid ${s.labelColor}33` }}>
                    <MapPin size={11} />
                    {s.title}
                  </div>
                  <div className="h-px bg-[#3a3a3a] mb-2"></div>
                  <p className="text-white font-semibold text-sm">{s.desc}</p>
                  <p className={`text-[#888] text-xs mt-0.5 ${s.address2 ? '' : 'mb-2.5'}`}>{s.address}</p>
                  {s.address2 && <p className="text-[#666] text-xs italic mt-0.5 mb-2.5">{s.address2}</p>}
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${s.lat},${s.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-auto bg-white/6 border border-white/10 text-white text-xs font-medium px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors duration-200"
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${s.labelColor}66`; e.currentTarget.style.color = s.labelColor }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.color = '' }}
                  >
                    ¿Cómo llegar?
                    <svg width="14" height="14" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                  </a>
                </div>
              ))}

            </div>
          </div>

          {/* Cobertura internacional: ancho completo debajo del mapa y las sedes */}
          <div className="bg-[#07101a] border border-cyan-500/10 rounded-3xl p-5 mt-6">
            <p className="text-cyan-400 font-bold text-xs uppercase tracking-widest mb-4">Cobertura internacional</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { name: 'Brasil', svg: 'br' },
                { name: 'Uruguay', svg: 'uy' },
                { name: 'Chile', svg: 'cl' },
                { name: 'Paraguay', svg: 'py' },
                { name: 'Bolivia', svg: 'bo' },
              ].map(p => (
                <div key={p.name} className="group flex flex-col items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-[12px] px-2 py-4 hover:border-cyan-400/40 hover:-translate-y-1 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default">
                  <img
                    src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${p.svg}.svg`}
                    alt={p.name}
                    width={48}
                    height={32}
                    className="rounded-[3px] object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <p className="text-white font-semibold text-xs text-center">{p.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLIENTES */}
      <section id="clientes" className="py-16 bg-[#0d0d0d] overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-400 mb-2">Clientes</p>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Empresas que confían en nosotros</h2>
          <p className="text-gray-500 text-base">Trabajamos con empresas líderes en alimentos, frutas, logística y consumo masivo en toda Argentina.</p>
        </div>

        {isAdmin && editMode && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-[12px] p-5">
              <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-4">Gestionar logos de clientes</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {clientLogos.map((logo, index) => {
                  const isAbsolute = logo.src.startsWith('/')
                  const imagePath = isAbsolute ? logo.src : `/images/clientes/${logo.src}`
                  return (
                    <div key={index} className="relative flex flex-col gap-2 bg-[#111] border border-[#2a2a2a] rounded-[8px] p-3">
                      <button
                        onClick={() => deleteClientLogo(index)}
                        title="Eliminar logo"
                        className="absolute top-2 right-2 z-[70] flex items-center justify-center w-7 h-7 rounded-md bg-black/70 text-red-400 border border-red-400/40 hover:bg-red-400/20 transition-colors"
                      >
                        <X size={13} />
                      </button>
                      <div className="admin-editable relative h-20 flex items-center justify-center bg-white rounded-[8px] p-2.5 overflow-hidden" data-logo-index={index}>
                        <img src={imagePath} alt={logo.name} className="max-h-full max-w-full w-auto h-auto object-contain object-center" />
                      </div>
                      <input
                        value={logo.name}
                        onChange={e => updateClientLogoName(index, e.target.value)}
                        placeholder="Nombre del cliente"
                        className="w-full bg-[#111] border border-gray-700 rounded px-2 py-1 text-xs text-[#ffffff] focus:outline-none focus:border-yellow-400"
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="relative">
          <div className="flex overflow-hidden">
            <div className="marquee-track">
              {[...clientLogos, ...clientLogos].map((logo, index) => {
                const isAbsolute = logo.src.startsWith('/')
                const imagePath = isAbsolute ? logo.src : `/images/clientes/${logo.src}`
                const webpPath = !isAbsolute ? `/images/clientes/${logo.src.replace(/\.[^.]+$/, '.webp')}` : undefined
                return (
                  <div key={index} className="cliente-logo">
                    <picture>
                      {webpPath ? <source srcSet={webpPath} type="image/webp" /> : null}
                      <img
                        src={imagePath}
                        alt={logo.name}
                        loading="lazy"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement
                          img.style.display = 'none'
                          const fallback = img.nextElementSibling as HTMLElement | null
                          if (fallback) fallback.style.display = 'block'
                        }}
                      />
                    </picture>
                    <span className="logo-fallback hidden text-gray-600 font-medium text-sm">{logo.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-[#0d0d0d] to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-[#0d0d0d] to-transparent z-10 pointer-events-none"></div>
        </div>
      </section>

      {/* CONTACTO */}
      <section id="contacto" className="py-24 bg-[#161616]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Izquierda */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-400 mb-2">Contacto</p>
              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">Hablemos de<br />tu carga</h2>
              <p className="text-gray-500 text-base leading-relaxed mb-8">Somos una empresa familiar que cree en el trato directo. Contactanos y te respondemos a la brevedad.</p>
              <div className="flex gap-10 pt-6 border-t border-white/8">
                <div>
                  <span className="text-yellow-400 text-4xl font-black block leading-none">+55</span>
                  <span className="text-gray-500 text-xs mt-1 block">Unidades disponibles</span>
                </div>
                <div>
                  <span className="text-yellow-400 text-4xl font-black block leading-none">19</span>
                  <span className="text-gray-500 text-xs mt-1 block">Años de experiencia</span>
                </div>
              </div>
            </div>

            {/* Card contacto */}
            <div className="bg-[#1e1e1e] border border-white/7 rounded-2xl p-8 hover:border-yellow-400/20 hover:shadow-[0_8px_40px_rgba(250,204,21,0.06)] transition-all duration-300">
              <img
                src={theme === 'light' ? '/images/logos/casereno.png' : '/images/logos/caserenoBlancoCorriente.png'}
                alt="El Casereño"
                className="h-10 w-auto object-contain mb-4 mx-auto"
              />
              <p className="text-gray-500 text-sm mb-6">Transporte Nacional e Internacional</p>
              <div className="h-px bg-white/7 mb-6"></div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="text-yellow-400 flex-shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                  <a href="mailto:recepcion@grupo-jlg.com" className="hover:text-yellow-400 transition-colors">recepcion@grupo-jlg.com</a>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="text-yellow-400 flex-shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.01z" /></svg>
                  <a href="tel:+5403775408417" className="hover:text-yellow-400 transition-colors">03775-408417</a>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="text-yellow-400 flex-shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  Monte Caseros, Corrientes · Argentina
                </div>
              </div>

              <a href="https://wa.me/5403775408417?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios%20de%20transporte." target="_blank" rel="noopener noreferrer" className="block w-full bg-yellow-400 text-black text-sm font-semibold text-center py-3.5 rounded-lg hover:bg-yellow-300 transition-colors duration-200">
                Escribinos por WhatsApp
              </a>

              <div className="pt-4 border-t border-white/7 mt-2">
                <p className="text-center text-gray-500 text-xs font-semibold tracking-widest mb-3">SEGUINOS</p>
                <div className="flex items-center justify-center gap-5">
                <a href="https://www.facebook.com/share/1H3te6ykUX/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors duration-200 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                  Facebook
                </a>
                <a href="https://www.instagram.com/transporte.casereno.sa?utm_source=qr&igsh=MXNtZGlkNjZjZHdsZg==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors duration-200 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                  Instagram
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRABAJÁ CON NOSOTROS */}
      <section id="trabajá" className="py-24 bg-[#0d0d0d]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-400 mb-2">Sumate al equipo</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">Trabajá con nosotros</h2>
            <p className="text-gray-500 text-base max-w-xl">Somos una empresa familiar en constante crecimiento. Si querés ser parte de un equipo comprometido y profesional, nos interesa conocerte.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {[
              { role: 'Choferes con registro', desc: 'Habilitación categoría E. Experiencia en larga distancia y/o cargas especiales.' },
              { role: 'Mecánicos de flota', desc: 'Conocimiento en motores a diesel, sistemas de frío Carrier y mantenimiento preventivo.' },
              { role: 'Administrativos', desc: 'Gestión de documentación, logística y coordinación de viajes nacionales e internacionales.' },
              { role: 'Despachantes de carga', desc: 'Conocimiento en documentación aduanera para operaciones con Brasil, Uruguay, Chile, Paraguay y Bolivia.' },
              { role: 'Operadores logísticos', desc: 'Seguimiento de cargas, comunicación con clientes y coordinación con conductores.' },
              { role: 'Otras posiciones', desc: 'Si no encontrás tu perfil pero querés ser parte del equipo, igualmente escribinos.' },
            ].map((item, i) => (
              <div key={i} className="group bg-[#161616] border border-white/6 rounded-xl p-5 hover:border-yellow-400/40 hover:-translate-y-3 hover:scale-105 hover:shadow-[0_16px_40px_rgba(250,204,21,0.45)] transition-all duration-300 cursor-default">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mb-3 transition-transform duration-300 group-hover:scale-150" />
                <h3 className="text-white font-semibold text-sm mb-2">{item.role}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#161616] border border-yellow-400/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">¿Querés postularte?</h3>
              <p className="text-gray-500 text-sm">Mandanos tu CV y una breve presentación a <span className="text-gray-300 font-medium select-all">recursoshumanos@grupo-jlg.com</span> o por WhatsApp.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a
                href="mailto:recursoshumanos@grupo-jlg.com?subject=Postulación laboral"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  try { navigator.clipboard.writeText('recursoshumanos@grupo-jlg.com') } catch { }
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
                  if (!isMobile) {
                    window.open('https://mail.google.com/mail/?view=cm&fs=1&to=recursoshumanos@grupo-jlg.com&su=Postulación%20laboral', '_blank')
                  }
                }}
                className="flex items-center gap-2 bg-white/6 border border-white/10 text-white text-sm font-medium px-5 py-3 rounded-lg hover:border-yellow-400/40 hover:text-yellow-400 transition-all duration-200"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                Enviar CV por email
              </a>
              <a href="https://wa.me/5403775468180?text=Hola%2C%20me%20interesa%20postularme%20para%20trabajar%20en%20El%20Casere%C3%B1o" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-400 text-black text-sm font-bold px-5 py-3 rounded-lg hover:bg-yellow-300 transition-all duration-200">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                WhatsApp
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs font-semibold tracking-widest mb-4">SEGUINOS</p>
            <div className="flex items-center justify-center gap-4">
              <a href="https://www.facebook.com/share/1H3te6ykUX/" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 bg-[#1877F2] text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(24,119,242,0.25)] hover:shadow-[0_8px_28px_rgba(24,119,242,0.45)] hover:-translate-y-1 hover:scale-105 transition-all duration-300">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="transition-transform duration-300 group-hover:scale-110"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                Facebook
              </a>
              <a href="https://www.instagram.com/transporte.casereno.sa?utm_source=qr&igsh=MXNtZGlkNjZjZHdsZg==" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2.5 text-white text-sm font-bold px-6 py-3.5 rounded-xl shadow-[0_4px_20px_rgba(217,70,166,0.25)] hover:shadow-[0_8px_28px_rgba(217,70,166,0.45)] hover:-translate-y-1 hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(45deg, #f9ce34, #ee2a7b, #6228d7)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:scale-110"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#2a1f0e] border-t border-[#c8971a]/20 py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <div className="flex items-center flex-wrap justify-center gap-6">
            <div className="flex items-center gap-4 border-r border-white/10 pr-6">
              <a href="https://www.facebook.com/share/1H3te6ykUX/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://www.instagram.com/transporte.casereno.sa?utm_source=qr&igsh=MXNtZGlkNjZjZHdsZg==" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
            </div>
            <img src="/images/logos/grupojlgBlanco.png" alt="Grupo JLG" className="h-8 w-auto" />
            <img src="/images/logos/yacareBlanco.png" alt="Yacaré" className="h-12 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <AdminBar />
            <span className="text-gray-400 text-xs whitespace-nowrap">© {new Date().getFullYear()} Transporte El Casereño S.A. Todos los derechos reservados · Diseño y desarrollo por <a href="https://www.codigo20.com.ar" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-colors">Código20</a></span>
          </div>
        </div>
      </footer>

      {/* MODAL TIMELINE - deshabilitado a pedido del cliente (todavia no tiene las fotos
          de cada hito). Descomentar junto con el boton "Ver fotos" de arriba para reactivarlo.
      {selectedItem && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="bg-[#1a1a1a] border border-yellow-400/20 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-5">
                <div>
                  <span className="text-yellow-400 font-black text-3xl block leading-none">{selectedItem.year}</span>
                  <h3 className="text-white font-bold text-xl mt-1">{selectedItem.title}</h3>
                </div>
                <button onClick={() => setSelectedItem(null)} className="text-gray-400 hover:text-white transition-colors p-1">
                  <X size={22} />
                </button>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{selectedItem.desc}</p>
              {(timelinePhotoOverrides[selectedItem.year] || selectedItem.photos || []).length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {(timelinePhotoOverrides[selectedItem.year] || selectedItem.photos || []).map((photo, i) => (
                    <div
                      key={i}
                      className="admin-editable relative rounded-xl overflow-hidden"
                      data-timeline-year={selectedItem.year}
                      data-photo-index={i}
                    >
                      <img src={photo} alt={`${selectedItem.title} - foto ${i + 1}`} className="w-full h-44 object-cover" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 border border-dashed border-gray-700 rounded-xl gap-2">
                  <Camera className="text-gray-600" size={28} />
                  <p className="text-gray-500 text-sm">Fotos próximamente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      */}

      {/* LIGHTBOX GALERIA HISTORIA */}
      {galleryLightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out" onClick={() => setGalleryLightbox(null)}>
          <button onClick={() => setGalleryLightbox(null)} className="absolute top-5 right-5 text-white hover:text-yellow-400 transition-colors z-10" aria-label="Cerrar">
            <X size={28} />
          </button>
          <img
            src={galleryLightbox}
            alt="Historia El Casereño"
            className="max-w-full max-h-[90vh] rounded-xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/5403775408417?text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20sus%20servicios%20de%20transporte." target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50 group">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden sm:block">
          ¡Habla con nosotros!
        </span>
      </a>

    </div>
  )
}

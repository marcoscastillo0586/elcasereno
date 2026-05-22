'use client'

import { useState, useRef, useEffect } from 'react'
import { Menu, X, CheckCircle, Thermometer, Globe, Shield, Clock, Users, Star } from 'lucide-react'
import MapArgentina from './components/MapArgentina'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const [counters, setCounters] = useState({ units: 0, years: 0, offices: 0, countries: 0 })

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
    const check = () => {
      const el = statsRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) {
        setStatsVisible(true)
        window.removeEventListener('scroll', check)
      }
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

  useEffect(() => {
    if (!statsVisible) return
    const targets = { units: 55, years: 18, offices: 3, countries: 4 }
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
  }, [statsVisible])

  const features = [
    "18 años de experiencia",
    "Cobertura nacional e internacional",
    "Más de 55 unidades térmicas Carrier",
    "Seguro de carga completo",
    "Empresa familiar con compromiso",
    "Atención personalizada",
    "Documentación internacional vigente",
  ]

  const timeline = [
    { year: '1983', title: 'Grupo JLG', desc: 'Fundación del Autoservicio y Supermercado por José Luis Gorbeña y Verónica Roverano' },
    { year: '2006', title: 'Primeros camiones', desc: 'Foco en distribución de arándanos con 2 camiones desde Concordia' },
    { year: '2007', title: 'Nace El Casereño', desc: 'Fundación formal de Transporte El Casereño S.A. con 4 unidades en Monte Caseros' },
    { year: '2009', title: 'Expansión Brasil', desc: 'Inicio de operaciones de logística internacional con Brasil' },
    { year: '2012', title: 'Región ampliada', desc: 'Expansión a Uruguay, Chile y Paraguay. Fortalecimiento logística nacional' },
    { year: '2017', title: '+30 unidades', desc: 'Crecimiento sostenido de la flota a más de 30 unidades' },
    { year: '2023', title: 'Nueva sede central', desc: 'Inauguración de la nueva casa central en Monte Caseros, Corrientes' },
    { year: '2024', title: '+55 unidades', desc: 'Flota de más de 55 unidades modernas con equipo frío Carrier' },
    { year: '2025', title: 'Seguimos creciendo', desc: 'Nuevo centro de distribución en Riachuelo y sede en Ezeiza, Buenos Aires' },
  ]

  const clients = [
    'Soychú', 'CCAM', 'PuroSol', 'Tonadita', 'Surfrigo', 'Dass', 'Fepasa', 'Trégar', 'Don Satur',
    'GrupoHenn', 'ExpoVerde', 'Granja Tres Arroyos', 'Citric', 'Las Camelias SA', 'Lario', 'Fadel',
    'Gramm', 'Eca', 'Tasa Logística', 'San Francisco', 'Silvestrin', 'Jauser', 'Grimoldi',
    'Los Azahares SA', 'Litoral Citrus SA', 'El Paruco', 'Gamorel', 'Arsa', 'Eriochem SA',
    'Fama', 'Grupo de Narvaez', 'Grupodelplata', 'Jucofer', 'TN&Platex', 'Tomasi Logística',
    'Toller Hermanos', 'Morresi Mfruit', 'Placas Rivadavia', 'Citromax', 'PHM SRL', 'MagniFresh', 'Nexus'
  ]

  const diferencial = [
    {
      icon: <Thermometer className="w-5 h-5" />,
      title: 'Flota 100% térmica',
      desc: '+55 unidades con equipos de frío Carrier de nueva generación. Temperatura controlada garantizada en cada viaje.',
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: 'Cobertura amplia',
      desc: 'Argentina, Brasil, Uruguay, Chile y Paraguay. Foco especial en centro y norte del país con cargas diarias.',
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
      title: '+18 años de trayectoria',
      desc: 'Seriedad, honestidad y responsabilidad desde el primer día. Más de 40 clientes activos en todo el país.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0d0d0d]">

      {/* NAV */}
      <nav className="bg-black/92 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-yellow-400/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[68px]">
            <div className="flex items-center">
              <img src="/images/logo.png" alt="El Casereño Logo" className="h-9 w-auto scale-[2.05]" />
            </div>
            <div className="hidden md:flex items-baseline gap-8">
              {[['#nosotros','Nosotros'],['#diferencial','Servicios'],['#flota','Flota'],['#clientes','Clientes'],['#contacto','Contacto'],['#trabajá','Trabajá con nosotros']].map(([href, label]) => (
                <a key={href} href={href} className="text-gray-300 hover:text-yellow-400 text-sm font-medium transition-colors duration-200">{label}</a>
              ))}
            </div>
            <div className="hidden md:block">
              <a href="#contacto" className="bg-yellow-400 text-black text-sm font-medium px-5 py-2 rounded-md hover:bg-yellow-300 transition-colors duration-200">Contactanos</a>
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
            {[['#nosotros','Nosotros'],['#diferencial','Servicios'],['#flota','Flota'],['#clientes','Clientes'],['#contacto','Contacto'],['#trabajá','Trabajá con nosotros']].map(([href, label]) => (
              <a key={href} href={href} onClick={() => setIsMenuOpen(false)} className="text-white hover:text-yellow-400 block px-3 py-2 rounded-md text-base font-medium">{label}</a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="inicio" className="relative min-h-screen text-white flex flex-col">
        <div className="absolute inset-0">
          <img src="/images/casereno-bandera.jpg.jpeg" alt="Camión de carga El Casereño" className="w-full h-full object-cover object-center" style={{ objectPosition: '60% center' }} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>

        <div className="relative flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full py-24">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 bg-yellow-400/12 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></div>
                <span className="text-yellow-400 text-xs font-medium tracking-wide">Monte Caseros, Corrientes · Argentina</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-6 uppercase">
                Transporte<br />
                <span className="text-yellow-400">El Casereño</span>
              </h1>
              <p className="text-gray-300 text-base md:text-lg max-w-lg mb-10 leading-relaxed">
                Conectando destinos con confianza y responsabilidad.<br />
                Transporte Nacional e Internacional.
              </p>
              <div className="flex flex-row gap-3">
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
            <div className="flex flex-wrap justify-center gap-y-4 divide-x divide-white/10">
              {[
                { value: counters.units, prefix: '+', label: 'Unidades activas' },
                { value: counters.years, prefix: '',  label: 'Años de experiencia' },
                { value: counters.countries, prefix: '', label: 'Países de cobertura' },
                { value: counters.offices, prefix: '', label: 'Sedes operativas' },
              ].map((stat, i) => (
                <div key={i} className="px-8 first:pl-8">
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
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-2">
          {[
            'Transporte temperatura controlada',
            'Cobertura nacional e internacional',
            'Cargas diarias punto a punto',
            'Equipos Carrier nueva generación',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-sm font-medium text-black">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
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
          <div className="mb-14 overflow-x-auto">
            <div className="relative flex min-w-[680px]">
              <div className="absolute left-0 right-0 h-px bg-yellow-400/15" style={{ top: '38px' }}></div>
              <div className="timeline-scanner absolute left-0 right-0 h-px" style={{ top: '38px' }}></div>
              {timeline.map((item, index) => {
                const isVisible = visibleItems.has(index)
                return (
                  <div key={index} ref={el => { itemRefs.current[index] = el }} className="flex-1 flex flex-col items-center px-1.5">
                    <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(-10px)', transition: 'opacity 0.5s ease, transform 0.5s ease', transitionDelay: `${index * 70}ms` }} className="h-7 flex items-center mb-1">
                      <span className="text-yellow-400 font-black text-xs sm:text-sm">{item.year}</span>
                    </div>
                    <div className="relative z-10 mb-3 w-3 h-3">
                      {isVisible && <div className="absolute inset-0 rounded-full bg-yellow-400/40 timeline-dot-ping" style={{ animationDelay: `${index * 300}ms` }} />}
                      <div style={{ transition: 'background-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease', transitionDelay: `${index * 70}ms`, transform: isVisible ? 'scale(1)' : 'scale(0.2)', boxShadow: isVisible ? '0 0 12px rgba(250,204,21,0.7)' : 'none' }} className={`w-3 h-3 rounded-full border-2 border-yellow-400 ${isVisible ? 'bg-yellow-400' : 'bg-[#161616]'}`} />
                    </div>
                    <div style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'translateY(0)' : 'translateY(12px)', transition: 'opacity 0.6s ease, transform 0.6s ease', transitionDelay: `${index * 70 + 100}ms` }} className="bg-[#1e1e1e] border border-gray-800 rounded-xl p-2.5 w-full hover:border-yellow-400/60 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(250,204,21,0.12)] transition-all duration-300 cursor-default">
                      <h3 className="text-white font-bold text-xs leading-tight">{item.title}</h3>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-3">{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Contenido + imagen */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-gray-400 text-base leading-relaxed mb-5">
                Fundada en 2007 por José Luis Gorbeña en Monte Caseros, Corrientes, El Casereño nació de una visión simple: que la fruta fina del litoral merecía llegar fresca a destino. Empezamos transportando arándanos con 3 camiones. Hoy somos más de 55 unidades y seguimos siendo la misma familia.
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-8">
                Operamos con cargas diarias en modalidad punto a punto o reparticiones, cubriendo todo el territorio argentino y países limítrofes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-3 bg-yellow-400 rounded-3xl opacity-10 blur-sm"></div>
              <img src="/images/casereno-flota.jpg.jpeg" alt="Flota El Casereño" className="relative rounded-2xl w-full h-[440px] object-cover shadow-2xl" />
              <div className="absolute -bottom-5 -right-5 bg-yellow-400 text-black rounded-2xl p-5 shadow-2xl">
                <span className="text-4xl font-black block leading-none">18+</span>
                <span className="text-xs font-bold uppercase tracking-wider mt-1 block">años de experiencia</span>
              </div>
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
            <p className="text-gray-500 text-base max-w-xl">Más de 18 años de experiencia nacional e internacional, comprometidos en brindar un servicio de carga en tiempo y calidad.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diferencial.map((card, i) => (
              <div key={i} className="bg-[#161616] border border-white/6 rounded-xl p-6 hover:border-yellow-400/30 hover:-translate-y-1 transition-all duration-200 cursor-default">
                <div className="w-11 h-11 bg-yellow-400/10 rounded-lg flex items-center justify-center mb-4 text-yellow-400">
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
          <div className="mb-12">
            <p className="text-xs font-semibold uppercase tracking-[2px] text-yellow-400 mb-2">Nuestra flota</p>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight mb-3">Capacidad para cada necesidad</h2>
            <p className="text-gray-500 text-base max-w-xl">Todas las unidades equipadas con frío Carrier, en constante mantenimiento y disponibles para carga inmediata.</p>
          </div>

          {/* Números */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { num: '+55', label: 'Unidades totales' },
              { num: '95%', label: 'Unidades térmicas' },
              { num: '3',   label: 'Sedes operativas' },
              { num: '5',   label: 'Países de cobertura' },
            ].map((n, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/6 rounded-xl p-5 text-center">
                <span className="text-yellow-400 text-4xl font-black block leading-none">{n.num}</span>
                <span className="text-gray-500 text-xs mt-2 block">{n.label}</span>
              </div>
            ))}
          </div>

          {/* Tipos de unidades */}
          <div className="bg-[#1e1e1e] border border-white/6 rounded-xl p-6 mb-6">
            <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-4">Tipos de unidades</p>
            <div className="flex flex-wrap gap-2">
              {['Tractores','Semirremolques','Balancines','Chasis','Camiones Saider','Camiones abiertos'].map(t => (
                <span key={t} className="bg-yellow-400/8 border border-yellow-400/20 text-gray-300 text-xs px-3 py-1.5 rounded-md">{t}</span>
              ))}
            </div>
          </div>

          {/* Sedes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: 'Sede Central', loc: 'Monte Caseros, Corrientes' },
              { name: 'Sucursal Riachuelo', loc: 'Corrientes' },
              { name: 'Sucursal Ezeiza', loc: 'Buenos Aires' },
            ].map((s, i) => (
              <div key={i} className="bg-yellow-400/6 border border-yellow-400/15 rounded-lg px-4 py-3">
                <p className="text-yellow-400 text-xs font-semibold mb-0.5">{s.name}</p>
                <p className="text-gray-500 text-xs">{s.loc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUESTRAS SEDES — MAPA */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Nuestras Sedes</h2>
            <p className="text-yellow-400 font-medium text-lg">Alianzas, Cobertura nacional e internacional</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            <div className="lg:col-span-2 bg-[#0d0d0d] rounded-2xl border border-gray-800 overflow-hidden min-h-[520px]">
              <MapArgentina />
            </div>
            <div className="space-y-4">
              <div className="bg-[#0d0d0d] border border-yellow-400/30 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-1">Sede Central</p>
                    <p className="text-white font-semibold">Monte Caseros, Corrientes</p>
                    <p className="text-gray-400 text-sm mt-1">Casa central de operaciones desde 2007</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0d0d0d] border border-gray-700 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-400/80 font-bold text-xs uppercase tracking-widest mb-1">Sucursal</p>
                    <p className="text-white font-semibold">Riachuelo, Corrientes</p>
                    <p className="text-gray-400 text-sm mt-1">Centro de distribución regional</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0d0d0d] border border-gray-700 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400/80 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-400/80 font-bold text-xs uppercase tracking-widest mb-1">Sucursal</p>
                    <p className="text-white font-semibold">Ezeiza, Buenos Aires</p>
                    <p className="text-gray-400 text-sm mt-1">Operaciones logísticas en el Gran Buenos Aires</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#0d0d0d] border border-yellow-400/20 rounded-2xl p-5">
                <p className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-3">Cobertura Internacional</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Brasil',    code: 'BR', svg: 'br' },
                    { name: 'Uruguay',   code: 'UY', svg: 'uy' },
                    { name: 'Chile',     code: 'CL', svg: 'cl' },
                    { name: 'Paraguay',  code: 'PY', svg: 'py' },
                  ].map(p => (
                    <div key={p.name} className="flex flex-col items-center gap-1.5 bg-black/40 border border-gray-800 rounded-xl px-3 py-3 hover:border-yellow-400/40 transition-colors duration-200">
                      <img
                        src={`https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${p.svg}.svg`}
                        alt={p.name}
                        width={64}
                        height={43}
                        className="rounded-[4px] object-cover"
                      />
                      <p className="text-white font-semibold text-sm">{p.name}</p>
                    </div>
                  ))}
                </div>
              </div>
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
        <div className="relative">
          <div className="flex overflow-hidden">
            <div className="animate-marquee flex gap-8 whitespace-nowrap">
              {[...clients, ...clients].map((client, index) => (
                <div key={index} className="inline-flex items-center justify-center px-6 py-3 bg-[#161616] border border-gray-700 rounded-lg flex-shrink-0 hover:border-yellow-400 transition-colors duration-300">
                  <span className="text-gray-300 font-medium text-sm">{client}</span>
                </div>
              ))}
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
                  <span className="text-yellow-400 text-4xl font-black block leading-none">18</span>
                  <span className="text-gray-500 text-xs mt-1 block">Años de experiencia</span>
                </div>
              </div>
            </div>

            {/* Card contacto */}
            <div className="bg-[#1e1e1e] border border-white/7 rounded-2xl p-8">
              <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-yellow-400/15 border-2 border-yellow-400/30 flex items-center justify-center mb-4">
                <span className="text-yellow-400 font-black text-lg tracking-wide">JG</span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-0.5">José Luis Gorbeña</h3>
              <p className="text-gray-500 text-sm mb-6">Gerente Comercial</p>
              <div className="h-px bg-white/7 mb-6"></div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="text-yellow-400 flex-shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <a href="mailto:josegorbena@grupo-jlg.com" className="hover:text-yellow-400 transition-colors">josegorbena@grupo-jlg.com</a>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="text-yellow-400 flex-shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.01z"/></svg>
                  <a href="tel:+5403775638819" className="hover:text-yellow-400 transition-colors">03775 – 638819</a>
                </div>
                <div className="flex items-center gap-3 text-gray-300 text-sm">
                  <svg className="text-yellow-400 flex-shrink-0" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Monte Caseros, Corrientes · Argentina
                </div>
              </div>

              <a href="https://wa.me/5403775638819" target="_blank" rel="noopener noreferrer" className="block w-full bg-yellow-400 text-black text-sm font-semibold text-center py-3.5 rounded-lg hover:bg-yellow-300 transition-colors duration-200">
                Escribinos por WhatsApp
              </a>

              <div className="flex items-center justify-center gap-5 pt-4 border-t border-white/7 mt-2">
                <a href="https://www.facebook.com/share/1H3te6ykUX/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors duration-200 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                  Facebook
                </a>
                <a href="https://www.instagram.com/transporte.casereno.sa?utm_source=qr&igsh=MXNtZGlkNjZjZHdsZg==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-500 hover:text-yellow-400 transition-colors duration-200 text-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </a>
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
              { role: 'Despachantes de carga', desc: 'Conocimiento en documentación aduanera para operaciones con Brasil, Uruguay, Chile y Paraguay.' },
              { role: 'Operadores logísticos', desc: 'Seguimiento de cargas, comunicación con clientes y coordinación con conductores.' },
              { role: 'Otras posiciones', desc: 'Si no encontrás tu perfil pero querés ser parte del equipo, igualmente escribinos.' },
            ].map((item, i) => (
              <div key={i} className="bg-[#161616] border border-white/6 rounded-xl p-5 hover:border-yellow-400/30 transition-all duration-200">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mb-3" />
                <h3 className="text-white font-semibold text-sm mb-2">{item.role}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#161616] border border-yellow-400/20 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 justify-between">
            <div>
              <h3 className="text-white font-bold text-lg mb-1">¿Querés postularte?</h3>
              <p className="text-gray-500 text-sm">Mandanos tu CV y una breve presentación al correo o por WhatsApp.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <a href="mailto:josegorbena@grupo-jlg.com?subject=Postulación laboral" className="flex items-center gap-2 bg-white/6 border border-white/10 text-white text-sm font-medium px-5 py-3 rounded-lg hover:border-yellow-400/40 hover:text-yellow-400 transition-all duration-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Enviar CV por email
              </a>
              <a href="https://wa.me/5403775638819?text=Hola,%20me%20interesa%20postularme%20para%20trabajar%20en%20El%20Casereño" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-yellow-400 text-black text-sm font-bold px-5 py-3 rounded-lg hover:bg-yellow-300 transition-all duration-200">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d0d0d] border-t border-white/6 py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <img src="/images/logo.png" alt="El Casereño Logo" className="h-7 w-auto scale-[2.05] md:mr-auto" />
          <div className="flex items-center gap-4">
            <a href="https://www.facebook.com/share/1H3te6ykUX/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-400 transition-colors duration-200" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://www.instagram.com/transporte.casereno.sa?utm_source=qr&igsh=MXNtZGlkNjZjZHdsZg==" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-yellow-400 transition-colors duration-200" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
            </a>
          </div>
          <span className="text-gray-600 text-xs text-center md:ml-auto">© 2025 Transporte El Casereño S.A. Todos los derechos reservados · Diseño y desarrollo por Código20</span>
        </div>
      </footer>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/5403775638819" target="_blank" rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 hover:scale-110 z-50 group">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.149-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          ¡Habla con nosotros!
        </span>
      </a>

    </div>
  )
}

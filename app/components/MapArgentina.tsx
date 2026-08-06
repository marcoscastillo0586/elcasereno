'use client'

import { useEffect, useRef } from 'react'

const PROVINCES_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/argentina-provinces.geojson'

// Estilo neutro y uniforme para los países limítrofes (sin colores distintivos por país)
const NEIGHBOR_COUNTRY_STYLE = { fill: '#334155', border: '#64748b', opacity: 0.5 }

const SEDES = [
  { label: 'Sede Central', city: 'Monte Caseros, Ctes.', lat: -30.2624734, lng: -57.6436151, main: true  },
  { label: 'Sucursal',     city: 'Riachuelo, Ctes.',     lat: -27.6330156, lng: -58.7380877, main: false },
  { label: 'Sucursal',     city: 'Ezeiza, Bs.As.',       lat: -34.8324837, lng: -58.5127149, main: false },
]

// Países limítrofes con banderas (hub 0 = Sede Central, 2 = Sucursal Ezeiza)
const COUNTRIES = [
  { name: 'Brasil', lat: -15.0, lng: -53.0, code: 'br', hub: 0 },
  { name: 'Uruguay', lat: -32.5, lng: -55.5, code: 'uy', hub: 2 },
  { name: 'Chile', lat: -35.0, lng: -71.0, code: 'cl', hub: 2 },
  { name: 'Paraguay', lat: -23.0, lng: -58.0, code: 'py', hub: 0 },
  { name: 'Bolivia', lat: -17.0, lng: -64.5, code: 'bo', hub: 0 },
]

// Provincias destino con conexión desde alguna sede (excluye Santa Cruz y Chubut)
// hub 0 = Sede Central / Monte Caseros, 1 = Sucursal Riachuelo, 2 = Sucursal Ezeiza
const DESTINATIONS = [
  { name: 'Jujuy', lat: -24.1858, lng: -65.2995, hub: 0 },
  { name: 'Salta', lat: -24.7859, lng: -65.4117, hub: 0 },
  { name: 'Formosa', lat: -26.1775, lng: -58.1781, hub: 0 },
  { name: 'Tucumán', lat: -26.8241, lng: -65.2226, hub: 0 },
  { name: 'Catamarca', lat: -28.4696, lng: -65.7852, hub: 0 },
  { name: 'Santiago del Estero', lat: -27.7834, lng: -64.2642, hub: 0 },
  { name: 'Chaco', lat: -27.4514, lng: -58.9867, hub: 0 },
  { name: 'Corrientes', lat: -27.4692, lng: -58.8306, hub: 0 },
  { name: 'Misiones', lat: -27.3671, lng: -55.8961, hub: 0 },
  { name: 'Santa Fe', lat: -31.6333, lng: -60.7000, hub: 0 },
  { name: 'Entre Ríos', lat: -31.7333, lng: -60.5297, hub: 0 },
  { name: 'La Rioja', lat: -29.4131, lng: -66.8558, hub: 2 },
  { name: 'San Juan', lat: -31.5375, lng: -68.5364, hub: 2 },
  { name: 'San Luis', lat: -33.3017, lng: -66.3378, hub: 2 },
  { name: 'Córdoba', lat: -31.4201, lng: -64.1888, hub: 2 },
  { name: 'Mendoza', lat: -32.8895, lng: -68.8458, hub: 2 },
  { name: 'La Pampa', lat: -36.6167, lng: -64.2833, hub: 2 },
  { name: 'Neuquén', lat: -38.9516, lng: -68.0591, hub: 2 },
  { name: 'Río Negro', lat: -40.8135, lng: -62.9967, hub: 2 },
  { name: 'Ciudad Autónoma de Buenos Aires', lat: -34.6037, lng: -58.3816, hub: 2 },
]

export default function MapArgentina() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    let active = true
    let map: any

    // Load Leaflet CSS from CDN if not already loaded
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    import('leaflet').then(L => {
      if (!active || !containerRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl

      map = L.map(containerRef.current, {
        center: [-35.5, -63],
        zoom: 4,
        minZoom: 3,
        maxBounds: [[-70, -100], [8, -25]],
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
      })
      mapRef.current = map

      map.createPane('routesPane')
      map.getPane('routesPane')!.style.zIndex = '450'

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
        maxZoom: 10,
        subdomains: 'abcd',
      }).addTo(map)

      // Cargar GeoJSON de países con colores sólidos elegantes
      fetch('/data/south-america-countries.geojson')
        .then(r => r.json())
        .then(data => {
          L.geoJSON(data, {
            style: (feature: any) => {
              const code: string = (feature.properties['ISO3166-1-Alpha-3'] || feature.properties.ISO_A3 || feature.properties.iso_a3 || '').toUpperCase()

              // Argentina la maneja el layer de provincias, acá la ocultamos
              if (code === 'ARG') {
                return { fillOpacity: 0, color: 'transparent', weight: 0, opacity: 0 }
              }

              return {
                fillColor: NEIGHBOR_COUNTRY_STYLE.fill,
                fillOpacity: NEIGHBOR_COUNTRY_STYLE.opacity,
                color: NEIGHBOR_COUNTRY_STYLE.border,
                weight: 1,
                opacity: 0.6,
              }
            },
          }).addTo(map)
        })
        .catch(err => console.log('Countries GeoJSON error:', err))

      // Provincias de Argentina
      fetch('/data/argentina-provincias.geojson')
        .then(r => r.json())
        .then(data => {
          L.geoJSON(data, {
            style: () => ({
              className: 'argentina-glow',
              fillColor: '#F5C422',
              fillOpacity: 0.28,
              color: '#FFE27A',
              weight: 1.6,
              opacity: 0.95,
            }),
          }).addTo(map)
        })
        .catch(() => console.log('GeoJSON load error'))

      // Marcadores de sedes
      const makeIcon = (main: boolean) => L.divIcon({
        className: '',
        html: `<div style="
          width:${main ? 14 : 10}px;height:${main ? 14 : 10}px;
          background:#facc15;border:2px solid #000;border-radius:50%;
          box-shadow:0 0 10px rgba(250,204,21,0.9);
        "></div>`,
        iconSize: [main ? 14 : 10, main ? 14 : 10],
        iconAnchor: [main ? 7 : 5, main ? 7 : 5],
      })

      SEDES.forEach(s => {
        L.marker([s.lat, s.lng], { icon: makeIcon(s.main) })
          .addTo(map)
          .bindTooltip(`<strong>${s.label}</strong><br/>${s.city}`, {
            className: 'leaflet-tooltip-custom',
            direction: 'top',
            offset: [0, -8],
          })
      })

      // Curva suave entre dos puntos (bezier cuadrática) para las líneas de conexión
      const curvePoints = (from: [number, number], to: [number, number], curvature = 0.18, segments = 40) => {
        const [lat1, lng1] = from
        const [lat2, lng2] = to
        const dx = lng2 - lng1
        const dy = lat2 - lat1
        const midLat = (lat1 + lat2) / 2 - dx * curvature
        const midLng = (lng1 + lng2) / 2 + dy * curvature
        const points: [number, number][] = []
        for (let i = 0; i <= segments; i++) {
          const t = i / segments
          const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2
          const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2
          points.push([lat, lng])
        }
        return points
      }

      // Conexiones desde cada sede a las provincias de cobertura
      DESTINATIONS.forEach(d => {
        const hub = SEDES[d.hub]
        const points = curvePoints([hub.lat, hub.lng], [d.lat, d.lng])
        L.polyline(points, { color: '#fff7d6', weight: 5, opacity: 0.15, pane: 'routesPane' }).addTo(map)
        L.polyline(points, { color: '#fff7d6', weight: 1.6, opacity: 0.85, pane: 'routesPane' }).addTo(map)

        L.circleMarker([d.lat, d.lng], {
          radius: 4,
          color: '#38bdf8',
          weight: 2,
          fillColor: '#0a0f1a',
          fillOpacity: 1,
          pane: 'routesPane',
        })
          .addTo(map)
          .bindTooltip(d.name, {
            className: 'leaflet-tooltip-custom',
            direction: 'top',
            offset: [0, -6],
          })
      })

      // Marcadores de banderas de países
      const flagIcon = (code: string) => L.divIcon({
        className: '',
        html: `<img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg" style="width:32px;height:24px;border-radius:3px;box-shadow:0 0 8px rgba(0,0,0,0.4);" />`,
        iconSize: [32, 24],
        iconAnchor: [16, 12],
      })

      COUNTRIES.forEach(country => {
        const hub = SEDES[country.hub]
        const points = curvePoints([hub.lat, hub.lng], [country.lat, country.lng])
        L.polyline(points, { color: '#fff7d6', weight: 5, opacity: 0.15, pane: 'routesPane' }).addTo(map)
        L.polyline(points, { color: '#fff7d6', weight: 1.6, opacity: 0.85, pane: 'routesPane' }).addTo(map)

        L.marker([country.lat, country.lng], { icon: flagIcon(country.code) })
          .addTo(map)
          .bindTooltip(country.name, {
            className: 'leaflet-tooltip-custom',
            direction: 'bottom',
            offset: [0, 8],
          })
      })

      map.invalidateSize()

      // ResizeObserver para redimensionar el mapa cuando cambie el tamaño del contenedor
      const resizeObserver = new ResizeObserver(() => {
        if (map) {
          map.invalidateSize()
        }
      })
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current)
      }

      return () => {
        active = false
        resizeObserver.disconnect()
        if (map) {
          map.remove()
          mapRef.current = null
        }
      }
    }).catch(() => null)
  }, [])

  return (
    <>
      <style>{`
        .leaflet-container {
          background: #111 !important;
        }
        .leaflet-tooltip-custom {
          background: #1a1a1a !important;
          border: 1px solid #F5C422 !important;
          color: #fff !important;
          font-size: 12px !important;
          border-radius: 8px !important;
          padding: 8px 12px !important;
          box-shadow: 0 0 12px rgba(245, 196, 34, 0.2) !important;
          white-space: nowrap !important;
        }
        .leaflet-tooltip-custom::before {
          border-top-color: #F5C422 !important;
        }
        .leaflet-control-zoom {
          margin: 10px !important;
        }
        .leaflet-control-zoom a {
          background: #1a1a1a !important;
          color: #F5C422 !important;
          border: 1px solid #333 !important;
          width: 30px !important;
          height: 30px !important;
          font-size: 16px !important;
          line-height: 30px !important;
        }
        .leaflet-control-zoom a:hover {
          background: #272727 !important;
        }
        .argentina-glow path {
          filter: drop-shadow(0 0 6px rgba(245, 196, 34, 0.85));
        }

      `}</style>
      <div ref={containerRef} className="w-full h-full min-h-[420px] lg:min-h-0" style={{ background: '#111' }} />
    </>
  )
}

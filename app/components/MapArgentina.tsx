'use client'

import { useEffect, useRef } from 'react'

const PROVINCES_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/argentina-provinces.geojson'

// Colores oscuros y elegantes por país (world GeoJSON)
const COUNTRY_STYLES: Record<string, { fill: string; border: string; opacity: number }> = {
  BRA: { fill: '#105030', border: '#10b981', opacity: 0.65 },
  URY: { fill: '#1e3a8a', border: '#3b82f6', opacity: 0.65 },
  CHL: { fill: '#7f1d1d', border: '#ef4444', opacity: 0.65 },
  PRY: { fill: '#7c2d12', border: '#f97316', opacity: 0.65 },
  BOL: { fill: '#27272a', border: '#3f3f46', opacity: 0.3 },
}

// Provincias con mayor presencia de El Casereño
const PROVINCES_PRIMARY = [
  'Corrientes', 'Entre Ríos', 'Misiones',
]
const PROVINCES_SECONDARY = [
  'Buenos Aires', 'Santa Fe', 'Chaco', 'Formosa',
  'Tucumán', 'Salta', 'Córdoba', 'Ciudad Autónoma de Buenos Aires',
]

const SEDES = [
  { label: 'Sede Central', city: 'Monte Caseros, Ctes.', lat: -30.2597, lng: -57.6434, main: true  },
  { label: 'Sucursal',     city: 'Riachuelo, Ctes.',     lat: -27.36,   lng: -58.7847, main: false },
  { label: 'Sucursal',     city: 'Ezeiza, Bs.As.',       lat: -34.8272, lng: -58.5347, main: false },
]

// Países limítrofes con banderas
const COUNTRIES = [
  { name: 'Brasil', lat: -15.0, lng: -53.0, code: 'br' },
  { name: 'Uruguay', lat: -32.5, lng: -55.5, code: 'uy' },
  { name: 'Chile', lat: -35.0, lng: -71.0, code: 'cl' },
  { name: 'Paraguay', lat: -23.0, lng: -58.0, code: 'py' },
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
        center: [-33, -61],
        zoom: 4,
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
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

              const style = COUNTRY_STYLES[code]
              if (!style) {
                return { fillOpacity: 0.15, color: '#333333', weight: 1, opacity: 0.2 }
              }
              return {
                fillColor: style.fill,
                fillOpacity: style.opacity,
                color: style.border,
                weight: 1.5,
                opacity: 0.7,
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
            style: (feature: any) => {
              const name = feature.properties.nombre || feature.properties.provincia || feature.properties.iso_nombre || '';
              const isPrimary = PROVINCES_PRIMARY.some(p => name.toLowerCase().includes(p.toLowerCase()));
              const isSecondary = PROVINCES_SECONDARY.some(p => name.toLowerCase().includes(p.toLowerCase()));

              let fillColor = '#1e293b';
              let fillOpacity = 0.45;
              let color = '#F5C422';
              let weight = 1.0;
              let opacity = 0.3;

              if (isPrimary) {
                fillColor = '#F5C422';
                fillOpacity = 0.35;
                color = '#F5C422';
                weight = 2.0;
                opacity = 0.8;
              } else if (isSecondary) {
                fillColor = '#F5C422';
                fillOpacity = 0.15;
                color = '#F5C422';
                weight = 1.3;
                opacity = 0.5;
              }

              return {
                fillColor,
                fillOpacity,
                color,
                weight,
                opacity
              }
            },
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

      // Marcadores de banderas de países
      const flagIcon = (code: string) => L.divIcon({
        className: '',
        html: `<img src="https://cdn.jsdelivr.net/gh/lipis/flag-icons@7.2.3/flags/4x3/${code}.svg" style="width:32px;height:24px;border-radius:3px;box-shadow:0 0 8px rgba(0,0,0,0.4);" />`,
        iconSize: [32, 24],
        iconAnchor: [16, 12],
      })

      COUNTRIES.forEach(country => {
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

      `}</style>
      <div ref={containerRef} className="w-full h-full min-h-[420px] lg:min-h-0" style={{ background: '#111' }} />
    </>
  )
}

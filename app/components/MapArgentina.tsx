'use client'

import { useEffect, useRef } from 'react'

const PROVINCES_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/argentina-provinces.geojson'

// Colores oscuros y elegantes por país (world GeoJSON)
const COUNTRY_STYLES: Record<string, { fill: string; opacity: number }> = {
  BRA: { fill: '#2D5A3D', opacity: 0.7 },
  URY: { fill: '#2D4A6B', opacity: 0.7 },
  CHL: { fill: '#6B2D2D', opacity: 0.7 },
  PRY: { fill: '#6B4A2D', opacity: 0.7 },
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

      // Inyecta el <marker> de flecha en el SVG interno de Leaflet
      const injectSVGDefs = () => {
        // Forzar creación del renderer SVG con un marcador temporal invisible
        const temp = L.circleMarker([0, 0] as [number, number], {
          radius: 0, opacity: 0, fillOpacity: 0,
        }).addTo(map)

        const svgEl = map.getPane('overlayPane')?.querySelector('svg') as SVGSVGElement | null
        temp.remove()

        if (!svgEl) return

        let defs = svgEl.querySelector('defs')
        if (!defs) {
          defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
          svgEl.insertBefore(defs, svgEl.firstChild)
        }

        if (!defs.querySelector('#arrow-yellow')) {
          const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker')
          marker.setAttribute('id', 'arrow-yellow')
          marker.setAttribute('viewBox', '0 0 10 10')
          marker.setAttribute('refX', '9')
          marker.setAttribute('refY', '5')
          marker.setAttribute('markerWidth', '7')
          marker.setAttribute('markerHeight', '7')
          marker.setAttribute('orient', 'auto')

          const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
          arrowPath.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z')
          arrowPath.setAttribute('fill', '#F5C422')

          marker.appendChild(arrowPath)
          defs.appendChild(marker)
        }
      }

      injectSVGDefs()

      // Cargar GeoJSON de países con colores sólidos elegantes
      fetch('https://cdn.jsdelivr.net/gh/datasets/geo-countries/data/countries.geojson')
        .then(r => r.json())
        .then(data => {
          L.geoJSON(data, {
            style: (feature: any) => {
              const code: string = feature.properties.ISO_A3

              // Argentina la maneja el layer de provincias, acá la ocultamos
              if (code === 'ARG') {
                return { fillOpacity: 0, color: 'transparent', weight: 0, opacity: 0 }
              }

              const style = COUNTRY_STYLES[code]
              if (!style) {
                return { fillOpacity: 0, color: 'transparent', weight: 0, opacity: 0 }
              }
              return {
                fillColor: style.fill,
                fillOpacity: style.opacity,
                color: '#333333',
                weight: 1,
                opacity: 1,
              }
            },
          }).addTo(map)
        })
        .catch(err => console.log('Countries GeoJSON error:', err))

      // Provincias de Argentina
      let provincias: any[] = []
      fetch('https://cdn.jsdelivr.net/gh/mgaitan/latam-geojson@master/argentina-provincias.json')
        .then(r => r.json())
        .then(data => {
          L.geoJSON(data, {
            style: () => ({
              fillColor: '#1a1a1a',
              fillOpacity: 0.7,
              color: '#F5C422',
              weight: 1.2,
              opacity: 0.5
            }),
            onEachFeature: (feature: any) => {
              // Calcular centroide — soporta Polygon y MultiPolygon
              let ring: [number, number][] | null = null
              if (feature.geometry.type === 'Polygon') {
                ring = feature.geometry.coordinates[0]
              } else if (feature.geometry.type === 'MultiPolygon') {
                // usar el anillo más largo (polígono principal)
                let maxLen = 0
                for (const poly of feature.geometry.coordinates) {
                  if (poly[0].length > maxLen) { maxLen = poly[0].length; ring = poly[0] }
                }
              }
              if (!ring) return
              let lat = 0, lng = 0
              ring.forEach((c: [number, number]) => { lng += c[0]; lat += c[1] })
              provincias.push({ lat: lat / ring.length, lng: lng / ring.length })
            },
          }).addTo(map)

          // Flechas animadas desde cada sede hacia cada provincia
          setTimeout(() => {
            SEDES.forEach(sede => {
              provincias.forEach(provincia => {
                const polyline = L.polyline([[sede.lat, sede.lng], [provincia.lat, provincia.lng]], {
                  color: '#F5C422',
                  weight: 1.2,
                  opacity: 0.45,
                  dashArray: '5,7',
                  className: 'animated-route',
                }).addTo(map)
                const el = (polyline as any).getElement() as SVGElement | null
                if (el) el.setAttribute('marker-end', 'url(#arrow-yellow)')
              })
            })
          }, 500)
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
    }).catch(() => null)

    return () => {
      active = false
      if (map) {
        map.remove()
        mapRef.current = null
      }
    }
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
        @keyframes dashMovement {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -10;
          }
        }
        .animated-route {
          animation: dashMovement 3s linear infinite;
        }
      `}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%', minHeight: '420px', background: '#111' }} />
    </>
  )
}

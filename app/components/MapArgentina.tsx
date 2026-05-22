'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'

const PROVINCES_URL = 'https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/argentina-provinces.geojson'

const NEIGHBORS = [
  { url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BRA.geo.json', color: '#0d3d1c', border: '#1a7a35' },
  { url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/URY.geo.json', color: '#0d2a5e', border: '#1a4099' },
  { url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/CHL.geo.json', color: '#5e1010', border: '#992020' },
  { url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/PRY.geo.json', color: '#5e2a0a', border: '#993318' },
  { url: 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BOL.geo.json', color: '#2a1a00', border: '#665500' },
]

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

export default function MapArgentina() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return

    let L: any
    try { L = require('leaflet') } catch { return }

    delete (L.Icon.Default.prototype as any)._getIconUrl

    const map = L.map(containerRef.current, {
      center: [-38, -63],
      zoom: 4,
      zoomControl: true,
      attributionControl: false,
      scrollWheelZoom: false,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 10,
    }).addTo(map)

    // Países vecinos
    NEIGHBORS.forEach(n => {
      fetch(n.url)
        .then(r => r.json())
        .then(data => {
          L.geoJSON(data, {
            style: { fillColor: n.color, fillOpacity: 1, color: n.border, weight: 1 },
          }).addTo(map)
        })
        .catch(() => null)
    })

    // Provincias de Argentina con colores diferenciados
    fetch(PROVINCES_URL)
      .then(r => r.json())
      .then(data => {
        L.geoJSON(data, {
          style: (feature: any) => {
            const name = feature?.properties?.name || ''
            if (PROVINCES_PRIMARY.includes(name)) {
              return { fillColor: '#3a2e00', fillOpacity: 1, color: '#F5C422', weight: 1.8, opacity: 1 }
            }
            if (PROVINCES_SECONDARY.includes(name)) {
              return { fillColor: '#252010', fillOpacity: 1, color: '#F5C422', weight: 1.8, opacity: 1 }
            }
            return { fillColor: '#1a1a1a', fillOpacity: 1, color: '#F5C422', weight: 1.8, opacity: 1 }
          },
          onEachFeature: (feature: any, layer: any) => {
            const name = feature?.properties?.name || ''
            if (PROVINCES_PRIMARY.includes(name) || PROVINCES_SECONDARY.includes(name)) {
              layer.bindTooltip(name, {
                className: 'leaflet-tooltip-dark',
                direction: 'center',
                permanent: false,
              })
            }
          },
        }).addTo(map)
      })
      .catch(() => null)

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
          className: 'leaflet-tooltip-dark',
          direction: 'top',
          offset: [0, -8],
        })
    })

    return () => { map.remove(); mapRef.current = null }
  }, [])

  return (
    <>
      <style>{`
        .leaflet-tooltip-dark {
          background: #111 !important;
          border: 1px solid #facc15 !important;
          color: #fff !important;
          font-size: 12px !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          box-shadow: none !important;
          white-space: nowrap !important;
        }
        .leaflet-tooltip-dark::before { border-top-color: #facc15 !important; }
        .leaflet-control-zoom a { background: #1a1a1a !important; color: #facc15 !important; border-color: #333 !important; }
        .leaflet-control-zoom a:hover { background: #272727 !important; }
        .leaflet-container { background: #111 !important; }
      `}</style>
      <div ref={containerRef} style={{ width: '100%', height: '100%', background: '#111' }} />
    </>
  )
}

import fs from 'fs'
import path from 'path'

export type Noticia = {
  id: number
  fecha: string
  categoria: string
  titulo: string
  resumen: string
  imagen: string
}

export type ClientLogo = { src: string; name: string }

export type SiteContent = {
  heroVideoId: string
  clientLogos: ClientLogo[]
  noticias: Noticia[]
  timelinePhotos: Record<string, string[]>
}

export const defaultSiteContent: SiteContent = {
  heroVideoId: 'iCbLZh_3MyA',
  clientLogos: [
    { src: 'puro-sol.png', name: 'PuroSol' },
    { src: 'surfrigo.png', name: 'Surfrigo' },
  ],
  noticias: [
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
  ],
  timelinePhotos: {},
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'site-content.json')

export function readSiteContent(): SiteContent {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return { ...defaultSiteContent, ...parsed }
  } catch {
    return defaultSiteContent
  }
}

export function writeSiteContent(content: SiteContent) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2))
}

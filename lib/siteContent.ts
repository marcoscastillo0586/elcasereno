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
  historiaGallery: string[]
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
  historiaGallery: [
    '/images/casereno1.png',
    '/images/casereno2.png',
    '/images/casereno3.png',
    '/images/casereno5.png',
  ],
}

const DATA_DIR = path.join(process.cwd(), 'data')
const DATA_FILE = path.join(DATA_DIR, 'site-content.json')

export function readSiteContent(): SiteContent {
  let content = defaultSiteContent
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8')
    content = { ...defaultSiteContent, ...JSON.parse(raw) }
  } catch {
    content = defaultSiteContent
  }

  // Auto-discover images inside public/images/clientes
  try {
    const clientesDir = path.join(process.cwd(), 'public', 'images', 'clientes')
    if (fs.existsSync(clientesDir)) {
      const files = fs.readdirSync(clientesDir)
      const validExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.jfif']
      const registeredSrcs = new Set(content.clientLogos.map(l => l.src))

      for (const f of files) {
        if (f.startsWith('.') || f.endsWith('.crdownload')) continue
        const ext = path.extname(f).toLowerCase()
        if (validExts.includes(ext)) {
          const relPath = `/images/clientes/${f}`
          if (!registeredSrcs.has(f) && !registeredSrcs.has(relPath)) {
            const rawName = path.basename(f, ext)
            const cleanName = rawName.replace(/[-_]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            content.clientLogos.push({
              src: relPath,
              name: cleanName || 'Cliente'
            })
            registeredSrcs.add(relPath)
          }
        }
      }
    }
  } catch {
    /* ignore scan errors */
  }

  // Filter out any clientLogos pointing to /images/clientes/ that no longer exist on disk
  try {
    const clientesDir = path.join(process.cwd(), 'public', 'images', 'clientes')
    content.clientLogos = content.clientLogos.filter(logo => {
      if (logo.src.startsWith('/images/clientes/')) {
        const fileName = logo.src.replace('/images/clientes/', '')
        const fullPath = path.join(clientesDir, fileName)
        return fs.existsSync(fullPath)
      }
      if (!logo.src.startsWith('/') && !logo.src.startsWith('http')) {
        const fullPath = path.join(clientesDir, logo.src)
        return fs.existsSync(fullPath)
      }
      return true
    })
  } catch {
    /* ignore filter errors */
  }

  return content
}

export function writeSiteContent(content: SiteContent) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.writeFileSync(DATA_FILE, JSON.stringify(content, null, 2))
}

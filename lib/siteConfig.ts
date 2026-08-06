// Datos generales del sitio usados en metadata, SEO y datos estructurados.
// Actualizar SITE_URL en .env.local (variable SITE_URL) apenas se defina el
// dominio final de producción.

export const SITE_URL = (process.env.SITE_URL || 'https://www.transporteelcasereno.com.ar').replace(/\/$/, '')

export const SITE_NAME = 'Transporte El Casereño S.A.'

export const SITE_DESCRIPTION = 'Transporte de cargas nacional e internacional con equipos de frío Carrier. Más de 19 años conectando Argentina, Brasil, Uruguay, Chile, Paraguay y Bolivia con seguridad y puntualidad.'

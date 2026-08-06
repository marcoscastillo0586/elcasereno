import 'leaflet/dist/leaflet.css'
import './globals.css'
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '../lib/siteConfig'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Transporte de cargas nacional e internacional`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: 'transporte de cargas, logística, camiones refrigerados, transporte internacional, Monte Caseros, Corrientes, Argentina, El Casereño',
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
  verification: {
    google: 'kXgXmj54Ka6GiPVeCYh7c6gs35O3pdjZpFmCOmGEGbQ',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Transporte de cargas nacional e internacional`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/images/casereno-flota.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} | Transporte de cargas nacional e internacional`,
    description: SITE_DESCRIPTION,
    images: ['/images/casereno-flota.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'MovingCompany',
  name: SITE_NAME,
  image: `${SITE_URL}/images/casereno-flota.png`,
  logo: `${SITE_URL}/images/logos/casereno.png`,
  url: SITE_URL,
  telephone: '+543775408417',
  email: 'recepcion@grupo-jlg.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Av. Libertador nº 1520',
    addressLocality: 'Monte Caseros',
    addressRegion: 'Corrientes',
    addressCountry: 'AR',
  },
  areaServed: ['AR', 'BR', 'UY', 'CL', 'PY', 'BO'],
  sameAs: [
    'https://www.facebook.com/share/1H3te6ykUX/',
    'https://www.instagram.com/transporte.casereno.sa',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  )
}

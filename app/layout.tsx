import 'leaflet/dist/leaflet.css'
import './globals.css'

export const metadata = {
 
  description: 'Empresa especializada en transporte de cargas. Conectamos tu negocio con destino seguro y puntual.',
  keywords: 'transporte, cargas, logística, Argentina, El Casereño',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}

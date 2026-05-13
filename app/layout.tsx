import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'El Casereño - Transporte de Cargas',
  description: 'Empresa especializada en transporte de cargas. Conectamos tu negocio con destino seguro y puntual.',
  keywords: 'transporte, cargas, logística, Argentina, El Casereño',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}

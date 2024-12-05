import './globals.css'
import { VERSION } from '@/app/utils/settings'


export const metadata = {
  title: 'IS-912 / Proyecto',
  description: 'Sistema de login y registro con Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-gray-100 text-center py-4 text-gray-800 fixed bottom-0 w-full">
          <p className='text-sm'>Proyecto Final de Sistemas Expertos / Versión {VERSION} - {new Date().getFullYear()} / Presentado por Kattherine Hernandez / Evaluado por Ing. Uayeb Caballero</p>
        </footer>
      </body>
    </html>
  )
}
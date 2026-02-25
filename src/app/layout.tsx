import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Civilization Command Center — Brandon Sandoval',
  description: 'Real-time operating intelligence dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-950 text-gray-50">{children}</body>
    </html>
  )
}

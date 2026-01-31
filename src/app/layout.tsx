import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['500', '600', '700']
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600']
})

export const metadata: Metadata = {
  title: 'Five Brothers CRM',
  description: 'Customer follow-up and review management system'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body style={{ fontFamily: 'var(--font-body), system-ui, sans-serif' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
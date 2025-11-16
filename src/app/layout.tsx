import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TYPEFORM_CONFIG } from '@/config/typeform'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Beforest 10cent Club | Strategic Wilderness Integration',
  description: 'A strategic conversation about regenerative living and the mathematics of wilderness integration. Saturday 5PM IST.',
  keywords: ['wilderness', 'regenerative living', '10cent club', 'beforest', 'nature integration', 'sustainable living'],
  authors: [{ name: 'Beforest' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  openGraph: {
    title: 'Beforest 10cent Club | Strategic Wilderness Integration',
    description: '10% of your life spent with nature restores 100% of your nature.',
    url: 'https://10cnt.beforest.co',
    siteName: 'Beforest 10cent Club',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Beforest 10cent Club Wilderness Integration',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-arizona">
        {children}
        {TYPEFORM_CONFIG.ENABLED && (
          <script
            src="https://embed.typeform.com/next/embed.js"
            async
          />
        )}
      </body>
    </html>
  )
}
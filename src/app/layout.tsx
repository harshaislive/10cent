import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TYPEFORM_CONFIG } from '@/config/typeform'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://10cnt.beforest.co'),
  title: 'Beforest 10cent Club | Strategic Wilderness Integration',
  description: 'A strategic conversation about regenerative living and the mathematics of wilderness integration. Saturday 5PM IST.',
  keywords: ['wilderness', 'regenerative living', '10cent club', 'beforest', 'nature integration', 'sustainable living'],
  authors: [{ name: 'Beforest' }],
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Beforest 10cent Club | Strategic Wilderness Integration',
    description: '10% of your life spent with nature restores 100% of your nature.',
    url: '/',
    siteName: 'Beforest 10cent Club',
    images: [
      {
        url: '/PBR_0209.jpg',
        width: 1200,
        height: 800,
        alt: 'Beforest 10cent Club Wilderness Integration',
      },
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
  twitter: {
    card: 'summary_large_image',
    title: 'Beforest 10cent Club | Strategic Wilderness Integration',
    description: '10% of your life spent with nature restores 100% of your nature.',
    images: ['/PBR_0209.jpg'],
    creator: '@beforestclub',
    site: '@beforestclub',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
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
          <>
            <script
              src="https://embed.typeform.com/next/embed.js"
              async
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                window.tfAsyncInit = function() {
                  window.tf = window.tf || {};
                  window.tf.createWidget = window.tf.createWidget || function(){};
                };
              `
              }}
            />
          </>
        )}
      </body>
    </html>
  )
}
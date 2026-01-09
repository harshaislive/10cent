import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { TYPEFORM_CONFIG } from '@/config/typeform'
import TypeformChatWrapper from '@/components/TypeformChatWrapper'
import AnalyticsWrapper from '@/components/analytics/AnalyticsWrapper'
import StructuredData, { organizationData, websiteData } from '@/components/seo/StructuredData'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://10cnt.beforest.co'),
  title: 'Beforest 10cent Club | Strategic Wilderness Integration',
  description: 'A strategic conversation about regenerative living and the mathematics of wilderness integration. Saturday 5PM IST.',
  keywords: ['wilderness', 'regenerative living', '10cent club', 'beforest', 'nature integration', 'sustainable living', 'wilderness therapy', 'nature conservation', 'eco-living'],
  authors: [{ name: 'Beforest' }],
  creator: 'Beforest',
  publisher: 'Beforest',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  verification: {
    google: 'your-google-site-verification',
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
      <head>
        {/* Preconnect to Supabase CDN for faster image loading */}
        <link rel="preconnect" href="https://isdbyvwocudnlwzghphw.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://isdbyvwocudnlwzghphw.supabase.co" />

        <AnalyticsWrapper
          gaId={process.env.NEXT_PUBLIC_GA_ID}
          facebookPixelId={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}
        />
      </head>
      <body className="font-arizona">
        <StructuredData data={organizationData} />
        <StructuredData data={websiteData} />
        {children}
        <TypeformChatWrapper />
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

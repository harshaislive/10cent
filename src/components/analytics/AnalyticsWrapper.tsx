'use client'

import { usePathname } from 'next/navigation'
import GoogleAnalytics from './GoogleAnalytics'
import FacebookPixel from './FacebookPixel'

interface AnalyticsWrapperProps {
  gaId?: string
  facebookPixelId?: string
}

export default function AnalyticsWrapper({ gaId, facebookPixelId }: AnalyticsWrapperProps) {
  const pathname = usePathname()
  // Only load analytics in production
  if (process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production' || pathname === '/envision' || pathname.startsWith('/my-year/')) {
    return null
  }

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <FacebookPixel pixelId={facebookPixelId} />
    </>
  )
}

'use client'

import GoogleAnalytics from './GoogleAnalytics'
import FacebookPixel from './FacebookPixel'

interface AnalyticsWrapperProps {
  gaId?: string
  facebookPixelId?: string
}

export default function AnalyticsWrapper({ gaId, facebookPixelId }: AnalyticsWrapperProps) {
  // Only load analytics in production
  if (process.env.NEXT_PUBLIC_ENVIRONMENT !== 'production') {
    return null
  }

  return (
    <>
      <GoogleAnalytics gaId={gaId} />
      <FacebookPixel pixelId={facebookPixelId} />
    </>
  )
}
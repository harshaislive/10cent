'use client'

import { useEffect, useCallback } from 'react'
import { trackEvent, trackPageView, trackingEvents } from '@/utils/analytics'

interface UseAnalyticsOptions {
  trackPageView?: boolean
  customEvents?: Record<string, string>
}

export const useAnalytics = (options: UseAnalyticsOptions = {}) => {
  const { trackPageView: shouldTrackPageView = true, customEvents = {} } = options

  // Track page view on mount and route change
  useEffect(() => {
    if (shouldTrackPageView) {
      trackPageView()
    }
  }, [shouldTrackPageView])

  // Memoized event tracking function
  const track = useCallback(
    (eventName: string, fbEventName?: string, parameters?: Record<string, any>) => {
      // Check if there's a custom mapping for this event
      const customFBEvent = customEvents[eventName] || fbEventName
      trackEvent(eventName, customFBEvent, parameters)
    },
    [customEvents]
  )

  // Specific tracking methods for common events
  const trackFormStart = useCallback(() => {
    track(trackingEvents.FORM_START, trackingEvents.FB_VIEW_CONTENT)
  }, [track])

  const trackFormSubmit = useCallback((parameters?: Record<string, any>) => {
    track(trackingEvents.FORM_SUBMIT, trackingEvents.FB_LEAD, parameters)
  }, [track])

  const trackCTAClick = useCallback((ctaText?: string) => {
    track(trackingEvents.CLICK_CTA, undefined, { cta_text: ctaText })
  }, [track])

  const trackVideoPlay = useCallback((videoTitle?: string) => {
    track(trackingEvents.VIDEO_PLAY, undefined, { video_title: videoTitle })
  }, [track])

  const trackLeadGenerated = useCallback(() => {
    track(trackingEvents.LEAD_GENERATED, trackingEvents.FB_COMPLETE_REGISTRATION)
  }, [track])

  return {
    track,
    trackFormStart,
    trackFormSubmit,
    trackCTAClick,
    trackVideoPlay,
    trackLeadGenerated,
    trackingEvents,
  }
}
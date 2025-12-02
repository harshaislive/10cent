// Google Analytics event tracking
export const trackGAEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, parameters)
  }
}

// Facebook Pixel event tracking
export const trackFBEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters)
  }
}

// Common tracking events
export const trackingEvents = {
  // Form events
  FORM_VIEW: 'FormView',
  FORM_START: 'FormStart',
  FORM_SUBMIT: 'FormSubmit',

  // Navigation events
  PAGE_VIEW: 'page_view',
  CLICK_CTA: 'ClickCTA',
  SCROLL_DEPTH: 'ScrollDepth',

  // Engagement events
  VIDEO_PLAY: 'VideoPlay',
  VIDEO_COMPLETE: 'VideoComplete',
  TIME_ON_PAGE: 'TimeOnPage',

  // Conversion events
  LEAD_GENERATED: 'LeadGenerated',
  SIGNUP_INITIATED: 'SignupInitiated',
  SIGNUP_COMPLETED: 'SignupCompleted',

  // Facebook specific events
  FB_LEAD: 'Lead',
  FB_VIEW_CONTENT: 'ViewContent',
  FB_COMPLETE_REGISTRATION: 'CompleteRegistration',
} as const

// Combined tracking function that tracks both GA and FB
export const trackEvent = (
  eventName: string,
  fbEventName?: string,
  parameters?: Record<string, any>
) => {
  trackGAEvent(eventName, parameters)
  if (fbEventName) {
    trackFBEvent(fbEventName, parameters)
  }
}

// Page view tracking
export const trackPageView = (url?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url || window.location.pathname,
    })
  }

  // Facebook page view is automatically tracked on initialization
}
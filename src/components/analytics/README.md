# Analytics Implementation

This directory contains the analytics components and utilities for the Beforest 10cent Club website.

## Components

### GoogleAnalytics.tsx
- **Purpose**: Integrates Google Analytics (gtag.js) into the website
- **Features**:
  - Asynchronous loading for better performance
  - Automatic page view tracking
  - Environment-aware (only loads in production)

### FacebookPixel.tsx
- **Purpose**: Integrates Facebook Pixel for tracking and ad optimization
- **Features**:
  - Automatic initialization and page view tracking
  - NoScript fallback for better compatibility
  - Environment-aware (only loads in production)

### AnalyticsWrapper.tsx
- **Purpose**: Wrapper component that conditionally loads both analytics
- **Features**:
  - Only loads in production environment
  - Centralized configuration
  - Easy enable/disable

## Environment Variables

Add these to your `.env.local` file:

```bash
# Google Analytics Measurement ID
NEXT_PUBLIC_GA_ID=G-Q2EVCVX7H9

# Facebook Pixel ID
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=your-facebook-pixel-id-here

# Environment (required for conditional loading)
NEXT_PUBLIC_ENVIRONMENT=production
```

## Usage

### Basic Setup

The analytics are automatically integrated in the layout.tsx file. Just ensure you have the environment variables set.

### Tracking Events

Use the `useAnalytics` hook for easy event tracking:

```tsx
'use client'

import { useAnalytics } from '@/hooks/useAnalytics'

export default function MyComponent() {
  const { trackCTAClick, trackFormSubmit } = useAnalytics()

  const handleCTAClick = () => {
    trackCTAClick('Join Now')
    // Your CTA logic here
  }

  const handleFormSubmit = (data: FormData) => {
    trackFormSubmit({
      form_type: 'contact',
      user_email: data.get('email')
    })
    // Your form submission logic here
  }

  return (
    <div>
      <button onClick={handleCTAClick}>
        Join Now
      </button>
    </div>
  )
}
```

### Available Tracking Methods

- `track(eventName, fbEventName?, parameters?)` - Custom event tracking
- `trackFormStart()` - Track when user starts filling a form
- `trackFormSubmit(parameters?)` - Track form submission
- `trackCTAClick(ctaText?)` - Track CTA button clicks
- `trackVideoPlay(videoTitle?)` - Track video playback
- `trackLeadGenerated()` - Track lead generation

### Manual Tracking

You can also use the utility functions directly:

```tsx
import { trackGAEvent, trackFBEvent, trackingEvents } from '@/utils/analytics'

// Track Google Analytics event
trackGAEvent(trackingEvents.CLICK_CTA, {
  cta_text: 'Join Now',
  button_location: 'hero'
})

// Track Facebook Pixel event
trackFBEvent(trackingEvents.FB_LEAD, {
  content_name: '10cent Club Signup'
})
```

## SEO Features

The implementation also includes:

- **Structured Data**: Organization and website schema for better search visibility
- **Meta Tags**: Enhanced Open Graph and Twitter Card tags
- **Robots.txt**: Search engine crawling instructions
- **Sitemap**: Automatic sitemap generation for all pages
- **Performance Optimizations**: Preconnect and DNS prefetch for external domains

## Testing

Analytics only load in production mode. To test in development:

1. Set `NEXT_PUBLIC_ENVIRONMENT=production` in your `.env.local`
2. Use browser developer tools to verify tracking
3. Check Network tab for gtag.js and Facebook Pixel requests
4. Use Google Analytics Debugger extension for GA debugging
5. Use Facebook Pixel Helper extension for Pixel debugging

## Privacy Compliance

- Analytics are only loaded with user consent (implied in production)
- All data is anonymized according to platform policies
- You can easily disable analytics by removing environment variables
- Consider adding a cookie consent banner for GDPR compliance

## Production Checklist

- [ ] Set `NEXT_PUBLIC_ENVIRONMENT=production`
- [ ] Configure `NEXT_PUBLIC_GA_ID` with your Google Analytics ID
- [ ] Configure `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` with your Facebook Pixel ID
- [ ] Test tracking events in production
- [ ] Verify Google Analytics is receiving data
- [ ] Verify Facebook Pixel is receiving data
- [ ] Consider adding cookie consent banner if needed
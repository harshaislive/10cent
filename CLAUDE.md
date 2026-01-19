# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on all interfaces (0.0.0.0)
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - TypeScript type checking without emitting files

### Build & Optimization
- `npm run build:optimized` - Run image optimization then build
- `npm run optimize-images` - Run custom image optimization script (`scripts/optimize-images.js`)
- `npm run analyze` - Build with bundle analyzer (set `ANALYZE=true` in environment)

## Project Architecture

### Technology Stack
- **Next.js 14.2** with App Router (not Pages Router)
- **TypeScript 5.9** with strict mode enabled
- **React 18** with Server Components
- **Tailwind CSS 3.4** for styling
- **Framer Motion 12** for animations
- **Typeform** (`@typeform/embed-react`) for form/chat integration
- **Supabase** (`@supabase/supabase-js`) for trial request storage

### Project Structure
```
src/
├── app/                          # Next.js App Router pages
│   ├── page.tsx                 # Main landing page
│   ├── micro/page.tsx           # Alternative landing page variant
│   ├── v2/page.tsx              # Version 2 variant
│   ├── v2-10percent/page.tsx    # 10percent variant
│   ├── v3/page.tsx              # Version 3 variant
│   ├── confirmation/            # Trial confirmation page
│   ├── feedback/                # Feedback page
│   ├── payment/                 # Payment success/failure pages
│   ├── api/                     # API routes
│   │   ├── phonepe/pay/         # Payment proxy endpoint
│   │   ├── availability/check/  # Availability check endpoint
│   │   ├── trial-request/       # Trial request submission
│   │   ├── schedule-call/       # Callback scheduling
│   │   └── feedback/            # Feedback submission
│   ├── layout.tsx               # Root layout with metadata, analytics, Typeform
│   ├── globals.css              # Global styles with theme variables
│   └── sitemap.ts               # Dynamic sitemap generation
├── components/                   # React components
│   ├── analytics/               # Google Analytics & Facebook Pixel wrappers
│   ├── headings/                # Typography components
│   ├── micro-interactions/      # Interactive elements
│   ├── seo/                     # Structured data, SEO components
│   ├── ui/                      # UI utilities
│   ├── HeroSection.tsx          # Main hero section
│   ├── TrialPaymentModal.tsx    # Payment modal for trial bookings
│   └── Typeform*.tsx            # Multiple Typeform integration components
├── config/
│   └── typeform.ts              # Typeform configuration (FORM_ID, ENABLED, options)
├── hooks/
│   └── useAnalytics.ts          # Analytics event tracking hook
├── types/                       # TypeScript definitions
├── utils/
│   ├── supabaseImage.ts         # Supabase image optimization utilities
│   └── analytics.ts             # Analytics utility functions
└── fonts/                       # Custom Arizona Flare font files
```

### Key Architectural Patterns

**Typeform Integration**: All Typeform configuration is centralized in [`src/config/typeform.ts`](src/config/typeform.ts). The project includes multiple Typeform components:
- `TypeformButton` - Popup button
- `TypeformWidget` - Embedded form
- `TypeformPopupButton` - Enhanced popup
- `TypeformSlider` - Side panel slider
- `TypeformChat` - Chat widget (globally enabled in layout.tsx)

See [`docs/TYPEFORM_COMPONENTS_USAGE.md`](docs/TYPEFORM_COMPONENTS_USAGE.md) for detailed usage.

**Image Optimization**: Next.js Image optimization is enabled (`unoptimized: false`) with WebP/AVIF formats. Images are cached for 1 year.

**Supabase Image Optimization**: All Supabase-hosted images should use the [`getOptimizedImageUrl()`](src/utils/supabaseImage.ts) utility or [`imagePresets`](src/utils/supabaseImage.ts) for automatic optimization:
- `imagePresets.heroDesktop()` - Hero images (1920px width, 75% quality, WebP)
- `imagePresets.heroMobile()` - Mobile hero images (1080px width, 70% quality, WebP)
- `imagePresets.card()` - Card/gallery images (800px width, 70% quality, WebP)
- `imagePresets.heroDesktopFast()` / `heroMobileFast()` - Faster loading variants (lower quality)
- `imagePresets.thumbnail()` - Thumbnails (400px width, 60% quality, WebP)

```typescript
import { imagePresets } from '@/utils/supabaseImage'

const optimizedUrl = imagePresets.heroDesktop(
  'https://xxx.supabase.co/storage/v1/object/public/bucket/image.jpg'
)
// Returns: https://xxx.supabase.co/.../image.jpg?width=1920&quality=75&format=webp
```

See [`docs/IMAGE_OPTIMIZATION.md`](docs/IMAGE_OPTIMIZATION.md) for more details.

**Analytics**: Google Analytics and Facebook Pixel are wrapped in [`AnalyticsWrapper`](src/components/analytics/AnalyticsWrapper.tsx) in the root layout. Use the [`useAnalytics`](src/hooks/useAnalytics.ts) hook for event tracking. Analytics only load in production (see [`analytics/README.md`](src/components/analytics/README.md)).

**Theme System**: CSS custom properties in [`globals.css`](src/app/globals.css) support multiple theme variants (default, v2, v3).

**Standalone Output**: Next.js is configured with `output: 'standalone'` for Docker deployment.

## Environment Variables

### Typeform
- `NEXT_PUBLIC_TYPEFORM_ID` - Typeform form ID (defaults to `'moe6bb'`)

### Analytics
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` - Facebook Pixel ID
- `NEXT_PUBLIC_ENVIRONMENT` - Set to `production` to enable analytics

### Payment Proxy (via experiences.beforest.co)
- `PAYMENT_PROXY_URL` - Proxy URL (default: `https://experiences.beforest.co/api/payment-proxy/initiate`)
- `PAYMENT_PROXY_API_KEY` - API key for proxy authentication
- `NEXT_PUBLIC_BASE_URL` - Base URL for redirects (update in production)

### Supabase (for trial requests)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key

## Payment Integration

The project uses a **Payment Proxy** via `experiences.beforest.co` for PhonePe payments:

**Architecture**: The 10percent site does NOT directly integrate PhonePe. Instead, it proxies payment requests through the experiences site which holds the PhonePe credentials.

**Payment Flow**:
1. User selects trial location and fills form in [`TrialPaymentModal`](src/components/TrialPaymentModal.tsx)
2. [`/api/phonepe/pay`](src/app/api/phonepe/pay/route.ts) forwards to `experiences.beforest.co/api/payment-proxy/initiate`
3. Experiences site creates PhonePe order with its authorized domain
4. User pays via PhonePe checkout
5. PhonePe redirects to experiences callback, which redirects back to 10percent site

**Pages**:
- `/confirmation?action=trial` - Trial location selection
- `/payment/success` - Success page after token purchase
- `/payment/failure` - Payment failure page

**Required Environment Variables**:
- `PAYMENT_PROXY_URL` - Experiences proxy URL (default: `https://experiences.beforest.co/api/payment-proxy/initiate`)
- `PAYMENT_PROXY_API_KEY` - API key for proxy authentication
- `NEXT_PUBLIC_BASE_URL` - Base URL for redirects (update in production)

**Token System**:
- Tokens secure trial stays and adjust toward full subscription
- Tracked in Supabase `trial_payments` table on experiences site

## Import Path Aliases

- `@/*` maps to `./src/*` (configured in tsconfig.json)

## Page Variants

The project includes multiple landing page variants for A/B testing or different audiences:
- `/` - Main landing page ([`src/app/page.tsx`](src/app/page.tsx))
- `/micro` - Micro landing page ([`src/app/micro/page.tsx`](src/app/micro/page.tsx))
- `/v2` - Version 2 ([`src/app/v2/page.tsx`](src/app/v2/page.tsx))
- `/v2-10percent` - 10percent variant ([`src/app/v2-10percent/page.tsx`](src/app/v2-10percent/page.tsx))
- `/v3` - Version 3 ([`src/app/v3/page.tsx`](src/app/v3/page.tsx))
- `/confirmation` - Trial confirmation page ([`src/app/confirmation/page.tsx`](src/app/confirmation/page.tsx))
- `/feedback` - Feedback page ([`src/app/feedback/page.tsx`](src/app/feedback/page.tsx))

## API Routes

- `/api/phonepe/pay` - Payment proxy endpoint (forwards to experiences.beforest.co)
- `/api/availability/check` - Check trial availability (Blyton)
- `/api/trial-request` - Submit trial requests (stores in Supabase)
- `/api/schedule-call` - Schedule callback requests
- `/api/feedback` - Submit feedback forms

## Important Architecture Notes

**Payment Proxy Pattern**: This site does NOT hold PhonePe credentials directly. All payment operations are proxied through `experiences.beforest.co` which is the authorized PhonePe merchant. When working on payment features:
- Never add direct PhonePe SDK integration
- Always use the existing `/api/phonepe/pay` proxy pattern
- Payment flow: 10percent site → experiences proxy → PhonePe → experiences callback → 10percent success/failure

**Analytics Environment Awareness**: Analytics components only load when `NEXT_PUBLIC_ENVIRONMENT=production`. To test analytics locally, temporarily set this in `.env.local`.

**Typeform Global Chat**: The `TypeformChat` widget is globally enabled in `layout.tsx`. To disable it globally, modify `TYPEFORM_CONFIG.ENABLED` or remove from layout.

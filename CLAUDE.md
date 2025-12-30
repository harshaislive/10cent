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
- `npm run analyze` - Build with bundle analyzer (requires `ANALYZE=true`)

## Project Architecture

### Technology Stack
- **Next.js 14.2** with App Router (not Pages Router)
- **TypeScript 5.9** with strict mode enabled
- **Tailwind CSS 3.4** for styling
- **Framer Motion 12** for animations
- **Typeform** for form/chat integration

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Main landing page
│   ├── micro/page.tsx     # Alternative landing page variant
│   ├── v2/page.tsx        # Version 2 variant
│   ├── v3/page.tsx        # Version 3 variant
│   ├── confirmation/      # Trial confirmation page
│   └── layout.tsx         # Root layout with metadata, analytics, Typeform
├── components/            # React components
│   ├── analytics/         # Google Analytics & Facebook Pixel wrappers
│   ├── headings/          # Typography components
│   ├── micro-interactions/ # Interactive elements
│   ├── seo/               # Structured data, SEO components
│   ├── ui/                # UI utilities
│   └── Typeform*.tsx      # Multiple Typeform integration components
├── config/
│   └── typeform.ts        # Typeform configuration (FORM_ID, ENABLED, options)
├── fonts/                 # Custom Arizona Flare font files
├── hooks/                 # Custom React hooks
├── styles/                # Additional styles
├── types/                 # TypeScript definitions
└── utils/                 # Utility functions
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
- `imagePresets.heroDesktop()` - Hero images (1920px width, 70% quality, WebP)
- `imagePresets.heroMobile()` - Mobile hero images (1080px width, 65% quality, WebP)
- `imagePresets.card()` - Card/gallery images (800px width, 70% quality, WebP)

```typescript
import { imagePresets } from '@/utils/supabaseImage'

const optimizedUrl = imagePresets.heroDesktop(
  'https://xxx.supabase.co/storage/v1/object/public/bucket/image.jpg'
)
// Returns: https://xxx.supabase.co/.../image.jpg?width=1920&quality=70&format=webp
```

See [`docs/IMAGE_OPTIMIZATION.md`](docs/IMAGE_OPTIMIZATION.md) for more details.

**Analytics**: Google Analytics and Facebook Pixel are wrapped in [`AnalyticsWrapper`](src/components/analytics/AnalyticsWrapper.tsx) in the root layout.

**Theme System**: CSS custom properties in [`globals.css`](src/app/globals.css) support multiple theme variants (default, v2, v3).

**Standalone Output**: Next.js is configured with `output: 'standalone'` for Docker deployment.

## Environment Variables

### Typeform
- `NEXT_PUBLIC_TYPEFORM_ID` - Typeform form ID (defaults to `'moe6bb'`)

### Analytics
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` - Facebook Pixel ID

### PhonePe Payment Gateway
- `NEXT_PUBLIC_PHONEPE_ENV` - Environment: `UAT` (testing) or `PROD` (production)
- `PHONEPE_MERCHANT_ID` - PhonePe merchant ID
- `PHONEPE_SALT_KEY` - PhonePe salt key for checksum generation
- `PHONEPE_SALT_INDEX` - PhonePe salt index (usually `1`)
- `PHONEPE_UAT_URL` - UAT API URL: `https://api-preprod.phonepe.com/apis/pg-sandbox`
- `PHONEPE_PROD_URL` - Production API URL: `https://api.phonepe.com/apis/hermes`
- `NEXT_PUBLIC_BASE_URL` - Base URL for redirects (update in production)
- `NEXT_PUBLIC_TRIAL_TOKEN_AMOUNT` - Trial token amount (default: `50000` for ₹50,000)

## Payment Integration

The project uses **PhonePe Payment Gateway** for trial token bookings:

**Payment Flow**:
1. User selects trial location and fills form in [`TrialPaymentModal`](src/components/TrialPaymentModal.tsx)
2. [`/api/phonepe/pay`](src/app/api/phonepe/pay/route.ts) initiates payment with PhonePe
3. User is redirected to PhonePe checkout
4. After payment, PhonePe redirects to [`/api/phonepe/checkStatus`](src/app/api/phonepe/checkStatus/route.ts)
5. Status verified server-side, user redirected to success/failure page

**Pages**:
- `/confirmation?action=trial` - Trial location selection (Blyton only available)
- `/payment/success` - Success page after token purchase
- `/payment/failure` - Payment failure page

**Token System**:
- ₹50,000 token secures trial stay
- Fully adjustable toward full subscription (₹17.6 Lakhs)
- Tracked in Supabase `trial_payments` table

**Database Schema**:
- See [`supabase_payment_schema.sql`](supabase_payment_schema.sql) for complete SQL setup

## Import Path Aliases

- `@/*` maps to `./src/*` (configured in tsconfig.json)

## Page Variants

The project includes multiple landing page variants for A/B testing or different audiences:
- `/` - Main landing page ([`src/app/page.tsx`](src/app/page.tsx))
- `/micro` - Micro landing page ([`src/app/micro/page.tsx`](src/app/micro/page.tsx))
- `/v2` - Version 2 ([`src/app/v2/page.tsx`](src/app/v2/page.tsx))
- `/v3` - Version 3 ([`src/app/v3/page.tsx`](src/app/v3/page.tsx))

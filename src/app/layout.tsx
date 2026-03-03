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

        {/* Preload critical hero images for faster LCP */}
        <link
          rel="preload"
          as="image"
          href="https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg"
          imageSrcSet="https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg 1920w, https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg 1280w, https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg 640w"
          imageSizes="100vw"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/5.jpg"
          imageSrcSet="https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/5.jpg 1080w, https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/5.jpg 750w, https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/5.jpg 640w"
          imageSizes="100vw"
          media="(max-width: 768px)"
          fetchPriority="high"
        />

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
        
        {/* User Behavior Tracking Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function() {
              var LS = localStorage;
              var SS = sessionStorage;
              var K = {
                f: 'bf_fv',
                t: 'bf_tv',
                v: 'bf_vc',
                p: 'bf_pg',
                i: 'bf_ic',
                c: 'bf_cf',
                d: 'bf_df',
                r: 'bf_rc'
              };

              var activeSec = 0;
              var maxScroll = 0;
              var clickCount = 0;
              var lastY = scrollY;
              var lastDir = 0;
              var lastDirAt = 0;
              var burst = [];
              var currentPage = 'home';
              var pageStartTime = Date.now();
              var popupOpened = false;

              if (!LS.getItem(K.f)) {
                LS.setItem(K.f, new Date().toISOString().slice(0, 16).replace('T', ' '));
              }
              if (!SS.getItem(K.v)) {
                LS.setItem(K.t, String((parseInt(LS.getItem(K.t) || '0', 10) || 0) + 1));
                SS.setItem(K.v, '1');
              }

              function saveCurrentPageData() {
                var timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
                var scrollDepth = Math.round((scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100);
                if (scrollDepth > 100) scrollDepth = 100;
                if (scrollDepth < 0) scrollDepth = 0;
                var label = classifyLabel(timeSpent, scrollDepth);

                var pageData = { pg: currentPage, ts: timeSpent, sc: scrollDepth, lb: label };
                var arr = JSON.parse(LS.getItem(K.p) || '[]');
                if (!Array.isArray(arr)) { arr = []; }
                arr.push(pageData);
                if (arr.length > 12) { arr = arr.slice(-12); }
                LS.setItem(K.p, JSON.stringify(arr));
              }

              function classifyLabel(time, scroll) {
                if (time < 15 && scroll < 25 && clickCount === 0) { return 'Bounced'; }
                if (scroll >= 60 || (time >= 45 && scroll >= 35) || LS.getItem(K.i) === 'true') { return 'Meaningful'; }
                return 'Skimming';
              }

              setInterval(function() {
                if (!popupOpened && document.visibilityState === 'visible') { activeSec++; }
              }, 1000);

              addEventListener('scroll', function() {
                var doc = document.documentElement;
                var h = Math.max(doc.scrollHeight - innerHeight, 1);
                var p = Math.round(scrollY / h * 100);
                if (p > maxScroll) { maxScroll = p; }

                var y = scrollY;
                var dir = y > lastY ? 1 : y < lastY ? -1 : 0;
                var t = Date.now();

                if (dir && lastDir && dir !== lastDir && (t - lastDirAt) < 1200) {
                  LS.setItem(K.c, String((parseInt(LS.getItem(K.c) || '0', 10) || 0) + 1));
                }
                if (dir) { lastDir = dir; lastDirAt = t; }
                lastY = y;
              }, { passive: true });

              addEventListener('click', function(e) {
                clickCount++;
                var t = Date.now();
                burst.push({ t: t, x: e.clientX, y: e.clientY });
                burst = burst.filter(function(b) { return (t - b.t) < 800; });
                if (burst.length >= 3 && burst.every(function(b) {
                  return Math.abs(b.x - burst[0].x) < 30 && Math.abs(b.y - burst[0].y) < 30;
                })) {
                  LS.setItem(K.r, String((parseInt(LS.getItem(K.r) || '0', 10) || 0) + 1));
                  burst = [];
                }
              }, true);

              document.addEventListener('copy', function() { LS.setItem(K.i, 'true'); });
              document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                  LS.setItem(K.d, String((parseInt(LS.getItem(K.d) || '0', 10) || 0) + 2));
                }
              });

              document.addEventListener('beforeunload', function() {
                saveCurrentPageData();
              });

              setInterval(function() {
                LS.setItem(K.d, String((parseInt(LS.getItem(K.d) || '0', 10) || 0) + 1));
              }, 90000);

              function buildJourney() {
                var arr = [];
                try {
                  var raw = LS.getItem(K.p);
                  if (raw) {
                    var parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                      arr = parsed.filter(function(item) { return item && item.pg; });
                    }
                  }
                } catch (e) { arr = []; }

                var str = arr.map(function(item) {
                  if (!item || !item.pg) { return ''; }
                  return item.pg + '(' + (item.ts || 0) + 's|' + (item.sc || 0) + '%|' + (item.lb || 'Skimming') + ')';
                }).filter(function(s) { return s; }).join(' > ');

                if (str.length > 240) { str = str.slice(0, 240); }
                return str;
              }

              function getHiddenFields() {
                saveCurrentPageData();
                
                var timeSpent = Math.round((Date.now() - pageStartTime) / 1000);
                var scrollDepth = Math.round((scrollY / (document.documentElement.scrollHeight - innerHeight)) * 100);
                if (scrollDepth > 100) scrollDepth = 100;
                if (scrollDepth < 0) scrollDepth = 0;

                return {
                  utm_time_spent: timeSpent + 's',
                  current_page: currentPage,
                  behavioral_journey: buildJourney(),
                  total_visits: LS.getItem(K.t) || '1',
                  first_visit: LS.getItem(K.f) || '',
                  distraction_score: LS.getItem(K.d) || '0',
                  intent_copy: LS.getItem(K.i) === 'true' ? 'true' : 'false',
                  device: /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
                  rage_clicks: LS.getItem(K.r) || '0',
                  confusion_score: LS.getItem(K.c) || '0'
                };
              }

              window.__getTypeformData = getHiddenFields;

              setInterval(function() {
                LS.setItem(K.d, String((parseInt(LS.getItem(K.d) || '0', 10) || 0) + 1));
              }, 90000);
            })();
            `
          }}
        />
      </body>
    </html>
  )
}

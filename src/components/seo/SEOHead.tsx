import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  canonical?: string
  image?: string
  type?: 'website' | 'article'
  structuredData?: Record<string, any>
}

export default function SEOHead({
  title = 'Beforest 10cent Club | Strategic Wilderness Integration',
  description = 'A strategic conversation about regenerative living and the mathematics of wilderness integration. Saturday 5PM IST.',
  keywords = ['wilderness', 'regenerative living', '10cent club', 'beforest', 'nature integration', 'sustainable living'],
  canonical,
  image = '/PBR_0209.jpg',
  type = 'website',
  structuredData
}: SEOHeadProps) {
  return (
    <Head>
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="author" content="Beforest" />
      <meta name="theme-color" content="#10B981" />

      {/* Keywords */}
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Additional Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="Beforest 10cent Club Wilderness Integration" />

      {/* Additional Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@beforestclub" />
      <meta name="twitter:site" content="@beforestclub" />

      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://embed.typeform.com" />
      <link rel="preconnect" href="https://www.googletagmanager.com" />
      <link rel="preconnect" href="https://connect.facebook.net" />

      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//connect.facebook.net" />
      <link rel="dns-prefetch" href="//embed.typeform.com" />
    </Head>
  )
}
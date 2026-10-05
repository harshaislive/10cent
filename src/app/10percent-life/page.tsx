import type { Metadata } from 'next'
import { ShortWalkthrough } from '@/components/walkthrough/ShortWalkthrough'
import { shortWalkthroughHref } from '@/lib/walkthrough/handoff'
import '@/components/walkthrough/short-walkthrough.css'

export const metadata: Metadata = {
  title: 'Stay in nature. Come back throughout the year. | Beforest 10% Life',
  description: 'A membership for regular stays in Beforest’s forests and farms, without buying a holiday home. Envision your year, then explore a trial stay at Blyton.',
  alternates: { canonical: 'https://10percent.beforest.co/10percent-life' },
  openGraph: {
    title: 'Stay in nature. Come back throughout the year. | Beforest 10% Life',
    description: 'Regular stays in Beforest’s forests and farms. See how these stays could fit into your year.',
    url: 'https://10percent.beforest.co/10percent-life',
    images: [{ url: 'https://10percent.beforest.co/PBR_0209.webp', width: 1920, height: 1280, alt: 'Time to read beneath the Beforest canopy' }],
  },
  twitter: {
    card: 'summary_large_image', title: 'Stay in nature. Come back throughout the year. | Beforest 10% Life',
    description: 'Regular stays in nature, without buying a holiday home. Envision your year.', images: ['https://10percent.beforest.co/PBR_0209.webp'],
  },
}

export default function ShortWalkthroughPage({ searchParams }: { searchParams?: Record<string, string | string[] | undefined> }) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(searchParams || {})) {
    const first = Array.isArray(value) ? value[0] : value
    if (first) query.set(key, first)
  }
  return <ShortWalkthrough initialHref={shortWalkthroughHref(query.toString())} />
}

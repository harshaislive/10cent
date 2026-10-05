import type { Metadata } from 'next'
import { ShortWalkthrough } from '@/components/walkthrough/ShortWalkthrough'
import { shortWalkthroughHref } from '@/lib/walkthrough/handoff'
import '@/components/walkthrough/short-walkthrough.css'

export const metadata: Metadata = {
  title: 'A little room to return | Beforest 10% Life',
  description: 'The 10% Life, in a few quiet moments. Get to know Beforest landscapes, then picture a year with room to return.',
  alternates: { canonical: 'https://10percent.beforest.co/10percent-life' },
  openGraph: {
    title: 'A little room to return | Beforest 10% Life',
    description: 'Living landscapes. Time to return. A year that feels more like you.',
    url: 'https://10percent.beforest.co/10percent-life',
    images: [{ url: 'https://10percent.beforest.co/PBR_0209.webp', width: 1920, height: 1280, alt: 'Time to read beneath the Beforest canopy' }],
  },
  twitter: {
    card: 'summary_large_image', title: 'A little room to return | Beforest 10% Life',
    description: 'Get to know the idea, then envision your own year.', images: ['https://10percent.beforest.co/PBR_0209.webp'],
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

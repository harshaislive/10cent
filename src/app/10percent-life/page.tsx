import type { Metadata } from 'next'
import { ShortWalkthrough } from '@/components/walkthrough/ShortWalkthrough'
import { shortWalkthroughHref } from '@/lib/walkthrough/handoff'
import '@/components/walkthrough/short-walkthrough.css'

export const metadata: Metadata = {
  title: 'A year with room for the wilderness | Beforest 10% Life',
  description: 'Give time in nature a place in your year. Get to know Beforest landscapes, envision your own calendar, then explore a trial stay at Blyton.',
  alternates: { canonical: 'https://10percent.beforest.co/10percent-life' },
  openGraph: {
    title: 'A year with room for the wilderness | Beforest 10% Life',
    description: 'Somewhere to return to. Time set aside. Picture it in your own year.',
    url: 'https://10percent.beforest.co/10percent-life',
    images: [{ url: 'https://10percent.beforest.co/PBR_0209.webp', width: 1920, height: 1280, alt: 'Time to read beneath the Beforest canopy' }],
  },
  twitter: {
    card: 'summary_large_image', title: 'A year with room for the wilderness | Beforest 10% Life',
    description: 'Give time in nature a place in your year. Start with your own calendar.', images: ['https://10percent.beforest.co/PBR_0209.webp'],
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

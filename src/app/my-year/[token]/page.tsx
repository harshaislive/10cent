import type { Metadata } from 'next'
import { PersonalYear } from '@/components/envision/PersonalYear'
import '@/components/envision/envision.css'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Your possible year | Beforest 10percent',
  robots: { index: false, follow: false }, referrer: 'no-referrer',
}
export default function MyYearPage({ params }: { params: { token: string } }) { return <PersonalYear token={params.token} /> }

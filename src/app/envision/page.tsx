import type { Metadata } from 'next'
import { EnvisionExperience } from '@/components/envision/EnvisionExperience'
import '@/components/envision/envision.css'

export const metadata: Metadata = {
  title: 'Envision your year | Beforest 10percent',
  description: 'Make room for time in Beforest landscapes. Picture a possible year that fits your life.',
}
export default function EnvisionPage() { return <EnvisionExperience /> }

import Image from 'next/image'
import TrialConfirmationView from './TrialConfirmationView'

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

export default function ConfirmationPage({ searchParams }: PageProps) {
  const action = typeof searchParams.action === 'string' ? searchParams.action : null
  const email = typeof searchParams.email === 'string' ? searchParams.email : null

  return (
    <main className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-0 relative overflow-x-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Simple Texture Fallback or just Gradients */}
        <div className="absolute inset-0 bg-[#fdfbf7]" />

        {/* Subtle Gradient */}
        <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#fdfbf7] to-transparent opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#342e29]/5 to-transparent opacity-50" />
      </div>

      <div className="w-full relative">
        <TrialConfirmationView action={action} email={email} />
      </div>
    </main>
  )
}
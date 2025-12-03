'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense, useEffect, useRef } from 'react'
import { ArrowLeft } from 'lucide-react'

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  const email = searchParams.get('email')
  const fired = useRef(false)

  useEffect(() => {
    // Fire webhook once if action and email are present
    if (action && email && !fired.current) {
      fired.current = true
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

      if (webhookUrl) {
        fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            action, 
            email, 
            source: 'webinar_email_confirmation',
            timestamp: new Date().toISOString() 
          })
        }).catch(err => console.error('Webhook trigger failed:', err))
      } else {
        console.warn('Webhook URL not configured (NEXT_PUBLIC_N8N_WEBHOOK_URL)')
      }
    }
  }, [action, email])

  const content = {
    subscribe: {
      title: "The Path Chosen.",
      message: "Thank you for your commitment. A team member will call you within 24-48 hours to assist with the payment and finalize your subscription to the 10% Club.",
      sub: "Welcome to the fold."
    },
    trial: {
      title: "The Trial.",
      message: "We have received your request. Our team will contact you shortly to schedule your trial stay at one of our Collectives.",
      sub: "Experience the wilderness first."
    },
    optout: {
      title: "Pause.",
      message: "We've updated your preferences. The wilderness will be here when you are ready.",
      sub: "See you down the road."
    },
    default: {
      title: "Acknowledged.",
      message: "We have received your response.",
      sub: ""
    }
  }

  const current = content[action as keyof typeof content] || content.default

  return (
    <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-light text-[#342e29] mb-8 font-arizona">
          {current.title}
        </h1>
        <p className="text-xl md:text-2xl text-[#342e29]/80 leading-relaxed mb-12 font-arizona font-light">
          {current.message}
        </p>
        {current.sub && (
          <p className="text-[#86312b] uppercase tracking-widest text-sm font-bold mb-16">
            {current.sub}
          </p>
        )}
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-[#342e29] hover:text-[#86312b] transition-colors border-b border-[#342e29]/20 hover:border-[#86312b] pb-1 uppercase tracking-widest text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Return Home
        </Link>
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-[#fdfbf7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-[#fdfbf7] to-transparent opacity-50" />
         <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#fdfbf7] to-transparent opacity-50" />
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 opacity-20 grayscale hover:grayscale-0 transition-all duration-700">
        <Image 
           src="/10-Club-01.png"
           alt="Beforest 10% Club"
           width={80}
           height={80}
        />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <ConfirmationContent />
      </Suspense>
    </main>
  )
}
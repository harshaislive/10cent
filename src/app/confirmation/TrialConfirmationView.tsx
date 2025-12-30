'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight, Calendar, Compass, MapPin, CreditCard, Phone, Stars, Coffee, Tent } from 'lucide-react'
import { motion } from 'framer-motion'
import TrialLocationCard from '@/components/TrialLocationCard'
import TrialRequestModal from '@/components/TrialRequestModal'
import TrialDetailModal from '@/components/TrialDetailModal'
import { imagePresets } from '@/utils/supabaseImage'

// Trial Locations Data - Only Blyton is available for trial
const AVAILABLE_LOCATION = {
  name: "Blyton, Coorg",
  tagline: "Misty forests. Colonial charm meets wilderness immersion.",
  description: "The architecture of the Western Ghats is not built; it is grown. The Blyton Bungalow respects this law. Constructed from the earth it stands on, overlooking the canopy, it is a place to sleep with the windows open and wake to the call of the Malabar Whistling Thrush. A heritage property wrapped in dense forest, where colonial elegance dissolves into the wild, and silence becomes your companion.",
  features: [
    "128-acre Poomaale Estate",
    "Coffee forest immersion",
    "Traditional Kodava Ainmanes architecture",
    "Laterite stone walls",
    "Mangalore tile roofing",
    "Malabar Whistling Thrush habitat",
    "Western Ghats biodiversity hotspot"
  ],
  images: [
    {
      desktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/blyton.webp",
      mobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/blyton.webp"
    },
    {
      desktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/IMG_1197-HDR%20(1).jpg",
      mobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/IMG_1197-HDR%20(1).jpg"
    },
    {
      desktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_3748.jpg",
      mobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_3748.jpg"
    },
    {
      desktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_3868.jpg",
      mobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_3868.jpg"
    },
    {
      desktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_7194.jpg",
      mobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_7194.jpg"
    },
    {
      desktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_8377.jpg",
      mobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_8377.jpg"
    },
    {
      desktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_9936.jpg",
      mobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/blyton/PBR_9936.jpg"
    }
  ]
}

// --- Utility Components ---
const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
)

const SectionHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
  <div className="flex flex-col gap-4 mb-12 md:mb-20 text-[#342e29]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4"
    >
      <span className="text-sm font-medium tracking-[0.2em] uppercase py-1 px-2 border border-[#342e29]/30">
        {number}
      </span>
      <div className="h-px flex-1 bg-[#342e29]/20" />
    </motion.div>
    <div className="overflow-hidden">
      <motion.h2
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight font-arizona"
      >
        {title}
      </motion.h2>
    </div>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="max-w-md text-lg md:text-xl font-arizona italic opacity-80 ml-auto mr-0 md:mr-12 text-right"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
)

interface ConfirmationClientProps {
  action: string | null
  email: string | null
}

export default function TrialConfirmationView({ action, email }: ConfirmationClientProps) {
  const fired = useRef(false)

  // Booking Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Detail Modal State
  const [showDetailModal, setShowDetailModal] = useState(false)

  const handleCardClick = () => {
    setShowDetailModal(true)
  }

  const handleBookFromDetail = () => {
    setShowDetailModal(false)
    setIsModalOpen(true)
  }

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

  // Trial action - Show enhanced page with locations
  if (action === 'trial') {
    return (
      <div className="w-full relative z-10 bg-[#fdfbf7] text-[#342e29] font-arizona">
        <NoiseOverlay />

        {/* Logo Header */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 flex justify-between items-center py-8">
          <Link href="/" className="transition-opacity hover:opacity-70">
            <div className="relative w-16 h-16 md:w-20 md:h-20 grayscale hover:grayscale-0 transition-all duration-500">
              <Image
                src="/10-Club-01.png"
                alt="Beforest 10% Club"
                fill
                className="object-contain"
              />
            </div>
          </Link>
          <div className="hidden md:block text-xs uppercase tracking-widest opacity-60">
            The Art of Return
          </div>
        </div>

        {/* Trial Request Modal */}
        <TrialRequestModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          locationName={AVAILABLE_LOCATION.name}
          location="blyton_coorg"
          locationSlug="blyton_coorg"
        />

        {/* Detail Modal (Gallery + Info) */}
        <TrialDetailModal
          isOpen={showDetailModal}
          onClose={() => setShowDetailModal(false)}
          location={AVAILABLE_LOCATION}
          onBook={handleBookFromDetail}
        />

        {/* Hero Section - Editorial Style */}
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-12 pt-12 md:pt-24">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 md:col-span-9">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-[12vw] md:text-[8vw] leading-[0.8] tracking-tighter font-light text-[#342e29] mb-8 mix-blend-multiply">
                  The Trial.
                </h1>
              </motion.div>
            </div>
            <div className="col-span-12 md:col-span-3 flex flex-col justify-end items-end text-right">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-lg md:text-xl leading-relaxed opacity-80 max-w-[320px]"
              >
                One sanctuary. Available now.<br />
                <span className="text-[#342e29] font-medium border-b border-[#342e29]/20 pb-1">Click to explore</span> and begin your 10% trial.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Full-width Location Card */}
        <div className="w-full h-[85vh] md:h-[90vh] mb-32 overflow-hidden border-y border-[#342e29]/10 relative">
          <TrialLocationCard
            {...AVAILABLE_LOCATION}
            index={0}
            onBook={handleCardClick}
            className="h-full"
            heightClass="h-full"
          />
        </div>

        {/* Trial Details Section - Editorial Redesign */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="max-w-[1800px] mx-auto mb-32 px-6 md:px-12"
        >
          <SectionHeader
            number="01"
            title="The Journey Ahead."
            subtitle="From request to arrival."
          />

          {/* The Process - Horizontal Timeline */}
          <div className="mb-40 mt-24">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
              {/* Connecting Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-0 right-0 h-px bg-[#342e29]/10 -z-10" />

              {[
                {
                  step: "01",
                  title: "Request",
                  desc: "Select your preferred sanctuary and submit a request.",
                  icon: MapPin
                },
                {
                  step: "02",
                  title: "Verify",
                  desc: "Our community team contacts you to verify details.",
                  icon: Phone
                },
                {
                  step: "03",
                  title: "Secure",
                  desc: "₹1 adjustable token secures your dates.",
                  icon: CreditCard
                },
                {
                  step: "04",
                  title: "Arrive",
                  desc: "Receive your guide and arrive at the sanctuary.",
                  icon: Compass
                }
              ].map((item, i) => (
                <div key={i} className="text-center group">
                  <div className="w-24 h-24 mx-auto bg-[#fdfbf7] border border-[#342e29]/10 rounded-full flex items-center justify-center mb-8 relative z-10 group-hover:border-[#86312b] transition-colors duration-500">
                    <span className="font-arizona text-3xl text-[#342e29]/20 font-light group-hover:text-[#86312b] transition-colors duration-500">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-arizona text-[#342e29] mb-4 font-light">{item.title}</h3>
                  <p className="text-[#342e29]/60 font-arizona text-sm leading-relaxed max-w-[200px] mx-auto">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <SectionHeader
            number="02"
            title="The Experience."
            subtitle="What to expect."
          />

          {/* The Experience - 2x2 Grid with Imagery */}
          <div className="grid md:grid-cols-2 gap-px bg-[#342e29]/10 border border-[#342e29]/10 overflow-hidden mt-20">
            {[
              {
                title: "Time Unbound",
                desc: "2 nights / 3 days. Long enough to forget the city, short enough to return.",
                icon: Calendar
              },
              {
                title: "All Inclusive",
                desc: "Farm-to-table meals, guided walks, and curated experiences included.",
                icon: Coffee
              },
              {
                title: "Wilderness First",
                desc: "Not a hotel. A sanctuary. Nature dictates the rhythm here.",
                icon: Stars
              },
              {
                title: "The 10% Life",
                desc: "A firsthand trial of the lifestyle we've built for our members.",
                icon: Tent
              }
            ].map((item, i) => (
              <div key={i} className="bg-[#fdfbf7] p-12 md:p-24 flex flex-col items-center text-center hover:bg-[#fffdf9] transition-colors duration-500 group">
                <item.icon className="w-10 h-10 text-[#86312b] mb-8 opacity-80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
                <h3 className="text-3xl font-arizona text-[#342e29] mb-4 font-light">{item.title}</h3>
                <p className="text-[#342e29]/60 font-arizona leading-relaxed max-w-sm text-lg">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-32 text-center">
            <p className="font-arizona text-3xl md:text-5xl text-[#342e29]/30 italic font-light leading-tight">
              "The wilderness doesn't rush,<br />and neither do we."
            </p>
          </div>
        </motion.div>

        {/* Return Home Link */}
        <div className="text-center pb-24 max-w-[1800px] mx-auto px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#342e29] hover:text-[#86312b] transition-colors border-b border-[#342e29]/20 hover:border-[#86312b] pb-1 uppercase tracking-widest text-xs font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div >
    )
  }

  // Other actions - Simple message format
  const content = {
    subscribe: {
      title: "The Path Chosen.",
      message: "Thank you for your commitment. A team member will call you within 24-48 hours to assist with the payment and finalize your subscription to the 10% Club.",
      sub: "Welcome to the fold."
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
    <div className="max-w-2xl mx-auto text-center relative z-10">
      <h1 className="text-4xl md:text-6xl font-light text-[#342e29] mb-8 font-arizona">
        {current.title}
      </h1>
      <p className="text-xl md:text-2xl text-[#342e29]/80 leading-relaxed mb-12 font-arizona font-light">
        {current.message}
      </p>
      {current.sub && (
        <p className="text-[#86312b] uppercase tracking-widest text-sm font-medium mb-16">
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

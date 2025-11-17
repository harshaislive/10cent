'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { HeroMainHeading, HeroSubHeading } from './headings'
import { headlineVariations } from './content/heroContent'
import { getNextSaturdayWithTime } from '@/utils/dateUtils'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0">
        <Image
          src="/PBR_0209.jpg"
          alt="Wilderness landscape"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container-max">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left Panel - Subject Space */}
            <div className="flex items-center justify-center">
              <div className="w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center">
                {/* Placeholder for centered subject/person */}
              </div>
            </div>

            {/* Right Panel - Text Content */}
            <div className="text-right space-y-8">
              <HeroTextContent isLoaded={isLoaded} />
            </div>

          </div>
        </div>
      </div>

      
      
      {/* Overlay Elements */}
      <HeroOverlayElements />
    </section>
  )
}

// Extracted text content component
function HeroTextContent({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div className="relative text-right max-w-xl lg:max-w-2xl">
      {/* Right edge line anchor */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20" />

      {/* Tagline */}
      <AnimatedWrapper delay={0} isLoaded={isLoaded}>
        <div className="mb-6 pr-8">
          <HeroSubHeading
            background="dark"
            size="sm"
            className="text-white/60 leading-relaxed"
          >
            30 nights a year. Your turn to pause, breathe, and return.
          </HeroSubHeading>
        </div>
      </AnimatedWrapper>

      {/* Main Heading */}
      <AnimatedWrapper delay={200} isLoaded={isLoaded}>
        <div className="mb-20 md:mb-28 lg:mb-32 min-h-[3rem] lg:min-h-[4rem] pr-8">
          <HeroMainHeading
            background="dark"
            typewriter
            variations={headlineVariations}
            className="leading-tight"
          />
        </div>
      </AnimatedWrapper>

      {/* Button */}
      <AnimatedWrapper delay={400} isLoaded={isLoaded}>
        <div className="mb-8 pr-8">
          <a
            href="#access"
            className="btn-primary inline-block text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Join The Conversation
          </a>
        </div>
      </AnimatedWrapper>

      {/* Date */}
      <AnimatedWrapper delay={600} isLoaded={isLoaded}>
        <div className="pr-8">
          <p className="text-white/50 text-sm font-light tracking-widest uppercase">
            {getNextSaturdayWithTime()}
          </p>
        </div>
      </AnimatedWrapper>

    </div>
  )
}

// Reusable animation wrapper
function AnimatedWrapper({
  children,
  delay,
  isLoaded
}: {
  children: React.ReactNode
  delay: number
  isLoaded: boolean
}) {
  return (
    <div
      className={`transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Extracted overlay elements
function HeroOverlayElements() {
  return (
    <>
      {/* Logo */}
      <div className="absolute top-8 right-8 z-20">
        <img
          src="/23-Beforest-Black-with-Tagline.png"
          alt="Beforest Club"
          className="h-8 md:h-10 w-auto invert"
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white/60"
          >
            <path
              d="M12 5v14M19 12l-7 7-7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  )
}
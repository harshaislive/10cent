'use client'

import { useState, useEffect } from 'react'
import { HeroSubHeading, EditorialHeading, MastheadInfo } from './headings'

export default function MicroHeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-stone-100 via-amber-50/20 to-stone-50">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative z-10 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">

          {/* Editorial Masthead - Refactored */}
          <MastheadInfo
            isLoaded={isLoaded}
            title="Beforest Club"
            subtitle="Return to Yourself"
            className="mb-16"
          />

          {/* Top Subheading */}
          <HeroSubHeading
            background="light"
            size="2xl"
            weight="light"
            variant="accent"
            animation={{ type: 'fade-in', delay: 200 }}
            className="mb-8 leading-tight"
          >
            30 nights a year. Your turn to pause, breathe, and return.
          </HeroSubHeading>

          {/* Drop Cap Style Headline - Refactored */}
          <EditorialHeading
            dropCap
            accent="3"
            accentColor="amber"
            isLoaded={isLoaded}
            animationDelay={300}
            className="mb-12 text-left font-serif"
          >
            0 nights at a time.
          </EditorialHeading>

          {/* Main Subheading - Refactored */}
          <HeroSubHeading
            background="light"
            size="lg"
            weight="light"
            variant="primary"
            animation={{ type: 'fade-in', delay: 500 }}
            className="mb-8 leading-relaxed"
          >
            Because the most important meetings are the ones you take with yourself.
          </HeroSubHeading>

          {/* Supporting Text - Refactored */}
          <HeroSubHeading
            background="light"
            size="md"
            weight="normal"
            variant="secondary"
            animation={{ type: 'fade-in', delay: 700 }}
            className="mb-16"
          >
            30 nights a year. For 10%. Across India's wildest landscapes.
          </HeroSubHeading>

          {/* CTA - Enhanced with proper animation */}
          <div className={`text-center mt-16 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`} style={{ transition: 'opacity 1s ease-in 0.6s' }}>
            <a href="#apply" className="inline-block px-12 py-4 bg-amber-600 text-white font-serif text-lg tracking-wide hover:bg-amber-700 transition-colors duration-300">
              Apply now
            </a>
          </div>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-stone-400 animate-bounce">
          <path d="M10 3v14M17 10l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  )
}
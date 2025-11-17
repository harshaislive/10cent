'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { HeroMainHeading, HeroSubHeading, MastheadInfo, PhilosophyCard, MemberQuote } from './headings'

export default function HeroSectionMicro() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239E3430' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-max relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Editorial Header - Refactored */}
          <MastheadInfo
            isLoaded={isLoaded}
            title="Beforest Club"
            subtitle="Return to Yourself"
            className="mb-12"
          />

          {/* Main Headline - Refactored with new component */}
          <HeroMainHeading
            background="light"
            animation={{ type: 'slide-up', delay: 200 }}
            className="mb-8 text-center"
          >
            <span className="text-3xl md:text-4xl lg:text-5xl text-brand-red font-semibold">30 nights at a time.</span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl">
              Because the most important meetings are the ones you take with yourself.
            </span>
          </HeroMainHeading>

          {/* Editorial Sub-headline - Refactored */}
          <HeroSubHeading
            background="light"
            size="md"
            weight="light"
            variant="secondary"
            animation={{ type: 'slide-up', delay: 400 }}
            className="mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            30 nights a year. For 10%. Across India's wildest landscapes.
          </HeroSubHeading>

          {/* Philosophy in Numbers - Refactored */}
          <PhilosophyCard
            isLoaded={isLoaded}
            animationDelay={500}
            className="mb-12"
          />

          {/* The Member Profile - Refactored */}
          <MemberQuote
            isLoaded={isLoaded}
            animationDelay={700}
            className="mb-12"
          />

          {/* Why Now Section - Refactored */}
          <div className={`mb-16 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transition: 'all 1s ease-in 0.9s' }}>
            <div className="text-center">
              <HeroSubHeading
                background="light"
                size="md"
                weight="normal"
                variant="secondary"
                className="mb-4"
              >
                Because we're opening to only <span className="text-brand-red font-bold">150 members</span>.
              </HeroSubHeading>
              <HeroSubHeading
                background="light"
                size="md"
                weight="light"
                variant="secondary"
                className="mb-4"
              >
                Because your inner landscape could use a little rewinding.
              </HeroSubHeading>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 ${
            isLoaded ? 'animate-up' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '1.1s' }}>
            <a href="#access" className="btn-primary text-lg px-12 py-6 shadow-xl">
              Apply now
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-text-secondary">
              <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-sustainable-green/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-brand-red/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-40 right-20 w-16 h-16 bg-sustainable-green/20 rounded-full animate-float" style={{ animationDelay: '4s' }} />
    </section>
  )
}
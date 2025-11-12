'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Image with Overlay */}
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
      
      
      <div className="container-max relative z-10 h-screen flex items-center">
        <div className="grid md:grid-cols-2 gap-12 items-center w-full">
          {/* Left: Center Space for Subject */}
          <div className="flex items-center justify-center">
            {/* This space is intentionally empty/centered for the subject in your image */}
            <div className="w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
              {/* Your image subject (person) should be centered here */}
            </div>
          </div>

          {/* Right: Text Content (Right-Aligned) */}
          <div className="text-right">
            {/* Date Stamp */}
            <div className={`mb-6 text-sm text-white/80 tracking-widest uppercase ${
              isLoaded ? 'animate-in' : 'opacity-0'
            }`}>
              Saturday, 6:00 PM IST, 15 Nov 2025
            </div>

            {/* Main Headline */}
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-arizona font-light leading-tight mb-6 text-white ${
              isLoaded ? 'animate-in' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.2s' }}>
              27 meetings this quarter.
              <br />
              <span className="text-3xl md:text-4xl lg:text-5xl font-arizona font-light text-brand-red">
                How many with yourself?
              </span>
            </h1>

            {/* Sub-headline */}
            <p className={`text-base md:text-lg text-white/90 mb-8 max-w-lg leading-relaxed font-arizona ml-auto ${
              isLoaded ? 'animate-up' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.4s' }}>
              Because the most important meetings are the ones you take with yourself.
              <br />
              <span className="text-sustainable-green">30 nights a year. For 10%. Across India's wildest landscapes.</span>
            </p>

            {/* CTA Section */}
            <div className={`flex flex-col sm:flex-row gap-4 justify-end mb-8 ${
              isLoaded ? 'animate-up' : 'opacity-0 translate-y-8'
            }`} style={{ animationDelay: '0.6s' }}>
              <a href="#webinar" className="btn-secondary text-lg px-10 py-5">
                Learn More
              </a>
              <a href="#access" className="btn-primary text-lg px-10 py-5 shadow-xl">
                Save Your Seat
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white/60">
            <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

          </section>
  )
}
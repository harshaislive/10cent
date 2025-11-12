'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

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
          {/* Editorial Header */}
          <div className={`mb-12 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`} style={{ transition: 'opacity 1.5s ease-in' }}>

            {/* Publication Masthead */}
            <div className="mb-8">
              <h2 className="text-xs font-serif tracking-[0.3em] uppercase text-text-secondary mb-2">
                Beforest Club
              </h2>
              <div className="w-24 h-px bg-stone-400 mx-auto mb-2" />
              <div className="text-xs font-serif tracking-wide uppercase text-text-secondary">
                Return to Yourself
              </div>
            </div>
          </div>

          {/* Main Headline - Editorial Style */}
          <h1 className={`text-5xl md:text-7xl lg:text-8xl font-serif font-light leading-tight mb-8 text-text-primary ${
            isLoaded ? 'animate-in' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.2s' }}>
            <span className="text-3xl md:text-4xl lg:text-5xl text-brand-red font-semibold">30 nights at a time.</span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl">
              Because the most important meetings are the ones you take with yourself.
            </span>
          </h1>

          {/* Editorial Sub-headline */}
          <p className={`text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed font-serif ${
            isLoaded ? 'animate-up' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '0.4s' }}>
            30 nights a year. For 10%. Across India's wildest landscapes.
          </p>

          {/* Philosophy in Numbers - Editorial Card */}
          <div className={`mb-12 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transition: 'all 1s ease-in 0.5s' }}>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-stone-200 max-w-2xl mx-auto">
              <h3 className="text-lg font-serif font-light text-text-secondary mb-4 text-center">
                A Philosophy in Numbers
              </h3>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-serif font-bold text-brand-red mb-6">
                  10% of your year. 30 nights. ₹15L
                </div>
                <p className="text-lg font-serif text-text-primary italic">
                  No ownership. No baggage. Just access—to what truly matters.
                </p>
              </div>
            </div>
          </div>

          {/* The Member Profile - Editorial Quote Block */}
          <div className={`mb-12 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transition: 'all 1s ease-in 0.7s' }}>
            <div className="border-l-4 border-sustainable-green pl-8 max-w-2xl mx-auto">
              <h3 className="text-lg font-serif font-bold text-text-primary mb-4">
                The one who brings binoculars for every trip.
              </h3>
              <p className="text-lg font-serif text-text-primary mb-3">
                The one who believes nature is a page turner—not a return ticket.
              </p>
              <p className="text-lg font-serif text-text-primary mb-4">
                The one who wants time alone, not time off.
              </p>
              <p className="text-base font-serif text-brand-red italic">
                If that sounds like you, we built this for you.
              </p>
            </div>
          </div>

          {/* Why Now Section */}
          <div className={`mb-16 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} style={{ transition: 'all 1s ease-in 0.9s' }}>
            <div className="text-center">
              <p className="text-lg font-serif text-text-secondary mb-4">
                Because we're opening to only <span className="text-brand-red font-bold">150 members</span>.
              </p>
              <p className="text-lg font-serif text-text-secondary">
                Because your inner landscape could use a little rewinding.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center mb-16 ${
            isLoaded ? 'animate-up' : 'opacity-0 translate-y-8'
          }`} style={{ animationDelay: '1.1s' }}>
            <a href="#access" className="btn-primary text-lg px-12 py-6 shadow-xl">
              Apply now
            </a>
            <a href="#webinar" className="btn-secondary text-lg px-12 py-6">
              Learn More
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
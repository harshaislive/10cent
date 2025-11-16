'use client'

import { useState, useEffect } from 'react'

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

          {/* Editorial Masthead */}
          <div className={`mb-16 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`} style={{ transition: 'opacity 1.5s ease-in' }}>

            <div className="mb-12">
              <h2 className="text-xs font-serif tracking-[0.3em] uppercase text-stone-600 mb-2">
                Beforest Club
              </h2>
              <div className="w-24 h-px bg-stone-400 mx-auto mb-2" />
              <div className="text-xs font-serif tracking-wide uppercase text-stone-600">
                Return to Yourself
              </div>
            </div>
          </div>

          {/* Drop Cap Style Headline */}
          <div className={`text-left font-serif mb-12 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`} style={{ transition: 'opacity 1s ease-in 0.3s' }}>
            <div className="text-6xl md:text-7xl lg:text-8xl font-light leading-none text-stone-900 mb-6">
              <span className="text-7xl md:text-8xl lg:text-9xl font-serif text-amber-600">3</span>
              0 nights at a time.
            </div>
            <p className="text-xl md:text-2xl lg:text-3xl text-stone-700 leading-relaxed mb-8">
              Because the most important meetings are the ones you take with yourself.
            </p>
            <p className="text-lg md:text-xl text-stone-600">
              30 nights a year. For 10%. Across India's wildest landscapes.
            </p>
          </div>

          {/* CTA */}
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
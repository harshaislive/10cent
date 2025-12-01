'use client'

import { useState, useEffect } from 'react'
import TypeformButton from './TypeformButton'

export default function ApplySection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoaded(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    const element = document.getElementById('apply-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  return (
    <section id="apply-section" className="py-24 px-6 md:px-12 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-light mb-8">
            Return to Yourself
          </h2>

          <div className="w-24 h-px bg-amber-600 mx-auto mb-12" />

          <p className="text-xl md:text-2xl font-serif text-stone-300 leading-relaxed mb-16 max-w-3xl mx-auto">
            30 nights at a time. Because the most important meetings are the ones you take with yourself.
          </p>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 mb-12">
            <h3 className="text-lg font-serif text-amber-400 mb-6">The Philosophy in Numbers</h3>
            <div className="text-3xl md:text-4xl font-serif font-bold text-white mb-6">
              10% of your year. 30 nights. ₹17.65L
            </div>
            <p className="text-stone-300 mb-8">
              No ownership. No baggage. Just access—to what truly matters.
            </p>

            <TypeformButton
              formId="01KA5X0AM1KH7WRX1ZB994N2TG"
              className="px-12 py-4 bg-amber-600 text-white font-serif text-lg tracking-wide hover:bg-amber-700 transition-all duration-300 transform hover:scale-105"
            >
              Begin My Return
            </TypeformButton>
          </div>

          <p className="text-sm font-serif text-stone-400">
            Limited to 150 founding members. The wilderness waits.
          </p>

        </div>
      </div>
    </section>
  )
}
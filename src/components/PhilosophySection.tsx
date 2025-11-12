'use client'

import { useState, useEffect } from 'react'

export default function PhilosophySection() {
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

    const element = document.getElementById('philosophy-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  return (
    <section id="philosophy-section" className="py-20 px-6 md:px-12 bg-stone-100">
      <div className="max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-16 text-center">
            A Philosophy in Numbers
          </h2>

          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <div className="text-center mb-8">
              <div className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-amber-600 mb-6">
                10% of your year. 30 nights. ₹15L
              </div>
              <div className="w-24 h-px bg-amber-600 mx-auto mb-6" />
              <p className="text-xl md:text-2xl font-serif text-stone-700 leading-relaxed">
                No ownership. No baggage. Just access—to what truly matters.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-stone-900 mb-3">10%</div>
                <p className="text-sm font-serif text-stone-600">of your year invested in yourself</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-stone-900 mb-3">30</div>
                <p className="text-sm font-serif text-stone-600">nights across wilderness landscapes</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-serif font-bold text-stone-900 mb-3">₹15L</div>
                <p className="text-sm font-serif text-stone-600">for access, not ownership</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
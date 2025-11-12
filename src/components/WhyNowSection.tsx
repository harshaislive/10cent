'use client'

import { useState, useEffect } from 'react'

export default function WhyNowSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [countdown, setCountdown] = useState(150)

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

    const element = document.getElementById('why-now-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) return 150
          return prev - 1
        })
      }, 50)
      return () => clearInterval(interval)
    }
  }, [isLoaded])

  return (
    <section id="why-now-section" className="py-20 px-6 md:px-12 bg-stone-100">
      <div className="max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>

          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-16 text-center">
            Why Now?
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="bg-white rounded-xl p-8 border border-stone-200">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-4">
                  Because we're opening to only <span className="text-amber-600 font-bold">{countdown} members</span>.
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  Intimacy requires exclusivity. We're limiting membership to preserve the wildness—both of the land and the experience. Once we're full, we're full.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 border border-stone-200">
                <h3 className="text-xl font-serif font-medium text-stone-900 mb-4">
                  Because your inner landscape could use a little rewinding.
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  The modern world moves fast. But you? You're ready to slow down. To remember the rhythm of your own heartbeat beneath the noise of everything else.
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-amber-600 rounded-full animate-pulse opacity-20"></div>
                <div className="relative bg-stone-900 text-white rounded-full w-48 h-48 flex items-center justify-center">
                  <div>
                    <div className="text-4xl font-serif font-bold">{countdown}</div>
                    <div className="text-sm font-serif">spots left</div>
                  </div>
                </div>
              </div>
              <p className="mt-6 text-sm font-serif text-stone-600">
                This isn't just a membership. It's a moment in time.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
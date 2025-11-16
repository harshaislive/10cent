'use client'

import { useState, useEffect } from 'react'

export default function MembershipSection() {
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

    const element = document.getElementById('membership-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  return (
    <section id="membership-section" className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-12 text-center">
            A Different Kind of Membership
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl font-serif text-stone-700 leading-relaxed mb-12 text-center">
              You're not booking a stay. You're investing in solitude, silence—
              <br />
              and stillness.
            </p>

            <div className="space-y-8 mb-16">
              <div className="flex items-start gap-6">
                <div className="text-3xl text-amber-600 font-serif">✓</div>
                <div>
                  <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
                    Wake up to bird songs instead of alarms.
                  </h3>
                  <p className="text-stone-600">
                    Let nature be your morning alarm, replacing digital notifications with the gentle sounds of the wilderness.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="text-3xl text-amber-600 font-serif">✓</div>
                <div>
                  <h3 className="text-lg font-serif font-medium text-stone-900 mb-2">
                    Live among trees rather than your last three travels.
                  </h3>
                  <p className="text-stone-600">
                    Without the performative rush of modern life, find yourself rooted in the ancient wisdom of the forest.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-amber-600 pl-8 py-4 bg-amber-50/30">
              <p className="text-lg font-serif text-stone-700 italic">
                This is your invitation to pause. To breathe. To remember what it feels like to be truly alive.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
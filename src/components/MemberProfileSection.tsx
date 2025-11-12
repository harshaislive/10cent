'use client'

import { useState, useEffect } from 'react'

export default function MemberProfileSection() {
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

    const element = document.getElementById('member-profile-section')
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [])

  const profiles = [
    {
      icon: "🔭",
      title: "The one who brings binoculars for every trip.",
      description: "You see the world differently—always looking closer, never just passing through."
    },
    {
      icon: "📖",
      title: "The one who believes nature is a page turner—not a return ticket.",
      description: "For you, wilderness isn't a destination. It's an ongoing story, and you're always reading the next chapter."
    },
    {
      icon: "🧘",
      title: "The one who wants time alone, not time off.",
      description: "You understand that solitude isn't loneliness—it's the space where you finally meet yourself."
    }
  ]

  return (
    <section id="member-profile-section" className="py-20 px-6 md:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-8">
              This is for you.
            </h2>
            <div className="w-32 h-px bg-amber-600 mx-auto mb-8" />
            <p className="text-lg font-serif text-stone-600 max-w-2xl mx-auto">
              If you recognize yourself in any of these, we built this for you.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {profiles.map((profile, index) => (
              <div
                key={index}
                className={`bg-stone-50 rounded-xl p-8 border border-stone-200 hover:shadow-lg transition-all duration-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-4xl mb-6">{profile.icon}</div>
                <h3 className="text-lg font-serif font-medium text-stone-900 mb-4">
                  {profile.title}
                </h3>
                <p className="text-stone-600 leading-relaxed">
                  {profile.description}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center bg-amber-50 rounded-2xl p-8 border border-amber-200">
            <p className="text-2xl font-serif text-stone-900 italic mb-4">
              If that sounds like you, we built this for you.
            </p>
            <div className="text-sm font-serif text-stone-600">
              The wilderness has been waiting for you to return.
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
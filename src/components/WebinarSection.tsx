'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function WebinarSection() {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null)
  const [showFloatingCTA, setShowFloatingCTA] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero')
      const accessSection = document.getElementById('access')

      // Check if hero section is completely scrolled past
      const heroScrolledPast = heroSection && (
        heroSection.getBoundingClientRect().bottom < 0
      )

      const accessVisible = accessSection && (
        accessSection.getBoundingClientRect().top < window.innerHeight &&
        accessSection.getBoundingClientRect().bottom > 0
      )

      // Show floating CTA only after hero is scrolled past AND access section is not visible
      setShowFloatingCTA((heroScrolledPast === true) && (accessVisible !== true))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const webinarTopics = [
    {
      title: "The Integration Protocol",
      description: "How to systematically integrate wilderness time into your busy schedule WITHOUT disrupting your business or career momentum.",
      keyPoints: [
        "Time audit and calendar blocking strategies",
        "Seasonal planning for maximum impact",
        "Transition protocols for city-to-wilderness",
        "Digital detox frameworks that actually work"
      ],
      duration: "15 minutes"
    },
    {
      title: "The Wilderness Experience",
      description: "What actually happens when you step into nature. The immediate shifts, the gradual transformations, the moments that change everything.",
      keyPoints: [
        "First 24 hours: The digital detox begins",
        "Week 1: Your senses come alive again",
        "Month 1: New patterns emerge naturally",
        "The lasting impact on your daily life"
      ],
      duration: "20 minutes"
    },
    {
      title: "The Lifetime Value",
      description: "How 300 wilderness nights across diverse landscapes becomes your personal sanctuary—creating memories, connections, and transformations that money can't buy.",
      keyPoints: [
        "Your private escape from urban chaos",
        "Seasonal rhythms that restore your natural state",
        "A legacy of wilderness for generations to experience",
        "The freedom to disappear without the burden of ownership"
      ],
      duration: "15 minutes"
    },
    {
      title: "Seed Member Experience",
      description: "Join the first cohort of wilderness pioneers—shape the future of regenerative living while securing your place in this exclusive community.",
      keyPoints: [
        "Choose your sacred spot in untouched landscapes",
        "Co-create spaces that reflect your vision",
        "Become part of wilderness governance and stewardship",
        "Lock in your legacy as a founding guardian of these lands"
      ],
      duration: "10 minutes"
    }
  ]

  return (
    <section id="webinar" className="section-padding relative overflow-hidden">
      
      <div className="container-max relative z-10">
        <div className="text-center mb-12 pt-12 pb-12">
          <h2 className="text-4xl md:text-6xl font-arizona font-light mb-4 text-text-primary">
            60-Minute Strategic Briefing
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed mb-6 font-arizona">
            Discover how dedicating just 10% of your time to wilderness immersion can completely transform the remaining 90% of your life—reawakening senses, restoring clarity, and reconnecting you to your truest self.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 mb-6">
            <div className="inline-flex items-center gap-4 bg-brand-red/10 backdrop-blur-sm border border-brand-red/20 px-6 py-3 rounded-full">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-brand-red">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium text-text-primary">
                Saturday, 6:00 PM IST, 15 Nov 2025
              </span>
            </div>

            <div className="inline-flex items-center gap-4 bg-sustainable-green/10 backdrop-blur-sm border border-sustainable-green/20 px-6 py-3 rounded-full">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="text-sustainable-green">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              <span className="text-sm font-medium text-text-primary">
                Registrations close on Friday 2PM
              </span>
            </div>
          </div>

          {/* Sign Up Button */}
          <div className="text-center mb-6 mt-8">
              <button
                onClick={() => {
                  const element = document.getElementById('access');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#86312b] text-white px-8 py-4 rounded-lg font-arizona font-medium text-lg hover:bg-[#9e3430] transition-colors duration-200 shadow-lg hover:shadow-xl"
              >
                Reserve Your Spot for the Conversation
              </button>
              <p className="text-sm text-text-secondary mt-2 font-arizona">
                Limited spots available. Join the intimate conversation about intentional living.
              </p>
            </div>
        </div>

        {/* Two Column Layout: Not For vs For - Moved Closer to Top */}
          <div className="max-w-4xl mx-auto mb-6">
            <div className="grid md:grid-cols-2 gap-4">
            {/* Who This Is NOT For */}
            <div>
              <h3 className="text-2xl font-arizona font-medium mb-4 text-text-primary text-center">
                This Conversation Is <span className="text-brand-red">Not</span> For
              </h3>
              <p className="text-text-secondary mb-4 font-arizona text-sm">
                We're intentionally selective. The 10cent Club only works for those who understand wilderness isn't a product to consume, but a relationship to build.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "The Quick Fix Seeker",
                    description: "You want 3 days of zen to 'fix' your burnout, then return to the same unsustainable pace.",
                    warning: "Wilderness doesn't solve problems—it reveals them."
                  },
                  {
                    title: "The Weekend Reveler",
                    description: "You're looking for a place to party with friends. Wilderness is just a backdrop for Instagram stories.",
                    warning: "Silence and introspection trump celebration here."
                  },
                  {
                    title: "The Luxury Collector",
                    description: "You're looking for another trophy to add to your collection. Wilderness stays are meant to be Instagram moments.",
                    warning: "You'll be disappointed by our emphasis on substance."
                  }
                ].map((notFor, index) => (
                  <div key={index} className="border-l-3 border-brand-red/50 bg-red-50/30 rounded-r-lg p-4">
                    <h4 className="text-base font-arizona font-medium mb-2 text-text-primary">
                      {notFor.title}
                    </h4>
                    <p className="text-text-secondary text-sm leading-relaxed mb-2 font-arizona">
                      {notFor.description}
                    </p>
                    <p className="text-xs font-arizona text-brand-red font-medium">
                      {notFor.warning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Who This IS For */}
            <div>
              <h3 className="text-2xl font-arizona font-medium mb-4 text-text-primary text-center">
                However, If You're...
              </h3>
              <p className="text-text-secondary mb-4 font-arizona text-sm">
                Ready to question whether your success is serving your life, not the other way around. You understand that true wealth isn't measured in spreadsheets, but in the depth of your connection to the wild.
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "The Naturalist",
                    description: "You don't just visit wilderness—you belong to it. Your binoculars are worn from use, your field journal filled with observations, and your soul stirs at the first call of the dawn.",
                    keywords: ["Wilderness", "Eco-tourism", "Authentic"]
                  },
                  {
                    title: "The Wellness Discerning",
                    description: "You've moved beyond wellness trends to understand that nature is not an escape, but a return home. You seek profound solitude, not packaged serenity.",
                    keywords: ["Meditation", "Digital detox", "Mindful"]
                  },
                  {
                    title: "The Cultural Authenticist",
                    description: "You reject performative travel for genuine immersion. You want to taste the soil, understand the seasons, and belong to something ancient and wild.",
                    keywords: ["Sustainability", "Regenerative", "Community"]
                  },
                  {
                    title: "The Wilderness Relocator",
                    description: "You're done with weekend wilderness. You're ready to answer the call that whispers during board meetings and traffic jams—the one that says this isn't just a vacation, it's your address.",
                    keywords: ["Wilderness Living", "Full Immersion", "Nature Integration"]
                  }
                ].map((audience, index) => (
                  <div key={index} className="bg-sustainable-green/10 rounded-lg p-4 border border-sustainable-green/20">
                    <h5 className="font-arizona font-medium mb-2 text-text-primary text-sm">
                      {audience.title}
                    </h5>
                    <p className="text-text-secondary text-xs leading-relaxed mb-3 font-arizona">
                      {audience.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {audience.keywords.map((keyword, keywordIndex) => (
                        <span
                          key={keywordIndex}
                          className="text-xs px-2 py-1 bg-sustainable-green/20 text-text-secondary rounded border border-sustainable-green/30 font-arizona"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="font-arizona font-medium text-text-primary mt-4 text-sm">
                Then this conversation might be the most important one you have this year.
              </p>
            </div>
          </div>
        </div>

        {/* Presenter Section with Image Background */}
        <section className="mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-sustainable-green/10 via-gray-50/30 to-brand-red/10 rounded-3xl border border-gray-100"></div>
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl"></div>
          <div className="max-w-5xl mx-auto px-8 py-12 relative">

            {/* Section Heading - Hook from Personal Story */}
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-arizona font-light mb-4 text-text-primary max-w-3xl mx-auto">
                When you stop running, you start seeing. The patterns of nature have a rhythm that reorders your own.
              </h2>
              <p className="text-lg text-text-secondary font-arizona max-w-2xl mx-auto">
                The greatest luxury today isn't space or possessions — it's time. The 10% Club is an invitation to build that pause into your life.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 items-stretch">
              {/* Left Column - Full Height Image Only */}
              <div className="relative h-96 md:h-[500px] lg:h-[600px] max-w-lg mx-auto md:max-w-none">
                <div className="relative group h-full">
                  <div className="absolute -inset-4 bg-gradient-to-br from-brand-red/20 to-sustainable-green/20 blur-xl"></div>
                  <div className="relative overflow-hidden h-full">
                    <Image
                      src="/PBR_7935.jpg"
                      alt="Sunith Reddy - Founder, Beforest"
                      width={800}
                      height={600}
                      className="w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-500"
                    />
                    <Image
                      src="/PBR_4601.jpg"
                      alt="Sunith Reddy in wilderness - Beforest"
                      width={800}
                      height={600}
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                  </div>
                </div>
                </div>

              {/* Right Column - The Saying with I'm Sunith Reddy */}
              <div>
                <h3 className="text-3xl font-arizona font-light mb-6 text-text-primary">
                  I'm Sunith Reddy
                </h3>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 mb-6">
                  <div className="space-y-2 text-sm text-text-secondary font-arizona">
                    <p>• 8+ years building wilderness communities</p>
                    <p>• 1000+ acres under regeneration</p>
                    <p>• 6 established wilderness collectives</p>
                  </div>
                </div>

                <div className="space-y-6 text-text-secondary font-arizona leading-relaxed">
                  <p>
                    It took stepping into the wilderness for me to realise that slowing down isn't the absence of ambition — it's the foundation for clarity.
                  </p>

                  <div className="border-l-2 border-brand-red/30 pl-4 italic">
                    When you stop running, you start seeing. The patterns of nature have a rhythm that reorders your own.
                  </div>

                  <p>
                    Beforest was born out of this realisation — that the greatest luxury today isn't space or possessions, but time. The 10% Club is an invitation to build that pause into your life.
                  </p>

                  <div className="pt-6">
                    <p className="text-brand-red font-medium">
                      I'd love to share more about this idea with you in person.
                      <br />
                      Join me for a conversation about what it means to live with intention.
                    </p>

                    <a
                      href="#access"
                      className="mt-4 inline-block text-[#344736] px-6 py-3 rounded-lg font-arizona font-medium hover:text-[#002140] transition-colors duration-200 border border-[#344736] hover:border-[#002140]"
                    >
                      Count Me In
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating CTA */}
      {showFloatingCTA && (
        <div className="fixed bottom-8 right-8 z-50 max-w-xs animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 backdrop-blur-sm bg-white/95">
            <h4 className="text-lg font-arizona font-medium mb-3 text-text-primary">
              I'd like to explore 10%, sign me up to the webinar
            </h4>
            <button
              onClick={() => {
                const element = document.getElementById('access');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full bg-brand-red text-white px-6 py-3 rounded-lg font-arizona font-medium hover:bg-brand-red/90 transition-colors duration-200"
            >
              Request Invite
            </button>
          </div>
        </div>
      )}
  </section>
  )
}
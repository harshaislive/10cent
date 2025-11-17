'use client'

import { useState, useEffect, useRef } from 'react'

// Type definitions for different solution types
interface WildernessExperienceSolution {
  id: string
  title: string
  subtitle: string
  description: string
  experiences: string[]
  visual: {
    quadrants: number[]
  }
}

interface LandscapeSolution {
  id: string
  title: string
  subtitle: string
  description: string
  locations: Array<{
    name: string
    specialty: string
  }>
  guarantee: string
  visual: {
    diversity: string
  }
}

type Solution = WildernessExperienceSolution | LandscapeSolution

export default function SolutionSection() {
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  const solutions: Solution[] = [
    {
      id: 'wilderness-experience',
      title: "The Wilderness Experience",
      subtitle: "What Actually Happens in Nature",
      description: "Nature doesn't just heal—it transforms. The experience rewires your brain, restores your senses, and reconnects you to your true self.",
      experiences: [
        "Digital Detox: Your mind finds silence again",
        "Sensory Awakening: Nature's symphony returns",
        "Mental Clarity: Decisions become effortless",
        "Emotional Reset: Joy flows naturally again"
      ],
      visual: {
        quadrants: [85, 92, 78, 95]
      }
    },
    {
      id: 'landscape-multiplicity',
      title: "10% Across India's Rewilded Landscapes",
      subtitle: "Some journeys don't just change your destination; they change you.",
      description: "You've achieved everything they said you should want. So why do you feel something's still missing? Our six wilderness landscapes across India reveal the answer that no boardroom can provide.",
      locations: [
        { name: "Poomaale, Coorg", specialty: "Ancient forest canopy" },
        { name: "Hammiyala, Coorg", specialty: "Coffee agroforestry" },
        { name: "Bodakonda, Hyderabad", specialty: "Deccan plateau" },
        { name: "Bhopal Collective", specialty: "Central India wilderness" },
        { name: "Mumbai Collective", specialty: "Urban-nature integration" }
      ],
      guarantee: "300 nights across India's wildest rewilded landscapes",
      visual: {
        diversity: "10% across landscapes"
      }
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0')
            setVisibleMetrics(prev => [...prev, index])
          }
        })
      },
      { threshold: 0.3 }
    )

    const metricElements = sectionRef.current?.querySelectorAll('[data-index]')
    metricElements?.forEach((el) => observer.observe(el))

    return () => {
      metricElements?.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <section id="solution" ref={sectionRef} className="section-padding relative overflow-hidden">
      <div className="container-max relative z-10">
        {/* Editorial Header */}
        <div className="text-center mb-12 pt-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-6xl md:text-8xl font-arizona font-light mb-8 text-text-primary leading-tight">
              Return to Yourself
            </h2>
            <h3 className="text-5xl md:text-7xl font-arizona font-light text-brand-red mb-12 leading-tight">
              30 nights at a time
            </h3>
            <p className="text-xl md:text-2xl text-text-secondary leading-relaxed font-light max-w-3xl mx-auto font-arizona">
              You keep telling yourself you'll finally breathe 'after this next milestone'... but what if this is <span className="text-brand-red font-medium">it</span>?
            </p>
          </div>
        </div>

        <div className="bg-warm-white">
          <div className="space-y-16">
            {solutions.map((solution, solutionIndex) => (
              <div
                key={solution.id}
                data-index={solutionIndex}
                className={`animate-slide-reveal ${visibleMetrics.includes(solutionIndex) ? 'revealed' : ''}`}
                style={{ animationDelay: `${solutionIndex * 0.3}s` }}
              >
                {/* Elegant Layout */}
                <div className="max-w-5xl mx-auto">
                  <div className={`grid lg:grid-cols-2 gap-8 items-center ${solutionIndex % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                    {/* Content Side */}
                    <div className={`${solutionIndex % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <div className="mb-6">
                        <div className={`inline-flex items-center gap-4 mb-4 ${solutionIndex === 0 ? 'text-brand-red' : solutionIndex === 1 ? 'text-sustainable-green' : 'text-orange-500'}`}>
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-light text-white ${
                            solutionIndex === 0 ? 'bg-brand-red' :
                            solutionIndex === 1 ? 'bg-sustainable-green' :
                            'bg-orange-500'
                          }`}>
                            {solutionIndex + 1}
                          </div>
                          <div className="h-px w-24 bg-current opacity-30" />
                        </div>

                        <h4 className="text-3xl md:text-4xl font-arizona font-light mb-2 text-text-primary leading-tight">
                          {solution.title}
                        </h4>
                        <p className="text-lg text-text-secondary/80 font-light mb-4 italic font-arizona">
                          {solution.subtitle}
                        </p>
                      </div>

                      <p className="text-lg text-text-secondary leading-relaxed mb-6 font-arizona">
                        {solution.description}
                      </p>

                      {/* Experiences List */}
                      {'experiences' in solution && (
                        <div className="space-y-3 mb-6">
                          {solution.experiences.map((experienceItem, index) => (
                            <div key={index} className="group">
                              <p className="text-base text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors font-arizona">
                                {experienceItem}
                              </p>
                            </div>
                          ))}
                          </div>
                      )}

                      {/* Locations */}
                      {'locations' in solution && (
                        <div className="mb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                            {solution.locations.map((location, index) => (
                              <div key={index} className="group bg-white border border-gray-200 rounded-lg p-3 transition-all duration-300 hover:shadow-lg hover:border-brand-red/30">
                                <h5 className="text-sm font-arizona font-medium text-text-primary mb-1">
                                  {location.name}
                                </h5>
                                <p className="text-xs text-text-secondary italic font-arizona">
                                  {location.specialty}
                                </p>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm italic text-text-primary font-light font-arizona text-center">
                            {solution.guarantee}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Visual Side */}
                    <div className={`${solutionIndex % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                      <div className="relative">
                        {/* Visual Elements */}
                        {'quadrants' in solution.visual && (
                          <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                            <div className="space-y-8">
                              {/* Experience 1 */}
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-brand-red/5 rounded-full flex items-center justify-center">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-brand-red">
                                      <path d="M4 20h16M4 16l4-4 3 3 5-5 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h6 className="text-lg font-arizona font-medium text-text-primary mb-1">
                                    Decisions become effortless
                                  </h6>
                                  <p className="text-sm text-text-secondary font-arizona">
                                    The mental fog lifts, revealing clarity that was there all along.
                                  </p>
                                </div>
                              </div>

                              {/* Experience 2 */}
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-sustainable-green/5 rounded-full flex items-center justify-center">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-sustainable-green">
                                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2"/>
                                      <circle cx="12" cy="6" r="1" fill="currentColor" opacity="0.4"/>
                                      <circle cx="6" cy="12" r="1" fill="currentColor" opacity="0.4"/>
                                      <circle cx="18" cy="12" r="1" fill="currentColor" opacity="0.4"/>
                                      <circle cx="12" cy="18" r="1" fill="currentColor" opacity="0.4"/>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h6 className="text-lg font-arizona font-medium text-text-primary mb-1">
                                    Joy flows naturally again
                                  </h6>
                                  <p className="text-sm text-text-secondary font-arizona">
                                    Spontaneous moments of delight return, unbidden and authentic.
                                  </p>
                                </div>
                              </div>

                              {/* Experience 3 */}
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-orange-500/5 rounded-full flex items-center justify-center">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-orange-500">
                                      <path d="M12 2v4m0 4v4m0 4v4M2 12h4m4 0h4m4 0h4m4 0h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                      <circle cx="12" cy="12" r="2" fill="currentColor" opacity="0.6"/>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h6 className="text-lg font-arizona font-medium text-text-primary mb-1">
                                    Body remembers vitality
                                  </h6>
                                  <p className="text-sm text-text-secondary font-arizona">
                                    Energy emerges naturally, not from stimulation but from restoration.
                                  </p>
                                </div>
                              </div>

                              {/* Experience 4 */}
                              <div className="flex items-center space-x-6">
                                <div className="flex-shrink-0">
                                  <div className="w-16 h-16 bg-brand-red/5 rounded-full flex items-center justify-center">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-brand-red">
                                      <path d="M12 2C6 2 2 6 2 12s4 10 10 10 10-4 10-10S18 2 12 2z" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2"/>
                                      <path d="M8 12s2-2 4-2 4 2 4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </div>
                                </div>
                                <div>
                                  <h6 className="text-lg font-arizona font-medium text-text-primary mb-1">
                                    Ideas appear without effort
                                  </h6>
                                  <p className="text-sm text-text-secondary font-arizona">
                                    Creative solutions surface in the quiet spaces between thoughts.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {'diversity' in solution.visual && (
                          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100 text-center">
                            <div className="text-6xl font-light text-brand-red mb-4">
                              {solution.visual.diversity}
                            </div>
                            <p className="text-lg text-text-secondary font-arizona">
                              Your 10% amplified across diverse ecosystems
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* The AsK Summary - Editorial Design */}
            <div className="mt-12 mb-8">
              <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-text-primary via-text-primary to-text-primary/95 text-white rounded-3xl shadow-2xl p-12 relative overflow-hidden">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-sustainable-green rounded-full blur-2xl" />
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-brand-red rounded-full blur-3xl" />
                  </div>

                  <div className="relative z-10 text-center">
                    <h4 className="text-3xl md:text-4xl font-arizona font-light mb-4">
                      The AsK
                    </h4>

                    <div className="mb-8">
                      <div className="text-6xl md:text-7xl font-arizona font-light mb-4 text-sustainable-green">
                        ₹15 <span className="text-4xl font-light">Lakhs</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                      <div>
                        <div className="text-3xl font-light text-sustainable-green mb-2">
                          30
                        </div>
                        <div className="text-sm opacity-80 uppercase tracking-widest font-arizona">Nights per year</div>
                      </div>
                      <div>
                        <div className="text-3xl font-light text-sustainable-green mb-2">
                          10
                        </div>
                        <div className="text-sm opacity-80 uppercase tracking-widest font-arizona">Years</div>
                      </div>
                      <div>
                        <div className="text-3xl font-light text-sustainable-green mb-2">
                          6+
                        </div>
                        <div className="text-sm opacity-80 uppercase tracking-widest font-arizona">Destinations and counting</div>
                      </div>
                      <div>
                        <div className="text-3xl font-light text-sustainable-green mb-2">
                          ∞
                        </div>
                        <div className="text-sm opacity-80 uppercase tracking-widest font-arizona">Mental Clarity</div>
                      </div>
                    </div>

                    <div className="p-8 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                      <p className="text-lg opacity-90 leading-relaxed font-light font-arizona">
                        No ownership. No baggage. Just access—to what truly matters.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-sustainable-green/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-brand-red/3 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  )
}
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function SolutionSection() {
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([])
  const [hoveredFormula, setHoveredFormula] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const solutions = [
    {
      id: 'ten-principle',
      title: "The 10% Principle",
      subtitle: "A Mathematical Approach to Restoration",
      description: "Just 10% of your time invested in wilderness. The mathematics of human performance shows this optimal allocation maximizes returns across all life domains.",
      formula: "The Return to Yourself: 10% Every Year",
      visual: {
        primary: 10,
        secondary: 90
      }
    },
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
      timeframe: "Changes begin immediately",
      visual: {
        quadrants: [85, 92, 78, 95]
      }
    },
    {
      id: 'landscape-multiplicity',
      title: "10% Across India's Rewilded Landscapes",
      subtitle: "Diversity Amplifies Your Returns",
      description: "Your 10% investment spans five distinct ecosystems. Each landscape offers unique restoration properties, creating compound returns that transform your remaining 90%.",
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
              You keep promising yourself you'll slow down 'after this next deal'... but what if this is <span className="text-brand-red font-medium">it</span>?
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

                    {/* Formula Display */}
                    {solution.formula && (
                      <div
                        className="group relative bg-gradient-to-r from-brand-red/5 to-sustainable-green/5 border border-brand-red/10 rounded-2xl p-6 mb-6 cursor-pointer transition-all duration-500 hover:shadow-xl"
                        onMouseEnter={() => setHoveredFormula(solution.id)}
                        onMouseLeave={() => setHoveredFormula(null)}
                      >
                        <div className="text-center space-y-4">
                          <div className="text-4xl md:text-5xl font-arizona font-light text-brand-red tracking-tight">
                            {solution.formula}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Experiences List */}
                    {solution.experiences && (
                      <div className="space-y-3 mb-6">
                        {solution.experiences.map((experienceItem, index) => (
                          <div key={index} className="group">
                            <p className="text-base text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors font-arizona">
                              {experienceItem}
                            </p>
                          </div>
                        ))}
                        <div className="mt-4 p-4 bg-brand-red/5 border border-brand-red/20 rounded-xl text-center">
                          <p className="text-sm font-medium text-brand-red uppercase tracking-wider font-arizona">
                            {solution.timeframe}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Locations */}
                    {solution.locations && (
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
                        <div className="bg-text-primary text-white rounded-lg p-3 text-center">
                          <p className="text-sm font-light mb-1 font-arizona">
                            {solution.guarantee}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Visual Side */}
                  <div className={`${solutionIndex % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="relative">
                      
                      {/* Visual Elements */}
                      {solution.visual.primary !== undefined && (
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                          <h5 className="text-xl font-arizona font-light text-center mb-4 text-text-primary">
                            The 10% Multiplier Effect
                          </h5>

                          <div className="space-y-4">
                            {/* Wilderness The AsK */}
                            <div className="bg-brand-red/5 border-2 border-brand-red/20 rounded-2xl p-6 text-center">
                              <div className="text-5xl font-bold text-brand-red mb-3">
                                {solution.visual.primary}%
                              </div>
                              <div className="text-sm font-medium text-text-primary uppercase tracking-widest mb-2 font-arizona">
                                10% in the wilderness
                              </div>
                              <div className="text-xs text-text-secondary font-arizona">
                                30 nights annually
                              </div>
                            </div>

                            {/* Arrow */}
                            <div className="flex justify-center">
                              <div className="text-3xl text-brand-red">↓</div>
                            </div>

                            {/* Enhanced Life */}
                            <div className="bg-sustainable-green/5 border-2 border-sustainable-green/20 rounded-2xl p-6 text-center">
                              <div className="text-5xl font-bold text-sustainable-green mb-3">
                                {solution.visual.secondary}%
                              </div>
                              <div className="text-sm font-medium text-text-primary uppercase tracking-widest mb-2 font-arizona">
                                Enhanced Daily Life
                              </div>
                              <div className="text-xs text-text-secondary font-arizona">
                                With amplified returns
                              </div>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-4 mt-8 text-center">
                              <p className="text-base text-text-secondary font-arizona leading-relaxed">
                                This small investment amplifies every aspect of your remaining time:
                              </p>
                              <div className="grid grid-cols-2 gap-4 mt-6">
                                <div className="benefit-icon">
                                  <div className="flex justify-center mb-2">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-brand-red animate-star-sparkle" style={{ animationDuration: '8s' }}>
                                      <path d="M16 2L20 10L28 11L22 16L24 24L16 20L8 24L10 16L4 11L12 10L16 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="currentColor" fillOpacity="0.1"/>
                                    </svg>
                                  </div>
                                  <div className="text-sm text-text-secondary font-arizona">creativity</div>
                                </div>
                                <div className="benefit-icon">
                                  <div className="flex justify-center mb-2">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-brand-red animate-target-focus" style={{ animationDuration: '6s' }}>
                                      <circle cx="16" cy="16" r="10" stroke="currentColor" strokeWidth="2" className="animate-target-pulse" style={{ animationDuration: '3s' }}/>
                                      <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2" className="animate-target-center" style={{ animationDuration: '2.5s' }}/>
                                      <circle cx="16" cy="16" r="2" fill="currentColor" className="animate-target-center" style={{ animationDuration: '2s' }}/>
                                      <path d="M20 12L16 16L12 20M12 12L16 16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="animate-crosshair-rotate" style={{ animationDuration: '4s' }}/>
                                    </svg>
                                  </div>
                                  <div className="text-sm text-text-secondary font-arizona">decision-making</div>
                                </div>
                                <div className="benefit-icon">
                                  <div className="flex justify-center mb-2">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-brand-red animate-clarity-flow" style={{ animationDuration: '7s' }}>
                                      <path d="M6 8H26V10H6z" className="animate-line-wave" style={{ animationDuration: '4s' }}/>
                                      <path d="M8 12H24V14H8z" className="animate-line-wave" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}/>
                                      <path d="M6 16H26V18H6z" className="animate-line-wave" style={{ animationDuration: '4.5s', animationDelay: '1s' }}/>
                                      <path d="M10 20H22V22H10z" className="animate-line-wave" style={{ animationDuration: '3s', animationDelay: '1.5s' }}/>
                                      <circle cx="14" cy="13" r="1.5" fill="currentColor" className="animate-clarity-dot-float" style={{ animationDuration: '2s' }}/>
                                      <circle cx="20" cy="17" r="1.5" fill="currentColor" className="animate-clarity-dot-float" style={{ animationDuration: '2.5s', animationDelay: '0.8s' }}/>
                                    </svg>
                                  </div>
                                  <div className="text-sm text-text-secondary font-arizona">cognitive clarity</div>
                                </div>
                                <div className="benefit-icon">
                                  <div className="flex justify-center mb-2">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-brand-red animate-heartbeat" style={{ animationDuration: '3s' }}>
                                      <path d="M16 26C16 26 4 18 4 10C4 6 8 2 12 2C14 2 16 3 16 3C16 3 18 2 20 2C24 2 28 6 28 10C28 18 16 26 16 26Z" stroke="currentColor" strokeWidth="2" fill="none" className="animate-heart-glow" style={{ animationDuration: '2s' }}/>
                                      <path d="M16 10C16.5 10 17 10.5 17 11C17 11.5 16.5 12 16 12C15.5 12 15 11.5 15 11C15 10.5 15.5 10 16 10Z" fill="currentColor" className="animate-heart-center-pulse" style={{ animationDuration: '1.5s' }}/>
                                    </svg>
                                  </div>
                                  <div className="text-sm text-text-secondary font-arizona">natural immunity</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {solution.visual.quadrants && (
                        <div className="bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
                          <h5 className="text-xl font-arizona font-light text-center mb-12 text-text-primary">
                            The Subtle Return
                          </h5>

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

                      {solution.visual.diversity && (
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
                    <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed font-arizona">
                      300 nights across India's wildest rewilded landscapes over 10 years
                    </p>
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
                        5
                      </div>
                      <div className="text-sm opacity-80 uppercase tracking-widest font-arizona">Destinations and counting</div>
                    </div>
                    <div>
                      <div className="text-3xl font-light text-sustainable-green mb-2">
                        ∞
                      </div>
                      <div className="text-sm opacity-80 uppercase tracking-widest font-arizona">Returns</div>
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
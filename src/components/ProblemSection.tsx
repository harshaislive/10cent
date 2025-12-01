'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'

export default function ProblemSection() {
  const ref = useRef(null)
  const [activeProblem, setActiveProblem] = useState(0)

  const problems = [
    {
      title: "The Urban Trap",
      description: "25 meetings. 47 emails. 3 Zoom calls that should have been emails. Your calendar is full, but your clarity is empty.",
      stats: ["78% of professionals report burnout", "Urban dwellers have 23% higher stress levels", "Screen time increased by 400% in 5 years"],
      icon: "city"
    },
    {
      title: "The Wellness Illusion",
      description: "Meditation apps. Weekend getaways. Luxury spas. Quick fixes that don't fix the root problem—you're disconnected from nature.",
      stats: ["72% of wellness initiatives fail within 6 months", "Nature deficit affects 84% of urban professionals", "Quick fixes create long-term dependency"],
      icon: "wellness"
    },
    {
      title: "The Opportunity Cost",
      description: "You're optimizing everything except what matters most: your relationship with the natural world that sustains you.",
      stats: ["Nature time correlates with 40% higher creativity", "3 hours/week in nature improves cognitive function", "Natural environments boost immune function"],
      icon: "opportunity"
    }
  ]

  const handleProblemHover = (index: number) => {
    setActiveProblem(index)
  }

  return (
    <section id="problem" ref={ref} className="section-padding relative overflow-hidden">
      
      <div className="container-max relative z-10">
        <div className="text-center mb-12 pt-8 pb-8">
          <h2 className="text-5xl md:text-7xl font-arizona font-light mb-8 text-text-primary animate-up">
            The Modern Dilemma
          </h2>
        </div>

        {/* The Modern Dilemma - Art Director Editorial */}
        <div className="mt-8 relative">
          {/* Background accent removed */}
          
          <div className="max-w-7xl mx-auto px-8 relative">
            {/* Section header with dramatic typography */}
            <div className="mb-8">
              {/* Circle and dash elements removed from top-left */}
            </div>
            
        <div className="bg-warm-white">
            
            {/* Main editorial layout */}
            <div className="grid grid-cols-1 gap-8 items-start">
              {/* Main statement */}
              <div>
                <div className="relative">
                  {/* Decorative circle element removed */}

                  {/* Main quote */}
                  <blockquote className="relative z-10 mb-8">
                    <p className="text-3xl md:text-4xl lg:text-5xl font-arizona font-light leading-tight text-text-primary mb-4">
                      You're building a successful life, and it's time to reconnect with what matters most.
                    </p>
                  </blockquote>
                </div>
              </div>
            </div>
            
            {/* Bottom supporting text - editorial style */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="max-w-4xl mx-auto">
                <p className="text-lg md:text-xl font-arizona font-light text-text-secondary leading-relaxed text-center">
                  Meditation apps. Weekend getaways. Luxury spas.
                  <span className="block mt-2 text-brand-red font-medium">
                    Quick fixes that don't fix the root problem—you're disconnected from nature.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {/* Red background element removed */}
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-sustainable-green rounded-full blur-3xl" />
      </div>
    </section>
  )
}
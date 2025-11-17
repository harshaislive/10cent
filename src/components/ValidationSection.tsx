'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ValidationSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Rahul M.",
      role: "Technology Founder, Bangalore",
      content: "I bought back my time. The AsK paid for itself in 6 months, but the return on my peace of mind is priceless.",
      metrics: ["Time reclaimed: 15 hours/week", "Stress reduction: 60%", "Revenue growth: 40%"]
    },
    {
      name: "Priya S.",
      role: "The AsK Banker, Mumbai",
      content: "As someone who calculates ROI for everything, the 4 Returns Framework made perfect sense. My best AsK yet.",
      metrics: ["Portfolio diversification: 25%", "Network quality: 10x", "Decision clarity: 85%"]
    },
    {
      name: "Arjun K.",
      role: "Creative Director, Delhi",
      content: "The wilderness doesn't just inspire—it transforms. My work has depth it never had before. My clients notice the difference.",
      metrics: ["Creative output: 200%", "Client satisfaction: 95%", "Personal satisfaction: ∞"]
    }
  ]

  
  return (
    <section id="validation" className="section-padding relative overflow-hidden">
      
      <div className="container-max relative z-10">
        <div className="text-center mb-12 pt-8 pb-8">
          <h2 className="text-4xl md:text-6xl font-arizona font-light mb-4 text-text-primary">
            Not Results but Experiences
          </h2>
          <h3 className="text-2xl md:text-3xl font-arizona font-medium mb-6 text-brand-red">
            Backed By Real Authentic Experiences
          </h3>
        </div>

        
        {/* Testimonials - Editorial Format */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-3xl md:text-4xl font-arizona font-light mb-8 text-center text-text-primary">
            Voices From The Wilderness
          </h3>

          <div className="space-y-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`relative animate-slide-reveal`}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                {/* Left Quote Mark */}
                <div className="absolute -top-4 -left-4 text-8xl md:text-9xl font-arizona font-light text-brand-red/20">
                  "
                </div>

                <div className="relative">
                  <blockquote className="text-xl md:text-2xl font-arizona font-light leading-relaxed text-text-primary mb-6 pl-8">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Attribution Line */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-lg font-arizona font-medium text-brand-red mb-1">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-text-secondary italic font-arizona">
                          {testimonial.role}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-sustainable-green/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-red/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  )
}
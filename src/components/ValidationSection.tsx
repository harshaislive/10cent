'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function ValidationSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Geetha",
      role: "Bangalore",
      content: "All aspects of the experience - the place, the nature, people - were awesome. Looking forward to come back & explore the other collectives."
    },
    {
      name: "Rudraite",
      role: "Kuchumba/Ahmedabad",
      content: "Nice place & very good food and hospitality."
    },
    {
      name: "Balu",
      role: "Bangalore",
      content: "What a hidden gem and an amazing place. In the midst of nature, great food, wonderful hospitality, great naturalists. I can go on... A special mention to Ravi Anna, Aranya, Elpin & Sagar & everyone else on the staff again. We will come back. PS: The coffee talk & nature walk were great!"
    },
    {
      name: "Kurinj (Martin & Pushpendra)",
      role: "Bangalore",
      content: "It has been a wonderful experience coming to Forest poomale. The walks were wonderful and the nature made us heal. Aranya and the team were great hosts. We wanted to stay more. Will visit for longer next time. Lots of Love ♡"
    }
  ]

  
  return (
    <section id="validation" className="section-padding relative overflow-hidden">
      
      <div className="container-max relative z-10">
        <div className="text-center mb-12 pt-8 pb-8">
          <h2 className="text-4xl md:text-6xl font-arizona font-light mb-4 text-text-primary">
            Real Transformations, Not Just Results
          </h2>
          <h3 className="text-2xl md:text-3xl font-arizona font-medium mb-6 text-brand-red">
            Hear Their Stories from the Wilderness
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
                <div className="absolute -top-4 left-0 text-8xl md:text-9xl font-arizona font-light text-brand-red/20">
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
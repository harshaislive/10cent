'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { HeroSubHeading } from './HeroSubHeading'

export interface PhilosophyCardProps {
  isLoaded: boolean
  animationDelay: number
  className?: string
}

export const PhilosophyCard: React.FC<PhilosophyCardProps> = ({
  isLoaded,
  animationDelay,
  className = ''
}) => {
  return (
    <div className={cn(
      className,
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      'transition-all duration-1000'
    )}
    style={{ transitionDelay: `${animationDelay}ms` }}>
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-stone-200 max-w-2xl mx-auto">
        <HeroSubHeading
          background="light"
          size="md"
          weight="light"
          variant="secondary"
          className="mb-4 text-center"
        >
          A Philosophy in Numbers
        </HeroSubHeading>
        <div className="text-center">
          <div className="text-4xl md:text-5xl font-serif font-bold text-brand-red mb-6">
            10% of your year. 30 nights. ₹15L
          </div>
          <p className="text-lg font-serif text-text-primary italic">
            No ownership. No baggage. Just access—to what truly matters.
          </p>
        </div>
      </div>
    </div>
  )
}
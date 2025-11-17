'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { HeroSubHeading } from './HeroSubHeading'

export interface MemberQuoteProps {
  isLoaded: boolean
  animationDelay: number
  className?: string
}

export const MemberQuote: React.FC<MemberQuoteProps> = ({
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
      <div className="border-l-4 border-sustainable-green pl-8 max-w-2xl mx-auto">
        <HeroSubHeading
          background="light"
          size="md"
          weight="bold"
          variant="primary"
          className="mb-4"
        >
          The one who brings binoculars for every trip.
        </HeroSubHeading>
        <HeroSubHeading
          background="light"
          size="md"
          weight="normal"
          variant="primary"
          className="mb-3"
        >
          The one who believes nature is a page turner—not a return ticket.
        </HeroSubHeading>
        <HeroSubHeading
          background="light"
          size="md"
          weight="normal"
          variant="primary"
          className="mb-4"
        >
          The one who wants time alone, not time off.
        </HeroSubHeading>
        <HeroSubHeading
          background="light"
          size="sm"
          weight="normal"
          variant="accent"
          className="italic"
        >
          If that sounds like you, we built this for you.
        </HeroSubHeading>
      </div>
    </div>
  )
}
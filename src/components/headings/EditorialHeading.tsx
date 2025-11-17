'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { BaseHeading, BaseHeadingProps } from './BaseHeading'

export interface EditorialHeadingProps extends Omit<BaseHeadingProps, 'as' | 'size'> {
  dropCap?: boolean
  accent?: string | React.ReactNode
  accentColor?: 'brand-red' | 'amber' | 'sustainable-green'
  isLoaded?: boolean
  animationDelay?: number
}

export const EditorialHeading: React.FC<EditorialHeadingProps> = ({
  children,
  dropCap = false,
  accent,
  accentColor = 'brand-red',
  isLoaded = true,
  animationDelay = 0,
  className = '',
  ...props
}) => {
  const accentColorClass = {
    'brand-red': 'text-brand-red',
    'amber': 'text-amber-600',
    'sustainable-green': 'text-sustainable-green'
  }[accentColor]

  return (
    <BaseHeading
      as="h1"
      variant="primary"
      size="3xl"
      weight="light"
      className={cn(
        'font-serif leading-none',
        'text-stone-900 mb-6',
        isLoaded ? 'opacity-100' : 'opacity-0',
        'transition-opacity duration-1000 ease-in',
        className
      )}
      style={{ 
        transitionDelay: `${animationDelay}ms`,
        fontFamily: 'Georgia, serif'
      }}
      {...props}
    >
      {dropCap && accent && (
        <span className={cn(
          'text-7xl md:text-8xl lg:text-9xl',
          'font-serif',
          accentColorClass
        )}>
          {accent}
        </span>
      )}
      {children}
    </BaseHeading>
  )
}
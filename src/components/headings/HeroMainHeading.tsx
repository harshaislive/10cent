'use client'

import React from 'react'
import { cn } from '@/utils/cn'
import { BaseHeading, BaseHeadingProps } from './BaseHeading'

export interface HeroMainHeadingProps extends Omit<BaseHeadingProps, 'as' | 'size' | 'children'> {
  background: 'dark' | 'light' | 'editorial'
  typewriter?: boolean
  variations?: TypewriterVariation[]
  children?: React.ReactNode
}

export interface TypewriterVariation {
  id: string
  mainText: string | React.ReactNode
  subText?: string | React.ReactNode
  emphasis?: string | React.ReactNode
}

export const HeroMainHeading: React.FC<HeroMainHeadingProps> = ({
  children,
  background = 'dark',
  typewriter = false,
  variations,
  className = '',
  ...props
}) => {
  if (typewriter && variations) {
    return (
      <TypewriterHeading
        variations={variations}
        background={background}
        className={className}
      />
    )
  }

  const variant = background === 'dark' ? 'white' : 'primary'
  
  return (
    <BaseHeading
      as="h1"
      variant={variant}
      size="3xl"
      weight="light"
      className={className}
      {...props}
    >
      {children}
    </BaseHeading>
  )
}

// Typewriter component (internal)
const TypewriterHeading: React.FC<{
  variations: TypewriterVariation[]
  background: 'dark' | 'light' | 'editorial'
  className?: string
}> = ({ variations, background, className = '' }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [showContent, setShowContent] = React.useState(true)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setShowContent(false)
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % variations.length)
        setShowContent(true)
      }, 300)
    }, 4000)

    return () => clearInterval(interval)
  }, [variations.length])

  const currentVariation = variations[currentIndex]
  const textColor = background === 'dark' ? 'text-white' : 'text-text-primary'

  return (
    <h1 className={cn(
      'font-arizona font-light leading-tight',
      textColor,
      'text-4xl md:text-5xl lg:text-6xl xl:text-7xl',
      className
    )}>
      <div className="relative" style={{ minHeight: '6rem' }}>
        <div className={cn(
          'absolute inset-0 transition-all duration-500 ease-in-out',
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        )}>
          <div className="flex flex-col">
            <div className="text-4xl md:text-5xl lg:text-6xl font-arizona font-light leading-tight">
              {currentVariation.mainText}
            </div>
            {currentVariation.subText && (
              <div className="text-3xl md:text-4xl lg:text-5xl font-arizona font-light text-brand-red leading-tight">
                {currentVariation.subText}
              </div>
            )}
          </div>
        </div>
      </div>
    </h1>
  )
}

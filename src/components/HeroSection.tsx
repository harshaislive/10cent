'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { HeroMainHeading, HeroSubHeading } from './headings'
import { HeroImage, MobileHeroImage, LogoImage } from '@/components/ui/OptimizedImage'
import { headlineVariations } from './content/heroContent'
import { getNextSaturdayWithTime } from '@/utils/dateUtils'

// Generate blur placeholder for faster perceived loading
const generateBlurDataURL = (width: number, height: number) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!

  // Create a subtle gradient blur placeholder
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, '#1a472a')
  gradient.addColorStop(1, '#0d2818')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  return canvas.toDataURL('image/jpeg', 0.1)
}

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0">
        {headlineVariations.map((variation, index) => (
          <div
            key={variation.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentBgIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Desktop Image - Optimized */}
            <HeroImage
              src={variation.imageDesktop}
              alt={typeof variation.mainText === 'string' ? variation.mainText : 'Hero background'}
              fill
              className="hidden md:block"
              priority={index === 0}
              sizes="100vw"
            />
            {/* Mobile Image - Optimized */}
            <MobileHeroImage
              src={variation.imageMobile}
              alt={typeof variation.mainText === 'string' ? variation.mainText : 'Hero background'}
              fill
              className="md:hidden"
              priority={index === 0}
              sizes="100vw"
            />
          </div>
        ))}
        
        <div className="hero-overlay absolute inset-0" />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex min-h-[80vh] md:min-h-screen items-center">
        <div className="container-max px-4">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Left Panel - Subject Space */}
            <div className="flex items-center justify-start md:justify-center">
              <div className="w-72 h-72 lg:w-96 lg:h-96 flex items-center justify-center">
                {/* Placeholder for centered subject/person */}
              </div>
            </div>

            {/* Right Panel - Text Content */}
            <div className="text-right space-y-8">
              <HeroTextContent isLoaded={isLoaded} onHeadingChange={setCurrentBgIndex} />
            </div>

          </div>
        </div>
      </div>

      
      
      
      {/* Overlay Elements */}
      <HeroOverlayElements />
    </section>
  )
}

// Extracted text content component
function HeroTextContent({ isLoaded, onHeadingChange }: { isLoaded: boolean; onHeadingChange: (index: number) => void }) {
  return (
    <div className="relative text-right max-w-xl lg:max-w-2xl flex flex-col -mt-10 md:mt-0">
      {/* Right edge line anchor */}
      <div className="absolute right-0 top-0 bottom-0 w-px bg-white/20" />

      {/* Tagline */}
      <AnimatedWrapper delay={0} isLoaded={isLoaded} className="order-4 md:order-1">
        <div className="md:mb-6 pr-8 mt-8 md:mt-0">
          <HeroSubHeading
            background="dark"
            size="sm"
            className="text-white/60 leading-relaxed"
          >
            30 nights a year. Your turn to pause, breathe, and return.
          </HeroSubHeading>
        </div>
      </AnimatedWrapper>

      {/* Main Heading */}
      <AnimatedWrapper delay={200} isLoaded={isLoaded} className="order-1 md:order-2">
        <div className="mb-8 md:mb-20 lg:mb-32 min-h-[3rem] lg:min-h-[4rem] pr-8">
          <HeroMainHeading
            background="dark"
            typewriter
            variations={headlineVariations}
            className="leading-tight"
            onChange={onHeadingChange}
          />
        </div>
      </AnimatedWrapper>

      {/* Button */}
      <AnimatedWrapper delay={400} isLoaded={isLoaded} className="order-2 md:order-3">
        <div className="mb-8 pr-8">
          <a
            href="#access"
            className="btn-primary inline-block text-lg px-8 py-3 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Join The Conversation
          </a>
        </div>
      </AnimatedWrapper>

      {/* Date */}
      <AnimatedWrapper delay={600} isLoaded={isLoaded} className="order-3 md:order-4">
        <div className="pr-8">
          <p className="text-white/50 text-sm font-light tracking-widest uppercase">
            {getNextSaturdayWithTime()}
          </p>
        </div>
      </AnimatedWrapper>

    </div>
  )
}

// Reusable animation wrapper
function AnimatedWrapper({
  children,
  delay,
  isLoaded,
  className,
}: {
  children: React.ReactNode
  delay: number
  isLoaded: boolean
  className?: string
}) {
  return (
    <div
      className={`transition-all duration-1000 ${
        isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className || ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// Extracted overlay elements
function HeroOverlayElements() {
  return (
    <>
      {/* Logo - Optimized */}
      <div className="absolute top-8 right-8 z-20">
        <LogoImage
          src="/10-Club-01.png"
          alt="Beforest 10% Club"
          width={80}
          height={80}
          className="h-12 md:h-16 lg:h-20 w-auto invert drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
          sizes="(max-width: 768px) 48px, (max-width: 1200px) 64px, 80px"
        />
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white/60"
          >
            <path
              d="M12 5v14M19 12l-7 7-7-7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </>
  )
}
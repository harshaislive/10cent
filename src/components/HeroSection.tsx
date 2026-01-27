'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { HeroMainHeading, HeroSubHeading } from './headings'
import { headlineVariations } from './content/heroContent'
import { getNextSaturdayWithTime } from '@/utils/dateUtils'

// Alias native browser Image to avoid conflict with Next.js Image
const NativeImage: { new (): any } = typeof window !== 'undefined' ? window.Image : (class {})

// Track which images have been preloaded
const useImagePreloader = (images: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const preloadingStarted = useRef(false)

  const preloadImages = useCallback(() => {
    if (preloadingStarted.current) return
    preloadingStarted.current = true

    const loadPromises = images.map((src) => {
      return new Promise<string>((resolve) => {
        if (loadedImages.has(src)) {
          resolve(src)
          return
        }

        const img = new NativeImage()
        img.src = src

        if (img.complete) {
          setLoadedImages((prev) => new Set(Array.from(prev).concat(src)))
          resolve(src)
        } else {
          img.onload = () => {
            setLoadedImages((prev) => new Set(Array.from(prev).concat(src)))
            resolve(src)
          }
          img.onerror = () => {
            // Still mark as loaded even on error to avoid infinite loading
            setLoadedImages((prev) => new Set(Array.from(prev).concat(src)))
            resolve(src)
          }
        }
      })
    })

    Promise.all(loadPromises).then(() => {
      setIsLoading(false)
    })
  }, [images, loadedImages])

  useEffect(() => {
    preloadImages()
  }, [preloadImages])

  return { loadedImages, isLoading }
}

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentBgIndex, setCurrentBgIndex] = useState(0)
  const [prevBgIndex, setPrevBgIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [readyIndex, setReadyIndex] = useState(0)

  // Collect all image URLs for preloading
  const allImageUrls = headlineVariations.flatMap((v) => [
    v.imageDesktop,
    v.imageMobile,
  ])

  const { loadedImages, isLoading: isPreloading } = useImagePreloader(allImageUrls)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Handle smooth image transitions - only change when images are ready
  const handleHeadingChange = useCallback((newIndex: number) => {
    if (newIndex === currentBgIndex) return

    const nextVariation = headlineVariations[newIndex]
    const isImageLoaded =
      loadedImages.has(nextVariation.imageDesktop) &&
      loadedImages.has(nextVariation.imageMobile)

    if (isImageLoaded && !isPreloading) {
      setPrevBgIndex(currentBgIndex)
      setIsTransitioning(true)
      setReadyIndex(newIndex)

      // Start the transition
      setTimeout(() => {
        setCurrentBgIndex(newIndex)
      }, 50) // Small delay for smooth crossfade

      // Reset transitioning state after animation
      setTimeout(() => {
        setIsTransitioning(false)
      }, 1050)
    }
  }, [currentBgIndex, loadedImages, isPreloading])

  // Always preload next and previous images for smooth transitions
  const preloadIndices = [
    currentBgIndex,
    (currentBgIndex + 1) % headlineVariations.length,
    (currentBgIndex - 1 + headlineVariations.length) % headlineVariations.length,
  ]

  // Check if an index's images are loaded
  const isIndexLoaded = (index: number) => {
    const variation = headlineVariations[index]
    return (
      loadedImages.has(variation.imageDesktop) &&
      loadedImages.has(variation.imageMobile)
    )
  }

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[#0d2818]">
        {headlineVariations.map((variation, index) => {
          // Only render if images are loaded, but render all loaded images
          const imagesLoaded = isIndexLoaded(index)

          if (!imagesLoaded) return null

          // Crossfade logic: keep current and transitioning images visible
          const isCurrent = index === currentBgIndex
          const isPrev = index === prevBgIndex && isTransitioning
          const isNextReady = index === readyIndex && isTransitioning

          // Multiple images can be visible during transition
          let opacity = 'opacity-0'
          let zIndex = 1

          if (isCurrent) {
            opacity = 'opacity-100'
            zIndex = 10
          } else if (isPrev) {
            opacity = 'opacity-100' // Keep previous visible during crossfade
            zIndex = 5
          } else if (isNextReady) {
            opacity = 'opacity-100' // Show next image
            zIndex = 10
          }

          return (
            <div
              key={variation.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${opacity}`}
              style={{ zIndex }}
            >
              {/* Desktop Image - Optimized */}
              <Image
                src={variation.imageDesktop}
                alt={typeof variation.mainText === 'string' ? variation.mainText : 'Hero background'}
                fill
                className="hidden md:block object-cover"
                priority={index === 0}
                quality={60}
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
              {/* Mobile Image - Optimized */}
              <Image
                src={variation.imageMobile}
                alt={typeof variation.mainText === 'string' ? variation.mainText : 'Hero background'}
                fill
                className="md:hidden object-cover"
                priority={index === 0}
                quality={55}
                sizes="100vw"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              />
            </div>
          )
        })}

        {/* Loading indicator - fades out when all images are ready */}
        {isPreloading && (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d2818] via-[#1a472a]/80 to-[#0d2818] z-20 animate-pulse" />
        )}

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
              <HeroTextContent isLoaded={isLoaded} onHeadingChange={handleHeadingChange} />
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
            Spending 30 nights a year in the deep quiet of the wilderness.
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
      <div className="absolute top-8 left-8 z-20 md:left-8">
        <Image
          src="/10-Club-01.png"
          alt="Beforest 10% Club"
          width={80}
          height={80}
          className="h-12 md:h-16 lg:h-20 w-auto invert drop-shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
          priority
          quality={90}
          sizes="(max-width: 768px) 48px, (max-width: 1200px) 64px, 80px"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4="
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
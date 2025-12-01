'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface WildernessPoint {
  id: number
  title: string
  description: string
  backgroundImage: string
}

const wildernessPoints: WildernessPoint[] = [
  {
    id: 1,
    title: "Expansive Privacy",
    description: "Large landscapes with secluded rooms (100+ acres with two to three guest houses)",
    backgroundImage: "/privacy.jpg"
  },
  {
    id: 2,
    title: "True Solitude",
    description: "You are likely to bump into wildlife more than bumping into others. Truly you, your thoughts and nothing else.",
    backgroundImage: "/PBR_8924.jpg"
  },
  {
    id: 3,
    title: "Unfiltered Wilderness",
    description: "An unfiltered experience of wilderness, working estates, the land and its culture",
    backgroundImage: "/PBR_4299.jpg"
  },
  {
    id: 4,
    title: "Deep Perspective",
    description: "One thing is for certain - in 3 nights you get a deep insight into the land and its culture. A perspective shift would have started.",
    backgroundImage: "/PBR_2161.jpg"
  },
  {
    id: 5,
    title: "Personal Commitment",
    description: "This is not a club. This is a commitment to yourself.",
    backgroundImage: "/PBR_9587 (1).jpg"
  },
  {
    id: 6,
    title: "Extended Family",
    description: "The team on the ground is an extension of your family.",
    backgroundImage: "/PBR_0872.jpg"
  }
]

export default function WildernessExperienceSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isTextVisible, setIsTextVisible] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [nextIndex, setNextIndex] = useState(1)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isPaused || isTransitioning) return

    const interval = setInterval(() => {
      handleSlideChange((prevIndex) => (prevIndex + 1) % wildernessPoints.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused, isTransitioning])

  const handleSlideChange = (newIndexOrFunction: number | ((prevIndex: number) => number)) => {
    if (isTransitioning) return

    const newIndex = typeof newIndexOrFunction === 'function'
      ? newIndexOrFunction(currentIndex)
      : newIndexOrFunction

    setIsTransitioning(true)
    setIsTextVisible(false)
    setNextIndex(newIndex)

    // Change content after text fade out
    setTimeout(() => {
      setCurrentIndex(newIndex)
      setIsTextVisible(true)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 600) // Wait for text fade in to complete
    }, 400)
  }

  const handleMouseEnter = () => setIsPaused(true)
  const handleMouseLeave = () => setIsPaused(false)

  const currentPoint = wildernessPoints[currentIndex]

  return (
    <section id="wilderness-experience" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Images with Cross-fade */}
      <div
        className="absolute inset-0"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Current Image */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
          isTransitioning ? 'opacity-100' : 'opacity-100'
        }`}>
          <Image
            src={currentPoint.backgroundImage}
            alt={currentPoint.title}
            fill
            className="object-cover"
            priority={currentIndex === 0}
            quality={85}
          />
        </div>

        {/* Next Image (preloaded for smooth transition) */}
        {isTransitioning && (
          <div className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-in-out">
            <Image
              src={wildernessPoints[nextIndex].backgroundImage}
              alt={wildernessPoints[nextIndex].title}
              fill
              className="object-cover"
              quality={85}
            />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="container-max px-4 relative z-10 h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">

          {/* Section Title */}
          <div className={`mb-16 transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
          }`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-arizona font-light text-warm-white mb-4">
              The Wilderness
              <span className="block text-sustainable-green">Experience</span>
            </h2>
            <div className="w-24 h-0.5 bg-sustainable-green mx-auto"></div>
          </div>

          {/* Dynamic Content */}
          <div
            className={`transition-all duration-600 ease-out ${
              isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            }`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-arizona font-light text-warm-white mb-6">
              {currentPoint.title}
            </h3>

            <p className="text-lg md:text-xl text-warm-white/90 leading-relaxed font-arizona max-w-3xl mx-auto px-4">
              {currentPoint.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div
            className="flex justify-center items-center gap-2 mt-16"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {wildernessPoints.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                disabled={isTransitioning}
                className={`h-2 rounded-full transition-all duration-500 ease-out ${
                  index === currentIndex
                    ? 'w-8 bg-sustainable-green scale-110'
                    : 'w-2 bg-warm-white/40 hover:bg-warm-white/60 hover:scale-125'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Manual Navigation */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <button
              onClick={() => handleSlideChange((prevIndex) =>
                prevIndex === 0 ? wildernessPoints.length - 1 : prevIndex - 1
              )}
              disabled={isTransitioning}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`p-4 rounded-full border transition-all duration-300 ease-out transform ${
                isTransitioning
                  ? 'border-warm-white/20 text-warm-white/40 cursor-not-allowed scale-95'
                  : 'border-warm-white/40 text-warm-white/80 hover:text-warm-white hover:border-warm-white/60 hover:scale-105 active:scale-95'
              }`}
              aria-label="Previous slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="text-sm text-warm-white/70 font-arizona tracking-wider min-w-[60px] text-center">
              {String(currentIndex + 1).padStart(2, '0')} / {String(wildernessPoints.length).padStart(2, '0')}
            </div>

            <button
              onClick={() => handleSlideChange((prevIndex) => (prevIndex + 1) % wildernessPoints.length)}
              disabled={isTransitioning}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className={`p-4 rounded-full border transition-all duration-300 ease-out transform ${
                isTransitioning
                  ? 'border-warm-white/20 text-warm-white/40 cursor-not-allowed scale-95'
                  : 'border-warm-white/40 text-warm-white/80 hover:text-warm-white hover:border-warm-white/60 hover:scale-105 active:scale-95'
              }`}
              aria-label="Next slide"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-warm-white/60">
          <path d="M12 5v14M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </section>
  )
}
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

  useEffect(() => {
    setIsLoaded(true)

    // Auto-slide every 5 seconds
    const interval = setInterval(() => {
      if (!isTransitioning) {
        handleSlideChange((prevIndex) => (prevIndex + 1) % wildernessPoints.length)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [isTransitioning])

  const handleSlideChange = (newIndexOrFunction: number | ((prevIndex: number) => number)) => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setIsTextVisible(false)

    // Change background after fade out
    setTimeout(() => {
      setCurrentIndex(newIndexOrFunction)
      setIsTextVisible(true)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300) // Wait for text fade in to complete
    }, 300)
  }

  const currentPoint = wildernessPoints[currentIndex]

  return (
    <section id="wilderness-experience" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        <Image
          src={currentPoint.backgroundImage}
          alt={currentPoint.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content Container */}
      <div className="container-max relative z-10 h-screen flex items-center">
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
          <div className={`transition-all duration-700 ${
            isTextVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-arizona font-light text-warm-white mb-6">
              {currentPoint.title}
            </h3>

            <p className="text-lg md:text-xl text-warm-white/90 leading-relaxed font-arizona max-w-3xl mx-auto px-4">
              {currentPoint.description}
            </p>
          </div>

          {/* Progress Indicators */}
          <div className="flex justify-center items-center gap-3 mt-16">
            {wildernessPoints.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                disabled={isTransitioning}
                className={`transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-12 h-2 bg-sustainable-green'
                    : 'w-2 h-2 bg-warm-white/40 hover:bg-warm-white/60'
                } ${isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Manual Navigation */}
          <div className="flex justify-center items-center gap-8 mt-12">
            <button
              onClick={() => handleSlideChange((prevIndex) =>
                prevIndex === 0 ? wildernessPoints.length - 1 : prevIndex - 1
              )}
              disabled={isTransitioning}
              className={`p-3 rounded-full border transition-all duration-300 ${
                isTransitioning
                  ? 'border-warm-white/20 text-warm-white/40 cursor-not-allowed'
                  : 'border-warm-white/30 text-warm-white/70 hover:text-warm-white hover:border-warm-white/50'
              }`}
              aria-label="Previous slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="text-sm text-warm-white/60 font-arizona">
              {currentIndex + 1} / {wildernessPoints.length}
            </div>

            <button
              onClick={() => handleSlideChange((prevIndex) => (prevIndex + 1) % wildernessPoints.length)}
              disabled={isTransitioning}
              className={`p-3 rounded-full border transition-all duration-300 ${
                isTransitioning
                  ? 'border-warm-white/20 text-warm-white/40 cursor-not-allowed'
                  : 'border-warm-white/30 text-warm-white/70 hover:text-warm-white hover:border-warm-white/50'
              }`}
              aria-label="Next slide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
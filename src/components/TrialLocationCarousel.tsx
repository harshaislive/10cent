'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface LocationImage {
  desktop: string
  mobile: string
}

interface TrialLocationCarouselProps {
  images: LocationImage[]
  locationName: string
}

export default function TrialLocationCarousel({ images, locationName }: TrialLocationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-play functionality
  useEffect(() => {
    if (isPaused || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 6000)

    return () => clearInterval(interval)
  }, [isPaused, images.length])

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  if (images.length === 0) return null

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#342e29]/5"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image Slideshow with Cinematic Crossfade */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, scale: 1.1, zIndex: 10 }}
          exit={{ opacity: 1, zIndex: 0 }} // KEY FIX: Don't fade out! Let new image fade in ON TOP.
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: 10, ease: "linear" }
          }}
          className="absolute inset-0 z-0"
        >
          {/* Desktop Image */}
          <Image
            src={images[currentIndex].desktop}
            alt={`${locationName} - Image ${currentIndex + 1}`}
            fill
            className="hidden md:block object-cover"
            sizes="100vw"
            quality={90}
            priority={currentIndex === 0}
          />
          {/* Mobile Image */}
          <Image
            src={images[currentIndex].mobile}
            alt={`${locationName} - Image ${currentIndex + 1}`}
            fill
            className="md:hidden object-cover"
            sizes="100vw"
            quality={75}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Only show on hover if more than 1 image */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Minimal Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          {images.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${index === currentIndex
                ? 'bg-white w-4'
                : 'bg-white/30 w-1'
                }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

interface TypewriterHeadlineProps {
  className?: string
}

const headlineVariations = [
  {
    mainText: "27 meetings this quarter.",
    subText: "How many with yourself?"
  },
  {
    mainText: "365 days this year.",
    subText: "How many for yourself?"
  },
  {
    mainText: "52 weekends this year.",
    subText: "How many in wilderness?"
  },
  {
    mainText: "A million notifications.",
    subText: "How many moments of silence?"
  },
  {
    mainText: "12 months of hustle.",
    subText: "How many of pause?"
  }
]

export default function TypewriterHeadline({ className = "" }: TypewriterHeadlineProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showContent, setShowContent] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setShowContent(false)

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % headlineVariations.length)
        setShowContent(true)
      }, 300) // Short fade out
    }, 4000) // Show each headline for 4 seconds

    return () => clearInterval(interval)
  }, [])

  const currentHeadline = headlineVariations[currentIndex]

  return (
    <div className={`text-right ${className}`}>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-arizona font-light leading-tight mb-6 text-white transition-opacity duration-300">
        <div
          className={`transition-opacity duration-300 ${
            showContent ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="whitespace-nowrap">
            {currentHeadline.mainText}
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl font-arizona font-light text-brand-red">
              {currentHeadline.subText}
            </span>
          </div>
        </div>
      </h1>
    </div>
  )
}
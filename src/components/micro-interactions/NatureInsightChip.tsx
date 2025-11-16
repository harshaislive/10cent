'use client'

import { useState, useEffect } from 'react'

interface NatureInsightChipProps {
  question: string
  answer: string
  delay?: number
}

export default function NatureInsightChip({ question, answer, delay = 0 }: NatureInsightChipProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  const handleInteraction = () => {
    setHasInteracted(true)
    setIsHovered(true)
    // Auto-hide after 5 seconds
    setTimeout(() => setIsHovered(false), 5000)
  }

  return (
    <div className={`text-center transition-all duration-700 ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div
        className="nature-insight-chip relative inline-block cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => !hasInteracted && setIsHovered(false)}
        onClick={handleInteraction}
      >
        {/* Question with underline */}
        <span className="text-base text-stone-700 font-arizona relative tracking-wide">
          {question}
          <span className={`absolute bottom-0 left-0 h-px bg-brand-red transition-all duration-300 ${
            isHovered || hasInteracted ? 'w-full' : 'w-0'
          }`} />
        </span>

        {/* Insight bubble */}
        <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-96 transition-all duration-300 z-50 ${
          isHovered || hasInteracted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
        }`}>
          <div className="relative bg-white rounded-xl p-6 shadow-2xl border border-stone-200">
            {/* Triangle pointer */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2 w-4 h-4 bg-white rotate-45 border-r border-t border-stone-200" />

            {/* Insight content */}
            <div className="text-stone-800">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-2xl text-brand-red">‟</span>
                <p className="text-lg leading-relaxed font-arizona">
                  {answer}
                </p>
                <span className="text-2xl text-brand-red">„</span>
              </div>
            </div>

            {/* Click to close for mobile */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsHovered(false)
              }}
              className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Glow effect */}
        {(isHovered || hasInteracted) && (
          <div className="absolute inset-0 bg-brand-red/20 blur-xl rounded-full -z-10" />
        )}
      </div>

      {/* Interaction prompt */}
      {!hasInteracted && (
        <div className={`mt-3 text-sm text-stone-500 transition-all duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <span className="animate-pulse">⟨ hover to discover ⟩</span>
        </div>
      )}
    </div>
  )
}
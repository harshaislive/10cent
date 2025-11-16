'use client'

import { useState, useEffect } from 'react'

interface MicroInteractionBlockProps {
  question: string
  answer: string
  type?: 'time' | 'wilderness' | 'sounds' | 'seasons' | 'stars'
}

export default function MicroInteractionBlock({
  question,
  answer,
  type = 'time'
}: MicroInteractionBlockProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showInsight, setShowInsight] = useState(false)
  const [isHovering, setIsHovering] = useState('')

  const getAnswerOptions = () => {
    switch (type) {
      case 'time':
        return [
          { id: 'never', text: "I can't remember", category: 'never' },
          { id: 'recent', text: "Last week", category: 'recent' },
          { id: 'month', text: "A month ago", category: 'recent' },
          { id: 'often', text: "I often disconnect", category: 'regular' },
          { id: 'weekend', text: "Most weekends", category: 'regular' }
        ]
      case 'wilderness':
        return [
          { id: 'childhood', text: "Like when I was a child", category: 'never' },
          { id: 'distant', text: "A distant memory", category: 'recent' },
          { id: 'occasional', text: "Occasionally on vacation", category: 'recent' },
          { id: 'seeking', text: "I actively seek it out", category: 'regular' },
          { id: 'partof', text: "It's part of who I am", category: 'regular' }
        ]
      case 'sounds':
        return [
          { id: 'never', text: "I can't remember the last time", category: 'never' },
          { id: 'city', text: "City noises have taken over", category: 'never' },
          { id: 'sometimes', text: "Sometimes when I travel", category: 'recent' },
          { id: 'seeking', text: "I actively seek natural sounds", category: 'regular' },
          { id: 'daily', text: "I try to hear them daily", category: 'regular' }
        ]
      case 'seasons':
        return [
          { id: 'lost', text: "I've lost track of seasons", category: 'never' },
          { id: 'office', text: "Seasons change outside my office window", category: 'recent' },
          { id: 'notice', text: "I notice but don't experience them", category: 'recent' },
          { id: 'weekends', text: "I try to get out on weekends", category: 'regular' },
          { id: 'live', text: "I live by the seasons", category: 'regular' }
        ]
      case 'stars':
        return [
          { id: 'city', text: "Can't see them from the city", category: 'never' },
          { id: 'remember', text: "I remember seeing them as a kid", category: 'recent' },
          { id: 'occasionally', text: "Occasionally on clear nights", category: 'recent' },
          { id: 'travel', text: "When I travel away from cities", category: 'regular' },
          { id: 'often', text: "I often look for them", category: 'regular' }
        ]
      default:
        return [
          { id: 'never', text: "I can't remember", category: 'never' },
          { id: 'recent', text: "Last week", category: 'recent' },
          { id: 'month', text: "A month ago", category: 'recent' },
          { id: 'often', text: "I often disconnect", category: 'regular' },
          { id: 'weekend', text: "Most weekends", category: 'regular' }
        ]
    }
  }

  const answerOptions = getAnswerOptions()

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleAnswerSelect = (option: typeof answerOptions[0]) => {
    setSelectedAnswer(option.text)
    setHasAnswered(true)
    setTimeout(() => setShowInsight(true), 1200)
  }

  const getInsightText = () => {
    const selectedOption = answerOptions.find(opt => opt.text === selectedAnswer)
    const category = selectedOption?.category || 'custom'

    switch (category) {
      case 'never':
        return "That's exactly why 30 nights a year could change everything."
      case 'recent':
        return "You remember what clarity feels like. What if you could have that 10% of your year?"
      case 'regular':
        return "You're ahead of most. Imagine making that 10% of every year—fully immersive."
      default:
        return "30 nights a year—that's 10%—creates space for whatever you've been missing."
    }
  }

  return (
    <section className={`py-16 transition-all duration-1000 ${
      isVisible ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Subtle separator */}
      <div className="container-max">
        <div className="max-w-4xl mx-auto">

          {/* Thought-provoking quote that looks like regular content */}
          <div className="text-center mb-8">
            <p className="text-stone-500 font-arizona text-sm leading-relaxed">
              The gap between knowing you need nature and actually finding it.
            </p>
          </div>

          {/* Main interaction - styled like editorial content */}
          <div className="bg-stone-50/30 rounded-xl p-8 backdrop-blur-xs border border-stone-200/30">

            {!hasAnswered ? (
              /* Discovery phase */
              <div className="space-y-8">
                {/* The question - looks like a pull quote */}
                <div className="text-center">
                  <p className="text-stone-600 font-arizona text-lg leading-relaxed italic">
                    "{question}"
                  </p>
                  <div className="mt-4 text-stone-400">
                    <span className="text-xs">— a moment of reflection</span>
                  </div>
                </div>

                {/* Interactive options - styled as subtle word choices */}
                <div className="space-y-6">
                  <p className="text-center text-stone-500 font-arizona text-xs tracking-wide uppercase">
                    Select the response that resonates
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    {answerOptions.map((option) => (
                      <span
                        key={option.id}
                        onClick={() => handleAnswerSelect(option)}
                        onMouseEnter={() => setIsHovering(option.id)}
                        onMouseLeave={() => setIsHovering('')}
                        className={`relative px-4 py-2 font-arizona text-sm cursor-pointer transition-all duration-300 ${
                          isHovering === option.id
                            ? 'text-brand-red bg-brand-red/5'
                            : 'text-stone-600 hover:text-stone-700'
                        }`}
                      >
                        {option.text}
                        {isHovering === option.id && (
                          <span className="absolute bottom-0 left-0 w-full h-px bg-brand-red/40 animate-pulse" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Subtle hint */}
                <p className="text-center text-stone-400 font-arizona text-xs">
                  ← or → scroll to continue
                </p>
              </div>
            ) : (
              /* Reveal phase */
              <div className="space-y-8">
                {/* Acknowledge their choice */}
                <div className="text-center">
                  <p className="text-stone-500 font-arizona text-sm italic">
                    You chose: <span className="text-stone-700">"{selectedAnswer}"</span>
                  </p>
                </div>

                {/* The insight - appears as a revelation */}
                <div className={`text-center transition-all duration-700 ${
                  showInsight ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                  <div className="inline-block">
                    <p className="text-stone-700 font-arizona text-base leading-relaxed">
                      {getInsightText()}
                    </p>
                  </div>
                </div>

                {/* Continue prompt */}
                {showInsight && (
                  <div className="text-center">
                    <p className="text-stone-400 font-arizona text-xs">
                      Continue exploring below →
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Subtle footer */}
          <div className="text-center mt-8">
            <p className="text-stone-400 font-arizona text-xs">
              *30 nights = 10% of your year
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
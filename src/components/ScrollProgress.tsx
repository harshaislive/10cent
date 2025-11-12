'use client'

import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentSection, setCurrentSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      // Update scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)

      // Update current section
      const sections = document.querySelectorAll('section[id]')
      const scrollPosition = window.scrollY + 100

      sections.forEach((section) => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionId = section.getAttribute('id')

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight &&
          sectionId
        ) {
          setCurrentSection(sectionId)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial call

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Progress Bar */}
      <div className="scroll-indicator" style={{ width: `${scrollProgress}%` }} />

      {/* Floating Section Indicator */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block">
        <div className="flex flex-col gap-4">
          {['hero', 'problem', 'solution', 'webinar', 'validation', 'access'].map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className={`group relative flex items-center transition-all duration-300 ${
                currentSection === section ? 'text-brand-red' : 'text-gray-400 hover:text-brand-red'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSection === section ? 'bg-brand-red scale-150' : 'bg-gray-400 group-hover:bg-brand-red'
                }`}
              />
              <span className="absolute left-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm whitespace-nowrap capitalize bg-white px-2 py-1 rounded shadow-md">
                {section.replace('-', ' ')}
              </span>
            </a>
          ))}
        </div>
      </div>
    </>
  )
}
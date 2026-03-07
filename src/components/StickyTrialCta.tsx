'use client'

import { useEffect, useState } from 'react'

interface StickyTrialCtaProps {
  targetId: string
}

export default function StickyTrialCta({ targetId }: StickyTrialCtaProps) {
  const [isTargetVisible, setIsTargetVisible] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTargetVisible(entry.isIntersecting)
      },
      {
        threshold: 0.2,
      }
    )

    observer.observe(target)

    return () => observer.disconnect()
  }, [targetId])

  if (isTargetVisible) {
    return null
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-text-primary/10 bg-warm-white/95 px-4 py-3 backdrop-blur-md shadow-[0_-6px_24px_rgba(0,33,64,0.08)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-text-secondary">
            Experience Before Commitment
          </p>
          <p className="mt-1 text-sm leading-relaxed text-text-primary md:text-base">
            The land will explain this more clearly than we can.
          </p>
        </div>

        <a
          href="https://hospitality.beforest.co"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-lg hover:-translate-y-0.5"
        >
          Book A Trial Stay
        </a>
      </div>
    </div>
  )
}

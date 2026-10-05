'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'

const VERSIONS = [
  { title: 'Stay in nature. Come back throughout the year.', note: 'A membership for regular stays in Beforest’s forests and farms, without buying a holiday home.' },
  { title: 'Spend more days in nature, every year.', note: '10% gives you recurring access to Beforest places, so time away can become part of your routine.' },
  { title: 'Return to places you get to know.', note: 'Stay in Beforest’s forests and farms across the seasons, through one membership.' },
  { title: 'Regular stays in nature. Without owning property.', note: 'Make time for yourself and your people at Beforest, with places you can return to throughout the year.' },
]

export function RotatingHeroCopy({ href, onBegin }: { href: string; onBegin: () => void }) {
  const [version, setVersion] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updatePreference()
    updateVisibility()
    preference.addEventListener('change', updatePreference)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(entries => setVisible(entries[0]?.isIntersecting ?? false), { threshold: 0.25 })
    if (root.current) observer.observe(root.current)
    return () => {
      preference.removeEventListener('change', updatePreference)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (paused || hovered || reducedMotion || !visible || !pageVisible) return
    const timer = window.setInterval(() => setVersion(current => (current + 1) % VERSIONS.length), 12000)
    return () => window.clearInterval(timer)
  }, [paused, hovered, reducedMotion, visible, pageVisible, version])

  return <div ref={root} className="sw-hero-copy sw-rotating-hero" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
    <div onFocusCapture={() => setPaused(true)}>
      <p className="sw-eyebrow">THE 10% LIFE · THE SHORT STORY</p>
      <h1 id="sw-title" className="sw-copy-stack" aria-live="off">
        {VERSIONS.map((item, index) => <span key={item.title} className={version === index ? 'sw-copy-frame is-current' : 'sw-copy-frame'} aria-hidden={version !== index}>{item.title}</span>)}
      </h1>
      <p className="sw-hero-note sw-copy-stack" aria-live="off">
        {VERSIONS.map((item, index) => <span key={item.title} className={version === index ? 'sw-copy-frame is-current' : 'sw-copy-frame'} aria-hidden={version !== index}>{item.note}</span>)}
      </p>
      <a className="sw-button" href={href} onClick={onBegin}>Imagine your year <ArrowRight size={19} aria-hidden="true" /></a>
    </div>
  </div>
}

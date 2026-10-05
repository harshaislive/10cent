'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

const VIEWS = [
  { image: '/images/walkthrough/hyderabad-living-land.webp', alt: 'Forested rocky hills, farms and water at the Beforest Hyderabad Collective', label: 'The wider landscape', line: 'Forests, farms and water, sharing one landscape.', credit: 'Beforest Hyderabad · Deccan plateau' },
  { image: '/images/walkthrough/forest-light.webp', alt: 'Sunlight falling through trees onto a leaf-covered forest path', label: 'A closer look', line: 'A familiar path. A different light each time.', credit: 'From the Beforest photo archive' },
]

export function LivingLandSequence() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(true)
  const [pageVisible, setPageVisible] = useState(true)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReduced(motion.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updateMotion(); updateVisibility()
    motion.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    if (root.current) observer.observe(root.current)
    return () => { observer.disconnect(); motion.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility) }
  }, [])
  useEffect(() => {
    if (paused || reduced || !visible || !pageVisible) return
    const timer = window.setInterval(() => setActive(index => (index + 1) % VIEWS.length), 7000)
    return () => window.clearInterval(timer)
  }, [paused, reduced, visible, pageVisible])
  return <div ref={root} className="sw-land-sequence" role="region" aria-label="Get to know the land" aria-roledescription="carousel">
    <div className="sw-land-frames">
      {VIEWS.map((view, index) => <figure key={view.image} className={`sw-land-frame ${active === index ? 'is-active' : ''}`} aria-hidden={active !== index}>
        <Image src={view.image} alt={view.alt} fill sizes="(max-width:760px) 100vw, 90vw" />
        <figcaption><span>{view.credit}</span><p>{view.line}</p></figcaption>
      </figure>)}
    </div>
    <div className="sw-land-controls">
      <div>{VIEWS.map((view, index) => <button key={view.label} type="button" aria-pressed={active === index} onClick={() => { setActive(index); setPaused(true) }}><span>0{index + 1}</span>{view.label}</button>)}</div>
      {!reduced && <button type="button" className="sw-land-play" onClick={() => setPaused(value => !value)}>{paused ? 'Let the views change' : 'Hold this view'}</button>}
    </div>
  </div>
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import './changing-seasons.css'

const FRAMES = ['sun', 'rain', 'fog', 'wind']

export function ChangingSeasons() {
  const scene = useRef<HTMLDivElement>(null)
  const loaded = useRef(new Set<string>())
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(false)
  const [pageVisible, setPageVisible] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotion = () => setReducedMotion(preference.matches)
    const updateVisibility = () => setPageVisible(!document.hidden)
    updateMotion()
    updateVisibility()
    preference.addEventListener('change', updateMotion)
    document.addEventListener('visibilitychange', updateVisibility)
    const observer = new IntersectionObserver(entries => {
      setInView(entries.some(entry => entry.isIntersecting))
    }, { threshold: 0.15 })
    if (scene.current) observer.observe(scene.current)
    return () => {
      preference.removeEventListener('change', updateMotion)
      document.removeEventListener('visibilitychange', updateVisibility)
      observer.disconnect()
    }
  }, [])

  const animated = ready && !reducedMotion
  const playing = animated && inView && pageVisible && !paused

  return <div ref={scene} className="sw-changing-seasons" data-animated={animated} data-playing={playing}>
    <div className="sw-season-scene" role="img" aria-label="The same wilderness trail changes through sunshine, rain, morning mist and wind.">
      {FRAMES.map(frame => <div className={`sw-season-frame sw-season-${frame}`} key={frame} aria-hidden="true">
        <Image src={`/illustrations/walkthrough/seasons-v3/${frame}.webp`} alt="" width={768} height={512} sizes="(max-width: 760px) calc(100vw - 48px), 560px" onLoad={() => {
          loaded.current.add(frame)
          if (loaded.current.size === FRAMES.length) setReady(true)
        }} />
      </div>)}
    </div>
    {animated ? <button type="button" className="sw-season-toggle" aria-label={paused ? 'Play changing landscape' : 'Pause changing landscape'} aria-pressed={paused} onClick={() => setPaused(value => !value)}>
      {paused ? 'Resume animation' : 'Pause animation'}
    </button> : null}
  </div>
}

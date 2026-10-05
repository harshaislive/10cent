'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowRight, Plus } from 'lucide-react'
import { PLACES } from '@/lib/envision/model'
import { readingSignal } from '@/lib/walkthrough/handoff'

const CHAPTERS = ['the-land', 'the-return', 'the-places', 'your-year']
const LANDSCAPES = PLACES.filter(place => ['poomaale', 'hammiyala', 'hyderabad'].includes(place.id))
const FAQS = [
  { question: 'Is this ownership?', answer: '10% is recurring access to Beforest landscapes. You do not buy land or become a collective owner. The collectives, hospitality and experiences are part of the larger Beforest world.' },
  { question: 'What does a person-night mean?', answer: 'One person staying one night uses one person-night. Two adults staying three nights use six person-nights. The 10% membership described in the walkthrough offers 30 person-nights a year for 10 years. Actual stays follow the applicable membership terms and availability.' },
  { question: 'What happens when I envision my year?', answer: 'You choose what you want more room for, who comes with you, your travel rhythm and the landscapes that interest you. We turn those choices into an editable, personal calendar. It is an illustration of a possible year, not a booking or a membership allowance.' },
  { question: 'Can I experience a place first?', answer: 'Yes. After picturing your year, you can explore a trial stay at Blyton Bungalow in Coorg. Available dates, stay details and payment are shown in the booking journey.' },
]

export function ShortWalkthrough({ initialHref }: { initialHref: string }) {
  const href = initialHref
  const [chapter, setChapter] = useState(0)
  const seen = useRef(new Set<string>())
  useEffect(() => {
    if (!seen.current.has('page')) {
      seen.current.add('page')
      readingSignal('reading_page_viewed')
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        const index = CHAPTERS.indexOf(entry.target.id)
        if (index >= 0) setChapter(index)
        if (!seen.current.has(entry.target.id)) {
          seen.current.add(entry.target.id)
          readingSignal('reading_section_viewed', entry.target.id)
        }
      }
    }, { rootMargin: '-15% 0px -35% 0px', threshold: 0 })
    CHAPTERS.forEach(id => { const section = document.getElementById(id); if (section) observer.observe(section) })
    return () => observer.disconnect()
  }, [])

  function begin(position: string) { readingSignal('envision_clicked', position) }
  return <main className="sw-page">
    <a className="sw-skip" href="#the-land">Skip to the story</a>
    <header className="sw-header">
      <a href="https://beforest.co" className="sw-brand" aria-label="Beforest home">Beforest<span>10% LIFE</span></a>
      <a className="sw-header-link" href={href} onClick={() => begin('header')}>Your year <ArrowRight size={16} aria-hidden="true" /></a>
    </header>

    <section className="sw-hero" aria-labelledby="sw-title">
      <div className="sw-hero-photo"><Image src="/PBR_0209.webp" alt="A quiet moment with a book beneath the canopy at Beforest" fill priority sizes="100vw" /></div>
      <div className="sw-hero-shade" />
      <div className="sw-hero-copy">
        <p className="sw-eyebrow">THE 10% LIFE · THE SHORT STORY</p>
        <h1 id="sw-title">A little room.<br />A reason to return.</h1>
        <p className="sw-hero-note">What if time in nature had a place in your year?</p>
        <a className="sw-button" href={href} onClick={() => begin('hero')}>Envision your year <ArrowRight size={19} aria-hidden="true" /></a>
      </div>
      <a className="sw-read" href="#the-land">Get to know the idea <ArrowDown size={17} aria-hidden="true" /></a>
      <span className="sw-hero-caption">Time beneath the canopy, Beforest</span>
    </section>

    <section id="the-land" className="sw-land sw-chapter" aria-labelledby="land-title">
      <div className="sw-section-number">01 / IT BEGINS WITH THE LAND</div>
      <div className="sw-land-copy"><h2 id="land-title">A living place.<br />Still becoming.</h2>
        <p>Beforest brings degraded land back to life. Soil, water, forests and communities are part of the same story.</p>
        <p>These are working, regenerating landscapes. Places to get to know slowly, as the land changes through the years.</p>
      </div>
      <figure className="sw-land-photo"><Image src={LANDSCAPES[2].image} alt="The Deccan rockscape at Beforest's Hyderabad collective" fill sizes="(max-width: 760px) 100vw, 48vw" /><figcaption>Beforest Hyderabad · Deccan plateau</figcaption></figure>
    </section>

    <section id="the-return" className="sw-return sw-chapter" aria-labelledby="return-title">
      <div className="sw-section-number">02 / A RHYTHM OF RETURN</div>
      <h2 id="return-title">Come back.<br />Notice a little more.</h2>
      <p className="sw-return-note">The rain arrives. The canopy changes. A path becomes familiar.<br className="sw-desktop-break" /> Returning gives you time to know a place.</p>
      <div className="sw-model">
        <p className="sw-model-intro">10% makes room for that relationship, through recurring access without the responsibility of owning land.</p>
        <div className="sw-model-fact"><strong>30</strong><span>person-nights a year</span></div>
        <div className="sw-model-fact"><strong>10</strong><span>years of returning</span></div>
      </div>
      <p className="sw-model-footnote">The membership described in the walkthrough. A person-night is one person staying one night. Stays are subject to terms and availability.</p>
    </section>

    <section id="the-places" className="sw-places sw-chapter" aria-labelledby="places-title">
      <div className="sw-places-heading"><div><p className="sw-section-number">03 / REAL PLACES, DIFFERENT RHYTHMS</p><h2 id="places-title">Which landscape calls to you?</h2></div><p className="sw-swipe">Scroll through the places <ArrowRight size={16} aria-hidden="true" /></p></div>
      <div className="sw-place-track" tabIndex={0} aria-label="Beforest landscapes. Scroll horizontally to see more places.">
        {LANDSCAPES.map(place => <figure className="sw-place" key={place.id}>
          <div className="sw-place-image"><Image src={place.image} alt={`${place.name}: ${place.description}`} fill sizes="(max-width: 760px) 82vw, 33vw" /></div>
          <figcaption><span>{place.region}</span><h3>{place.name}</h3><p>{place.description}</p></figcaption>
        </figure>)}
      </div>
    </section>

    <section id="your-year" className="sw-year sw-chapter" aria-labelledby="year-title">
      <div className="sw-year-copy"><p className="sw-section-number">04 / NOW MAKE IT PERSONAL</p><h2 id="year-title">Where would this<br />fit in your year?</h2>
        <p>A few days on your own. Time with your family. A place you return to as the seasons change.</p>
        <p>Tell us what matters to you. Choose your people, your places and your rhythm. See those choices become a possible year.</p>
        <a className="sw-button" href={href} onClick={() => begin('year')}>Envision your year <ArrowRight size={19} aria-hidden="true" /></a>
        <small>Your own editable calendar. No booking needed to begin.</small>
      </div>
      <div className="sw-year-preview" aria-label="Illustration of a possible year">
        <div className="sw-preview-top"><span>A YEAR WITH ROOM TO RETURN</span><span>YOURS TO SHAPE</span></div>
        {[{ season: 'A quieter beginning', place: LANDSCAPES[0], line: 'A few days beneath the canopy.' }, { season: 'When the seasons change', place: LANDSCAPES[1], line: 'Time for a wider sky.' }, { season: 'A little later in the year', place: LANDSCAPES[2], line: 'Another landscape to get to know.' }].map(item => <div className="sw-preview-visit" key={item.season}>
          <span className="sw-preview-dot" /><div className="sw-preview-image"><Image src={item.place.image} alt="" fill sizes="92px" /></div>
          <div><span>{item.season}</span><h3>{item.place.name}</h3><p>{item.line}</p></div>
        </div>)}
        <p className="sw-preview-note">Just a first picture. Your dates and places come from your choices.</p>
      </div>
    </section>

    <section className="sw-questions" aria-labelledby="questions-title"><h2 id="questions-title">A little clarity, before you begin.</h2>
      {FAQS.map((faq, index) => <details key={faq.question} onToggle={event => { if (event.currentTarget.open) readingSignal('reading_faq_opened', String(index + 1)) }}>
        <summary>{faq.question}<Plus size={18} aria-hidden="true" /></summary><p>{faq.answer}</p>
      </details>)}
    </section>

    <section className="sw-trial-note" aria-labelledby="trial-note-title"><div className="sw-trial-photo"><Image src="/blyton-optimized/verandah-mobile.webp" alt="The verandah at Blyton Bungalow in Coorg" fill sizes="(max-width: 760px) 100vw, 30vw" /></div>
      <div><p className="sw-section-number">THEN, LET THE LAND ANSWER</p><h2 id="trial-note-title">Picture it here.<br />Experience it at Blyton.</h2><p>After you envision your year, take the next step with a trial stay at Blyton Bungalow, Coorg. Walk the land. Have the coffee. See how it feels.</p><a className="sw-text-link" href={href} onClick={() => begin('trial_bridge')}>Start with your year <ArrowRight size={17} aria-hidden="true" /></a></div>
    </section>

    <footer className="sw-footer"><span>Beforest · 10% Life</span><a href="https://live.10percent.beforest.co/">Prefer the guided walkthrough?</a></footer>
    <aside className="sw-dock" aria-label="Your next step"><div><span>0{chapter + 1} / 04</span><p>Make a little room for you.</p></div><a href={href} className="sw-button" onClick={() => begin('sticky')}>Envision your year <ArrowRight size={17} aria-hidden="true" /></a></aside>
  </main>
}

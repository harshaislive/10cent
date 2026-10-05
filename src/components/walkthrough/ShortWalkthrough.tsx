'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowRight, Plus } from 'lucide-react'
import { PLACES } from '@/lib/envision/model'
import { readingSignal } from '@/lib/walkthrough/handoff'
import { RotatingHeroCopy } from './RotatingHeroCopy'
import { ChangingSeasons } from './ChangingSeasons'

const CHAPTERS = ['the-land', 'the-return', 'the-places', 'your-year']
const LANDSCAPES = PLACES.filter(place => ['poomaale', 'hammiyala', 'hyderabad'].includes(place.id))
const YEAR_MOMENTS = [
  { place: 'Poomaale', region: 'Coorg', moment: 'A few days, closer to the land', line: 'Coffee cherries in your hands. Time to notice how it grows.', image: '/images/walkthrough/poomaale-coffee-harvest.webp', alt: 'People holding freshly picked coffee cherries at the Poomaale Collective' },
  { place: 'Hammiyala', region: 'Coorg', moment: 'Return when the landscape changes', line: 'Misty hills. A slower start to the morning.', image: '/images/walkthrough/hammiyala-mist.webp', alt: 'Misty wooded hills and a winding path at the Hammiyala Collective' },
  { place: 'Hyderabad', region: 'Deccan plateau', moment: 'Another place in your year', line: 'An evening by the lake, watching the light change.', image: '/images/walkthrough/hyderabad-lake-sunset.webp', alt: 'Birds above the Hyderabad Collective lake at sunset' },
]
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
      <RotatingHeroCopy href={href} onBegin={() => begin('hero')} />
      <a className="sw-read" href="#the-land">Get to know the idea <ArrowDown size={17} aria-hidden="true" /></a>
      <span className="sw-hero-caption">Time beneath the canopy, Beforest</span>
    </section>

    <section id="the-land" className="sw-land sw-chapter" aria-labelledby="land-title">
      <div className="sw-land-copy">
        <div className="sw-land-kicker">
          <div className="sw-section-number">01 / IT BEGINS WITH THE LAND</div>
          <div className="sw-illustration sw-illustration-land"><Image src="/illustrations/walkthrough/living-land-v2.webp" alt="Illustration of hands tending a young sapling beside a stream, showing care for living land" width={1200} height={800} sizes="(max-width: 760px) 100px, 130px" /></div>
        </div>
        <h2 id="land-title">A place to<br />get to know.</h2>
        <p>At Beforest, time outside begins with living landscapes. Land being restored. Forests, farms and communities growing together.</p>
        <p>Return through the seasons and there is more to notice. What grows here. How the land changes. The people who care for it.</p>
      </div>
      <figure className="sw-land-photo"><Image src={LANDSCAPES[2].image} alt="A family by the water at sunset at Beforest Hyderabad" fill sizes="(max-width: 760px) 100vw, 48vw" /><figcaption>Beforest Hyderabad · Deccan plateau</figcaption></figure>
    </section>

    <section id="the-return" className="sw-return sw-chapter" aria-labelledby="return-title">
      <div className="sw-section-number">02 / A RHYTHM OF RETURN</div>
      <h2 id="return-title">Let one visit<br />become a rhythm.</h2>
      <p className="sw-return-note">A trail you begin to recognise. A season you look forward to.<br className="sw-desktop-break" /> Time set aside to come back.</p>
      <ChangingSeasons />
      <div className="sw-model">
        <p className="sw-model-intro">10% gives you recurring access to Beforest landscapes. A way to make returning part of your year, without owning land.</p>
        <div className="sw-model-fact"><strong>30</strong><span>person-nights a year</span></div>
        <div className="sw-model-fact"><strong>10</strong><span>years of returning</span></div>
      </div>
      <p className="sw-model-footnote">The membership described in the walkthrough. A person-night is one person staying one night. Stays are subject to terms and availability.</p>
    </section>

    <section id="the-places" className="sw-places sw-chapter" aria-labelledby="places-title">
      <div className="sw-places-heading"><div><p className="sw-section-number">03 / FIND YOUR PLACE</p><h2 id="places-title">Which place would you return to?</h2></div><p className="sw-swipe">Scroll through the places <ArrowRight size={16} aria-hidden="true" /></p></div>
      <div className="sw-place-track" tabIndex={0} aria-label="Beforest landscapes. Scroll horizontally to see more places.">
        {LANDSCAPES.map(place => <figure className="sw-place" key={place.id}>
          <div className="sw-place-image"><Image src={place.image} alt={`${place.name}: ${place.description}`} fill sizes="(max-width: 760px) 82vw, 33vw" /></div>
          <figcaption><span>{place.region}</span><h3>{place.name}</h3><p>{place.description}</p></figcaption>
        </figure>)}
      </div>
    </section>

    <section id="your-year" className="sw-year sw-chapter" aria-labelledby="year-title">
      <div className="sw-year-copy"><p className="sw-section-number">04 / GIVE IT A PLACE IN YOUR YEAR</p><h2 id="year-title">See it in<br />your own year.</h2>
        <p>A few days beneath the canopy. A longer stay with your family. Another visit when the seasons change.</p>
        <p>Choose what you want time for, who comes along and the places that draw you. Envision brings those choices into your own editable calendar.</p>
        <a className="sw-button" href={href} onClick={() => begin('year')}>Envision your year <ArrowRight size={19} aria-hidden="true" /></a>
        <small>A possible year, yours to change. No booking needed to begin.</small>
      </div>
      <div className="sw-year-stories">
        <div className="sw-year-heading">
          <div><span>A POSSIBLE YEAR</span><p>Different places. More to look forward to.</p></div>
          <div className="sw-illustration sw-year-seal"><Image src="/illustrations/walkthrough/picture-your-year-v2.webp" alt="Illustration of a personal calendar with chosen visits to a forest, hills and a lake, and a pencil for making changes" width={1200} height={800} sizes="(max-width: 360px) 80px, (max-width: 760px) 96px, 120px" /></div>
        </div>
        <div className="sw-moment-track" tabIndex={0} role="region" aria-label="Picture your year at Beforest. Scroll horizontally to see three moments.">
          {YEAR_MOMENTS.map((item, index) => <figure className="sw-year-moment" key={item.place}>
            <div className="sw-moment-photo"><Image src={item.image} alt={item.alt} fill sizes={index === 0 ? '(max-width: 760px) 82vw, 52vw' : '(max-width: 760px) 82vw, 26vw'} /><span className="sw-moment-order" aria-hidden="true">0{index + 1}</span></div>
            <figcaption><span>{item.moment}</span><h3>{item.place}<small>{item.region}</small></h3><p>{item.line}</p></figcaption>
          </figure>)}
        </div>
        <div className="sw-year-bottom"><p>These are a few possibilities. Your choices shape your calendar.</p><span className="sw-year-scroll" aria-hidden="true">Swipe to explore <ArrowRight size={16} /></span></div>
      </div>
    </section>

    <section className="sw-questions" aria-labelledby="questions-title"><h2 id="questions-title">What would you like to know?</h2>
      {FAQS.map((faq, index) => <details key={faq.question} onToggle={event => { if (event.currentTarget.open) readingSignal('reading_faq_opened', String(index + 1)) }}>
        <summary>{faq.question}<Plus size={18} aria-hidden="true" /></summary><p>{faq.answer}</p>
      </details>)}
    </section>

    <section className="sw-trial-note" aria-labelledby="trial-note-title"><div className="sw-trial-photo"><Image src="/blyton-optimized/verandah-mobile.webp" alt="The verandah at Blyton Bungalow in Coorg" fill sizes="(max-width: 760px) 100vw, 30vw" /></div>
      <div><p className="sw-section-number">FROM PICTURING TO EXPERIENCING</p><h2 id="trial-note-title">Begin with a stay<br />at Blyton.</h2><p>Once you have pictured your year, explore a trial stay at Blyton Bungalow, Coorg. Walk the land. Have the coffee. Find out what a few days here could mean for you.</p><a className="sw-text-link" href={href} onClick={() => begin('trial_bridge')}>Envision your year <ArrowRight size={17} aria-hidden="true" /></a></div>
    </section>

    <footer className="sw-footer"><span>Beforest · 10% Life</span><a href="https://live.10percent.beforest.co/">Prefer the guided walkthrough?</a></footer>
    <aside className="sw-dock" aria-label="Your next step"><div><span>0{chapter + 1} / 04</span><p>Make room in your year.</p></div><a href={href} className="sw-button" onClick={() => begin('sticky')}>Envision your year <ArrowRight size={17} aria-hidden="true" /></a></aside>
  </main>
}

'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react'
import { DEFAULT_PREFERENCES, MONTHS, MOTIVES, PLACES, type IPreferences } from '@/lib/envision/model'
import { openJourney, recordAction, resetJourney } from '@/lib/envision/client'

const QUESTIONS = [
  { title: 'What would you like more room for?', note: 'Choose one or two things you would like to bring into your year.' },
  { title: 'Who comes into the picture?', note: 'Think of a typical visit. You can change the group for each stay later.' },
  { title: 'Where does your journey begin?', note: 'A little context helps us make this feel like your year.' },
  { title: 'When can you make room?', note: 'Choose the windows that suit you. These are possibilities, not reservations.' },
  { title: 'Find a rhythm that feels like you.', note: 'Short visits, longer stays, or a little of both. There is room to change your mind.' },
  { title: 'Which landscapes call to you?', note: 'Choose your favourites, or let us offer a first picture using these Beforest places.' },
]
const PARTIES = [{ id: 'solo', label: 'Just me' }, { id: 'partner', label: 'My partner and me' }, { id: 'family', label: 'My family' }, { id: 'friends', label: 'Friends' }, { id: 'varies', label: 'Different people, different visits' }] as const
const STORY_LINES = ['A year with room for you.', 'Time with the people who matter.', 'A different rhythm begins here.', 'Days to look forward to.', 'A place in your everyday life.', 'Every landscape has its own story.']

interface IChoiceProps { selected: boolean; title: string; detail?: string; onClick: () => void }
function Choice({ selected, title, detail, onClick }: IChoiceProps) {
  return <button type="button" className={`ev-choice ${selected ? 'is-selected' : ''}`} aria-pressed={selected} onClick={onClick}>
    <span><strong>{title}</strong>{detail && <small>{detail}</small>}</span><span className="ev-check">{selected && <Check size={14} />}</span>
  </button>
}
export function EnvisionExperience() {
  const [step, setStep] = useState(0)
  const [preferences, setPreferences] = useState<IPreferences>({ ...DEFAULT_PREFERENCES })
  const [token, setToken] = useState('')
  const [resume, setResume] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const heading = useRef<HTMLHeadingElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    openJourney().then(result => {
      setToken(result.token); setPreferences(result.journey.preferences)
      setStep(result.journey.resumeStep)
      setResume(result.journey.visits.length > 0 && new URLSearchParams(window.location.search).get('edit') !== '1')
    }).catch(reason => { setError(reason instanceof Error ? reason.message : 'Please try again.') })
  }, [])
  function update<K extends keyof IPreferences>(key: K, value: IPreferences[K]) { setPreferences(current => ({ ...current, [key]: value })) }
  function toggle(key: 'motives' | 'places', value: string, max: number) {
    const existing = preferences[key]
    if (existing.includes(value)) update(key, existing.filter(item => item !== value))
    else if (existing.length < max) update(key, [...existing, value])
  }
  async function next() {
    setBusy(true); setError('')
    try {
      let currentToken = token
      if (!currentToken) { const result = await openJourney(); currentToken = result.token; setToken(currentToken) }
      if (step === 5) {
        await recordAction(currentToken, 'year_generated', { preferences })
        // A fresh document clears any third-party scripts loaded on earlier pages.
        window.location.assign(`/my-year/${currentToken}`)
      } else {
        await recordAction(currentToken, 'preferences_saved', { preferences, step })
        setStep(current => current + 1)
        requestAnimationFrame(() => heading.current?.focus())
      }
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  async function fresh() {
    setBusy(true); setError('')
    try {
      resetJourney()
      const result = await openJourney()
      setToken(result.token); setPreferences(result.journey.preferences); setStep(0); setResume(false)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  const storyPlace = PLACES.find(place => place.id === preferences.places[0]) || PLACES[0]
  const hero = step === 1 ? '/hero-3.webp' : step === 2 ? PLACES[3].image : step === 4 ? PLACES[2].image : storyPlace.image
  return <main className="ev-shell">
    <aside className="ev-story">
      <div className="ev-story-visual"><Image src={hero} alt={step === 1 ? 'People spending time in a Beforest landscape' : 'A real Beforest forest landscape'} fill priority quality={90} sizes="(max-width: 800px) 100vw, 58vw" className="ev-story-image" /></div>
      <div className="ev-story-shade" />
      <Link href="/" className="ev-brand" aria-label="Beforest 10percent home">Beforest <span>10percent</span></Link>
      <div className="ev-story-copy"><p className="ev-eyebrow">Your life, with room for the wilderness</p><h1 key={step}>{STORY_LINES[step]}</h1><p>{step === 5 ? 'A coffee forest. A rocky plateau. A place you could come to know.' : 'Picture the days you would like to return to.'}</p></div>
      <span className="ev-story-caption">{step === 1 ? 'Time together · Beforest landscapes' : step === 2 ? 'Hyderabad · The Deccan plateau' : step === 4 ? 'Hammiyala · Coorg' : `${storyPlace.name} · ${storyPlace.region}`}</span>
    </aside>
    <section className="ev-questions" aria-label="Picture your year">
      <div className="ev-question-top"><span className="ev-eyebrow">Imagine your year</span><span className="ev-step-count">{String(step + 1).padStart(2, '0')} / 06</span></div>
      <div className="ev-progress" aria-label={`Question ${step + 1} of 6`}>{QUESTIONS.map((_, index) => <span key={index} className={index <= step ? 'is-filled' : ''} />)}</div>
      {resume ? <div className="ev-resume"><h2>Your year is waiting.</h2><p>Pick up where you left off, or picture a different rhythm.</p><Link className="ev-button" href={`/my-year/${token}`}>Open my year <ArrowRight size={17} /></Link><button className="ev-text-button" onClick={fresh} disabled={busy}>Start a different year</button></div> : <>
        <header className="ev-question-heading"><h2 ref={heading} tabIndex={-1}>{QUESTIONS[step].title}</h2><p>{QUESTIONS[step].note}</p></header>
        <div className="ev-answer" key={step}>
          {step === 0 && <div className="ev-choices">{MOTIVES.map(motive => <Choice key={motive.id} title={motive.label} selected={preferences.motives.includes(motive.id)} onClick={() => toggle('motives', motive.id, 2)} />)}<button className="ev-text-button" onClick={() => update('motives', [])}>I'm still discovering that</button></div>}
          {step === 1 && <><div className="ev-choices">{PARTIES.map(party => <Choice key={party.id} title={party.label} selected={preferences.party === party.id} onClick={() => setPreferences(current => ({ ...current, party: party.id, people: party.id === 'solo' ? 1 : party.id === 'partner' ? 2 : Math.max(3, current.people) }))} />)}</div><label className="ev-inline-field">How many people do you picture?<input aria-label="People travelling" type="number" min={1} max={20} value={preferences.people} onChange={event => update('people', Number(event.target.value))} /></label></>}
          {step === 2 && <><label className="ev-field">Your home city<input autoComplete="address-level2" value={preferences.city} maxLength={100} onChange={event => update('city', event.target.value)} placeholder="For example, Bengaluru" /></label><p className="ev-field-label">What journey feels manageable?</p><div className="ev-choices">{([{ id: 'drive', label: 'A nearby drive' }, { id: 'long-drive', label: 'A longer drive is fine' }, { id: 'flight', label: 'I can take a flight' }, { id: 'help', label: 'Help me choose' }] as const).map(item => <Choice key={item.id} title={item.label} selected={preferences.travel === item.id} onClick={() => update('travel', item.id)} />)}</div><p className="ev-small">We use this to understand your preferences. Travel routes will be checked when you plan an actual stay.</p></>}
          {step === 3 && <><div className="ev-chips">{([{ id: 'weekends', label: 'Weekends' }, { id: 'school-holidays', label: 'School holidays' }, { id: 'planned-leave', label: 'Planned leave' }, { id: 'flexible', label: 'Flexible weekdays' }, { id: 'unsure', label: 'Not sure yet' }] as const).map(item => <button key={item.id} aria-pressed={preferences.timing === item.id} className={preferences.timing === item.id ? 'is-selected' : ''} onClick={() => update('timing', item.id)}>{item.label}</button>)}</div><p className="ev-field-label">Any months you have in mind?</p><div className="ev-months">{MONTHS.map((month, index) => <button key={month} aria-pressed={preferences.months.includes(index)} className={preferences.months.includes(index) ? 'is-selected' : ''} onClick={() => update('months', preferences.months.includes(index) ? preferences.months.filter(item => item !== index) : [...preferences.months, index])}>{month.slice(0, 3)}</button>)}</div><p className="ev-small">Leave months open and we'll spread your visits through the coming year. School holiday dates are suggestions for you to adjust.</p></>}
          {step === 4 && <><div className="ev-choices">{([{ id: 'short', label: 'A few short visits', length: 3 }, { id: 'long', label: 'Fewer, longer stays', length: 7 }, { id: 'mix', label: 'A rhythm I can shape', length: 5 }] as const).map(item => <Choice key={item.id} title={item.label} selected={preferences.rhythm === item.id} onClick={() => setPreferences(current => ({ ...current, rhythm: item.id, stayLength: item.length }))} />)}</div><label className="ev-range">Nights you would like to make room for <strong>{preferences.desiredNights}</strong><input aria-label="Desired nights in your imagined year" type="range" min={6} max={60} step={1} value={preferences.desiredNights} onChange={event => update('desiredNights', Number(event.target.value))} /></label><label className="ev-inline-field">Typical nights per visit<input type="number" min={1} max={21} value={preferences.stayLength} onChange={event => update('stayLength', Number(event.target.value))} /></label><label className="ev-checkbox"><input type="checkbox" checked={preferences.returnToSame} onChange={event => update('returnToSame', event.target.checked)} />I'd like to return to one favourite place</label><p className="ev-small">This is time you imagine setting aside, not a membership allowance.</p></>}
          {step === 5 && <><div className="ev-place-choices">{PLACES.map(place => <button key={place.id} className={`ev-place-choice ${preferences.places.includes(place.id) ? 'is-selected' : ''}`} aria-pressed={preferences.places.includes(place.id)} onClick={() => toggle('places', place.id, 6)}><div className="ev-place-photo"><Image src={place.image} alt={place.name + ', ' + place.region} fill sizes="(max-width: 800px) 44vw, 20vw" /><span className="ev-photo-check">{preferences.places.includes(place.id) ? <Check size={14} /> : <Plus size={14} />}</span></div><strong>{place.name}</strong><small>{place.region}</small><p className="ev-place-detail">{place.description}</p></button>)}</div><p className="ev-small">No favourites yet? Leave these open and we'll use the landscapes above.</p></>}
        </div>
        <div className="ev-question-nav"><button className="ev-back" disabled={step === 0 || busy} onClick={() => { setStep(current => current - 1); requestAnimationFrame(() => heading.current?.focus()) }}><ArrowLeft size={16} /> Back</button><button className="ev-button" disabled={busy} onClick={next}>{busy ? 'Saving your choices…' : step === 5 ? 'Picture my year' : 'Continue'}<ArrowRight size={17} /></button></div>
      </>}
      {error && <p role="alert" className="ev-error">{error}</p>}
      <p className="ev-footer-note">Your choices shape your calendar and help us make future conversations relevant.</p>
    </section>
  </main>
}

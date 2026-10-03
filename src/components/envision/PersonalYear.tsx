'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, ChevronLeft, ChevronRight, Copy, Pencil, X } from 'lucide-react'
import { MONTHS, PLACES, visitDateRange, visitLiner, type IContact, type IPublicJourney, type IVisit } from '@/lib/envision/model'
import { loadYear, recordAction } from '@/lib/envision/client'

const EMPTY_CONTACT: IContact = { name: '', email: '', phone: '', permissions: { email: false, whatsapp: false, calling: false } }

export function PersonalYear({ token }: { token: string }) {
  const [year, setYear] = useState<IPublicJourney | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [contact, setContact] = useState<IContact>(EMPTY_CONTACT)
  const [showSave, setShowSave] = useState(false)
  const [editing, setEditing] = useState<IVisit | null>(null)
  const [copied, setCopied] = useState(false)
  const [copyLink, setCopyLink] = useState('')
  const [notice, setNotice] = useState('')
  const [active, setActive] = useState(0)
  const gallery = useRef<HTMLElement>(null)
  const monthNav = useRef<HTMLElement>(null)
  const viewId = useRef('')
  const hasModal = Boolean(editing || showSave)
  useEffect(() => {
    if (!hasModal) return
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = document.querySelector<HTMLElement>('.ev-modal')
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const controls = () => Array.from(dialog?.querySelectorAll<HTMLElement>('button:not(:disabled), input, select, a[href]') || [])
    controls()[1]?.focus()
    function keys(event: KeyboardEvent) {
      if (event.key === 'Escape' && !busy) { setEditing(null); setShowSave(false) }
      if (event.key !== 'Tab') return
      const items = controls()
      const first = items[0]; const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener('keydown', keys)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', keys); previous?.focus() }
  }, [hasModal, busy])
  useEffect(() => {
    let alive = true
    if (!viewId.current) viewId.current = crypto.randomUUID()
    loadYear(token).then(async loaded => {
      if (!alive) return
      if (!loaded.visits.length) throw new Error('This year is not ready yet. Return to Envision to finish your choices.')
      setYear(loaded)
      const viewed = await recordAction(token, loaded.saved ? 'year_reopened' : 'year_viewed', { id: viewId.current })
      if (alive) setYear(viewed)
    }).catch(reason => { if (alive) setError(reason instanceof Error ? reason.message : 'Please try again.') })
    return () => { alive = false }
  }, [token])

  useEffect(() => {
    if (!year || !gallery.current) return
    const panels = Array.from(gallery.current.querySelectorAll<HTMLElement>('.ev-visit'))
    const ratios = new Map<Element, number>()
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0))
      const visible = panels.filter(panel => (ratios.get(panel) || 0) > 0)
        .sort((a, b) => (ratios.get(b) || 0) - (ratios.get(a) || 0))[0]
      if (visible) setActive(panels.indexOf(visible))
    }, { rootMargin: '-72px 0px -200px 0px', threshold: [0, .1, .25, .5, .75, 1] })
    panels.forEach(panel => observer.observe(panel))
    return () => observer.disconnect()
  }, [year?.revision])

  useEffect(() => {
    const selected = monthNav.current?.querySelector<HTMLElement>('[aria-current="true"]')
    if (selected && monthNav.current) {
      const nav = monthNav.current
      nav.scrollTo({ left: Math.max(0, selected.offsetLeft - nav.offsetLeft - (nav.clientWidth - selected.clientWidth) / 2), behavior: 'smooth' })
    }
  }, [active])

  function jump(index: number) {
    const panels = gallery.current?.querySelectorAll<HTMLElement>('.ev-visit')
    const target = panels?.[index]
    if (!target) return
    setActive(index)
    target.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try {
      const updated = await recordAction(token, 'year_saved', { contact })
      setYear(updated); setShowSave(false); setNotice('Your year is saved. Keep your private link to return to it.')
      setContact(EMPTY_CONTACT)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  async function commitEdit(event: FormEvent) {
    event.preventDefault()
    if (!year || !editing) return
    setBusy(true); setError('')
    try {
      const visits = year.visits.map(visit => visit.id === editing.id ? editing : visit)
      const updated = await recordAction(token, 'year_edited', { visits, expectedRevision: year.revision })
      setYear(updated); setEditing(null); setNotice('Your year has been updated.')
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Please try again.') }
    finally { setBusy(false) }
  }
  async function copy() {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 3000) }
    catch { setCopyLink(window.location.href) }
  }
  async function trial() {
    if (!year) return
    setBusy(true); setError('')
    try {
      await recordAction(token, 'trial_clicked')
      window.location.assign(`/?trial=booking&calendar_id=${encodeURIComponent(year.id)}`)
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Please try again.'); setBusy(false) }
  }
  if (!year) return <main className="ev-loading"><p className="ev-eyebrow">Beforest · Envision</p><h1>{error ? 'Let’s find your year.' : 'Opening your possible year…'}</h1>{error && <><p role="alert">{error}</p><Link href="/envision" className="ev-button">Return to Envision <ArrowRight size={16} /></Link></>}</main>

  const visits = [...year.visits].sort((a, b) => a.startDate.localeCompare(b.startDate))
  const total = visits.reduce((sum, visit) => sum + visit.nights, 0)
  const years = Array.from(new Set(visits.map(visit => visit.startDate.slice(0, 4))))
  const group = year.preferences.party === 'solo' ? 'Just you' : year.preferences.party === 'partner' ? 'The two of you' : year.preferences.party === 'family' ? `Family of ${year.preferences.people}` : year.preferences.party === 'friends' ? `${year.preferences.people} friends` : `${year.preferences.people} people`

  return <main className="ev-year">
    <header className="ev-year-nav">
      <div className="ev-year-nav-inner">
        <Link href="/" className="ev-year-brand" aria-label="Beforest 10percent home">Beforest <span>10percent</span></Link>
        <p className="ev-year-total" aria-live="polite" aria-atomic="true"><strong>{total}</strong> {total === 1 ? 'night' : 'nights'} <span>·</span> {visits.length} {visits.length === 1 ? 'break' : 'breaks'}</p>
        <Link href="/envision?edit=1" className="ev-icon-button" aria-label="Edit your year preferences"><Pencil size={22} strokeWidth={1.5} /></Link>
        <span className="ev-group">{group} <span className="ev-group-years">{years.join(' / ')}</span></span>
      </div>
    </header>
    <h1 className="ev-sr-only">Your year, outside</h1>
    <section ref={gallery} className="ev-visit-gallery" aria-label="Scroll through your possible year">{visits.map((visit, index) => {
      const place = PLACES.find(item => item.id === visit.placeId)!
      const returning = visits.slice(0, index).some(previous => previous.placeId === visit.placeId)
      return <article className="ev-visit" key={visit.id} id={`visit-${visit.id}`} aria-label={`${place.name}, ${visitDateRange(visit)}`}>
        <div className="ev-visit-image"><Image src={place.image} alt={`A Beforest landscape at ${place.name}, ${place.region}`} fill quality={90} priority={index === 0} sizes="(max-width: 1160px) 100vw, 1160px" />
          <div className="ev-visit-caption">
            <div className="ev-visit-title"><h2>{place.name}, {place.region}</h2><button className="ev-icon-button" onClick={() => { setEditing({ ...visit }); setError('') }} aria-label={`Edit ${place.name} visit`}><Pencil size={19} strokeWidth={1.5} /></button></div>
            <p className="ev-visit-dates">{visitDateRange(visit)} <span>·</span> {visit.nights} {visit.nights === 1 ? 'night' : 'nights'}</p>
            <p className="ev-visit-liner">{visitLiner(year.preferences, visit, index, returning)}</p>
          </div>
        </div>
      </article>
    })}</section>
    <div className="ev-year-details">
      <p className="ev-small">A possible year, not a reservation. Actual stays depend on availability and booking terms.</p>
      {total < year.preferences.desiredNights && <p className="ev-small">{total} of your {year.preferences.desiredNights} imagined nights are pictured. Edit a visit to adjust your year.</p>}
      <button className="ev-copy" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Link copied' : 'Copy private link'}</button>
      {copyLink && <label className="ev-field">Copy your private link<input readOnly value={copyLink} onFocus={event => event.target.select()} /></label>}
      <p className="ev-small">Keep this link private. Anyone with it can view and edit this calendar.</p>
    </div>
    {notice && <p role="status" className="ev-notice ev-year-message">{notice}</p>}
    {error && !hasModal && <p role="alert" className="ev-error ev-year-message">{error}</p>}
    {!hasModal && <div className="ev-year-dock">
      <div className="ev-month-navigation">
        <button className="ev-icon-button" aria-label="Previous visit" disabled={active === 0} onClick={() => jump(active - 1)}><ChevronLeft size={25} strokeWidth={1.5} /></button>
        <nav ref={monthNav} className="ev-month-links" aria-label="Jump to a visit">{visits.map((visit, index) => {
          const date = new Date(`${visit.startDate}T12:00:00Z`)
          return <button key={visit.id} aria-current={active === index ? 'true' : undefined} aria-label={`${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${PLACES.find(place => place.id === visit.placeId)?.name}`} onClick={() => jump(index)}>{MONTHS[date.getUTCMonth()].slice(0, 3)} {date.getUTCFullYear().toString().slice(-2)}</button>
        })}</nav>
        <button className="ev-icon-button" aria-label="Next visit" disabled={active >= visits.length - 1} onClick={() => jump(active + 1)}><ChevronRight size={25} strokeWidth={1.5} /></button>
      </div>
      <div className="ev-dock-actions"><button className="ev-button" disabled={busy} onClick={trial} aria-label="Request a trial at Blyton, Coorg">{busy ? 'Opening trial…' : 'Request a trial'}<ArrowRight size={21} strokeWidth={1.5} /></button><button className="ev-save-link" onClick={() => { setShowSave(true); setError('') }}>{year.saved ? 'Saved · Update details' : 'Save my year'}</button><p className="ev-dock-note">Illustrative calendar</p></div>
    </div>}

    {editing && <div className="ev-modal-backdrop"><section className="ev-modal" role="dialog" aria-modal="true" aria-labelledby="edit-title"><button aria-label="Close editor" className="ev-modal-close" onClick={() => setEditing(null)} disabled={busy}><X size={20} /></button><p className="ev-eyebrow">Make it yours</p><h2 id="edit-title">Shape this visit.</h2><form onSubmit={commitEdit}><label className="ev-field">Landscape<select value={editing.placeId} onChange={event => setEditing({ ...editing, placeId: event.target.value })}>{PLACES.map(place => <option key={place.id} value={place.id}>{place.name}, {place.region}</option>)}</select></label><label className="ev-field">Suggested arrival<input type="date" required value={editing.startDate} onChange={event => setEditing({ ...editing, startDate: event.target.value })} /></label><div className="ev-form-pair"><label className="ev-field">Nights<input type="number" min={1} max={21} required value={editing.nights} onChange={event => setEditing({ ...editing, nights: Number(event.target.value) })} /></label><label className="ev-field">People<input type="number" min={1} max={20} required value={editing.people} onChange={event => setEditing({ ...editing, people: Number(event.target.value) })} /></label></div><p className="ev-small">Change what you imagine. Actual availability is checked when you book a trial.</p>{error && <p role="alert" className="ev-error">{error}</p>}<button type="submit" className="ev-button" disabled={busy}>{busy ? 'Saving…' : 'Update this visit'}<Check size={16} /></button></form></section></div>}
    {showSave && <div className="ev-modal-backdrop"><section className="ev-modal" role="dialog" aria-modal="true" aria-labelledby="save-title"><button aria-label="Close save form" className="ev-modal-close" onClick={() => setShowSave(false)} disabled={busy}><X size={20} /></button><p className="ev-eyebrow">A year worth returning to</p><h2 id="save-title">Keep your year.</h2><p>Save your details with this calendar and choose how you'd like to hear from us.</p><form onSubmit={save}><label className="ev-field">Your name<input autoComplete="name" required maxLength={100} value={contact.name} onChange={event => setContact({ ...contact, name: event.target.value })} /></label><label className="ev-field">Email<input autoComplete="email" type="email" required maxLength={254} value={contact.email} onChange={event => setContact({ ...contact, email: event.target.value })} /></label><label className="ev-field">WhatsApp number <small>(with country code)</small><input autoComplete="tel" type="tel" required placeholder="+91" value={contact.phone} onChange={event => setContact({ ...contact, phone: event.target.value })} /></label><div className="ev-permissions">{([{ id: 'email', label: 'Relevant emails about my year and trial stays' }, { id: 'whatsapp', label: 'Relevant WhatsApp messages about my year and trial stays' }, { id: 'calling', label: 'A call to help me explore a trial stay' }] as const).map(item => <label key={item.id} className="ev-checkbox"><input type="checkbox" checked={contact.permissions[item.id]} onChange={event => setContact({ ...contact, permissions: { ...contact.permissions, [item.id]: event.target.checked } })} />{item.label}</label>)}</div><p className="ev-small">You can save your year without choosing follow-ups. Keep the private link to return to it.</p>{error && <p role="alert" className="ev-error">{error}</p>}<button type="submit" className="ev-button" disabled={busy}>{busy ? 'Saving…' : 'Save my year'}<ArrowRight size={17} /></button></form></section></div>}
  </main>
}

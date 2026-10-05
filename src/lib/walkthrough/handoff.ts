// Deliberately exclude names, contacts, passcodes and private calendar tokens.
export const READING_ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'entry_path', 'recovery_bucket'] as const
export function shortWalkthroughHref(search: string): string {
  const incoming = new URLSearchParams(search)
  const next = new URLSearchParams()
  for (const key of READING_ATTRIBUTION_KEYS.slice(0, 5)) {
    const value = incoming.get(key)?.trim()
    if (value) next.set(key, value.slice(0, 150))
  }
  next.set('entry_path', 'short_walkthrough')
  const bucket = incoming.get('watched') || incoming.get('recovery_bucket')
  // Campaign context only. This parameter never proves a watch milestone.
  if (bucket && ['25', '50', '75', '100'].includes(bucket)) next.set('recovery_bucket', bucket)
  return `/envision?${next.toString()}`
}

type ReadingEvent = 'reading_page_viewed' | 'reading_section_viewed' | 'reading_faq_opened' | 'envision_clicked'
interface IReadingWindow extends Window {
  dataLayer?: unknown[]
  gtag?: (command: 'event', eventName: string, parameters: Record<string, unknown>) => void
}
export function readingSignal(event: ReadingEvent, section?: string): void {
  const signal = { event, page_id: 'short_walkthrough', page_version: 1, section: section || '', occurred_at: new Date().toISOString() }
  const browser = window as IReadingWindow
  browser.dataLayer = browser.dataLayer || []
  browser.dataLayer.push(signal)
  if (browser.gtag) browser.gtag('event', event, { page_id: signal.page_id, page_version: signal.page_version, section: signal.section })
  window.dispatchEvent(new CustomEvent('beforest:reading', { detail: signal }))
  // A small local trace helps preview QA. It is not a database event ledger.
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem('beforest-reading-events-v1') || '[]')
    const prior = Array.isArray(parsed) ? parsed.slice(-49) : []
    sessionStorage.setItem('beforest-reading-events-v1', JSON.stringify([...prior, signal]))
  } catch { /* Storage restrictions must never prevent reading or navigation. */ }
}

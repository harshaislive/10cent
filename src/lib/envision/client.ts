import { type EventName, type IPreferences, type IVisit, type IContact, type IPublicJourney } from './model'

const SESSION_KEY = 'beforest-envision-v1'
interface IResponse { token?: string; journey?: IPublicJourney; error?: string }
let opening: Promise<{ token: string; journey: IPublicJourney }> | null = null

async function request(url: string, options?: RequestInit): Promise<IResponse> {
  const response = await fetch(url, { ...options, cache: 'no-store', headers: { 'Content-Type': 'application/json', ...options?.headers } })
  const result = await response.json() as IResponse
  if (!response.ok || !result.journey) throw new Error(result.error || 'Your year could not be saved. Please try again.')
  return result
}
export function openJourney(): Promise<{ token: string; journey: IPublicJourney }> {
  if (opening) return opening
  opening = (async () => {
    let token: string | null = null
    try { token = localStorage.getItem(SESSION_KEY) } catch {}
    if (token && /^[a-f0-9]{64}$/.test(token)) {
      const response = await fetch(`/api/envision/${token}`, { cache: 'no-store' })
      if (response.ok) {
        const result = await response.json() as IResponse
        if (result.journey) return { token, journey: result.journey }
      } else if (![404, 410].includes(response.status)) throw new Error('Your saved year could not be loaded. Please try again.')
    }
    const params = new URLSearchParams(window.location.search)
    const attribution = Object.fromEntries(['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].map(key => [key, params.get(key) || '']))
    const result = await request('/api/envision', { method: 'POST', body: JSON.stringify({ attribution }) })
    if (!result.token || !result.journey) throw new Error('Please try starting your year again.')
    try { localStorage.setItem(SESSION_KEY, result.token) } catch {}
    return { token: result.token, journey: result.journey }
  })().finally(() => { opening = null })
  return opening
}
export function resetJourney(): void { try { localStorage.removeItem(SESSION_KEY) } catch {} }
export async function loadYear(token: string): Promise<IPublicJourney> {
  const result = await request(`/api/envision/${token}`)
  return result.journey!
}
export async function recordAction(token: string, name: EventName, fields?: { preferences?: IPreferences; visits?: IVisit[]; contact?: IContact; step?: number; id?: string; expectedRevision?: number }): Promise<IPublicJourney> {
  const result = await request(`/api/envision/${token}`, { method: 'PATCH', body: JSON.stringify({
    preferences: fields?.preferences, visits: fields?.visits, contact: fields?.contact, expectedRevision: fields?.expectedRevision,
    event: { name, id: fields?.id || crypto.randomUUID(), step: fields?.step },
  }) })
  return result.journey!
}

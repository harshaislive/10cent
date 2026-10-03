export const LEAD_MAGNET = { id: 'envision-your-year', version: 1 } as const

export interface IPlace {
  id: string
  name: string
  region: string
  description: string
  image: string
}

const IMAGE_ROOT = 'https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images'
export const PLACES: IPlace[] = [
  { id: 'poomaale', name: 'Poomaale 1.0', region: 'Coorg', description: 'Ancient forest canopy. Coffee, cardamom and mist.', image: '/blyton-optimized/blyton-desktop.webp' },
  { id: 'poomaale2', name: 'Poomaale 2.0', region: 'Coorg', description: 'Coffee plantations and misty trails in adjacent wilderness.', image: `${IMAGE_ROOT}/colective_images/pomaale_2.jpg` },
  { id: 'hammiyala', name: 'Hammiyala', region: 'Coorg', description: 'Coffee agroforestry and high altitude grasslands.', image: `${IMAGE_ROOT}/desktop/4.jpg` },
  { id: 'hyderabad', name: 'Hyderabad', region: 'Deccan plateau', description: 'Ancient rocks and scrub forests.', image: `${IMAGE_ROOT}/colective_images/1762346094681-1ljldd.webp` },
  { id: 'bhopal', name: 'Bhopal', region: 'Central Highlands', description: "A landscape in India's Central Highlands.", image: `${IMAGE_ROOT}/colective_images/bhopal.png` },
  { id: 'mumbai', name: 'Mumbai', region: 'Western India', description: 'A quieter landscape close to Maximum City.', image: `${IMAGE_ROOT}/colective_images/mumbai.jpg` },
]

export const MOTIVES = [
  { id: 'family-time', label: 'More time together', detail: 'Room for the people who matter.' },
  { id: 'quiet', label: 'Time to myself', detail: 'A little less noise. A little more space.' },
  { id: 'couple-time', label: 'Time as a couple', detail: 'A different rhythm, together.' },
  { id: 'explore', label: 'Walking and exploring', detail: 'Follow your curiosity into a landscape.' },
  { id: 'return', label: 'A place to return to', detail: 'Get to know a place over time.' },
] as const

export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
export type Party = 'solo' | 'partner' | 'family' | 'friends' | 'varies'
export type Timing = 'weekends' | 'school-holidays' | 'planned-leave' | 'flexible' | 'unsure'
export type Rhythm = 'short' | 'long' | 'mix'

export interface IPreferences {
  motives: string[]
  party: Party
  people: number
  city: string
  travel: 'drive' | 'long-drive' | 'flight' | 'help'
  timing: Timing
  months: number[]
  rhythm: Rhythm
  stayLength: number
  desiredNights: number
  returnToSame: boolean
  places: string[]
}

export const DEFAULT_PREFERENCES: IPreferences = {
  motives: [], party: 'solo', people: 1, city: '', travel: 'help', timing: 'flexible',
  months: [], rhythm: 'mix', stayLength: 5, desiredNights: 30, returnToSame: false, places: [],
}

export interface IVisit {
  id: string
  placeId: string
  startDate: string
  nights: number
  people: number
}

export type JourneyState = 'started' | 'preferences_added' | 'year_generated' | 'year_viewed' | 'year_saved' | 'trial_interest'
export type EventName = 'journey_started' | 'preferences_saved' | 'year_generated' | 'year_viewed' | 'year_edited' | 'year_saved' | 'year_reopened' | 'trial_clicked'
export interface IJourneyEvent {
  id: string
  name: EventName
  at: string
  revision: number
  step?: number
}
export interface IContact {
  name: string
  email: string
  phone: string
  permissions: { email: boolean; whatsapp: boolean; calling: boolean }
}
export interface IJourney {
  id: string
  leadMagnet: typeof LEAD_MAGNET
  revision: number
  createdAt: string
  updatedAt: string
  expiresAt: string
  state: JourneyState
  preferences: IPreferences
  visits: IVisit[]
  contact: IContact | null
  contactHistory: { at: string; revision: number; contact: IContact }[]
  attribution: Record<string, string>
  events: IJourneyEvent[]
  versions: { revision: number; at: string; preferences: IPreferences; visits: IVisit[] }[]
}
export interface IPublicJourney {
  id: string
  revision: number
  state: JourneyState
  preferences: IPreferences
  visits: IVisit[]
  firstName: string
  saved: boolean
  resumeStep: number
}

export function publicJourney(journey: IJourney): IPublicJourney {
  const lastStep = [...journey.events].reverse().find(event => event.name === 'preferences_saved' && event.step !== undefined)?.step
  return { id: journey.id, revision: journey.revision, state: journey.state, preferences: journey.preferences,
    visits: journey.visits, firstName: journey.contact?.name.split(' ')[0] || '', saved: Boolean(journey.contact),
    resumeStep: journey.visits.length || lastStep === undefined ? 0 : Math.min(5, lastStep + 1) }
}

export function dateLabel(date: string): string {
  return new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}

export function visitReason(preferences: IPreferences): string {
  const reason = preferences.motives[0]
  if (reason === 'family-time') return 'Room for the time together you chose.'
  if (reason === 'quiet') return 'A little space for the time to yourself you chose.'
  if (reason === 'couple-time') return 'Time together, at a different pace.'
  if (reason === 'explore') return 'A landscape to get to know through walking and exploring.'
  if (reason === 'return') return 'Another visit. A more familiar place.'
  return 'A little room in your year for the wilderness.'
}

export function visitDateRange(visit: IVisit): string {
  const start = new Date(`${visit.startDate}T12:00:00Z`)
  const end = new Date(start)
  end.setUTCDate(end.getUTCDate() + visit.nights)
  const month = (date: Date) => MONTHS[date.getUTCMonth()].slice(0, 3)
  const sameMonth = start.getUTCFullYear() === end.getUTCFullYear() && start.getUTCMonth() === end.getUTCMonth()
  if (sameMonth) return `${start.getUTCDate()}–${end.getUTCDate()} ${month(start)} ${start.getUTCFullYear()}`
  if (start.getUTCFullYear() === end.getUTCFullYear()) return `${start.getUTCDate()} ${month(start)} – ${end.getUTCDate()} ${month(end)} ${end.getUTCFullYear()}`
  return `${start.getUTCDate()} ${month(start)} ${start.getUTCFullYear()} – ${end.getUTCDate()} ${month(end)} ${end.getUTCFullYear()}`
}

// Liners describe the visitor's stated preferences, never inferred booking facts.
export function visitLiner(preferences: IPreferences, visit: IVisit, index: number, returning: boolean): string {
  if (returning) return 'Another visit. A more familiar place.'
  const motive = preferences.motives[0]
  if (motive === 'quiet') return index % 2 ? 'A little less noise. A little more space.' : 'A pause, at your own pace.'
  if (motive === 'explore') return index % 2 ? 'Another landscape to get to know.' : 'A few days to follow your curiosity.'
  if (motive === 'return') return 'A place you could come back to.'
  if (visit.people === 1) return visit.nights > 5 ? 'A little longer, just for you.' : 'A few days, just for you.'
  if (motive === 'couple-time' && visit.people === 2) return 'Time for the two of you, outside.'
  if (preferences.party === 'family' || motive === 'family-time') return index % 2 ? 'Room for time together.' : 'A few days, together.'
  if (preferences.party === 'friends') return 'A shared pause with your favourite people.'
  return 'A little room for a different rhythm.'
}

export function generateYear(preferences: IPreferences, now = new Date()): IVisit[] {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  const candidates: Date[] = []
  for (let offset = 0; offset <= 12; offset++) {
    const date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + offset, 15))
    if (date <= today) continue
    if (preferences.months.length && !preferences.months.includes(date.getUTCMonth())) continue
    if (preferences.timing === 'weekends') date.setUTCDate(date.getUTCDate() + (5 - date.getUTCDay() + 7) % 7)
    candidates.push(date)
  }
  const places = preferences.places.length ? preferences.places : PLACES.map(place => place.id)
  const count = Math.min(candidates.length, Math.ceil(preferences.desiredNights / preferences.stayLength))
  const visits: IVisit[] = []
  let remaining = preferences.desiredNights
  for (let index = 0; index < count; index++) {
    const date = candidates[Math.floor(index * candidates.length / count)]
    const nights = Math.min(preferences.stayLength, remaining)
    visits.push({ id: `visit-${index + 1}`, placeId: places[preferences.returnToSame ? 0 : index % places.length],
      startDate: date.toISOString().slice(0, 10), nights, people: preferences.people })
    remaining -= nights
  }
  return visits
}

export function validateVisits(visits: IVisit[]): string | null {
  if (!visits.length || visits.length > 12) return 'Choose between one and twelve visits.'
  const ids = new Set<string>()
  for (const visit of visits) {
    if (ids.has(visit.id)) return 'Each visit needs its own ID.'
    ids.add(visit.id)
    if (!PLACES.some(place => place.id === visit.placeId)) return 'Choose a Beforest landscape from the list.'
    if (!/^\d{4}-\d{2}-\d{2}$/.test(visit.startDate) || !Number.isFinite(Date.parse(`${visit.startDate}T00:00:00Z`)) || new Date(`${visit.startDate}T00:00:00Z`).toISOString().slice(0, 10) !== visit.startDate) return 'Choose a valid date.'
    if (!Number.isInteger(visit.nights) || visit.nights < 1 || visit.nights > 21) return 'Choose a stay of 1 to 21 nights.'
    if (!Number.isInteger(visit.people) || visit.people < 1 || visit.people > 20) return 'Choose a group of 1 to 20 people.'
  }
  const sorted = [...visits].sort((a, b) => a.startDate.localeCompare(b.startDate))
  for (let index = 1; index < sorted.length; index++) {
    const priorEnd = Date.parse(`${sorted[index - 1].startDate}T00:00:00Z`) + sorted[index - 1].nights * 86400000
    if (Date.parse(`${sorted[index].startDate}T00:00:00Z`) < priorEnd) return 'These visits overlap. Move a date or shorten a visit.'
  }
  return null
}

// Awareness stage advances from evidence. Edits or late page views cannot undo trial interest.
export function nextState(state: JourneyState, name: EventName): JourneyState {
  const rank: JourneyState[] = ['started', 'preferences_added', 'year_generated', 'year_viewed', 'year_saved', 'trial_interest']
  const target: Partial<Record<EventName, JourneyState>> = {
    journey_started: 'started', preferences_saved: 'preferences_added', year_generated: 'year_generated',
    year_viewed: 'year_viewed', year_saved: 'year_saved', year_reopened: 'year_viewed', trial_clicked: 'trial_interest',
  }
  const proposed = target[name] || state
  return rank.indexOf(proposed) > rank.indexOf(state) ? proposed : state
}

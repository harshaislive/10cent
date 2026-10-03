import { DEFAULT_PREFERENCES, MOTIVES, PLACES, validateVisits, type IContact, type IPreferences, type IVisit, type EventName } from './model'

export class EnvisionError extends Error {
  constructor(message: string, public status = 400) { super(message) }
}
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new EnvisionError('Please check the information supplied.')
  return value as Record<string, unknown>
}
function text(value: unknown, max: number): string {
  if (typeof value !== 'string' || value.length > max) throw new EnvisionError('Please check the text supplied.')
  return value.trim()
}
function number(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) throw new EnvisionError('Please check the number supplied.')
  return value
}
function choice<T extends string>(value: unknown, choices: readonly T[]): T {
  if (typeof value !== 'string' || !choices.includes(value as T)) throw new EnvisionError('Choose an option from the list.')
  return value as T
}
function choices(value: unknown, allowed: readonly string[], max: number): string[] {
  if (!Array.isArray(value) || value.length > max) throw new EnvisionError('Choose from the options shown.')
  const values = value.map(item => choice(item, allowed))
  if (new Set(values).size !== values.length) throw new EnvisionError('An option was selected twice.')
  return values
}
export function parsePreferences(value: unknown): IPreferences {
  const input = object(value)
  if (!Array.isArray(input.months) || input.months.length > 12) throw new EnvisionError('Choose valid months.')
  const months = input.months.map(month => number(month, 0, 11))
  if (new Set(months).size !== months.length) throw new EnvisionError('A month was selected twice.')
  if (typeof input.returnToSame !== 'boolean') throw new EnvisionError('Choose your visit rhythm.')
  return {
    ...DEFAULT_PREFERENCES, motives: choices(input.motives, MOTIVES.map(motive => motive.id), 2),
    party: choice(input.party, ['solo', 'partner', 'family', 'friends', 'varies']), people: number(input.people, 1, 20),
    city: text(input.city, 100), travel: choice(input.travel, ['drive', 'long-drive', 'flight', 'help']),
    timing: choice(input.timing, ['weekends', 'school-holidays', 'planned-leave', 'flexible', 'unsure']), months,
    rhythm: choice(input.rhythm, ['short', 'long', 'mix']), stayLength: number(input.stayLength, 1, 21),
    desiredNights: number(input.desiredNights, 1, 90), returnToSame: input.returnToSame,
    places: choices(input.places, PLACES.map(place => place.id), 6),
  }
}
export function parseVisits(value: unknown): IVisit[] {
  if (!Array.isArray(value) || value.length > 12) throw new EnvisionError('Please check your visits.')
  const visits = value.map(item => {
    const input = object(item)
    return { id: text(input.id, 60), placeId: text(input.placeId, 30), startDate: text(input.startDate, 10),
      nights: number(input.nights, 1, 21), people: number(input.people, 1, 20) }
  })
  const error = validateVisits(visits)
  if (error) throw new EnvisionError(error)
  return visits
}
export function parseContact(value: unknown): IContact {
  const input = object(value)
  const permissions = object(input.permissions)
  const name = text(input.name, 100)
  const email = text(input.email, 254).toLowerCase()
  const phone = text(input.phone, 30).replace(/[\s()-]/g, '')
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new EnvisionError('Add your name and a valid email address.')
  if (!/^\+[0-9]{8,15}$/.test(phone)) throw new EnvisionError('Add your WhatsApp number with country code, such as +91.')
  for (const key of ['email', 'whatsapp', 'calling']) if (typeof permissions[key] !== 'boolean') throw new EnvisionError('Please check your contact preferences.')
  if ((permissions.whatsapp || permissions.calling) && !phone) throw new EnvisionError('Add a number for WhatsApp or calling permission.')
  return { name, email, phone, permissions: { email: permissions.email === true, whatsapp: permissions.whatsapp === true, calling: permissions.calling === true } }
}
export function parseEvent(value: unknown): { name: EventName; id: string; step?: number } {
  const input = object(value)
  const name = choice(input.name, ['preferences_saved', 'year_generated', 'year_viewed', 'year_edited', 'year_saved', 'year_reopened', 'trial_clicked'] as const)
  const id = text(input.id, 80)
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(id)) throw new EnvisionError('Please retry this action.')
  return { name, id, step: input.step === undefined ? undefined : number(input.step, 0, 5) }
}
export function parseAttribution(value: unknown): Record<string, string> {
  const input = value ? object(value) : {}
  const result: Record<string, string> = {}
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) if (typeof input[key] === 'string') result[key] = text(input[key], 150)
  return result
}
export function parsePayload(value: unknown): Record<string, unknown> { return object(value) }

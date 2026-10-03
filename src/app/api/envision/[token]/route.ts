import { NextResponse } from 'next/server'
import { changeJourney, readJourney } from '@/lib/envision/store'
import { generateYear, publicJourney } from '@/lib/envision/model'
import { EnvisionError, parseContact, parseEvent, parsePayload, parsePreferences, parseVisits } from '@/lib/envision/validation'
import { checkWrite, errorResponse } from '@/lib/envision/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const headers = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }
interface IContext { params: { token: string } }

export async function GET(_req: Request, { params }: IContext): Promise<NextResponse> {
  try { return NextResponse.json({ journey: publicJourney(await readJourney(params.token)) }, { headers }) }
  catch (error) { return errorResponse(error) }
}
export async function PATCH(req: Request, { params }: IContext): Promise<NextResponse> {
  try {
    checkWrite(req)
    const body = parsePayload(await req.json())
    const event = parseEvent(body.event)
    const preferences = body.preferences === undefined ? undefined : parsePreferences(body.preferences)
    const visits = body.visits === undefined ? undefined : parseVisits(body.visits)
    const contact = body.contact === undefined ? undefined : parseContact(body.contact)
    if (event.name === 'year_edited' && (!Number.isInteger(body.expectedRevision) || typeof body.expectedRevision !== 'number')) throw new EnvisionError('Reload your year before editing it.')
    if (event.name === 'year_saved' && !contact) throw new EnvisionError('Add your details to save this year.')
    if (contact && event.name !== 'year_saved') throw new EnvisionError('Contact details can only be added when saving your year.')
    if (preferences && !['preferences_saved', 'year_generated', 'year_edited'].includes(event.name)) throw new EnvisionError('Please save preferences using the correct action.')
    if (visits && event.name !== 'year_edited') throw new EnvisionError('Please save visits using the edit action.')
    const journey = await changeJourney(params.token, event.id, current => {
      if (event.name === 'year_edited' && current.revision !== body.expectedRevision) throw new EnvisionError('Your year changed in another window. Reload it before editing.', 409)
      if (event.name === 'year_generated' && current.contact && preferences) throw new EnvisionError('Edit the saved year rather than replacing it.')
      if (event.name === 'preferences_saved' && current.visits.length) throw new EnvisionError('Please edit preferences with your saved year.')
      if (preferences) current.preferences = preferences
      if (event.name === 'year_generated') current.visits = generateYear(current.preferences)
      if (visits) current.visits = visits
      if (event.name === 'year_edited' && !visits && preferences) current.visits = generateYear(preferences)
      if (['year_viewed', 'year_saved', 'year_reopened', 'trial_clicked', 'year_edited'].includes(event.name) && !current.visits.length) throw new EnvisionError('Create your year first.')
      const now = new Date().toISOString()
      if (contact) {
        current.contact = contact
        current.contactHistory = [...(current.contactHistory || []), { at: now, revision: current.revision + 1, contact: structuredClone(contact) }]
      }
      if (['year_generated', 'year_edited'].includes(event.name)) {
        current.versions.push({ revision: current.revision + 1, at: now, preferences: structuredClone(current.preferences), visits: structuredClone(current.visits) })
        if (current.versions.length > 200) throw new EnvisionError('This year has reached its edit limit.', 429)
      }
      current.events.push({ ...event, at: now, revision: current.revision + 1 })
      return current
    })
    return NextResponse.json({ journey: publicJourney(journey) }, { headers })
  } catch (error) { return errorResponse(error) }
}

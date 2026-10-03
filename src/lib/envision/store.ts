import 'server-only'
import { createHash, randomBytes, randomUUID } from 'crypto'
import { mkdir, readFile, writeFile, rename } from 'fs/promises'
import path from 'path'
import { createSupabaseServiceClient } from '@/lib/supabase/server'
import { DEFAULT_PREFERENCES, LEAD_MAGNET, nextState, type IJourney } from './model'
import { EnvisionError } from './validation'

const directory = path.join(process.cwd(), '.local', 'envision')
const localQueue = new Map<string, Promise<unknown>>()

function mode(): 'local' | 'supabase' {
  if (process.env.ENVISION_STORAGE_MODE === 'supabase') return 'supabase'
  if (process.env.NODE_ENV === 'development' || process.env.ENVISION_STORAGE_MODE === 'local' && process.env.NODE_ENV !== 'production') return 'local'
  throw new EnvisionError('Saved years are not enabled in this environment yet.', 503)
}
function digest(token: string): string {
  if (!/^[a-f0-9]{64}$/.test(token)) throw new EnvisionError('This year link is not valid.', 404)
  return createHash('sha256').update(token).digest('hex')
}
function db() {
  const client = createSupabaseServiceClient()
  if (!client) throw new EnvisionError('Saved years are not configured yet.', 503)
  return client.schema('tencent').from('envision_journeys')
}
async function load(hash: string): Promise<IJourney> {
  if (mode() === 'local') {
    try { return JSON.parse(await readFile(path.join(directory, `${hash}.json`), 'utf8')) as IJourney }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new EnvisionError('This year link was not found.', 404)
      throw error
    }
  }
  const { data, error } = await db().select('document').eq('token_hash', hash).maybeSingle()
  if (error) throw new EnvisionError('Saved-year storage is unavailable. Please try again.', 503)
  if (!data) throw new EnvisionError('This year link was not found.', 404)
  return data.document as IJourney
}
async function write(hash: string, journey: IJourney, expected?: number): Promise<boolean> {
  if (mode() === 'local') {
    await mkdir(directory, { recursive: true })
    const destination = path.join(directory, `${hash}.json`)
    const temporary = `${destination}.${randomUUID()}.tmp`
    await writeFile(temporary, JSON.stringify(journey), { mode: 0o600 })
    await rename(temporary, destination)
    return true
  }
  if (expected === undefined) {
    const { error } = await db().insert({ token_hash: hash, revision: journey.revision, document: journey })
    if (error) throw new EnvisionError('Your year could not be saved. Please try again.', 503)
    return true
  }
  const { data, error } = await db().update({ revision: journey.revision, document: journey, updated_at: journey.updatedAt })
    .eq('token_hash', hash).eq('revision', expected).select('revision')
  if (error) throw new EnvisionError('Your changes could not be saved. Please try again.', 503)
  return Boolean(data?.length)
}
function checkExpiry(journey: IJourney): void {
  if (Date.parse(journey.expiresAt) <= Date.now()) throw new EnvisionError('This year link has expired. Please create a new year.', 410)
}
export async function createJourney(attribution: Record<string, string>): Promise<{ token: string; journey: IJourney }> {
  const token = randomBytes(32).toString('hex')
  const now = new Date().toISOString()
  const journey: IJourney = {
    id: randomUUID(), leadMagnet: { ...LEAD_MAGNET }, revision: 1, createdAt: now, updatedAt: now,
    expiresAt: new Date(Date.now() + 180 * 86400000).toISOString(), state: 'started',
    preferences: { ...DEFAULT_PREFERENCES }, visits: [], contact: null, contactHistory: [], attribution,
    events: [{ id: randomUUID(), name: 'journey_started', at: now, revision: 1 }], versions: [],
  }
  await write(digest(token), journey)
  return { token, journey }
}
export async function readJourney(token: string): Promise<IJourney> {
  const journey = await load(digest(token)); checkExpiry(journey); return journey
}
export async function changeJourney(token: string, eventId: string, transform: (journey: IJourney) => IJourney): Promise<IJourney> {
  const hash = digest(token)
  const run = async () => {
    for (let attempt = 0; attempt < 4; attempt++) {
      const prior = await load(hash)
      checkExpiry(prior)
      if (prior.events.some(event => event.id === eventId)) return prior
      if (prior.events.length >= 2000) throw new EnvisionError('This year has reached its edit limit. Please start a new year.', 429)
      const changed = transform(structuredClone(prior))
      changed.updatedAt = new Date().toISOString()
      changed.revision = prior.revision + 1
      changed.state = nextState(prior.state, changed.events[changed.events.length - 1].name)
      if (await write(hash, changed, prior.revision)) return changed
    }
    throw new EnvisionError('Your year changed in another window. Reload and try again.', 409)
  }
  if (mode() !== 'local') return run()
  const preceding = localQueue.get(hash) || Promise.resolve()
  const current = preceding.catch(() => undefined).then(run)
  localQueue.set(hash, current)
  try { return await current } finally { if (localQueue.get(hash) === current) localQueue.delete(hash) }
}

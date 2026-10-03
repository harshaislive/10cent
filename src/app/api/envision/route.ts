import { NextResponse } from 'next/server'
import { createJourney } from '@/lib/envision/store'
import { publicJourney } from '@/lib/envision/model'
import { EnvisionError, parseAttribution, parsePayload } from '@/lib/envision/validation'
import { checkWrite, errorResponse, PRIVATE_HEADERS as headers } from '@/lib/envision/http'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const limits = new Map<string, { count: number; reset: number }>()
export async function POST(req: Request): Promise<NextResponse> {
  try {
    checkWrite(req)
    // Preview limit; production must also apply a durable edge rate limit.
    const key = req.headers.get('x-forwarded-for')?.split(',')[0] || 'local'
    const now = Date.now()
    for (const [id, limit] of Array.from(limits.entries())) if (limit.reset <= now) limits.delete(id)
    const limit = limits.get(key) || { count: 0, reset: now + 60000 }
    if (++limit.count > 20) throw new EnvisionError('Please wait a moment before starting another year.', 429)
    limits.set(key, limit)
    const body = parsePayload(await req.json())
    const { token, journey } = await createJourney(parseAttribution(body.attribution))
    return NextResponse.json({ token, journey: publicJourney(journey) }, { status: 201, headers })
  } catch (error) { return errorResponse(error) }
}

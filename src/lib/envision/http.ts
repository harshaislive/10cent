import { NextResponse } from 'next/server'
import { EnvisionError } from './validation'

export const PRIVATE_HEADERS = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' }
export function checkWrite(req: Request): void {
  const origin = req.headers.get('origin')
  // Next's internal request URL may use the bind address; the browser uses Host.
  if (!origin || new URL(origin).host !== req.headers.get('host')) throw new EnvisionError('Please use the form on this website.', 403)
  if (Number(req.headers.get('content-length') || 0) > 30000) throw new EnvisionError('That request is too large.', 413)
}
export function errorResponse(error: unknown): NextResponse {
  const known = error instanceof EnvisionError
  return NextResponse.json({ error: known ? error.message : 'Your year could not be loaded. Please try again.' }, { status: known ? error.status : 500, headers: PRIVATE_HEADERS })
}

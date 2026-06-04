import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

const ALLOWED_EVENT_NAMES = new Set([
  "trial_modal_opened",
  "trial_date_started",
  "trial_dates_selected",
  "trial_room_count_changed",
  "trial_room_selected",
  "trial_guest_details_started",
  "trial_checkout_started",
  "trial_payment_redirected",
  "trial_confirmation_viewed",
])

interface ITrialFunnelEventPayload {
  requestId?: string | null
  sessionId?: string
  eventName?: string
  eventSource?: string
  eventStage?: string | null
  name?: string | null
  email?: string | null
  phone?: string | null
  locationSlug?: string | null
  locationName?: string | null
  checkInDate?: string | null
  checkOutDate?: string | null
  durationNights?: number | null
  roomCount?: number | null
  adults?: number | null
  children?: number | null
  guestCount?: number | null
  amount?: number | null
  currency?: string | null
  pageUrl?: string | null
  referrer?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
  utmTerm?: string | null
  payload?: Record<string, unknown> | null
}

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServiceClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 503 })
    }

    const body = await req.json() as ITrialFunnelEventPayload
    const eventName = normalizeText(body.eventName)
    const sessionId = normalizeText(body.sessionId)

    if (!eventName || !sessionId) {
      return NextResponse.json({ error: "eventName and sessionId are required" }, { status: 400 })
    }

    if (!ALLOWED_EVENT_NAMES.has(eventName)) {
      return NextResponse.json({ error: "Unsupported eventName" }, { status: 400 })
    }

    const { error } = await supabase
      .schema("tencent")
      .from("trial_funnel_events")
      .insert({
        request_id: normalizeText(body.requestId),
        session_id: sessionId,
        event_name: eventName,
        event_source: normalizeText(body.eventSource) || "10cent",
        event_stage: normalizeText(body.eventStage),
        name: normalizeText(body.name),
        email: normalizeText(body.email),
        phone: normalizeText(body.phone),
        location_slug: normalizeText(body.locationSlug),
        location_name: normalizeText(body.locationName),
        check_in_date: normalizeDate(body.checkInDate),
        check_out_date: normalizeDate(body.checkOutDate),
        duration_nights: normalizeNumber(body.durationNights),
        room_count: normalizeNumber(body.roomCount),
        adults: normalizeNumber(body.adults),
        children: normalizeNumber(body.children),
        guest_count: normalizeNumber(body.guestCount),
        amount: normalizeNumber(body.amount),
        currency: normalizeText(body.currency) || "INR",
        page_url: normalizeText(body.pageUrl),
        referrer: normalizeText(body.referrer),
        utm_source: normalizeText(body.utmSource),
        utm_medium: normalizeText(body.utmMedium),
        utm_campaign: normalizeText(body.utmCampaign),
        utm_content: normalizeText(body.utmContent),
        utm_term: normalizeText(body.utmTerm),
        payload: body.payload || null,
      })

    if (error) {
      console.error("Trial funnel event insert error:", error)
      return NextResponse.json({ error: "Failed to save event" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Trial funnel event error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save event" },
      { status: 500 }
    )
  }
}

function normalizeText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function normalizeDate(value: unknown): string | null {
  const text = normalizeText(value)
  return text && /^\d{4}-\d{2}-\d{2}$/.test(text) ? text : null
}

function normalizeNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

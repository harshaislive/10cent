import { trackEvent } from "@/utils/analytics"

const SESSION_STORAGE_KEY = "tencent_trial_session_id"

const META_EVENT_MAP: Partial<Record<string, string>> = {
  trial_modal_opened: "ViewContent",
  trial_room_selected: "AddToCart",
  trial_checkout_started: "InitiateCheckout",
  trial_payment_redirected: "AddPaymentInfo",
  trial_confirmation_viewed: "Purchase",
}

export interface ITrialFunnelEvent {
  requestId?: string | null
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
  payload?: Record<string, unknown> | null
}

export function getTrialSessionId(): string {
  if (typeof window === "undefined") return ""

  const existing = window.localStorage.getItem(SESSION_STORAGE_KEY)
  if (existing) return existing

  const sessionId = `ts_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(SESSION_STORAGE_KEY, sessionId)
  return sessionId
}

export function getTrialAttributionPayload() {
  if (typeof window === "undefined") {
    return {
      sessionId: "",
      pageUrl: "",
      referrer: "",
      utmSource: null,
      utmMedium: null,
      utmCampaign: null,
      utmContent: null,
      utmTerm: null,
    }
  }

  const params = new URLSearchParams(window.location.search)

  return {
    sessionId: getTrialSessionId(),
    pageUrl: window.location.href,
    referrer: document.referrer || null,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term"),
  }
}

export function trackTrialFunnelEvent(eventName: string, event: ITrialFunnelEvent = {}) {
  if (typeof window === "undefined") return

  const attribution = getTrialAttributionPayload()
  const analyticsPayload = {
    request_id: event.requestId || undefined,
    location_slug: event.locationSlug || undefined,
    location_name: event.locationName || undefined,
    check_in_date: event.checkInDate || undefined,
    check_out_date: event.checkOutDate || undefined,
    duration_nights: event.durationNights ?? undefined,
    room_count: event.roomCount ?? undefined,
    adults: event.adults ?? undefined,
    children: event.children ?? undefined,
    guest_count: event.guestCount ?? undefined,
    value: event.amount ?? undefined,
    currency: event.currency || "INR",
    session_id: attribution.sessionId,
    event_stage: event.eventStage || undefined,
  }

  trackEvent(eventName, META_EVENT_MAP[eventName], analyticsPayload)

  const body = JSON.stringify({
    ...event,
    ...attribution,
    eventName,
    eventSource: "10cent",
  })

  fetch("/api/trial-funnel-event", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    // Funnel tracking must never block booking.
  })
}

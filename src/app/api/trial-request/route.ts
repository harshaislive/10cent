import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js"
import { createExperiencesTrialCheckout } from "@/lib/experiences/trialCheckout"
import { getPublicBaseUrl } from "@/lib/site/url"
import { createSupabaseServiceClient } from "@/lib/supabase/server"
import { addDays, getBookingEngineAvailability, type IEzeeAvailabilityResult, type IEzeeAvailableRoom } from "@/lib/ezee/availability"

interface ITrialRequestPayload {
  name?: string
  email?: string
  phone?: string
  location?: string
  locationSlug?: string
  preferredDate?: string
  checkInDate?: string
  checkOutDate?: string
  durationNights?: number
  adults?: number
  children?: number
  roomCount?: number
  guestCount?: number
  estimatedCost?: number
  roomTypeId?: string
  ratePlanId?: string
  rateTypeId?: string
  roomSelections?: ITrialRoomSelectionPayload[]
  specialRequests?: string | null
  sessionId?: string | null
  pageUrl?: string | null
  referrer?: string | null
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmContent?: string | null
  utmTerm?: string | null
  attributionPayload?: Record<string, unknown> | null
}

interface ITrialRoomSelectionPayload {
  roomIndex?: number
  adults?: number
  children?: number
  roomTypeId?: string
  ratePlanId?: string
  rateTypeId?: string
}

interface ISelectedTrialRoom {
  roomIndex: number
  adults: number
  children: number
  room: IEzeeAvailableRoom
}

const ROOM_RATE_ADULTS = 2
const ROOM_RATE_CHILDREN = 0

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServiceClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const body = await req.json() as ITrialRequestPayload
    const {
      name,
      email,
      phone,
      location,
      locationSlug,
      preferredDate,
      checkInDate,
      checkOutDate,
      durationNights = 2,
      adults = 1,
      children = 0,
      roomCount = 1,
      guestCount,
      estimatedCost,
      roomTypeId,
      ratePlanId,
      rateTypeId,
      specialRequests,
      sessionId,
      pageUrl,
      referrer,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      attributionPayload,
    } = body
    const selectedDate = checkInDate || preferredDate
    const requestedRooms = Number.isFinite(roomCount) && roomCount > 0 ? Math.min(Math.round(roomCount), 4) : 1

    // Validate required fields
    if (!name || !email || !phone || !location || !selectedDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const finalCheckOutDate = checkOutDate || addDays(selectedDate, durationNights)
    const requestedRoomSelections = normalizeRoomSelectionPayload(body, requestedRooms, adults, children, roomTypeId, ratePlanId, rateTypeId)
    let availabilityData: IEzeeAvailabilityResult | null = null
    let selectedRooms: ISelectedTrialRoom[] = []

    try {
      const arrangement = await resolveSelectedRooms({
        checkIn: selectedDate,
        checkOut: finalCheckOutDate,
        selections: requestedRoomSelections,
      })
      availabilityData = arrangement.availabilityData
      selectedRooms = arrangement.selectedRooms
    } catch (availabilityError) {
      console.error("eZee availability error:", availabilityError)
    }

    const selectedRoom = selectedRooms[0]?.room || null
    const totalAdults = selectedRooms.reduce((total, selection) => total + selection.adults, 0) || adults
    const totalChildren = selectedRooms.reduce((total, selection) => total + selection.children, 0) || children
    const totalGuests = guestCount || totalAdults + totalChildren
    const selectedRoomPayload = buildSelectedRoomPayload(selectedRooms)
    const canCreateCheckout = selectedRooms.length === requestedRoomSelections.length && selectedRooms.length > 0
    const adultCapacity = getTotalCapacity(selectedRooms, "maxAdults")
    const childCapacity = getTotalCapacity(selectedRooms, "maxChildren")

    if ((adultCapacity > 0 && totalAdults > adultCapacity) || (childCapacity > 0 && totalChildren > childCapacity)) {
      return NextResponse.json(
        { error: "The selected rooms cannot accommodate this many guests. Please add another room or adjust the guest count." },
        { status: 400 }
      )
    }

    // Generate unique request ID
    const requestId = `TR${Date.now()}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()
    const liveCheckoutAmount = selectedRooms.length
      ? selectedRooms.reduce((total, selection) => total + getRoomAmount(selection.room), 0)
      : estimatedCost || availabilityData?.lowestTotalInclusiveTax || availabilityData?.lowestRateInclusiveTax || null
    const checkoutAmount = getCheckoutAmount(liveCheckoutAmount)
    const checkoutExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    const returnUrl = `${getBaseUrl()}/trial-booking/confirmation`
    const selectedRoomName = selectedRooms.length > 1
      ? `${selectedRooms.length} rooms arranged`
      : selectedRoom?.name || null
    const selectedRatePlanName = selectedRooms.length > 1
      ? "Mixed room arrangement"
      : selectedRoom?.roomTypeName || selectedRoom?.name || null

    // Insert into trial_requests table
    const { data: requestData, error: insertError } = await supabase
      .schema("tencent")
      .from("trial_requests")
      .insert({
        request_id: requestId,
        name,
        email,
        phone,
        location,
        location_slug: locationSlug,
        preferred_date: selectedDate,
        check_in_date: selectedDate,
        check_out_date: finalCheckOutDate,
        duration_nights: durationNights,
        adults: totalAdults,
        children: totalChildren,
        guest_count: totalGuests,
        estimated_cost: estimatedCost,
        special_requests: specialRequests,
        availability_data: {
          source: "ezee",
          availability: availabilityData,
          requestedRooms: selectedRooms.length || requestedRooms,
          roomSelections: selectedRoomPayload.roomSelections,
          checkout: {
            enabled: canCreateCheckout,
            expiresAt: checkoutExpiresAt,
            liveAmount: liveCheckoutAmount,
            amountOverride: checkoutAmount !== liveCheckoutAmount ? checkoutAmount : null,
          },
        },
        is_date_available: canCreateCheckout,
        available_rooms: availabilityData?.rooms || [],
        selected_room_id: selectedRoom?.roomTypeId || roomTypeId || null,
        selected_room_name: selectedRoomName,
        selected_rate_plan_id: selectedRoom?.ratePlanId || ratePlanId || null,
        selected_rate_plan_name: selectedRatePlanName,
        selected_room_payload: selectedRooms.length ? selectedRoomPayload : null,
        payment_amount: checkoutAmount,
        payment_currency: selectedRoom?.currency || availabilityData?.currency || "INR",
        checkout_expires_at: checkoutExpiresAt,
        request_status: canCreateCheckout ? "PENDING_PAYMENT" : "WAITLIST",
        payment_status: canCreateCheckout ? "PENDING_PAYMENT" : "NOT_STARTED",
        ezee_booking_status: "NOT_STARTED",
        session_id: normalizeOptionalText(sessionId),
        landing_url: normalizeOptionalText(pageUrl),
        referrer: normalizeOptionalText(referrer),
        utm_source: normalizeOptionalText(utmSource),
        utm_medium: normalizeOptionalText(utmMedium),
        utm_campaign: normalizeOptionalText(utmCampaign),
        utm_content: normalizeOptionalText(utmContent),
        utm_term: normalizeOptionalText(utmTerm),
        attribution_payload: attributionPayload || null,
      })
      .select()
      .single()

    if (insertError) {
      console.error("Supabase insert error:", insertError)
      return NextResponse.json(
        { error: "Failed to save trial request" },
        { status: 500 }
      )
    }

    if (sessionId) {
      await linkFunnelEventsToRequest(supabase, requestData.id, requestId, sessionId)
    }

    if (!canCreateCheckout || !checkoutAmount) {
      return NextResponse.json({
        success: true,
        requestId,
        status: requestData.request_status,
        message: "The selected date is fully booked. Your request has been added to our waitlist and we'll contact you if dates become available.",
      })
    }

    try {
      const checkout = await createExperiencesTrialCheckout({
        externalRequestId: requestId,
        locationName: location,
        locationSlug: locationSlug || "blyton_coorg",
        checkInDate: selectedDate,
        checkOutDate: finalCheckOutDate,
        durationNights,
        adults: totalAdults,
        children: totalChildren,
        roomCount: selectedRooms.length,
        guestCount: totalGuests,
        roomTypeId: selectedRoom?.roomTypeId,
        roomTypeName: selectedRoomName || selectedRoom?.roomTypeName,
        ratePlanId: selectedRoom?.ratePlanId,
        ratePlanName: selectedRatePlanName || selectedRoom?.roomTypeName || selectedRoom?.name,
        amount: checkoutAmount,
        currency: selectedRoom?.currency || availabilityData?.currency || "INR",
        customer: {
          name,
          email,
          phone,
        },
        payload: {
          source: "10cent",
          trialRequestRowId: requestData.id,
          selectedRoom,
          roomSelections: selectedRoomPayload.roomSelections,
          requestedRooms: selectedRooms.length,
        },
        expiresAt: checkoutExpiresAt,
        returnUrl,
      })

      const { error: checkoutUpdateError } = await supabase
        .schema("tencent")
        .from("trial_requests")
        .update({
          request_status: "PAYMENT_LINK_SENT",
          payment_status: "PAYMENT_LINK_SENT",
          experiences_checkout_id: checkout.requestId || null,
          experiences_checkout_url: checkout.checkoutUrl,
          checkout_expires_at: checkout.expiresAt || checkoutExpiresAt,
          payment_link_sent_at: new Date().toISOString(),
        })
        .eq("id", requestData.id)

      if (checkoutUpdateError) {
        console.error("Supabase checkout update error:", checkoutUpdateError)
      }

      await insertPaymentEvent(supabase, requestData.id, "checkout_created", "experiences", {
        experiencesRequestId: checkout.requestId,
        checkoutUrlCreated: Boolean(checkout.checkoutUrl),
        expiresAt: checkout.expiresAt || checkoutExpiresAt,
      })

      await insertFunnelEvent(supabase, requestData.id, requestId, {
        sessionId,
        eventName: "trial_checkout_created",
        eventStage: "checkout_created",
        name,
        email,
        phone,
        locationSlug,
        locationName: location,
        checkInDate: selectedDate,
        checkOutDate: finalCheckOutDate,
        durationNights,
        roomCount: selectedRooms.length,
        adults: totalAdults,
        children: totalChildren,
        guestCount: totalGuests,
        amount: checkoutAmount,
        currency: selectedRoom?.currency || availabilityData?.currency || "INR",
        pageUrl,
        referrer,
        utmSource,
        utmMedium,
        utmCampaign,
        utmContent,
        utmTerm,
        payload: {
          experiencesRequestId: checkout.requestId,
          checkoutUrlCreated: Boolean(checkout.checkoutUrl),
          expiresAt: checkout.expiresAt || checkoutExpiresAt,
        },
      })

      return NextResponse.json({
        success: true,
        requestId,
        status: "PAYMENT_LINK_SENT",
        checkoutUrl: checkout.checkoutUrl,
        message: "Redirecting you to secure payment.",
      })
    } catch (checkoutError) {
      console.error("Experiences checkout error:", checkoutError)

      await supabase
        .schema("tencent")
        .from("trial_requests")
        .update({
          request_status: "PAYMENT_FAILED",
          payment_status: "FAILED",
          status_notes: checkoutError instanceof Error ? checkoutError.message : "Failed to create checkout link",
        })
        .eq("id", requestData.id)

      return NextResponse.json(
        { error: checkoutError instanceof Error ? checkoutError.message : "Failed to create checkout link" },
        { status: 502 }
      )
    }
  } catch (error: unknown) {
    console.error("Trial request error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit trial request" },
      { status: 500 }
    )
  }
}

function normalizeOptionalText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null
}

function getBaseUrl(): string {
  return getPublicBaseUrl()
}

function normalizeRoomSelectionPayload(
  body: ITrialRequestPayload,
  requestedRooms: number,
  adults: number,
  children: number,
  roomTypeId?: string,
  ratePlanId?: string,
  rateTypeId?: string
): Required<ITrialRoomSelectionPayload>[] {
  const adultDistribution = distributeIntegerAcrossRooms(adults, requestedRooms, 1)
  const childDistribution = distributeIntegerAcrossRooms(children, requestedRooms, 0)
  const incomingSelections = Array.isArray(body.roomSelections) && body.roomSelections.length > 0
    ? body.roomSelections.slice(0, 4)
    : Array.from({ length: requestedRooms }, (_, index) => ({
      roomIndex: index + 1,
      adults: adultDistribution[index],
      children: childDistribution[index],
      roomTypeId,
      ratePlanId,
      rateTypeId,
    }))

  return incomingSelections.map((selection, index) => ({
    roomIndex: Number.isFinite(selection.roomIndex) && selection.roomIndex && selection.roomIndex > 0
      ? Math.round(selection.roomIndex)
      : index + 1,
    adults: Number.isFinite(selection.adults) && selection.adults && selection.adults > 0
      ? Math.round(selection.adults)
      : adultDistribution[index] || 1,
    children: Number.isFinite(selection.children) && selection.children && selection.children > 0
      ? Math.round(selection.children)
      : childDistribution[index] || 0,
    roomTypeId: selection.roomTypeId || "",
    ratePlanId: selection.ratePlanId || "",
    rateTypeId: selection.rateTypeId || "",
  }))
}

function distributeIntegerAcrossRooms(total: number, roomCount: number, minimumPerRoom: number): number[] {
  if (roomCount <= 1) return [Math.max(total, minimumPerRoom)]

  const distribution = Array.from({ length: roomCount }, () => minimumPerRoom)
  let remaining = Math.max(total - minimumPerRoom * roomCount, 0)
  let index = 0

  while (remaining > 0) {
    distribution[index % roomCount] += 1
    remaining -= 1
    index += 1
  }

  return distribution
}

async function resolveSelectedRooms({
  checkIn,
  checkOut,
  selections,
}: {
  checkIn: string
  checkOut: string
  selections: Required<ITrialRoomSelectionPayload>[]
}): Promise<{
  availabilityData: IEzeeAvailabilityResult | null
  selectedRooms: ISelectedTrialRoom[]
}> {
  const resolvedRooms: ISelectedTrialRoom[] = []
  let primaryAvailability: IEzeeAvailabilityResult | null = null

  for (const selection of selections) {
    const availability = await getBookingEngineAvailability({
      checkIn,
      checkOut,
      adults: ROOM_RATE_ADULTS,
      children: ROOM_RATE_CHILDREN,
      rooms: 1,
    })
    primaryAvailability = primaryAvailability || availability

    const room = availability.rooms.find(candidate =>
      candidate.availableRooms > 0 &&
      !candidate.stopSell &&
      (!selection.roomTypeId || candidate.roomTypeId === selection.roomTypeId) &&
      (!selection.ratePlanId || candidate.ratePlanId === selection.ratePlanId) &&
      (!selection.rateTypeId || candidate.rateTypeId === selection.rateTypeId)
    ) || availability.rooms.find(candidate => candidate.availableRooms > 0 && !candidate.stopSell)

    if (!room) {
      throw new Error(`No room is available for room ${selection.roomIndex}`)
    }

    resolvedRooms.push({
      roomIndex: selection.roomIndex,
      adults: selection.adults,
      children: selection.children,
      room,
    })
  }

  assertSelectedRoomInventory(resolvedRooms)

  return {
    availabilityData: primaryAvailability,
    selectedRooms: resolvedRooms,
  }
}

function assertSelectedRoomInventory(selectedRooms: ISelectedTrialRoom[]) {
  const roomCounts = new Map<string, { count: number; availableRooms: number; name: string }>()

  selectedRooms.forEach(selection => {
    const key = getSelectedRoomKey(selection.room)
    const current = roomCounts.get(key) || {
      count: 0,
      availableRooms: selection.room.availableRooms,
      name: selection.room.name,
    }

    roomCounts.set(key, {
      ...current,
      count: current.count + 1,
      availableRooms: Math.min(current.availableRooms, selection.room.availableRooms),
    })
  })

  roomCounts.forEach(value => {
    if (value.count > value.availableRooms) {
      throw new Error(`${value.name} has only ${value.availableRooms} room${value.availableRooms === 1 ? "" : "s"} available for this stay.`)
    }
  })
}

function buildSelectedRoomPayload(selectedRooms: ISelectedTrialRoom[]) {
  return {
    requestedRooms: selectedRooms.length,
    roomSelections: selectedRooms.map(selection => ({
      roomIndex: selection.roomIndex,
      adults: selection.adults,
      children: selection.children,
      amount: getRoomAmount(selection.room),
      room: selection.room,
    })),
  }
}

function getTotalCapacity(selectedRooms: ISelectedTrialRoom[], key: "maxAdults" | "maxChildren"): number {
  return selectedRooms.reduce((total, selection) => total + (selection.room[key] || 0), 0)
}

function getRoomAmount(room: IEzeeAvailableRoom): number {
  return room.totalPriceInclusiveTax || room.priceInclusiveTax || 0
}

function getSelectedRoomKey(room: IEzeeAvailableRoom): string {
  return `${room.roomTypeId || room.name}-${room.ratePlanId || ""}-${room.rateTypeId || ""}`
}

function getCheckoutAmount(liveAmount: number | null): number | null {
  const testCookie = cookies().get("trial_checkout_test")?.value
  if (testCookie === "1") {
    return 1
  }

  const overrideValue = process.env.TRIAL_CHECKOUT_AMOUNT_OVERRIDE
  if (!overrideValue) return liveAmount

  const overrideAmount = Number(overrideValue)
  if (!Number.isFinite(overrideAmount) || overrideAmount <= 0) {
    console.error("Ignoring invalid TRIAL_CHECKOUT_AMOUNT_OVERRIDE", {
      overrideValue,
    })
    return liveAmount
  }

  return overrideAmount
}

async function linkFunnelEventsToRequest(
  supabase: SupabaseClient | null,
  trialRequestId: string,
  requestId: string,
  sessionId: string
): Promise<void> {
  if (!supabase) return

  const { error } = await supabase
    .schema("tencent")
    .from("trial_funnel_events")
    .update({
      trial_request_id: trialRequestId,
      request_id: requestId,
    })
    .eq("session_id", sessionId)
    .is("request_id", null)

  if (error) {
    logSupabaseError("Supabase funnel event link error", error)
  }
}

interface IInsertFunnelEventInput {
  sessionId?: string | null
  eventName: string
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

async function insertFunnelEvent(
  supabase: SupabaseClient | null,
  trialRequestId: string,
  requestId: string,
  input: IInsertFunnelEventInput
): Promise<void> {
  if (!supabase || !input.sessionId) return

  const { error } = await supabase
    .schema("tencent")
    .from("trial_funnel_events")
    .insert({
      trial_request_id: trialRequestId,
      request_id: requestId,
      session_id: input.sessionId,
      event_name: input.eventName,
      event_source: "10cent",
      event_stage: input.eventStage || null,
      name: normalizeOptionalText(input.name),
      email: normalizeOptionalText(input.email),
      phone: normalizeOptionalText(input.phone),
      location_slug: normalizeOptionalText(input.locationSlug),
      location_name: normalizeOptionalText(input.locationName),
      check_in_date: normalizeOptionalText(input.checkInDate),
      check_out_date: normalizeOptionalText(input.checkOutDate),
      duration_nights: input.durationNights ?? null,
      room_count: input.roomCount ?? null,
      adults: input.adults ?? null,
      children: input.children ?? null,
      guest_count: input.guestCount ?? null,
      amount: input.amount ?? null,
      currency: normalizeOptionalText(input.currency) || "INR",
      page_url: normalizeOptionalText(input.pageUrl),
      referrer: normalizeOptionalText(input.referrer),
      utm_source: normalizeOptionalText(input.utmSource),
      utm_medium: normalizeOptionalText(input.utmMedium),
      utm_campaign: normalizeOptionalText(input.utmCampaign),
      utm_content: normalizeOptionalText(input.utmContent),
      utm_term: normalizeOptionalText(input.utmTerm),
      payload: input.payload || null,
    })

  if (error) {
    logSupabaseError("Supabase funnel event insert error", error)
  }
}

async function insertPaymentEvent(
  supabase: SupabaseClient | null,
  trialRequestId: string,
  eventType: string,
  source: string,
  payload: Record<string, unknown>
): Promise<void> {
  if (!supabase) return

  const { error } = await supabase
    .schema("tencent")
    .from("trial_request_payment_events")
    .insert({
      trial_request_id: trialRequestId,
      event_type: eventType,
      source,
      payload,
    })

  if (error) {
    logSupabaseError("Supabase payment event insert error", error)
  }
}

function logSupabaseError(label: string, error: PostgrestError): void {
  console.error(label, {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  })
}

// GET endpoint to check request status
export async function GET(req: Request) {
  try {
    const supabase = createSupabaseServiceClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get("requestId")

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .schema("tencent")
      .from("trial_requests")
      .select("*")
      .eq("request_id", requestId)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(data)
  } catch (error: unknown) {
    console.error("Get trial request error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch trial request" },
      { status: 500 }
    )
  }
}

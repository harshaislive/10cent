import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js"
import { createExperiencesTrialCheckout } from "@/lib/experiences/trialCheckout"
import { createSupabaseServiceClient } from "@/lib/supabase/server"
import { addDays, getBookingEngineAvailability, type IEzeeAvailabilityResult } from "@/lib/ezee/availability"

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
  guestCount?: number
  estimatedCost?: number
  roomTypeId?: string
  ratePlanId?: string
  rateTypeId?: string
  specialRequests?: string | null
}

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
      guestCount,
      estimatedCost,
      roomTypeId,
      ratePlanId,
      rateTypeId,
      specialRequests,
    } = body
    const selectedDate = checkInDate || preferredDate
    const totalGuests = guestCount || adults + children

    // Validate required fields
    if (!name || !email || !phone || !location || !selectedDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let availabilityData: IEzeeAvailabilityResult | null = null
    let isAvailable = false

    try {
      availabilityData = await getBookingEngineAvailability({
        checkIn: selectedDate,
        checkOut: checkOutDate || addDays(selectedDate, durationNights),
        adults,
        children,
        rooms: 1,
      })
      isAvailable = availabilityData.available
    } catch (availabilityError) {
      console.error("eZee availability error:", availabilityError)
    }

    const selectedRoom = availabilityData?.rooms.find(room =>
      room.availableRooms > 0 &&
      !room.stopSell &&
      (!roomTypeId || room.roomTypeId === roomTypeId) &&
      (!ratePlanId || room.ratePlanId === ratePlanId) &&
      (!rateTypeId || room.rateTypeId === rateTypeId)
    ) || availabilityData?.rooms.find(room => room.availableRooms > 0 && !room.stopSell) || null

    const canCreateCheckout = Boolean(isAvailable && selectedRoom)

    // Generate unique request ID
    const requestId = `TR${Date.now()}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()
    const finalCheckOutDate = checkOutDate || addDays(selectedDate, durationNights)
    const liveCheckoutAmount =
      selectedRoom?.totalPriceInclusiveTax ||
      selectedRoom?.priceInclusiveTax ||
      estimatedCost ||
      availabilityData?.lowestTotalInclusiveTax ||
      availabilityData?.lowestRateInclusiveTax ||
      null
    const checkoutAmount = getCheckoutAmount(liveCheckoutAmount)
    const checkoutExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    const returnUrl = `${getBaseUrl()}/trial-booking/confirmation`

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
        adults,
        children,
        guest_count: totalGuests,
        estimated_cost: estimatedCost,
        special_requests: specialRequests,
        availability_data: {
          source: "ezee",
          availability: availabilityData,
          checkout: {
            enabled: canCreateCheckout,
            expiresAt: checkoutExpiresAt,
            liveAmount: liveCheckoutAmount,
            amountOverride: checkoutAmount !== liveCheckoutAmount ? checkoutAmount : null,
          },
        },
        is_date_available: isAvailable,
        available_rooms: availabilityData?.rooms || [],
        selected_room_id: selectedRoom?.roomTypeId || roomTypeId || null,
        selected_room_name: selectedRoom?.name || null,
        selected_rate_plan_id: selectedRoom?.ratePlanId || ratePlanId || null,
        selected_rate_plan_name: selectedRoom?.roomTypeName || selectedRoom?.name || null,
        selected_room_payload: selectedRoom || null,
        payment_amount: checkoutAmount,
        payment_currency: selectedRoom?.currency || availabilityData?.currency || "INR",
        checkout_expires_at: checkoutExpiresAt,
        request_status: canCreateCheckout ? "PENDING_PAYMENT" : "WAITLIST",
        payment_status: canCreateCheckout ? "PENDING_PAYMENT" : "NOT_STARTED",
        ezee_booking_status: "NOT_STARTED",
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
        adults,
        children,
        guestCount: totalGuests,
        roomTypeId: selectedRoom?.roomTypeId,
        roomTypeName: selectedRoom?.name || selectedRoom?.roomTypeName,
        ratePlanId: selectedRoom?.ratePlanId,
        ratePlanName: selectedRoom?.roomTypeName || selectedRoom?.name,
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

function getBaseUrl(): string {
  return (process.env.NEXT_PUBLIC_BASE_URL || "https://10percent.beforest.co").replace(/\/$/, "")
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

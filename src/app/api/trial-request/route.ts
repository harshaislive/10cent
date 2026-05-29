import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { addDays, getBookingEngineAvailability, type IEzeeAvailabilityResult } from "@/lib/ezee/availability"
import { createEzeeBookingHold, isTrialBlockingEnabled, type IEzeeBookingResult } from "@/lib/ezee/bookings"

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
    // Get Supabase config at request time
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

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
      adults = 2,
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
    let blockingData: IEzeeBookingResult | null = null
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

      if (isAvailable && isTrialBlockingEnabled()) {
        const roomToBlock = availabilityData.rooms.find(room =>
          room.availableRooms > 0 &&
          !room.stopSell &&
          (!roomTypeId || room.roomTypeId === roomTypeId) &&
          (!ratePlanId || room.ratePlanId === ratePlanId) &&
          (!rateTypeId || room.rateTypeId === rateTypeId)
        ) || availabilityData.rooms.find(room => room.availableRooms > 0 && !room.stopSell)
        if (!roomToBlock) {
          throw new Error("No eZee room is available to block")
        }

        blockingData = await createEzeeBookingHold({
          checkIn: selectedDate,
          checkOut: checkOutDate || addDays(selectedDate, durationNights),
          adults,
          children,
          room: roomToBlock,
          guest: {
            name,
            email,
            phone,
          },
          specialRequest: specialRequests,
        })
      }
    } catch (availabilityError) {
      console.error("eZee availability/blocking error:", availabilityError)
    }

    // Generate unique request ID
    const requestId = `TR${Date.now()}${Math.random().toString(36).slice(2, 6)}`.toUpperCase()

    // Insert into trial_requests table
    const { data: requestData, error: insertError } = await supabase
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
        check_out_date: checkOutDate,
        duration_nights: durationNights,
        adults,
        children,
        guest_count: totalGuests,
        estimated_cost: estimatedCost,
        special_requests: specialRequests,
        availability_data: {
          source: "ezee",
          availability: availabilityData,
          blocking: blockingData || {
            enabled: isTrialBlockingEnabled(),
            skipped: !isTrialBlockingEnabled(),
          },
        },
        is_date_available: isAvailable,
        available_rooms: availabilityData?.rooms || [],
        ezee_reservation_no: blockingData?.reservationNo || null,
        ezee_inventory_mode: blockingData?.inventoryMode || null,
        request_status: isAvailable ? "AVAILABLE" : "WAITLIST",
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

    return NextResponse.json({
      success: true,
      requestId,
      status: requestData.request_status,
      message: isAvailable
        ? "Your trial request has been received! We'll contact you shortly to confirm your booking."
        : "The selected date is fully booked. Your request has been added to our waitlist and we'll contact you if dates become available.",
    })
  } catch (error: unknown) {
    console.error("Trial request error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to submit trial request" },
      { status: 500 }
    )
  }
}

// GET endpoint to check request status
export async function GET(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { searchParams } = new URL(req.url)
    const requestId = searchParams.get("requestId")

    if (!requestId) {
      return NextResponse.json(
        { error: "requestId is required" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
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

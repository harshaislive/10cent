import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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

    // Check if availability was verified for this date
    const AVAILABILITY_API_URL = "https://blytonavailability.devsharsha.live/api/availability"
    const availabilityUrl = `${AVAILABILITY_API_URL}?mode=check&startDate=${selectedDate}&months=2&offset=0`
    const availabilityResponse = await fetch(availabilityUrl, {
      headers: { accept: "application/json" },
    })

    let availabilityData: unknown = null
    if (availabilityResponse.ok) {
      availabilityData = await availabilityResponse.json()
    }
    const isAvailable =
      typeof availabilityData === "object" &&
      availabilityData !== null &&
      "data" in availabilityData &&
      typeof (availabilityData as { data?: { available?: unknown } }).data?.available === "boolean"
        ? (availabilityData as { data: { available: boolean } }).data.available
        : false

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
        availability_data: availabilityData,
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

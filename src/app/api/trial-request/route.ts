import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase configuration")
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      location,
      locationSlug,
      preferredDate,
      durationNights = 2,
      guestCount,
      specialRequests,
    } = body

    // Validate required fields
    if (!name || !email || !phone || !location || !preferredDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if availability was verified for this date
    const AVAILABILITY_API_URL = "https://blytonavailability.devsharsha.live/api/availability"
    const availabilityUrl = `${AVAILABILITY_API_URL}?mode=check&startDate=${preferredDate}&months=2&offset=0`
    const availabilityResponse = await fetch(availabilityUrl, {
      headers: { accept: "application/json" },
    })

    let availabilityData: any = null
    if (availabilityResponse.ok) {
      availabilityData = await availabilityResponse.json()
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
        preferred_date: preferredDate,
        duration_nights: durationNights,
        guest_count: guestCount,
        special_requests: specialRequests,
        availability_data: availabilityData,
        request_status: availabilityData?.data?.available ? "AVAILABLE" : "WAITLIST",
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
      message: availabilityData?.data?.available
        ? "Your trial request has been received! We'll contact you shortly to confirm your booking."
        : "The selected date is fully booked. Your request has been added to our waitlist and we'll contact you if dates become available.",
    })
  } catch (error: any) {
    console.error("Trial request error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to submit trial request" },
      { status: 500 }
    )
  }
}

// GET endpoint to check request status
export async function GET(req: Request) {
  try {
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
  } catch (error: any) {
    console.error("Get trial request error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch trial request" },
      { status: 500 }
    )
  }
}

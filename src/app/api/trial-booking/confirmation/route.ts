import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

interface ITrialRequestConfirmationRow {
  request_id: string
  name: string
  email: string
  phone: string
  location: string
  location_slug: string
  check_in_date: string | null
  check_out_date: string | null
  duration_nights: number | null
  adults: number | null
  children: number | null
  guest_count: number | null
  selected_room_id: string | null
  selected_room_name: string | null
  selected_rate_plan_id: string | null
  selected_rate_plan_name: string | null
  payment_amount: number | null
  payment_currency: string | null
  payment_status: string
  request_status: string
  ezee_booking_status: string
  ezee_reservation_no: string | null
  ezee_inventory_mode: string | null
  paid_at: string | null
  checkout_expires_at: string | null
  experiences_checkout_id: string | null
}

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const supabase = createSupabaseServiceClient()

  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    )
  }

  const { searchParams } = new URL(req.url)
  const requestId = searchParams.get("requestId")

  if (!requestId || !/^TR[A-Z0-9]+$/i.test(requestId)) {
    return NextResponse.json(
      { error: "Valid requestId is required" },
      { status: 400 }
    )
  }

  const { data, error } = await supabase
    .schema("tencent")
    .from("trial_requests")
    .select(`
      request_id,
      name,
      email,
      phone,
      location,
      location_slug,
      check_in_date,
      check_out_date,
      duration_nights,
      adults,
      children,
      guest_count,
      selected_room_id,
      selected_room_name,
      selected_rate_plan_id,
      selected_rate_plan_name,
      payment_amount,
      payment_currency,
      payment_status,
      request_status,
      ezee_booking_status,
      ezee_reservation_no,
      ezee_inventory_mode,
      paid_at,
      checkout_expires_at,
      experiences_checkout_id
    `)
    .eq("request_id", requestId)
    .single<ITrialRequestConfirmationRow>()

  if (error || !data) {
    return NextResponse.json(
      { error: "Trial request not found" },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    request: {
      requestId: data.request_id,
      location: {
        name: data.location,
        slug: data.location_slug,
      },
      stay: {
        checkInDate: data.check_in_date,
        checkOutDate: data.check_out_date,
        durationNights: data.duration_nights,
        adults: data.adults,
        children: data.children,
        guestCount: data.guest_count,
      },
      room: {
        roomTypeId: data.selected_room_id,
        roomTypeName: data.selected_room_name,
        ratePlanId: data.selected_rate_plan_id,
        ratePlanName: data.selected_rate_plan_name,
      },
      payment: {
        amount: data.payment_amount,
        currency: data.payment_currency || "INR",
        status: data.payment_status,
        paidAt: data.paid_at,
        checkoutExpiresAt: data.checkout_expires_at,
        experiencesCheckoutId: data.experiences_checkout_id,
      },
      booking: {
        requestStatus: data.request_status,
        ezeeStatus: data.ezee_booking_status,
        ezeeReservationNo: data.ezee_reservation_no,
        ezeeInventoryMode: data.ezee_inventory_mode,
      },
      customer: {
        name: data.name,
        email: data.email,
        phone: data.phone,
      },
    },
  })
}

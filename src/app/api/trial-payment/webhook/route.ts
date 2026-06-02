import crypto from "crypto"
import { NextResponse } from "next/server"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getBookingEngineAvailability, type IEzeeAvailableRoom } from "@/lib/ezee/availability"
import { createEzeeBookingHold } from "@/lib/ezee/bookings"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

interface ITrialPaymentWebhookPayload {
  event?: string
  externalRequestId?: string
  paymentStatus?: string
  amount?: number
  currency?: string
  phonepeTransactionId?: string
  paidAt?: string
  customer?: {
    name?: string
    email?: string
    phone?: string
  }
}

interface ITrialRequestRecord {
  id: string
  request_id: string
  name: string
  email: string
  phone: string
  check_in_date: string | null
  check_out_date: string | null
  duration_nights: number | null
  adults: number | null
  children: number | null
  selected_room_id: string | null
  selected_rate_plan_id: string | null
  selected_room_payload: Record<string, unknown> | null
  ezee_booking_status: string | null
  ezee_reservation_no: string | null
  special_requests: string | null
}

export async function POST(req: Request) {
  const rawBody = await req.text()

  if (!verifyWebhookSignature(rawBody, req.headers)) {
    return NextResponse.json(
      { success: false, error: "Invalid signature" },
      { status: 401 }
    )
  }

  let payload: ITrialPaymentWebhookPayload
  try {
    payload = JSON.parse(rawBody) as ITrialPaymentWebhookPayload
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload" },
      { status: 400 }
    )
  }

  if (!payload.externalRequestId) {
    return NextResponse.json(
      { success: false, error: "externalRequestId is required" },
      { status: 400 }
    )
  }

  const supabase = createSupabaseServiceClient()
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Database not configured" },
      { status: 503 }
    )
  }

  const { data: requestRecord, error: fetchError } = await supabase
    .schema("tencent")
    .from("trial_requests")
    .select("*")
    .eq("request_id", payload.externalRequestId)
    .single<ITrialRequestRecord>()

  if (fetchError || !requestRecord) {
    console.error("Trial payment webhook request lookup error:", fetchError)
    return NextResponse.json(
      { success: false, error: "Trial request not found" },
      { status: 404 }
    )
  }

  await insertPaymentEvent(supabase, requestRecord.id, payload.event || "trial_payment_webhook", "experiences", {
    ...payload,
  })

  if (payload.event !== "trial_payment_completed" || payload.paymentStatus !== "completed") {
    const isFailedPayment = payload.paymentStatus === "failed"
    await supabase
      .schema("tencent")
      .from("trial_requests")
      .update({
        request_status: isFailedPayment ? "PAYMENT_FAILED" : "PAYMENT_STARTED",
        payment_status: isFailedPayment ? "FAILED" : "PAYMENT_STARTED",
        payment_failed_at: isFailedPayment ? new Date().toISOString() : null,
        payment_webhook_received_at: new Date().toISOString(),
        payment_webhook_payload: payload,
        payment_reference: payload,
      })
      .eq("id", requestRecord.id)

    return NextResponse.json({
      success: true,
      requestId: payload.externalRequestId,
      paymentStatus: payload.paymentStatus || "pending",
      ezeeBookingStatus: "not_started",
    })
  }

  await supabase
    .schema("tencent")
    .from("trial_requests")
    .update({
      request_status: "PAID",
      payment_status: "PAID",
      payment_amount: payload.amount ?? null,
      payment_currency: payload.currency || "INR",
      payment_transaction_id: payload.phonepeTransactionId || null,
      payment_reference: payload,
      paid_at: payload.paidAt || new Date().toISOString(),
      payment_webhook_received_at: new Date().toISOString(),
      payment_webhook_payload: payload,
      ezee_booking_status: requestRecord.ezee_booking_status === "CREATED" ? "CREATED" : "PENDING",
      ezee_booking_attempted_at: requestRecord.ezee_booking_status === "CREATED" ? null : new Date().toISOString(),
    })
    .eq("id", requestRecord.id)

  if (requestRecord.ezee_booking_status === "CREATED" && requestRecord.ezee_reservation_no) {
    return NextResponse.json({
      success: true,
      requestId: payload.externalRequestId,
      paymentStatus: "completed",
      ezeeBookingStatus: "created",
      reservationNo: requestRecord.ezee_reservation_no,
    })
  }

  try {
    const booking = await createPostPaymentEzeeBooking(requestRecord)

    await supabase
      .schema("tencent")
      .from("trial_requests")
      .update({
        request_status: "EZEE_BOOKING_CREATED",
        ezee_booking_status: "CREATED",
        ezee_booking_created_at: new Date().toISOString(),
        ezee_booking_error: null,
        ezee_reservation_no: booking.reservationNo || null,
        ezee_inventory_mode: booking.inventoryMode || null,
      })
      .eq("id", requestRecord.id)

    await insertPaymentEvent(supabase, requestRecord.id, "ezee_booking_created", "ezee", {
      reservationNo: booking.reservationNo,
      inventoryMode: booking.inventoryMode,
    })

    return NextResponse.json({
      success: true,
      requestId: payload.externalRequestId,
      paymentStatus: "completed",
      ezeeBookingStatus: "created",
      reservationNo: booking.reservationNo,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create eZee booking"
    console.error("Post-payment eZee booking error:", error)

    await supabase
      .schema("tencent")
      .from("trial_requests")
      .update({
        request_status: "EZEE_BOOKING_FAILED",
        ezee_booking_status: "FAILED",
        ezee_booking_error: message,
      })
      .eq("id", requestRecord.id)

    await insertPaymentEvent(supabase, requestRecord.id, "ezee_booking_failed", "ezee", {
      error: message,
    })

    return NextResponse.json({
      success: true,
      requestId: payload.externalRequestId,
      paymentStatus: "completed",
      ezeeBookingStatus: "failed",
      error: message,
    })
  }
}

function verifyWebhookSignature(rawBody: string, headers: Headers): boolean {
  const secret = process.env.TRIAL_PAYMENT_WEBHOOK_SECRET
  if (!secret) {
    console.error("TRIAL_PAYMENT_WEBHOOK_SECRET is not configured")
    return false
  }

  const signature = headers.get("X-Trial-Signature") || headers.get("x-trial-signature")
  if (!signature) return false

  const normalizedSignature = signature.replace(/^sha256=/i, "").trim()
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex")

  return safeCompareHex(normalizedSignature, expectedSignature)
}

function safeCompareHex(actual: string, expected: string): boolean {
  if (!/^[a-f0-9]+$/i.test(actual) || actual.length !== expected.length) {
    return false
  }

  return crypto.timingSafeEqual(
    Buffer.from(actual, "hex"),
    Buffer.from(expected, "hex")
  )
}

async function createPostPaymentEzeeBooking(requestRecord: ITrialRequestRecord) {
  if (!requestRecord.check_in_date || !requestRecord.check_out_date) {
    throw new Error("Trial request is missing stay dates")
  }

  const adults = requestRecord.adults ?? 1
  const children = requestRecord.children ?? 0
  const availability = await getBookingEngineAvailability({
    checkIn: requestRecord.check_in_date,
    checkOut: requestRecord.check_out_date,
    adults,
    children,
    rooms: 1,
  })

  const selectedRoom = availability.rooms.find(room =>
    room.availableRooms > 0 &&
    !room.stopSell &&
    (!requestRecord.selected_room_id || room.roomTypeId === requestRecord.selected_room_id) &&
    (!requestRecord.selected_rate_plan_id || room.ratePlanId === requestRecord.selected_rate_plan_id)
  ) || availability.rooms.find(room => room.availableRooms > 0 && !room.stopSell)

  if (!selectedRoom) {
    throw new Error("Selected eZee room is no longer available")
  }

  return createEzeeBookingHold({
    checkIn: requestRecord.check_in_date,
    checkOut: requestRecord.check_out_date,
    adults,
    children,
    room: selectedRoom,
    guest: {
      name: requestRecord.name,
      email: requestRecord.email,
      phone: requestRecord.phone,
    },
    specialRequest: requestRecord.special_requests,
  })
}

async function insertPaymentEvent(
  supabase: SupabaseClient,
  trialRequestId: string,
  eventType: string,
  source: string,
  payload: Record<string, unknown>
): Promise<void> {
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
    console.error("Trial payment event insert error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
  }
}

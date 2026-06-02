import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServiceClient()

    if (!supabase) {
      return NextResponse.json(
        { error: "Database not configured" },
        { status: 503 }
      )
    }

    const body = await req.json()
    const {
      name,
      phone,
      email, // Optional
      scheduledDate,
      scheduledTime,
    } = body

    // Validate required fields
    if (!name || !phone || !scheduledDate || !scheduledTime) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Insert into onboarding_calls table
    const { data, error } = await supabase
      .schema("tencent")
      .from("onboarding_calls")
      .insert({
        name,
        phone,
        email,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        status: "SCHEDULED"
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to schedule call" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error: any) {
    console.error("Schedule call error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to schedule call" },
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
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

import { NextResponse } from "next/server"
import { createSupabaseServiceClient } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServiceClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database config missing" }, { status: 503 })
    }

    const body = await req.json()

    const { name, phone, feelings, highlights, stay_location } = body

    const { error } = await supabase
      .schema("tencent")
      .from("feedback")
      .insert({
        name,
        phone,
        feelings,
        highlights,
        stay_location
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Feedback error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

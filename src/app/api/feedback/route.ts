import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: "Database config missing" }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const body = await req.json()

    const { name, phone, feelings, highlights, stay_location } = body

    const { error } = await supabase
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

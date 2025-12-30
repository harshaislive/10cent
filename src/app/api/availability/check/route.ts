import { NextResponse } from "next/server"

const AVAILABILITY_API_URL = "https://blytonavailability.devsharsha.live/api/availability"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")

    if (!startDate) {
      return NextResponse.json(
        { error: "startDate is required" },
        { status: 400 }
      )
    }

    // Call the availability API
    const apiUrl = `${AVAILABILITY_API_URL}?mode=check&startDate=${startDate}&months=2&offset=0`
    const response = await fetch(apiUrl, {
      headers: {
        accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Availability API returned ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Availability check error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to check availability" },
      { status: 500 }
    )
  }
}

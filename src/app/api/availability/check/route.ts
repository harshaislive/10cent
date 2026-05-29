import { NextResponse } from "next/server"
import { addDays, getBookingEngineAvailability } from "@/lib/ezee/availability"

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const startDate = searchParams.get("startDate")
    const checkOutDate = searchParams.get("checkOutDate")
    const durationNights = Number(searchParams.get("durationNights") || "2")
    const adults = Number(searchParams.get("adults") || "2")
    const children = Number(searchParams.get("children") || "0")
    const rooms = Number(searchParams.get("rooms") || "1")

    if (!startDate) {
      return NextResponse.json(
        { error: "startDate is required" },
        { status: 400 }
      )
    }

    const safeDurationNights = Number.isFinite(durationNights) && durationNights > 0 ? durationNights : 1
    const availability = await getBookingEngineAvailability({
      checkIn: startDate,
      checkOut: checkOutDate || addDays(startDate, safeDurationNights),
      adults: Number.isFinite(adults) && adults > 0 ? adults : 2,
      children: Number.isFinite(children) && children >= 0 ? children : 0,
      rooms: Number.isFinite(rooms) && rooms > 0 ? rooms : 1,
    })

    return NextResponse.json({
      success: true,
      source: "ezee",
      data: {
        available: availability.available,
        availableRooms: availability.availableRooms,
        checkIn: availability.checkIn,
        checkOut: availability.checkOut,
        currency: availability.currency,
        lowestRateInclusiveTax: availability.lowestRateInclusiveTax,
        lowestTotalInclusiveTax: availability.lowestTotalInclusiveTax,
        rooms: availability.rooms.map(room => ({
          roomTypeId: room.roomTypeId,
          ratePlanId: room.ratePlanId,
          rateTypeId: room.rateTypeId,
          name: room.name,
          roomTypeName: room.roomTypeName,
          availableRooms: room.availableRooms,
          currency: room.currency,
          priceInclusiveTax: room.priceInclusiveTax,
          priceExclusiveTax: room.priceExclusiveTax,
          totalPriceInclusiveTax: room.totalPriceInclusiveTax,
          totalPriceExclusiveTax: room.totalPriceExclusiveTax,
          maxAdults: room.maxAdults,
          maxChildren: room.maxChildren,
          minNights: room.minNights,
          stopSell: room.stopSell,
        })),
      },
    })
  } catch (error: unknown) {
    console.error("Availability check error:", error)
    const isConfigError = error instanceof Error && error.message === "eZee API is not configured"
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to check availability" },
      { status: isConfigError ? 503 : 500 }
    )
  }
}

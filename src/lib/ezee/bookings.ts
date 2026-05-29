import { buildEzeeUrl, fetchEzeeJson, getEzeeConfig } from "./client"
import type { IEzeeAvailableRoom } from "./availability"

export interface IEzeeBookingGuest {
  name: string
  email?: string
  phone?: string
}

export interface ICreateEzeeBookingInput {
  checkIn: string
  checkOut: string
  adults: number
  children: number
  room: IEzeeAvailableRoom
  guest: IEzeeBookingGuest
  specialRequest?: string | null
}

export interface IEzeeBookingResult {
  reservationNo: string
  inventoryMode: string
  raw: unknown
}

const DEFAULT_PAYMENT_GATEWAY_ID = "4547700000000000184"

export function isTrialBlockingEnabled(): boolean {
  return process.env.EZEE_ENABLE_TRIAL_BLOCKING === "true"
}

export async function createEzeeBookingHold(input: ICreateEzeeBookingInput): Promise<IEzeeBookingResult> {
  const { hotelCode, authCode, userAgent } = getEzeeConfig()
  const bookingData = buildBookingData(input)
  const url = buildEzeeUrl("/booking/reservation_api/listing.php", {
    request_type: "InsertBooking",
    HotelCode: hotelCode,
    APIKey: authCode,
    BookingData: JSON.stringify(bookingData),
    language: "en",
  })

  const raw = await fetchEzeeJson(url, userAgent)
  const record = raw && typeof raw === "object" && !Array.isArray(raw)
    ? raw as Record<string, unknown>
    : {}

  return {
    reservationNo: typeof record.ReservationNo === "string" ? record.ReservationNo : "",
    inventoryMode: typeof record.Inventory_Mode === "string" ? record.Inventory_Mode : "",
    raw,
  }
}

function buildBookingData(input: ICreateEzeeBookingInput) {
  const { firstName, lastName } = splitName(input.guest.name)
  const baseRate = input.room.priceExclusiveTax ?? input.room.priceInclusiveTax ?? 0

  return {
    Room_Details: {
      Room_1: {
        Rateplan_Id: input.room.ratePlanId,
        Ratetype_Id: input.room.rateTypeId,
        Roomtype_Id: input.room.roomTypeId,
        baserate: String(Math.round(baseRate)),
        extradultrate: "0",
        extrachildrate: "0",
        number_adults: String(input.adults),
        number_children: String(input.children),
        Title: "",
        First_Name: firstName,
        Last_Name: lastName,
        Gender: "",
        SpecialRequest: input.specialRequest || "",
      },
    },
    check_in_date: input.checkIn,
    check_out_date: input.checkOut,
    Booking_Payment_Mode: "",
    Email_Address: input.guest.email || "",
    Source_Id: "",
    MobileNo: input.guest.phone || "",
    Address: "",
    State: "",
    Country: "India",
    City: "",
    Zipcode: "",
    Fax: "",
    Device: "website",
    Languagekey: "en",
    paymenttypeunkid: process.env.EZEE_PAYMENT_TYPE_UNKID || DEFAULT_PAYMENT_GATEWAY_ID,
  }
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "." }
  }
  return {
    firstName: parts.slice(0, -1).join(" "),
    lastName: parts[parts.length - 1],
  }
}

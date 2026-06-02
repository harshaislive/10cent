import { getEzeeConfig, postEzeeFormJson } from "./client"
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
  roomCount?: number
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
  const raw = await postEzeeFormJson("/booking/reservation_api/listing.php", {
    request_type: "InsertBooking",
    HotelCode: hotelCode,
    APIKey: authCode,
    BookingData: JSON.stringify(bookingData),
    language: "en",
  }, userAgent)
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
  const requestedRoomCount = input.roomCount ?? 1
  const availableRoomCount = input.room.availableRooms || requestedRoomCount
  const roomCount = Number.isFinite(requestedRoomCount) && requestedRoomCount > 0
    ? Math.min(Math.round(requestedRoomCount), availableRoomCount)
    : 1
  const roomDetails = buildRoomDetails(input, roomCount, baseRate, firstName, lastName)

  return {
    Room_Details: roomDetails,
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

function buildRoomDetails(
  input: ICreateEzeeBookingInput,
  roomCount: number,
  baseRate: number,
  firstName: string,
  lastName: string
) {
  const adultDistribution = distributeGuests(input.adults, roomCount, 1)
  const childDistribution = distributeGuests(input.children, roomCount, 0)

  return Object.fromEntries(
    Array.from({ length: roomCount }, (_, index) => {
      const roomNumber = index + 1
      return [
        `Room_${roomNumber}`,
        {
          Rateplan_Id: input.room.ratePlanId,
          Ratetype_Id: input.room.rateTypeId,
          Roomtype_Id: input.room.roomTypeId,
          baserate: String(Math.round(baseRate)),
          extradultrate: "0",
          extrachildrate: "0",
          number_adults: String(adultDistribution[index]),
          number_children: String(childDistribution[index]),
          Title: "",
          First_Name: roomNumber === 1 ? firstName : `${firstName} Room ${roomNumber}`,
          Last_Name: lastName,
          Gender: "",
          SpecialRequest: input.specialRequest || "",
        },
      ]
    })
  )
}

function distributeGuests(totalGuests: number, roomCount: number, minimumPerRoom: number): number[] {
  if (roomCount <= 1) return [Math.max(totalGuests, minimumPerRoom)]

  const distribution = Array.from({ length: roomCount }, () => minimumPerRoom)
  let remaining = Math.max(totalGuests - minimumPerRoom * roomCount, 0)
  let index = 0

  while (remaining > 0) {
    distribution[index % roomCount] += 1
    remaining -= 1
    index += 1
  }

  return distribution
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

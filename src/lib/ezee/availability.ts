import { buildEzeeUrl, fetchEzeeJson, getEzeeConfig } from "./client"

export interface IEzeeAvailabilitySearch {
  checkIn: string
  checkOut: string
  adults?: number
  children?: number
  rooms?: number
}

export interface IEzeeAvailableRoom {
  roomTypeId: string
  ratePlanId: string
  rateTypeId: string
  name: string
  roomTypeName: string
  availableRooms: number
  currency: string
  priceInclusiveTax: number | null
  priceExclusiveTax: number | null
  totalPriceInclusiveTax: number | null
  totalPriceExclusiveTax: number | null
  maxAdults: number | null
  maxChildren: number | null
  minNights: number | null
  stopSell: boolean
  raw: Record<string, unknown>
}

export interface IEzeeAvailabilityResult {
  available: boolean
  checkIn: string
  checkOut: string
  adults: number
  children: number
  requestedRooms: number
  availableRooms: number
  currency: string
  lowestRateInclusiveTax: number | null
  lowestTotalInclusiveTax: number | null
  rooms: IEzeeAvailableRoom[]
  raw: unknown
}

const ROOM_ARRAY_KEYS = [
  "Room_Details",
  "RoomDetails",
  "RoomList",
  "Rooms",
  "Room",
  "data",
]

export function addDays(dateValue: string, days: number): string {
  const [year, month, day] = dateValue.split("-").map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().split("T")[0]
}

export async function getBookingEngineAvailability(
  search: IEzeeAvailabilitySearch
): Promise<IEzeeAvailabilityResult> {
  const { hotelCode, authCode, userAgent } = getEzeeConfig()
  const adults = search.adults ?? 2
  const children = search.children ?? 0
  const rooms = search.rooms ?? 1

  const url = buildEzeeUrl("/booking/reservation_api/listing.php", {
    request_type: "RoomList",
    HotelCode: hotelCode,
    APIKey: authCode,
    check_in_date: search.checkIn,
    check_out_date: search.checkOut,
    number_adults: String(adults),
    number_children: String(children),
    num_rooms: String(rooms),
    show_only_available_rooms: "1",
    language: "en",
  })

  const raw = await fetchEzeeJson(url, userAgent)
  return normalizeBookingEngineAvailability(raw, {
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    adults,
    children,
    rooms,
  })
}

function normalizeBookingEngineAvailability(
  raw: unknown,
  search: Required<IEzeeAvailabilitySearch>
): IEzeeAvailabilityResult {
  const normalizedRooms = collectRoomRecords(raw)
    .map(normalizeRoom)
    .filter((room): room is IEzeeAvailableRoom => Boolean(room))

  const availableRooms = normalizedRooms.reduce((total, room) => total + room.availableRooms, 0)
  const availableRates = normalizedRooms
    .map(room => room.priceInclusiveTax)
    .filter((rate): rate is number => typeof rate === "number")
  const availableTotals = normalizedRooms
    .map(room => room.totalPriceInclusiveTax)
    .filter((rate): rate is number => typeof rate === "number")

  return {
    available: normalizedRooms.some(room => room.availableRooms >= search.rooms && !room.stopSell),
    checkIn: search.checkIn,
    checkOut: search.checkOut,
    adults: search.adults,
    children: search.children,
    requestedRooms: search.rooms,
    availableRooms,
    currency: normalizedRooms[0]?.currency || "INR",
    lowestRateInclusiveTax: availableRates.length ? Math.min(...availableRates) : null,
    lowestTotalInclusiveTax: availableTotals.length ? Math.min(...availableTotals) : null,
    rooms: normalizedRooms,
    raw,
  }
}

function normalizeRoom(room: Record<string, unknown>): IEzeeAvailableRoom | null {
  const roomTypeId = getString(room, [
    "Roomtype_Id",
    "RoomType_Id",
    "RoomTypeID",
    "roomtypeunkid",
    "roomtype_id",
    "room_type_id",
  ])
  const ratePlanId = getString(room, [
    "Rateplan_Id",
    "RatePlan_Id",
    "RatePlanID",
    "roomrateunkid",
    "rateplanunkid",
    "rateplan_id",
  ])
  const rateTypeId = getString(room, [
    "Ratetype_Id",
    "RateType_Id",
    "RateTypeID",
    "ratetypeunkid",
    "ratetype_id",
  ])
  const name = getString(room, [
    "Room_Name",
    "RoomName",
    "RoomType",
    "Room_Type",
    "Roomtype_Name",
    "roomtype_name",
    "Name",
  ])
  const roomTypeName = getString(room, [
    "Roomtype_Name",
    "RoomTypeName",
    "Room_Type_Name",
  ])
  const availableRooms = getNumber(room, [
    "min_ava_rooms",
    "Available_Rooms",
    "AvailableRooms",
    "available_rooms",
    "availableroom",
    "Availability",
    "available",
    "NoOfRooms",
  ])
  const roomRatesInfo = getRecord(room, "room_rates_info")
  const stopSell = getBoolean(room, [
    "StopSell",
    "Stop_Sell",
    "stop_sell",
    "stopsell",
    "is_stop_sell",
  ])

  if (!roomTypeId && !ratePlanId && !name) {
    return null
  }

  return {
    roomTypeId,
    ratePlanId,
    rateTypeId,
    name: name || roomTypeId || "Room",
    roomTypeName,
    availableRooms: availableRooms ?? (stopSell ? 0 : 1),
    currency: getString(room, ["Currency", "currency", "CurrencyCode", "currency_code"]) || "INR",
    priceInclusiveTax: getNumberFromRecords([roomRatesInfo, room], [
      "RoomRateInclusiveTax",
      "InclusiveTax",
      "RateInclusiveTax",
      "PublicInclusiveRate",
      "avg_per_night_after_discount",
      "TotalRate",
      "total_amount",
      "avg_per_night_with_tax",
    ]),
    priceExclusiveTax: getNumberFromRecords([roomRatesInfo, room], [
      "RoomRateExclusiveTax",
      "ExclusiveTax",
      "RateExclusiveTax",
      "PublicExclusiveRate",
      "avg_per_night_without_tax",
      "BaseRate",
      "baserate",
      "avg_per_night_without_tax",
    ]),
    totalPriceInclusiveTax: getNumberFromRecords([roomRatesInfo, room], [
      "totalprice_inclusive_all",
      "TotalPriceInclusiveTax",
      "TotalInclusiveTax",
    ]),
    totalPriceExclusiveTax: getNumberFromRecords([roomRatesInfo, room], [
      "totalprice_room_only",
      "TotalPriceExclusiveTax",
      "TotalExclusiveTax",
    ]),
    maxAdults: getNumber(room, [
      "max_adult_occupancy",
      "Room_Max_adult",
      "MaxAdult",
    ]),
    maxChildren: getNumber(room, [
      "max_child_occupancy",
      "Room_Max_child",
      "MaxChild",
    ]),
    minNights: getNumberFromRecords([room, { Avg_min_nights: getCaseInsensitiveValue(room, "Avg_min_nights") }], [
      "MinNights",
      "MinimumNights",
      "min_nights",
      "minstay",
      "Avg_min_nights",
    ]),
    stopSell,
    raw: room,
  }
}

function collectRoomRecords(value: unknown, depth = 0): Record<string, unknown>[] {
  if (depth > 5) return []

  if (Array.isArray(value)) {
    const records = value.filter(isRecord)
    const roomLikeRecords = records.filter(looksLikeRoom)
    if (roomLikeRecords.length > 0) return roomLikeRecords
    return records.flatMap(item => collectRoomRecords(item, depth + 1))
  }

  if (!isRecord(value)) return []

  for (const key of ROOM_ARRAY_KEYS) {
    const nestedValue = getCaseInsensitiveValue(value, key)
    const nestedRooms = collectRoomRecords(nestedValue, depth + 1)
    if (nestedRooms.length > 0) return nestedRooms
  }

  if (looksLikeRoom(value)) return [value]

  return Object.values(value).flatMap(item => collectRoomRecords(item, depth + 1))
}

function looksLikeRoom(value: Record<string, unknown>): boolean {
  const keys = Object.keys(value).map(key => key.toLowerCase())
  return keys.some(key =>
    key.includes("roomtype") ||
    key.includes("room_type") ||
    key.includes("rateplan") ||
    key.includes("available_room") ||
    key.includes("room_name")
  )
}

function getString(record: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = getCaseInsensitiveValue(record, key)
    if (typeof value === "string" && value.trim()) return value.trim()
    if (typeof value === "number") return String(value)
  }
  return ""
}

function getNumber(record: Record<string, unknown>, keys: string[]): number | null {
  for (const key of keys) {
    const value = getCaseInsensitiveValue(record, key)
    if (typeof value === "number" && Number.isFinite(value)) return value
    if (typeof value === "string") {
      const parsed = Number(value.replace(/[^\d.-]/g, ""))
      if (Number.isFinite(parsed)) return parsed
    }
  }
  return null
}

function getNumberFromRecords(records: Array<Record<string, unknown> | null>, keys: string[]): number | null {
  for (const record of records) {
    if (!record) continue
    const value = getNumber(record, keys)
    if (value !== null) return value
  }
  return null
}

function getBoolean(record: Record<string, unknown>, keys: string[]): boolean {
  for (const key of keys) {
    const value = getCaseInsensitiveValue(record, key)
    if (typeof value === "boolean") return value
    if (typeof value === "string") {
      const normalized = value.toLowerCase()
      if (["1", "true", "yes", "y"].includes(normalized)) return true
      if (["0", "false", "no", "n"].includes(normalized)) return false
    }
    if (typeof value === "number") return value === 1
  }
  return false
}

function getCaseInsensitiveValue(record: Record<string, unknown>, key: string): unknown {
  const matchingKey = Object.keys(record).find(item => item.toLowerCase() === key.toLowerCase())
  return matchingKey ? record[matchingKey] : undefined
}

function getRecord(record: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = getCaseInsensitiveValue(record, key)
  return isRecord(value) ? value : null
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

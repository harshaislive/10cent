'use client'

import React from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, XCircle } from 'lucide-react'

type AvailabilityState = 'loading' | 'available' | 'booked'

interface ICalendarDay {
  date: string
  day: string
  isCurrentMonth: boolean
  state: AvailabilityState
}

interface IAvailableRoom {
  roomTypeId?: string
  ratePlanId?: string
  rateTypeId?: string
  name: string
  roomTypeName?: string
  availableRooms: number
  currency: string
  priceInclusiveTax: number | null
  totalPriceInclusiveTax: number | null
  maxAdults: number | null
  maxChildren: number | null
}

interface IAvailabilityQuote {
  available: boolean
  currency: string
  lowestRateInclusiveTax: number | null
  lowestTotalInclusiveTax: number | null
  rooms: IAvailableRoom[]
}

interface ITrialStayRequestFormProps {
  locationName: string
  locationSlug: string
  onBack: () => void
}

const MONTH_GRID_DAYS = 42
const TRIAL_NIGHTS = 2
const MIN_ADVANCE_DAYS = 2

const formatDateValue = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildMonthDays = (monthDate: Date): ICalendarDay[] => {
  const firstOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1)
  const gridStart = new Date(firstOfMonth)
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay())

  return Array.from({ length: MONTH_GRID_DAYS }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)

    return {
      date: formatDateValue(date),
      day: date.getDate().toString(),
      isCurrentMonth: date.getMonth() === monthDate.getMonth(),
      state: 'loading',
    }
  })
}

const addDays = (dateValue: string, days: number) => {
  const [year, month, day] = dateValue.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().split('T')[0]
}

const todayValue = () => formatDateValue(new Date())

const isBeforeFirstBookableDate = (dateValue: string) => dateValue < addDays(todayValue(), MIN_ADVANCE_DAYS)

const getInitialCalendarMonth = () => {
  const firstBookableValue = addDays(todayValue(), MIN_ADVANCE_DAYS)
  const [year, month, day] = firstBookableValue.split('-').map(Number)
  const firstBookableDate = new Date(year, month - 1, day)

  if (day >= 25) {
    return new Date(year, month, 1)
  }

  return firstBookableDate
}

const formatCurrency = (amount: number | null | undefined, currency = 'INR') => {
  if (typeof amount !== 'number') return 'Rate pending'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getRoomKey = (room: IAvailableRoom) =>
  `${room.roomTypeId || room.name}-${room.ratePlanId || room.totalPriceInclusiveTax || 'rate'}`

export default function TrialStayRequestForm({ locationName, locationSlug, onBack }: ITrialStayRequestFormProps) {
  const [step, setStep] = React.useState<1 | 2 | 3 | 4>(1)
  const [calendarMonth, setCalendarMonth] = React.useState(getInitialCalendarMonth)
  const [days, setDays] = React.useState<ICalendarDay[]>([])
  const [usesFallbackAvailability, setUsesFallbackAvailability] = React.useState(false)
  const [checkInDate, setCheckInDate] = React.useState('')
  const [checkOutDate, setCheckOutDate] = React.useState('')
  const [adults, setAdults] = React.useState(2)
  const [children, setChildren] = React.useState(0)
  const [selectedAvailability, setSelectedAvailability] = React.useState<IAvailabilityQuote | null>(null)
  const [selectedRoomKey, setSelectedRoomKey] = React.useState('')
  const [isQuoteLoading, setIsQuoteLoading] = React.useState(false)
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState('')
  const [requestId, setRequestId] = React.useState('')

  const nights = checkInDate && checkOutDate
    ? Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / 86400000))
    : 1
  const availableRooms = selectedAvailability?.rooms.filter(room => room.availableRooms > 0) ?? []
  const selectedRoom = availableRooms.find(room => getRoomKey(room) === selectedRoomKey) ?? availableRooms[0] ?? null
  const estimatedCost = selectedRoom?.totalPriceInclusiveTax ?? selectedAvailability?.lowestTotalInclusiveTax ?? null
  const checkInLabel = checkInDate
    ? new Date(checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'Select a date'
  const checkOutLabel = checkOutDate
    ? new Date(checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    : 'Select checkout'
  const hasDateRange = Boolean(checkInDate && checkOutDate)

  React.useEffect(() => {
    setCalendarMonth(getInitialCalendarMonth())
  }, [])

  const selectDate = (date: string) => {
    if (!checkInDate || checkOutDate || new Date(date) <= new Date(checkInDate)) {
      setCheckInDate(date)
      setCheckOutDate('')
      return
    }

    setCheckOutDate(date)
  }

  const isWithinRange = (date: string) =>
    Boolean(checkInDate && checkOutDate && new Date(date) > new Date(checkInDate) && new Date(date) < new Date(checkOutDate))

  React.useEffect(() => {
    let cancelled = false

    if (!checkInDate || !checkOutDate) {
      setSelectedAvailability(null)
      setSelectedRoomKey('')
      setIsQuoteLoading(false)
      return
    }

    setIsQuoteLoading(true)

    fetch(`/api/availability/check?startDate=${checkInDate}&checkOutDate=${checkOutDate}&adults=${adults}&children=${children}`)
      .then(async response => {
        if (!response.ok) throw new Error('Availability unavailable')
        const data: unknown = await response.json()
        if (
          typeof data === 'object' &&
          data !== null &&
          'data' in data &&
          typeof (data as { data?: unknown }).data === 'object'
        ) {
          return (data as { data: IAvailabilityQuote }).data
        }
        throw new Error('Availability unavailable')
      })
      .then(availability => {
        if (!cancelled) {
          setSelectedAvailability(availability)
          setSelectedRoomKey('')
        }
      })
      .catch(() => {
        if (!cancelled) setSelectedAvailability(null)
      })
      .finally(() => {
        if (!cancelled) setIsQuoteLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [adults, checkInDate, checkOutDate, children])

  React.useEffect(() => {
    let cancelled = false
    const initialDays = buildMonthDays(calendarMonth)
    setDays(initialDays)
    setUsesFallbackAvailability(false)

    Promise.all(
      initialDays.map(async day => {
        if (isBeforeFirstBookableDate(day.date)) return { date: day.date, state: 'booked' as AvailabilityState, fallback: false }

        try {
          const response = await fetch(`/api/availability/check?startDate=${day.date}&durationNights=${TRIAL_NIGHTS}&adults=${adults}&children=${children}`)
          if (!response.ok) throw new Error('Availability unavailable')

          const data: unknown = await response.json()
          const available =
            typeof data === 'object' &&
            data !== null &&
            'data' in data &&
            typeof (data as { data?: { available?: unknown } }).data?.available === 'boolean'
              ? (data as { data: { available: boolean } }).data.available
              : null

          if (available === null) throw new Error('Availability unavailable')

          return { date: day.date, state: available ? 'available' as AvailabilityState : 'booked' as AvailabilityState, fallback: false }
        } catch {
          return { date: day.date, state: 'booked' as AvailabilityState, fallback: true }
        }
      })
    ).then(results => {
      if (cancelled) return

      const currentMonthResults = results.filter(result => {
        const matchingDay = initialDays.find(day => day.date === result.date)
        return matchingDay?.isCurrentMonth
      })

      const liveCheckCount = currentMonthResults.filter(result => !isBeforeFirstBookableDate(result.date)).length
      const fallbackCount = currentMonthResults.filter(result => result.fallback).length
      setUsesFallbackAvailability(liveCheckCount > 0 && fallbackCount === liveCheckCount)
      setDays(currentDays =>
        currentDays.map(day => {
          const result = results.find(item => item.date === day.date)
          return result ? { ...day, state: result.state } : day
        })
      )
    })

    return () => {
      cancelled = true
    }
  }, [adults, calendarMonth, children])

  const submitRequest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/trial-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          location: locationName,
          locationSlug,
          preferredDate: checkInDate,
          checkInDate,
          checkOutDate,
          durationNights: nights,
          adults,
          children,
          guestCount: adults + children,
          estimatedCost: estimatedCost ?? undefined,
          roomTypeId: selectedRoom?.roomTypeId,
          ratePlanId: selectedRoom?.ratePlanId,
          rateTypeId: selectedRoom?.rateTypeId,
        }),
      })

      const data: unknown = await response.json()
      if (!response.ok) {
        const message =
          typeof data === 'object' && data !== null && 'error' in data
            ? String((data as { error: unknown }).error)
            : 'Failed to submit request. Please try again.'
        throw new Error(message)
      }

      const submittedRequestId =
        typeof data === 'object' && data !== null && 'requestId' in data
          ? String((data as { requestId: unknown }).requestId)
          : ''

      setRequestId(submittedRequestId)
      setStep(4)
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Failed to submit request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex h-full flex-col bg-[#f7f4ee] text-[#342e29]">
      <div className="flex items-center justify-between border-b border-[#342e29]/10 px-5 py-4 pr-24">
        <button
          type="button"
          onClick={step === 1 ? onBack : () => setStep(step === 4 ? 3 : step === 3 ? 2 : 1)}
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-[#342e29]/55 transition-colors hover:text-[#86312b]"
        >
          <ArrowLeft className="h-3 w-3" />
          {step === 1 ? 'Back' : 'Previous'}
        </button>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(item => (
            <span
              key={item}
              className={`h-1.5 w-8 rounded-full ${item <= step ? 'bg-[#86312b]' : 'bg-[#342e29]/15'}`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {step === 1 && (
          <div className="grid min-h-full grid-cols-1 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="border-b border-[#342e29]/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#86312b]">Step 1 · Select stay dates</p>
              <h3 className="mb-5 font-arizona text-3xl font-light">Choose your stay dates</h3>

              <div className="mb-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const previous = new Date(calendarMonth)
                    previous.setMonth(previous.getMonth() - 1)
                    setCalendarMonth(previous)
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#342e29]/50 hover:text-[#86312b]"
                >
                  Earlier
                </button>
                <span className="font-arizona text-2xl">
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const next = new Date(calendarMonth)
                    next.setMonth(next.getMonth() + 1)
                    setCalendarMonth(next)
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#342e29]/50 hover:text-[#86312b]"
                >
                  Later
                </button>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-widest text-[#342e29]/40">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day}>{day}</span>)}
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {days.map(day => {
                  const isSelected = checkInDate === day.date || checkOutDate === day.date
                  const isAvailable = day.state === 'available'
                  const isRangeDate = isWithinRange(day.date)
                  return (
                    <button
                      key={day.date}
                      type="button"
                      aria-label={`${day.date} ${day.state}`}
                      disabled={!isAvailable}
                      onClick={() => selectDate(day.date)}
                      className={`relative flex aspect-square items-center justify-center rounded-full border text-sm transition-colors ${
                        isSelected
                          ? 'border-[#86312b] bg-[#86312b] text-white'
                          : isRangeDate
                            ? 'border-[#86312b]/10 bg-[#86312b]/10 text-[#342e29]'
                          : isAvailable
                            ? 'border-emerald-600/35 bg-emerald-100 text-emerald-900 hover:border-emerald-700'
                            : day.state === 'loading'
                              ? 'border-[#342e29]/10 text-[#342e29]/25'
                              : 'border-transparent text-[#342e29]/30'
                      } ${day.isCurrentMonth ? '' : 'opacity-25'}`}
                    >
                      {day.state === 'loading' ? <Loader2 className="h-3 w-3 animate-spin" /> : day.day}
                      {day.state === 'booked' && day.isCurrentMonth && (
                        <XCircle className="absolute bottom-1 right-1 h-3 w-3 text-[#86312b]/45" />
                      )}
                    </button>
                  )
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#342e29]/55">
                <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-100 ring-1 ring-emerald-600/35" /> Requestable</span>
                <span className="inline-flex items-center gap-2"><XCircle className="h-3 w-3" /> Blocked</span>
              </div>
            </div>

            <aside className="flex flex-col justify-between p-5 lg:p-7">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#86312b]">Blyton Bungalow</p>
                <h4 className="font-arizona text-4xl font-light">Trial stay</h4>
              <p className="mt-4 text-sm leading-relaxed text-[#342e29]/65">
                  Pick your arrival and departure dates for Blyton Bungalow. Your nights will be calculated automatically from the range you choose, with a two-night trial stay as the default.
                </p>

                {usesFallbackAvailability && (
                  <p className="mt-4 border border-[#86312b]/15 bg-[#86312b]/5 p-3 text-xs leading-relaxed text-[#342e29]/65">
                    Live eZee availability is not responding right now, so dates are temporarily blocked until inventory can be checked.
                  </p>
                )}

                <div className="mt-6 space-y-3 border-t border-[#342e29]/10 pt-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#342e29]/50">Check-in</span>
                    <span className="text-right font-medium">{checkInLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#342e29]/50">Check-out</span>
                    <span className="text-right font-medium">{checkOutLabel}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#342e29]/50">Nights</span>
                    <span className="font-medium">{hasDateRange ? nights : '-'}</span>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  {[
                    { label: 'Adults', value: adults, setValue: setAdults, min: 1, max: 8 },
                    { label: 'Children', value: children, setValue: setChildren, min: 0, max: 8 },
                  ].map(item => (
                    <div key={item.label} className="border border-[#342e29]/10 bg-white/35 p-3">
                      <span className="block text-[10px] uppercase tracking-widest text-[#342e29]/45">{item.label}</span>
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <button type="button" onClick={() => item.setValue(Math.max(item.min, item.value - 1))} className="h-7 w-7 border border-[#342e29]/15">-</button>
                        <span className="font-arizona text-2xl">{item.value}</span>
                        <button type="button" onClick={() => item.setValue(Math.min(item.max, item.value + 1))} className="h-7 w-7 border border-[#342e29]/15">+</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                disabled={!hasDateRange}
                onClick={() => setStep(2)}
                className="mt-8 inline-flex w-full items-center justify-center gap-3 bg-[#342e29] px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#fdfbf7] transition-colors hover:bg-[#86312b] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Check eZee rooms
                <ArrowRight className="h-4 w-4" />
              </button>
            </aside>
          </div>
        )}

        {step === 2 && (
          <div className="grid min-h-full grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="border-b border-[#342e29]/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#86312b]">Step 2 · eZee rooms</p>
              <h3 className="font-arizona text-4xl font-light">Choose a room type</h3>
              <p className="mt-4 text-sm text-[#342e29]/60">
                {checkInLabel} to {checkOutLabel} · {nights} {nights === 1 ? 'night' : 'nights'} · {adults} adults{children ? ` · ${children} children` : ''}
              </p>
              <div className="mt-6 border border-[#342e29]/10 bg-white/45 p-5">
                <span className="text-[10px] uppercase tracking-widest text-[#86312b]">Live eZee total</span>
                <div className="mt-2 flex min-h-12 items-center gap-3 font-arizona text-4xl">
                  {isQuoteLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                  <span>{isQuoteLoading ? 'Checking' : formatCurrency(estimatedCost, selectedAvailability?.currency)}</span>
                </div>
                {selectedRoom && (
                  <p className="mt-2 text-sm font-medium text-[#342e29]">
                    Selected: {selectedRoom.name}
                  </p>
                )}
                <p className="mt-2 text-xs leading-relaxed text-[#342e29]/55">
                  Rate and inventory are pulled from eZee for this exact stay window. The next step only collects guest details.
                </p>
              </div>
            </aside>

            <div className="p-5 lg:p-7">
              {isQuoteLoading && (
                <div className="flex h-full min-h-80 items-center justify-center gap-3 text-sm text-[#342e29]/55">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking eZee room inventory
                </div>
              )}

              {!isQuoteLoading && availableRooms.length === 0 && (
                <div className="border border-[#86312b]/15 bg-[#86312b]/5 p-5 text-sm leading-relaxed text-[#342e29]/65">
                  eZee is not showing rooms for this stay window. Please go back and choose another date range.
                </div>
              )}

              {!isQuoteLoading && availableRooms.length > 0 && (
                <div className="space-y-3">
                  {availableRooms.map(room => {
                    const roomKey = getRoomKey(room)
                    const isSelected = getRoomKey(selectedRoom || room) === roomKey
                    return (
                      <button
                        key={roomKey}
                        type="button"
                        onClick={() => setSelectedRoomKey(roomKey)}
                        className={`w-full border p-5 text-left transition-colors ${isSelected ? 'border-[#86312b] bg-[#86312b]/5' : 'border-[#342e29]/10 bg-white/35 hover:border-[#86312b]/40'}`}
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-[10px] uppercase tracking-[0.2em] text-[#342e29]/45">{room.roomTypeName || 'Blyton room'}</p>
                              {isSelected && (
                                <span className="border border-[#86312b]/25 bg-[#86312b]/10 px-2 py-1 text-[9px] uppercase tracking-widest text-[#86312b]">
                                  Selected
                                </span>
                              )}
                            </div>
                            <h4 className="mt-2 font-arizona text-3xl font-light">{room.name}</h4>
                            <p className="mt-2 text-xs text-[#342e29]/55">
                              {room.availableRooms} available
                              {room.maxAdults ? ` · up to ${room.maxAdults} adults` : ''}
                              {room.maxChildren ? ` · ${room.maxChildren} children` : ''}
                            </p>
                          </div>
                          <div className="md:text-right">
                            <p className="font-arizona text-3xl">{formatCurrency(room.totalPriceInclusiveTax, room.currency)}</p>
                            <p className="mt-1 text-xs text-[#342e29]/50">
                              {room.priceInclusiveTax ? `${formatCurrency(room.priceInclusiveTax, room.currency)} avg/night` : 'Inclusive total from eZee'}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    disabled={!selectedRoom}
                    onClick={() => setStep(3)}
                    className="mt-5 flex w-full items-center justify-center gap-3 bg-[#342e29] px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#fdfbf7] transition-colors hover:bg-[#86312b] disabled:opacity-50"
                  >
                    Continue with selected room
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={submitRequest} className="grid min-h-full grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="border-b border-[#342e29]/10 p-5 lg:border-b-0 lg:border-r lg:p-7">
              <p className="mb-2 text-[10px] uppercase tracking-[0.25em] text-[#86312b]">Step 3 · Guest details</p>
              <h3 className="font-arizona text-4xl font-light">Your request</h3>
              <p className="mt-4 text-sm text-[#342e29]/60">
                {checkInLabel} to {checkOutLabel} · {nights} {nights === 1 ? 'night' : 'nights'}
              </p>

              {selectedRoom && (
                <div className="mt-6 border border-[#342e29]/10 bg-white/45 p-5">
                  <span className="text-[10px] uppercase tracking-widest text-[#86312b]">Selected eZee room</span>
                  <h4 className="mt-3 font-arizona text-3xl font-light">{selectedRoom.name}</h4>
                  <p className="mt-2 text-sm text-[#342e29]/60">{formatCurrency(selectedRoom.totalPriceInclusiveTax, selectedRoom.currency)} total inclusive</p>
                  <p className="mt-2 text-xs text-[#342e29]/50">{selectedRoom.availableRooms} rooms available at last check</p>
                </div>
              )}
            </aside>

            <div className="p-5 lg:p-7">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-[#342e29]/50">Name</span>
                  <input required value={name} onChange={event => setName(event.target.value)} className="mt-1 w-full border-b border-[#342e29]/20 bg-transparent py-3 text-base outline-none focus:border-[#86312b]" placeholder="Your full name" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-[#342e29]/50">Email</span>
                  <input required type="email" value={email} onChange={event => setEmail(event.target.value)} className="mt-1 w-full border-b border-[#342e29]/20 bg-transparent py-3 text-base outline-none focus:border-[#86312b]" placeholder="you@example.com" />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-widest text-[#342e29]/50">Phone number</span>
                  <input required type="tel" value={phone} onChange={event => setPhone(event.target.value)} className="mt-1 w-full border-b border-[#342e29]/20 bg-transparent py-3 text-base outline-none focus:border-[#86312b]" placeholder="+91 XXXXX XXXXX" />
                </label>
              </div>

              {error && <p className="mt-5 text-sm text-[#86312b]">{error}</p>}

              <button type="submit" disabled={isSubmitting || !selectedRoom} className="mt-7 flex w-full items-center justify-center gap-3 bg-[#342e29] px-6 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#fdfbf7] transition-colors hover:bg-[#86312b] disabled:opacity-60">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>Submit stay request</span>}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div className="flex min-h-full flex-col justify-center p-8 text-center">
            <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full border border-[#86312b] text-[#86312b]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.25em] text-[#86312b]">Request received</p>
            <h3 className="mb-5 font-arizona text-4xl font-light">Thank you.</h3>
            <p className="mx-auto max-w-md text-base leading-relaxed text-[#342e29]/70">
              Thanks for requesting a stay with Blyton Bungalow. One of our team members will reach out to you with the next steps shortly.
            </p>
            {requestId && <p className="mt-6 text-xs uppercase tracking-widest text-[#342e29]/45">Reference {requestId}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

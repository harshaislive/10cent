"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, CalendarDays, CheckCircle2, Clock, CreditCard, Home, MapPin, Users } from "lucide-react"

interface IConfirmationResponse {
  success: boolean
  request: {
    requestId: string
    location: {
      name: string
      slug: string
    }
    stay: {
      checkInDate: string | null
      checkOutDate: string | null
      durationNights: number | null
      roomCount: number
      adults: number | null
      children: number | null
      guestCount: number | null
    }
    room: {
      roomTypeId: string | null
      roomTypeName: string | null
      ratePlanId: string | null
      ratePlanName: string | null
      roomSelections: Array<{
        roomIndex: number
        adults: number
        children: number
        amount: number | null
        roomTypeName: string
        ratePlanName: string
      }>
    }
    payment: {
      amount: number | null
      currency: string
      status: string
      paidAt: string | null
      checkoutExpiresAt: string | null
      experiencesCheckoutId: string | null
    }
    booking: {
      requestStatus: string
      ezeeStatus: string
      ezeeReservationNo: string | null
      ezeeInventoryMode: string | null
      ezeePaymentStatus: string
      ezeePaymentPostedAt: string | null
      ezeePaymentError: string | null
    }
    customer: {
      name: string
      email: string
      phone: string
    }
  }
}

type LoadState = "loading" | "loaded" | "error"

export default function TrialBookingConfirmationClient() {
  const searchParams = useSearchParams()
  const requestId = searchParams.get("requestId") || ""
  const redirectPaymentStatus = searchParams.get("paymentStatus") || ""
  const redirectStatus = searchParams.get("status") || ""
  const [loadState, setLoadState] = React.useState<LoadState>("loading")
  const [request, setRequest] = React.useState<IConfirmationResponse["request"] | null>(null)
  const [error, setError] = React.useState("")

  React.useEffect(() => {
    let cancelled = false

    async function loadConfirmation() {
      if (!requestId) {
        setError("Booking reference is missing from this confirmation link.")
        setLoadState("error")
        return
      }

      try {
        const response = await fetch(`/api/trial-booking/confirmation?requestId=${encodeURIComponent(requestId)}`, {
          cache: "no-store",
        })
        const data: unknown = await response.json()

        if (!response.ok) {
          const message =
            typeof data === "object" && data !== null && "error" in data
              ? String((data as { error: unknown }).error)
              : "Unable to load your booking confirmation."
          throw new Error(message)
        }

        if (!cancelled) {
          setRequest((data as IConfirmationResponse).request)
          setLoadState("loaded")
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load your booking confirmation.")
          setLoadState("error")
        }
      }
    }

    loadConfirmation()

    return () => {
      cancelled = true
    }
  }, [requestId])

  const status = request ? getDisplayStatus(request, redirectPaymentStatus) : null

  return (
    <main className="min-h-screen bg-[#f7f4ee] text-[#342e29]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-8 md:px-10 md:py-12">
        <header className="mb-10 flex items-center justify-between gap-6 border-b border-[#342e29]/10 pb-6">
          <Link href="/" className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#342e29]/60 transition-colors hover:text-[#342e29]">
            <Home className="h-4 w-4" />
            10% Club
          </Link>
          {requestId && (
            <span className="text-right text-xs uppercase tracking-[0.18em] text-[#342e29]/50">
              Reference {requestId}
            </span>
          )}
        </header>

        {loadState === "loading" && (
          <section className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-5 h-12 w-12 rounded-full border border-[#86312b]/30 border-t-[#86312b] animate-spin" />
              <p className="text-sm uppercase tracking-[0.2em] text-[#342e29]/60">Loading your booking details</p>
            </div>
          </section>
        )}

        {loadState === "error" && (
          <section className="flex flex-1 items-center justify-center">
            <div className="max-w-xl text-center">
              <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[#86312b]">Confirmation unavailable</p>
              <h1 className="mb-5 text-4xl font-light md:text-6xl">We could not find this request.</h1>
              <p className="mb-8 text-base leading-7 text-[#342e29]/70">{error}</p>
              <Link href="/#trial" className="inline-flex items-center justify-center gap-3 bg-[#342e29] px-7 py-4 text-xs font-medium uppercase tracking-[0.2em] text-[#fdfbf7] transition-colors hover:bg-[#86312b]">
                Return to trial booking
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {loadState === "loaded" && request && status && (
          <section className="grid flex-1 gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <aside className="flex flex-col justify-between border-r-0 border-[#342e29]/10 pb-8 lg:border-r lg:pr-10">
              <div>
                <p className="mb-5 text-xs uppercase tracking-[0.22em] text-[#86312b]">Trial stay</p>
                <h1 className="mb-6 text-5xl font-light leading-[0.95] md:text-7xl">
                  {status.heading}
                </h1>
                <p className="max-w-xl text-lg leading-8 text-[#342e29]/70">
                  {status.message}
                </p>
              </div>

              <div className="mt-10 space-y-4">
                <StatusLine label="Payment" value={formatStatus(request.payment.status)} tone={status.paymentTone} />
                <StatusLine label="Booking" value={formatStatus(request.booking.ezeeStatus)} tone={status.bookingTone} />
                <StatusLine
                  label="Payment record"
                  value={formatStatus(request.booking.ezeePaymentStatus)}
                  tone={getEzeePaymentTone(request.booking.ezeePaymentStatus)}
                />
                {request.booking.ezeeReservationNo && (
                  <StatusLine label="Reservation" value={request.booking.ezeeReservationNo} tone="good" />
                )}
                {redirectStatus && (
                  <p className="pt-4 text-xs leading-5 text-[#342e29]/45">
                    Redirect status received from experiences: {redirectStatus}. Final details above are loaded from 10cent records.
                  </p>
                )}
              </div>
            </aside>

            <div className="space-y-8">
              <DetailBand
                title="Stay Details"
                icon={<MapPin className="h-5 w-5" />}
                rows={[
                  ["Location", request.location.name || "Blyton Bungalow"],
                  ["Check-in", formatDate(request.stay.checkInDate)],
                  ["Check-out", formatDate(request.stay.checkOutDate)],
                  ["Duration", `${request.stay.durationNights || 0} ${request.stay.durationNights === 1 ? "night" : "nights"}`],
                  ["Rooms", `${request.stay.roomCount || 1} ${request.stay.roomCount === 1 ? "room" : "rooms"}`],
                ]}
              />

              <DetailBand
                title="Room And Guests"
                icon={<Users className="h-5 w-5" />}
                rows={request.room.roomSelections.length > 0 ? [
                  ...request.room.roomSelections.map(selection => [
                    `Room ${selection.roomIndex}`,
                    `${selection.roomTypeName} · ${selection.adults} adult${selection.adults === 1 ? "" : "s"}${selection.children ? ` · ${selection.children} child${selection.children === 1 ? "" : "ren"}` : ""} · ${formatCurrency(selection.amount, request.payment.currency)}`,
                  ] as [string, string]),
                  ["Adults", String(request.stay.adults ?? 0)],
                  ["Children", String(request.stay.children ?? 0)],
                  ["Guest count", String(request.stay.guestCount ?? 0)],
                ] : [
                  ["Room", request.room.roomTypeName || "Selected room"],
                  ["Rate plan", request.room.ratePlanName || "-"],
                  ["Adults", String(request.stay.adults ?? 0)],
                  ["Children", String(request.stay.children ?? 0)],
                  ["Guest count", String(request.stay.guestCount ?? 0)],
                ]}
              />

              <DetailBand
                title="Payment"
                icon={<CreditCard className="h-5 w-5" />}
                rows={[
                  ["Amount", formatCurrency(request.payment.amount, request.payment.currency)],
                  ["Payment status", formatStatus(request.payment.status)],
                  ["Paid at", formatDateTime(request.payment.paidAt)],
                  ["Experiences checkout", request.payment.experiencesCheckoutId || "-"],
                  ["Payment record", formatStatus(request.booking.ezeePaymentStatus)],
                  ["Recorded at", formatDateTime(request.booking.ezeePaymentPostedAt)],
                  ["Payment record note", request.booking.ezeePaymentError || "-"],
                ]}
              />

              <DetailBand
                title="Guest"
                icon={<CalendarDays className="h-5 w-5" />}
                rows={[
                  ["Name", request.customer.name],
                  ["Email", request.customer.email],
                  ["Phone", request.customer.phone],
                ]}
              />
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function DetailBand({ title, icon, rows }: { title: string; icon: React.ReactNode; rows: Array<[string, string]> }) {
  return (
    <section className="border-t border-[#342e29]/10 pt-6">
      <div className="mb-5 flex items-center gap-3 text-[#86312b]">
        {icon}
        <h2 className="text-xs uppercase tracking-[0.22em]">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="border-b border-[#342e29]/10 pb-4">
            <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#342e29]/45">{label}</p>
            <p className="break-words text-lg leading-7">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function StatusLine({ label, value, tone }: { label: string; value: string; tone: "good" | "pending" | "failed" }) {
  const Icon = tone === "good" ? CheckCircle2 : Clock
  const color = tone === "failed" ? "text-[#86312b]" : tone === "good" ? "text-[#216b4f]" : "text-[#8a6d3b]"

  return (
    <div className="flex items-center justify-between gap-4 border-t border-[#342e29]/10 pt-4">
      <span className="text-xs uppercase tracking-[0.18em] text-[#342e29]/45">{label}</span>
      <span className={`inline-flex items-center gap-2 text-sm ${color}`}>
        <Icon className="h-4 w-4" />
        {value}
      </span>
    </div>
  )
}

function getDisplayStatus(request: IConfirmationResponse["request"], redirectPaymentStatus: string) {
  const paymentStatus = request.payment.status
  const ezeeStatus = request.booking.ezeeStatus

  if (paymentStatus === "PAID" && ezeeStatus === "CREATED") {
    return {
      heading: "Booking confirmed.",
      message: "Your payment is received and your booking has been created. Our team will share final arrival details shortly.",
      paymentTone: "good" as const,
      bookingTone: "good" as const,
    }
  }

  if (paymentStatus === "PAID") {
    return {
      heading: "Payment received.",
      message: "Your payment has been recorded. We are completing the booking confirmation now, and the team will follow up once it is locked.",
      paymentTone: "good" as const,
      bookingTone: ezeeStatus === "FAILED" ? "failed" as const : "pending" as const,
    }
  }

  if (redirectPaymentStatus === "completed") {
    return {
      heading: "Payment is being verified.",
      message: "Experiences redirected you after payment. We are waiting for the signed payment confirmation before updating the booking record.",
      paymentTone: "pending" as const,
      bookingTone: "pending" as const,
    }
  }

  if (paymentStatus === "FAILED" || paymentStatus === "EXPIRED") {
    return {
      heading: "Payment not completed.",
      message: "The payment for this trial request has not completed. Please contact the team if you need a fresh payment link.",
      paymentTone: "failed" as const,
      bookingTone: "pending" as const,
    }
  }

  return {
    heading: "Request received.",
    message: "Your trial request is saved. If payment is still in progress, this page will reflect the final status once the signed confirmation reaches 10cent.",
    paymentTone: "pending" as const,
    bookingTone: "pending" as const,
  }
}

function getEzeePaymentTone(status: string): "good" | "pending" | "failed" {
  if (status === "POSTED") return "good"
  if (status === "FAILED") return "failed"
  return "pending"
}

function formatStatus(status: string | null): string {
  if (!status) return "-"
  return status
    .toLowerCase()
    .split("_")
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function formatDate(value: string | null): string {
  if (!value) return "-"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00+05:30`))
}

function formatDateTime(value: string | null): string {
  if (!value) return "-"
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value))
}

function formatCurrency(amount: number | null, currency: string): string {
  if (typeof amount !== "number") return "-"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

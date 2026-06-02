import { Suspense } from "react"
import TrialBookingConfirmationClient from "./TrialBookingConfirmationClient"

export default function TrialBookingConfirmationPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-[#f7f4ee] text-[#342e29] flex items-center justify-center px-6">
        <p className="text-sm uppercase tracking-[0.2em] text-[#342e29]/60">Loading booking confirmation</p>
      </main>
    }>
      <TrialBookingConfirmationClient />
    </Suspense>
  )
}

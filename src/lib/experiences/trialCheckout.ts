export interface ICreateTrialCheckoutInput {
  externalRequestId: string
  locationName: string
  locationSlug: string
  checkInDate: string
  checkOutDate: string
  durationNights: number
  adults: number
  children: number
  guestCount: number
  roomTypeId?: string
  roomTypeName?: string
  ratePlanId?: string
  ratePlanName?: string
  amount: number
  currency: string
  customer: {
    name: string
    email: string
    phone: string
  }
  payload: Record<string, unknown>
  expiresAt: string
}

export interface ICreateTrialCheckoutResult {
  success: boolean
  requestId?: string | null
  checkoutUrl?: string
  expiresAt?: string | null
  error?: string
}

export async function createExperiencesTrialCheckout(
  input: ICreateTrialCheckoutInput
): Promise<ICreateTrialCheckoutResult> {
  const checkoutCreateUrl = process.env.EXPERIENCES_CHECKOUT_CREATE_URL
  const apiKey = process.env.EXPERIENCES_API_KEY

  if (!checkoutCreateUrl || !apiKey) {
    throw new Error("Experiences checkout is not configured")
  }

  const response = await fetch(checkoutCreateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify(input),
    cache: "no-store",
  })

  const data = await response.json().catch(() => null) as ICreateTrialCheckoutResult | null

  if (!response.ok) {
    throw new Error(data?.error || `Experiences checkout returned ${response.status}`)
  }

  if (!data?.success || !data.checkoutUrl) {
    throw new Error(data?.error || "Experiences checkout did not return a checkout URL")
  }

  return data
}

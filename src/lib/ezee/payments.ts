import { getEzeeConfig, postEzeeJson } from "./client"

export interface IPostEzeePaymentInput {
  reservationNo: string
  amount: number
  paymentReference?: string | null
}

export interface IPostEzeePaymentResult {
  posted: boolean
  paymentId: string
  currencyId: string
  raw: unknown
}

const DEFAULT_UPI_PAYMENT_ID = "4547700000000000204"
const DEFAULT_INR_CURRENCY_ID = "4547700000000000001"

export function isEzeePaymentPostingEnabled(): boolean {
  return process.env.EZEE_POST_PAYMENT_TO_PMS === "true"
}

export function getEzeePaymentPostingConfig(): { paymentId: string; currencyId: string } {
  return {
    paymentId: process.env.EZEE_PAYMENT_ID || DEFAULT_UPI_PAYMENT_ID,
    currencyId: process.env.EZEE_CURRENCY_ID || DEFAULT_INR_CURRENCY_ID,
  }
}

export async function postEzeePayment(input: IPostEzeePaymentInput): Promise<IPostEzeePaymentResult> {
  if (!input.reservationNo) {
    throw new Error("eZee reservation number is required to post payment")
  }

  if (!Number.isFinite(input.amount) || input.amount <= 0) {
    throw new Error("A positive payment amount is required to post payment to eZee")
  }

  const { hotelCode, authCode, userAgent } = getEzeeConfig()
  const { paymentId, currencyId } = getEzeePaymentPostingConfig()
  const raw = await postEzeeJson("/index.php/page/service.kioskconnectivity", {
    RES_Request: {
      Request_Type: "AddPayment",
      Authentication: {
        HotelCode: hotelCode,
        AuthCode: authCode,
      },
      Reservation: [
        {
          BookingId: input.reservationNo,
          PaymentId: paymentId,
          CurrencyId: currencyId,
          Payment: formatEzeePaymentAmount(input.amount),
          Remark: input.paymentReference || "",
        },
      ],
    },
  }, userAgent)

  if (!isAddPaymentSuccess(raw)) {
    throw new Error(`eZee AddPayment error: ${JSON.stringify(raw)}`)
  }

  return {
    posted: true,
    paymentId,
    currencyId,
    raw,
  }
}

function formatEzeePaymentAmount(amount: number): string {
  return (Math.round(amount * 100) / 100).toFixed(2)
}

function isAddPaymentSuccess(raw: unknown): boolean {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return false
  }

  const record = raw as Record<string, unknown>
  const errors = record.Errors
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const errorRecord = errors as Record<string, unknown>
    return String(errorRecord.ErrorCode || "") === "0"
  }

  const success = record.Success
  return Boolean(success)
}

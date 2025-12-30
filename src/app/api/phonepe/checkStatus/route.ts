import { NextResponse } from "next/server"
import crypto from "crypto"
import axios from "axios"

export async function POST(req: Request) {
  // PhonePe sends a POST request to your redirect URL
  const formData = await req.formData()
  const transactionId = formData.get("transactionId") as string

  // Parse the query param "id" from the URL we set earlier
  const { searchParams } = new URL(req.url)
  const txnId = searchParams.get("id")

  if (!txnId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`
    )
  }

  const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
  const SALT_KEY = process.env.PHONEPE_SALT_KEY
  const SALT_INDEX = process.env.PHONEPE_SALT_INDEX
  const BASE_URL =
    process.env.NEXT_PUBLIC_PHONEPE_ENV === "PROD"
      ? process.env.PHONEPE_PROD_URL
      : process.env.PHONEPE_UAT_URL

  // Generate Checksum for Status Check API
  // Endpoint: /pg/v1/status/{merchantId}/{merchantTransactionId}
  const statusEndpoint = `/pg/v1/status/${MERCHANT_ID}/${txnId}`
  const stringToHash = statusEndpoint + SALT_KEY
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex")
  const checksum = sha256 + "###" + SALT_INDEX

  try {
    const response = await axios.get(`${BASE_URL}${statusEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
    })

    if (
      response.data.success &&
      response.data.code === "PAYMENT_SUCCESS"
    ) {
      // SUCCESS: Redirect with transaction details
      const paymentData = response.data.data
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?tid=${txnId}&amount=${paymentData.amount / 100}`
      )
    } else if (response.data.code === "PAYMENT_PENDING") {
      // PENDING: Redirect to pending page
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending?tid=${txnId}`
      )
    } else {
      // FAILURE
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?tid=${txnId}`
      )
    }
  } catch (error) {
    console.error("Status Check Error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`
    )
  }
}

// Also handle GET requests for direct URL access
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const txnId = searchParams.get("id")

  if (!txnId) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`
    )
  }

  const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
  const SALT_KEY = process.env.PHONEPE_SALT_KEY
  const SALT_INDEX = process.env.PHONEPE_SALT_INDEX
  const BASE_URL =
    process.env.NEXT_PUBLIC_PHONEPE_ENV === "PROD"
      ? process.env.PHONEPE_PROD_URL
      : process.env.PHONEPE_UAT_URL

  const statusEndpoint = `/pg/v1/status/${MERCHANT_ID}/${txnId}`
  const stringToHash = statusEndpoint + SALT_KEY
  const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex")
  const checksum = sha256 + "###" + SALT_INDEX

  try {
    const response = await axios.get(`${BASE_URL}${statusEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": MERCHANT_ID,
      },
    })

    if (
      response.data.success &&
      response.data.code === "PAYMENT_SUCCESS"
    ) {
      const paymentData = response.data.data
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success?tid=${txnId}&amount=${paymentData.amount / 100}`
      )
    } else if (response.data.code === "PAYMENT_PENDING") {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/pending?tid=${txnId}`
      )
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure?tid=${txnId}`
      )
    }
  } catch (error) {
    console.error("Status Check Error:", error)
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_BASE_URL}/payment/failure`
    )
  }
}

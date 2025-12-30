import { NextResponse } from "next/server"
import axios from "axios"

/**
 * Payment Proxy Route
 *
 * This route forwards payment requests to the experiences.beforest.co proxy
 * which is the authorized domain for PhonePe payments.
 *
 * Flow:
 * 1. 10percent.beforest.co receives payment request
 * 2. Forwards to experiences.beforest.co/api/payment-proxy/initiate
 * 3. Experiences proxy creates PhonePe order with authorized domain
 * 4. User pays, PhonePe redirects to experiences.beforest.co callback
 * 5. Experiences proxy redirects back to 10percent.beforest.co success/failure pages
 */
export async function POST(req: Request) {
  try {
    const { amount, mobileNumber, name, email, location } = await req.json()

    const PROXY_URL = process.env.PAYMENT_PROXY_URL || "https://experiences.beforest.co/api/payment-proxy/initiate"
    const API_KEY = process.env.PAYMENT_PROXY_API_KEY
    const REDIRECT_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://10percent.beforest.co"

    if (!API_KEY) {
      return NextResponse.json(
        { error: "Payment proxy not configured - missing API key" },
        { status: 500 }
      )
    }

    // Call the payment proxy on experiences.beforest.co
    const response = await axios.post(
      PROXY_URL,
      {
        amount,
        mobileNumber,
        name,
        email,
        location,
        redirectUrl: `${REDIRECT_URL}/payment/success`,
        failureUrl: `${REDIRECT_URL}/payment/failure`,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
          "X-Source-Domain": REDIRECT_URL,
        },
        timeout: 30000, // 30 second timeout
      }
    )

    // Return the proxy response to frontend
    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error("Payment Proxy Error:", error.response?.data || error.message)

    const errorMessage = error.response?.data?.error || error.message || "Payment initiation failed"
    const statusCode = error.response?.status || 500

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}

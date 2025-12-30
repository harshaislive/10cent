import { NextResponse } from "next/server"
import crypto from "crypto"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

export async function POST(req: Request) {
  try {
    const { amount, mobileNumber, name, email, location } = await req.json()

    const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
    const SALT_KEY = process.env.PHONEPE_SALT_KEY
    const SALT_INDEX = process.env.PHONEPE_SALT_INDEX
    const BASE_URL =
      process.env.NEXT_PUBLIC_PHONEPE_ENV === "PROD"
        ? process.env.PHONEPE_PROD_URL
        : process.env.PHONEPE_UAT_URL

    if (!MERCHANT_ID || !SALT_KEY || !SALT_INDEX || !BASE_URL) {
      return NextResponse.json(
        { error: "Payment gateway not configured properly" },
        { status: 500 }
      )
    }

    // 1. Define the Endpoint
    const apiEndpoint = "/pg/v1/pay"

    // 2. Generate a unique Transaction ID
    const merchantTransactionId = "MT" + Date.now() + uuidv4().slice(0, 4)

    // 3. Construct the Payload
    const data = {
      merchantId: MERCHANT_ID,
      merchantTransactionId: merchantTransactionId,
      merchantUserId: "MUID" + Date.now(),
      amount: amount * 100, // Amount in Paise (1 INR = 100 Paise)
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/checkStatus?id=${merchantTransactionId}`,
      redirectMode: "POST", // PhonePe will POST to the redirectUrl
      callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/phonepe/checkStatus?id=${merchantTransactionId}`,
      mobileNumber: mobileNumber || undefined,
      paymentInstrument: {
        type: "PAY_PAGE", // Standard Payment Gateway Page
      },
    }

    // 4. Encode Payload to Base64
    const bufferObj = Buffer.from(JSON.stringify(data), "utf8")
    const base64EncodedPayload = bufferObj.toString("base64")

    // 5. Calculate X-VERIFY Checksum
    // Formula: SHA256(Base64Payload + APIEndpoint + SaltKey) + "###" + SaltIndex
    const stringToHash = base64EncodedPayload + apiEndpoint + SALT_KEY
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex")
    const checksum = sha256 + "###" + SALT_INDEX

    // 6. Make the API Call to PhonePe
    const response = await axios.post(
      `${BASE_URL}${apiEndpoint}`,
      { request: base64EncodedPayload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      }
    )

    // 7. Return the Redirect URL to Frontend
    if (response.data.success) {
      // Store payment details in a way we can retrieve after callback
      // For now, we'll use the transaction ID to track
      return NextResponse.json({
        url: response.data.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId,
        amount: amount,
      })
    } else {
      return NextResponse.json(
        { error: "Payment initiation failed" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("PhonePe Error:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.message || "Payment initiation failed" },
      { status: 500 }
    )
  }
}

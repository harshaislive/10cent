# Payment Proxy Setup for experiences.beforest.co

## Overview

The `10percent.beforest.co` site needs to accept payments through PhonePe, but PhonePe only allows transactions from `experiences.beforest.co`. This document outlines the **Payment Proxy** architecture that enables smart routing between the two domains.

## Architecture

```
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────┐
│ 10percent.beforest.co   │      │ experiences.beforest.co │      │     PhonePe     │
│  (Your Site)            │      │  (Payment Proxy)        │      │  (Gateway)      │
└───────────┬─────────────┘      └───────────┬─────────────┘      └────────┬────────┘
            │                                │                             │
     1. User clicks pay                       │                             │
            │                                │                             │
     2. API call to proxy ─────────────────>│                             │
            │                                │          3. Create order   │
            │                                │──────────────────────────>│
            │                                │<─────────────────────────│
            │<───────────────────────────────│          4. Payment URL   │
     5. Redirect user to PhonePe            │                             │
            │                                │                             │
            │────────────────────────────────│          6. User pays      │
            │                                │──────────────────────────>│
            │                                │<─────────────────────────│
            │<───────────────────────────────│          7. Callback      │
     8. Redirect to success page            │          8. Check status   │
            │                                │──────────────────────────>│
            │                                │<─────────────────────────│
            │<───────────────────────────────│       9. Final status     │
            │                                │                             │
```

---

## Files to Create on experiences.beforest.co

### 1. Payment Proxy Initiate Route

**Path**: `src/app/api/payment-proxy/initiate/route.ts`

```typescript
import { NextResponse } from "next/server"
import crypto from "crypto"
import axios from "axios"
import { v4 as uuidv4 } from "uuid"

/**
 * Payment Proxy Initiate Route
 *
 * Receives payment requests from 10percent.beforest.co and creates
 * PhonePe orders using the authorized experiences.beforest.co domain.
 *
 * Authentication: X-API-Key header must match PAYMENT_PROXY_API_KEY env var
 */
export async function POST(req: Request) {
  try {
    const { amount, mobileNumber, name, email, location, redirectUrl, failureUrl } = await req.json()

    // === AUTHENTICATION ===
    const apiKey = req.headers.get("x-api-key")
    const sourceDomain = req.headers.get("x-source-domain")

    if (apiKey !== process.env.PAYMENT_PROXY_API_KEY) {
      console.error("Payment proxy: Invalid API key")
      return NextResponse.json(
        { error: "Unauthorized: Invalid API key" },
        { status: 401 }
      )
    }

    // Optional: Verify source domain
    if (sourceDomain && !sourceDomain.includes("10percent.beforest.co")) {
      console.error("Payment proxy: Invalid source domain", sourceDomain)
      return NextResponse.json(
        { error: "Unauthorized: Invalid source domain" },
        { status: 403 }
      )
    }

    // === PHONEPE CONFIGURATION ===
    const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
    const SALT_KEY = process.env.PHONEPE_SALT_KEY
    const SALT_INDEX = process.env.PHONEPE_SALT_INDEX
    const BASE_URL = process.env.NEXT_PUBLIC_PHONEPE_ENV === "PROD"
      ? process.env.PHONEPE_PROD_URL
      : process.env.PHONEPE_UAT_URL

    if (!MERCHANT_ID || !SALT_KEY || !SALT_INDEX || !BASE_URL) {
      return NextResponse.json(
        { error: "Payment gateway not configured properly" },
        { status: 500 }
      )
    }

    // === CREATE PHONEPE ORDER ===
    const apiEndpoint = "/pg/v1/pay"
    const merchantTransactionId = "MT" + Date.now() + uuidv4().slice(0, 4)

    // IMPORTANT: redirectUrl points BACK to experiences.beforest.co callback
    // which will then redirect to 10percent.beforest.co
    const callbackUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-proxy/callback?id=${merchantTransactionId}&redirect=${encodeURIComponent(redirectUrl)}&failure=${encodeURIComponent(failureUrl || "")}`

    const data = {
      merchantId: MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: "MUID" + Date.now(),
      amount: amount * 100, // Amount in Paise
      redirectUrl: callbackUrl,
      redirectMode: "POST",
      callbackUrl: callbackUrl,
      mobileNumber: mobileNumber || undefined,
      paymentInstrument: {
        type: "PAY_PAGE",
      },
      propertyUrls: {
        onboardingUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
        transactionStatusUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
      },
    }

    // === ENCODE AND CALCULATE CHECKSUM ===
    const bufferObj = Buffer.from(JSON.stringify(data), "utf8")
    const base64EncodedPayload = bufferObj.toString("base64")

    const stringToHash = base64EncodedPayload + apiEndpoint + SALT_KEY
    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex")
    const checksum = sha256 + "###" + SALT_INDEX

    // === CALL PHONEPE API ===
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

    if (response.data.success) {
      return NextResponse.json({
        url: response.data.data.instrumentResponse.redirectInfo.url,
        transactionId: merchantTransactionId,
      })
    } else {
      return NextResponse.json(
        { error: "Payment initiation failed" },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Payment Proxy Error:", error.response?.data || error.message)
    return NextResponse.json(
      { error: error.message || "Payment initiation failed" },
      { status: 500 }
    )
  }
}
```

---

### 2. Payment Proxy Callback Route

**Path**: `src/app/api/payment-proxy/callback/route.ts`

```typescript
import { NextResponse } from "next/server"
import crypto from "crypto"
import axios from "axios"

/**
 * Payment Proxy Callback Route
 *
 * Receives callbacks from PhonePe after payment completion,
 * verifies the status, and redirects back to 10percent.beforest.co
 * with the appropriate success/failure page.
 */

// Handle POST (PhonePe callback)
export async function POST(req: Request) {
  const formData = await req.formData()
  const { searchParams } = new URL(req.url)
  const txnId = searchParams.get("id")
  const targetRedirect = searchParams.get("redirect")
  const targetFailure = searchParams.get("failure")

  if (!txnId) {
    return NextResponse.redirect(`${targetFailure || targetRedirect || 'https://10percent.beforest.co'}/payment/failure`)
  }

  const MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
  const SALT_KEY = process.env.PHONEPE_SALT_KEY
  const SALT_INDEX = process.env.PHONEPE_SALT_INDEX
  const BASE_URL = process.env.NEXT_PUBLIC_PHONEPE_ENV === "PROD"
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

    // Redirect back to 10percent.beforest.co with status
    const baseUrl = targetRedirect || 'https://10percent.beforest.co'
    const failureUrl = targetFailure || `${baseUrl}/payment/failure`

    if (response.data.success && response.data.code === "PAYMENT_SUCCESS") {
      const paymentData = response.data.data
      return NextResponse.redirect(
        `${baseUrl}/payment/success?tid=${txnId}&amount=${paymentData.amount / 100}`
      )
    } else if (response.data.code === "PAYMENT_PENDING") {
      return NextResponse.redirect(
        `${baseUrl}/payment/pending?tid=${txnId}`
      )
    } else {
      return NextResponse.redirect(failureUrl + `?tid=${txnId}`)
    }
  } catch (error) {
    console.error("Status Check Error:", error)
    return NextResponse.redirect(
      `${targetFailure || targetRedirect || 'https://10percent.beforest.co'}/payment/failure`
    )
  }
}

// Handle GET (direct URL access)
export async function GET(req: Request) {
  return POST(req)
}
```

---

## Environment Variables to Add

Add these to your `.env` file on `experiences.beforest.co`:

```bash
# === PAYMENT PROXY CONFIGURATION ===

# API Key for authenticating requests from 10percent.beforest.co
# Generate a secure random key and share with the 10percent site admin
PAYMENT_PROXY_API_KEY=your_secure_api_key_here

# Base URL for this site (experiences.beforest.co)
NEXT_PUBLIC_BASE_URL=https://experiences.beforest.co

# === PHONEPE CREDENTIALS ===
# (These should already exist if you have PhonePe configured)

# PhonePe Environment: UAT for testing, PROD for production
NEXT_PUBLIC_PHONEPE_ENV=UAT

# PhonePe Merchant Credentials
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1

# PhonePe API URLs
PHONEPE_UAT_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
PHONEPE_PROD_URL=https://api.phonepe.com/apis/hermes
```

---

## Generate a Secure API Key

Run this command to generate a secure API key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online tool like: https://www.uuidgenerator.net/api/guid

**Important**: Share this same key with the 10percent site admin to add to their `.env` file.

---

## Testing Checklist

### 1. API Key Authentication
```bash
curl -X POST https://experiences.beforest.co/api/payment-proxy/initiate \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "amount": 1,
    "mobileNumber": "9999999999",
    "name": "Test User",
    "email": "test@example.com",
    "location": "Blyton",
    "redirectUrl": "https://10percent.beforest.co/payment/success"
  }'
```

Expected response:
- **Valid API key**: Returns payment URL
- **Invalid/missing API key**: Returns 401 Unauthorized

### 2. End-to-End Payment Flow

1. Go to `https://10percent.beforest.co`
2. Select a trial location
3. Fill payment form and submit
4. Should redirect to PhonePe checkout
5. Complete/cancel payment
6. Should redirect back to `10percent.beforest.co/payment/success` or `/payment/failure`

### 3. Verify Redirects

| Scenario | Expected Behavior |
|----------|-------------------|
| Successful payment | Redirect to `10percent.beforest.co/payment/success?tid=XXX&amount=XXX` |
| Failed payment | Redirect to `10percent.beforest.co/payment/failure?tid=XXX` |
| Pending payment | Redirect to `10percent.beforest.co/payment/pending?tid=XXX` |

---

## Troubleshooting

### Error: "Unauthorized: Invalid API key"
- Verify `PAYMENT_PROXY_API_KEY` is set in `.env` on experiences site
- Verify the same key is set on 10percent site
- Restart the development server after changing env variables

### Error: "Payment gateway not configured properly"
- Verify PhonePe credentials are set in `.env`
- Check that `PHONEPE_MERCHANT_ID`, `PHONEPE_SALT_KEY`, and `PHONEPE_SALT_INDEX` are present

### Payment URL not redirecting properly
- Check `NEXT_PUBLIC_BASE_URL` is set correctly on both sites
- Verify PhonePe callback URL includes the correct `redirect` parameter

### CORS Issues
If you encounter CORS errors, add this to the initiate route:

```typescript
// Add at the top of the POST function
const origin = req.headers.get('origin')
if (origin && origin === 'https://10percent.beforest.co') {
  // Allow the request
}
```

---

## Security Considerations

1. **API Key**: Never commit `PAYMENT_PROXY_API_KEY` to git. Keep it in `.env` (which should be in `.gitignore`)

2. **Domain Verification**: The proxy verifies requests come from `10percent.beforest.co` via the `X-Source-Domain` header

3. **HTTPS Only**: In production, ensure both sites use HTTPS and the API calls are encrypted

4. **Rate Limiting**: Consider adding rate limiting to prevent abuse:

```typescript
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 m"),
})

// In your route handler:
const { success } = await ratelimit.limit(apiKey)
if (!success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 })
}
```

---

## Summary of Changes on experiences.beforest.co

| File/Action | Description |
|-------------|-------------|
| `src/app/api/payment-proxy/initiate/route.ts` | New file: Receives payment requests from 10percent site |
| `src/app/api/payment-proxy/callback/route.ts` | New file: Handles PhonePe callbacks and redirects to 10percent |
| `.env` | Add `PAYMENT_PROXY_API_KEY` and verify PhonePe credentials |

---

## Contact

If you have questions or issues, please contact:
- **10percent site admin**: For API key coordination
- **PhonePe support**: For merchant account and domain whitelisting questions

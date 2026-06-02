import { NextResponse } from "next/server"
import { getPublicBaseUrl } from "@/lib/site/url"

export function GET() {
  const redirectUrl = new URL("/", getPublicBaseUrl())
  redirectUrl.searchParams.set("trial", "booking")

  const response = NextResponse.redirect(redirectUrl)
  response.cookies.set("trial_checkout_test", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 20 * 60,
  })

  return response
}

import { NextResponse } from "next/server"

export function GET(req: Request) {
  const url = new URL(req.url)
  const redirectUrl = new URL("/", url.origin)
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

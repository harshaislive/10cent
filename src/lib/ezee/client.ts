const EZEE_BASE_URL = "https://live.ipms247.com"

export interface IEzeeConfig {
  hotelCode: string
  authCode: string
  userAgent: string
}

export function getEzeeConfig(): IEzeeConfig {
  const hotelCode = process.env.EZEE_HOTEL_CODE
  const authCode = process.env.EZEE_AUTH_CODE
  const userAgent = process.env.EZEE_USER_AGENT || "openAPI-BlytonBungalow"

  if (!hotelCode || !authCode) {
    throw new Error("eZee API is not configured")
  }

  return {
    hotelCode,
    authCode,
    userAgent,
  }
}

export function buildEzeeUrl(path: string, params: Record<string, string>): string {
  const url = new URL(path, EZEE_BASE_URL)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

export async function fetchEzeeJson(url: string, userAgent: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": userAgent,
      accept: "application/json",
    },
    cache: "no-store",
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`eZee API returned ${response.status}`)
  }

  try {
    const data: unknown = JSON.parse(text)
    if (hasEzeeError(data)) {
      throw new Error(`eZee API error: ${JSON.stringify(data)}`)
    }
    return data
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`eZee API returned non-JSON response: ${text.slice(0, 160)}`)
    }
    throw error
  }
}

function hasEzeeError(data: unknown): boolean {
  if (Array.isArray(data)) {
    return data.some(hasEzeeError)
  }

  if (!data || typeof data !== "object") {
    return false
  }

  const record = data as Record<string, unknown>
  return Boolean(
    record["Error Details"] ||
    record.Error_Code ||
    record.ErrorCode ||
    record.Error ||
    record.error
  )
}

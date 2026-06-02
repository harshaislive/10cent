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
    if (hasEzeeNoDataResponse(data)) {
      return data
    }

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

export async function postEzeeFormJson(
  path: string,
  params: Record<string, string>,
  userAgent: string
): Promise<unknown> {
  const url = new URL(path, EZEE_BASE_URL)
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": userAgent,
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(params),
    cache: "no-store",
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`eZee API returned ${response.status}`)
  }

  try {
    const data: unknown = JSON.parse(text)
    if (hasEzeeNoDataResponse(data)) {
      return data
    }

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

export async function postEzeeJson(
  path: string,
  body: unknown,
  userAgent: string
): Promise<unknown> {
  const url = new URL(path, EZEE_BASE_URL)
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "User-Agent": userAgent,
      accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`eZee API returned ${response.status}`)
  }

  try {
    return JSON.parse(text) as unknown
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`eZee API returned non-JSON response: ${text.slice(0, 160)}`)
    }
    throw error
  }
}

function hasEzeeNoDataResponse(data: unknown): boolean {
  if (Array.isArray(data)) {
    return data.some(hasEzeeNoDataResponse)
  }

  if (!data || typeof data !== "object") {
    return false
  }

  const record = data as Record<string, unknown>
  const details = record["Error Details"]

  if (!details || typeof details !== "object" || Array.isArray(details)) {
    return false
  }

  const errorDetails = details as Record<string, unknown>
  return (
    Number(errorDetails.Error_Code) === -1 &&
    typeof errorDetails.Error_Message === "string" &&
    errorDetails.Error_Message.toLowerCase().includes("no data")
  )
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

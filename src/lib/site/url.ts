const PRODUCTION_BASE_URL = "https://10percent.beforest.co"

export function getPublicBaseUrl(): string {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL

  if (configuredBaseUrl && !isLocalhostUrl(configuredBaseUrl)) {
    return configuredBaseUrl.replace(/\/$/, "")
  }

  return PRODUCTION_BASE_URL
}

function isLocalhostUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.hostname === "localhost" || url.hostname === "127.0.0.1"
  } catch {
    return false
  }
}

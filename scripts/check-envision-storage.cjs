// Read-only preflight. Does not print credentials, tokens or customer records.
const { loadEnvConfig } = require('@next/env')

loadEnvConfig(process.cwd(), true)

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE
  if (!url || !key) {
    console.log(JSON.stringify({ configured: false, hasUrl: Boolean(url), hasServerKey: Boolean(key) }))
    process.exitCode = 1
    return
  }
  const response = await fetch(new URL('/rest/v1/envision_journeys?select=token_hash,revision,document&limit=0', url), {
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Accept-Profile': 'tencent' },
  })
  let errorCode = null
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    errorCode = error.code || 'unknown'
  }
  console.log(JSON.stringify({
    configured: true,
    projectHost: new URL(url).hostname,
    storageMode: process.env.ENVISION_STORAGE_MODE || 'development-local / production-disabled',
    tableAvailable: response.ok,
    status: response.status,
    errorCode,
  }))
  if (!response.ok) process.exitCode = 1
}

main().catch(error => {
  console.error(JSON.stringify({ checkFailed: true, errorClass: error.name, causeCode: error.cause?.code || null }))
  process.exitCode = 1
})

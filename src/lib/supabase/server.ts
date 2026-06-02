import { createClient, type SupabaseClient } from "@supabase/supabase-js"

export function createSupabaseServiceClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase service config missing", {
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasSupabaseServiceKey: Boolean(supabaseServiceKey),
    })
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

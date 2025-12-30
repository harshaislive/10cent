-- ============================================================================
-- SUPABASE SQL SCHEMA FOR WEBINAR REGISTRANTS
-- ============================================================================
-- This file contains the SQL schema for storing Typeform webinar registrations
--
-- Execute these queries in your Supabase SQL Editor:
-- 1. Go to your Supabase project > SQL Editor
-- 2. Run each block separately in order
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: webinar_registrants
-- Stores all Typeform webinar registrations
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.webinar_registrants (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Typeform Response Details
  typeform_response_id TEXT UNIQUE NOT NULL, -- Unique response ID from Typeform
  typeform_form_id TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  landed_at TIMESTAMP WITH TIME ZONE,

  -- User Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Survey Answers
  last_disconnect TEXT, -- "When did you last disconnect for 24 hours?"
  natural_sounds TEXT, -- "When did you last hear only natural sounds?"
  describes_you TEXT, -- "What Best Describes You?"

  -- UTM Parameters
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,

  -- Registration Status
  webinar_attended BOOLEAN DEFAULT false,
  reminder_sent BOOLEAN DEFAULT false,
  follow_up_sent BOOLEAN DEFAULT false,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Additional Notes
  notes TEXT
);

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_webinar_registrants_email
  ON public.webinar_registrants(email);

-- Create index for typeform response ID
CREATE INDEX IF NOT EXISTS idx_webinar_registrants_typeform_id
  ON public.webinar_registrants(typeform_response_id);

-- Create index for webinar attendance tracking
CREATE INDEX IF NOT EXISTS idx_webinar_registrants_attended
  ON public.webinar_registrants(webinar_attended);

-- Add comment to table
COMMENT ON TABLE public.webinar_registrants IS 'Stores all Typeform webinar registrations';

-- ============================================================================
-- HELPER FUNCTION: Parse Typeform webhook data and insert registrant
-- ============================================================================
CREATE OR REPLACE FUNCTION public.insert_webinar_registrant(
  p_typeform_response_id TEXT,
  p_typeform_form_id TEXT,
  p_submitted_at TIMESTAMP WITH TIME ZONE,
  p_landed_at TIMESTAMP WITH TIME ZONE,
  p_first_name TEXT,
  p_last_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_last_disconnect TEXT DEFAULT NULL,
  p_natural_sounds TEXT DEFAULT NULL,
  p_describes_you TEXT DEFAULT NULL,
  p_utm_source TEXT DEFAULT NULL,
  p_utm_medium TEXT DEFAULT NULL,
  p_utm_campaign TEXT DEFAULT NULL,
  p_utm_content TEXT DEFAULT NULL,
  p_utm_term TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_registrant_id UUID;
BEGIN
  INSERT INTO public.webinar_registrants (
    typeform_response_id,
    typeform_form_id,
    submitted_at,
    landed_at,
    first_name,
    last_name,
    email,
    phone,
    last_disconnect,
    natural_sounds,
    describes_you,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_content,
    utm_term
  ) VALUES (
    p_typeform_response_id,
    p_typeform_form_id,
    p_submitted_at,
    p_landed_at,
    p_first_name,
    p_last_name,
    p_email,
    p_phone,
    p_last_disconnect,
    p_natural_sounds,
    p_describes_you,
    p_utm_source,
    p_utm_medium,
    p_campaign,
    p_utm_content,
    p_utm_term
  )
  ON CONFLICT (typeform_response_id) DO NOTHING
  RETURNING id INTO v_registrant_id;

  RETURN v_registrant_id;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on the table
-- ----------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.webinar_registrants ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role (backend) full access
CREATE POLICY "Service role has full access on webinar_registrants"
  ON public.webinar_registrants
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can read their own registrations (based on email)
CREATE POLICY "Users can read own webinar_registrants"
  ON public.webinar_registrants
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- ----------------------------------------------------------------------------
-- TRIGGER: Update updated_at timestamp automatically
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_webinar_registrants_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_webinar_registrants_updated_at
  BEFORE UPDATE ON public.webinar_registrants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_webinar_registrants_updated_at();

-- ============================================================================
-- SAMPLE QUERIES FOR COMMON OPERATIONS
-- ============================================================================

-- -- Get all registrants for a specific form
-- SELECT
--   first_name,
--   last_name,
--   email,
--   phone,
--   describes_you,
--   submitted_at
-- FROM public.webinar_registrants
-- WHERE typeform_form_id = 'j82U1ZMC'
-- ORDER BY submitted_at DESC;

-- -- Get registrants who haven't attended yet
-- SELECT * FROM public.webinar_registrants
-- WHERE webinar_attended = false
-- ORDER BY submitted_at;

-- -- Mark a registrant as attended
-- UPDATE public.webinar_registrants
-- SET webinar_attended = true
-- WHERE email = 'user@example.com';

-- ============================================================================
-- END OF SUPABASE SQL SCHEMA
-- ============================================================================

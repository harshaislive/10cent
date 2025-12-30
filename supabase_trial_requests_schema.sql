-- ============================================================================
-- SUPABASE SQL SCHEMA FOR TRIAL REQUESTS (NO PAYMENT)
-- ============================================================================
-- This file contains the SQL for creating tables to track trial requests
-- without requiring payment upfront. Users submit requests and availability
-- is checked in real-time.
--
-- Execute these queries in your Supabase SQL Editor:
-- 1. Go to your Supabase project > SQL Editor
-- 2. Run each block separately in order
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: trial_requests
-- Stores all trial stay requests without payment
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trial_requests (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Request ID (human-readable)
  request_id TEXT UNIQUE NOT NULL, -- e.g., 'TR1234567890ABCD'

  -- User Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Trial Details
  location TEXT NOT NULL, -- e.g., 'Blyton, Coorg'
  location_slug TEXT NOT NULL, -- e.g., 'blyton_coorg'

  -- Date Preferences
  preferred_date DATE NOT NULL, -- User's preferred check-in date
  duration_nights INTEGER DEFAULT 2, -- How many nights (default 2)
  guest_count INTEGER, -- Number of guests
  flexible_dates BOOLEAN DEFAULT false, -- Is user flexible with dates?

  -- Availability Check (from external API)
  availability_data JSONB, -- Full response from availability API
  is_date_available BOOLEAN, -- True if date was available at request time
  available_rooms JSONB, -- Available rooms from API response

  -- Request Status
  request_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, AVAILABLE, WAITLIST, CONFIRMED, CANCELLED
  status_notes TEXT, -- Notes about status changes

  -- Special Requests
  special_requests TEXT, -- Any special requirements from user

  -- Follow-up
  contacted_at TIMESTAMP WITH TIME ZONE, -- When team contacted the user
  confirmed_booking_id UUID, -- Reference to confirmed booking if any

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_request_status CHECK (request_status IN ('PENDING', 'AVAILABLE', 'WAITLIST', 'CONFIRMED', 'CANCELLED'))
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_trial_requests_request_id
  ON public.trial_requests(request_id);

CREATE INDEX IF NOT EXISTS idx_trial_requests_email
  ON public.trial_requests(email);

CREATE INDEX IF NOT EXISTS idx_trial_requests_phone
  ON public.trial_requests(phone);

CREATE INDEX IF NOT EXISTS idx_trial_requests_status
  ON public.trial_requests(request_status);

CREATE INDEX IF NOT EXISTS idx_trial_requests_preferred_date
  ON public.trial_requests(preferred_date);

CREATE INDEX IF NOT EXISTS idx_trial_requests_location
  ON public.trial_requests(location_slug);

-- Add comment to table
COMMENT ON TABLE public.trial_requests IS 'Stores trial stay requests without payment';

-- ----------------------------------------------------------------------------
-- TABLE: trial_request_notes
-- Internal notes for trial requests (for admin use)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trial_request_notes (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key
  trial_request_id UUID NOT NULL REFERENCES public.trial_requests(id) ON DELETE CASCADE,

  -- Note Details
  note TEXT NOT NULL,
  noted_by TEXT, -- Admin name/email who added the note

  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for notes
CREATE INDEX IF NOT EXISTS idx_trial_request_notes_trial_request_id
  ON public.trial_request_notes(trial_request_id);

-- Add comment to table
COMMENT ON TABLE public.trial_request_notes IS 'Internal admin notes for trial requests';

-- ----------------------------------------------------------------------------
-- FUNCTION: Update updated_at timestamp automatically
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_trial_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_trial_requests_updated_at_trigger
  BEFORE UPDATE ON public.trial_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_trial_requests_updated_at();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
-- Enable RLS
ALTER TABLE public.trial_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_request_notes ENABLE ROW LEVEL SECURITY;

-- Policy: Service role has full access
CREATE POLICY "Service role full access on trial_requests"
  ON public.trial_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access on trial_request_notes"
  ON public.trial_request_notes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- HELPER VIEW: trial_requests_summary
-- A view to get request statistics
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.trial_requests_summary AS
SELECT
  DATE_TRUNC('day', created_at) as request_date,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE request_status = 'PENDING') as pending_requests,
  COUNT(*) FILTER (WHERE request_status = 'AVAILABLE') as available_requests,
  COUNT(*) FILTER (WHERE request_status = 'WAITLIST') as waitlist_requests,
  COUNT(*) FILTER (WHERE request_status = 'CONFIRMED') as confirmed_requests,
  COUNT(*) FILTER (WHERE is_date_available = true) as dates_available_count
FROM public.trial_requests
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY request_date DESC;

COMMENT ON VIEW public.trial_requests_summary IS 'Daily summary of trial request statistics';

-- ============================================================================
-- SAMPLE QUERIES FOR COMMON OPERATIONS
-- ============================================================================

-- -- 1. Get all pending requests
-- SELECT
--   request_id,
--   name,
--   email,
--   phone,
--   location,
--   preferred_date,
--   request_status,
--   created_at
-- FROM public.trial_requests
-- WHERE request_status = 'PENDING'
-- ORDER BY created_at ASC;

-- -- 2. Get requests by email
-- SELECT
--   request_id,
--   location,
--   preferred_date,
--   request_status,
--   created_at
-- FROM public.trial_requests
-- WHERE email = 'user@example.com'
-- ORDER BY created_at DESC;

-- -- 3. Get waitlist requests with available dates nearby
-- SELECT
--   request_id,
--   name,
--   email,
--   phone,
--   location,
--   preferred_date,
--   created_at
-- FROM public.trial_requests
-- WHERE request_status = 'WAITLIST'
--   AND preferred_date > CURRENT_DATE
-- ORDER BY preferred_date ASC;

-- -- 4. Update request status
-- UPDATE public.trial_requests
-- SET
--   request_status = 'CONFIRMED',
--   status_notes = 'Booking confirmed via phone',
--   contacted_at = NOW()
-- WHERE request_id = 'TR1234567890ABCD';

-- -- 5. Get availability stats for a date range
-- SELECT
--   preferred_date,
--   COUNT(*) as total_requests,
--   COUNT(*) FILTER (WHERE request_status = 'AVAILABLE') as available_count,
--   COUNT(*) FILTER (WHERE request_status = 'WAITLIST') as waitlist_count
-- FROM public.trial_requests
-- WHERE preferred_date BETWEEN '2025-01-01' AND '2025-12-31'
-- GROUP BY preferred_date
-- ORDER BY preferred_date;

-- ============================================================================
-- END OF SUPABASE SQL SCHEMA
-- ============================================================================

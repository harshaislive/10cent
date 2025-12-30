-- ============================================================================
-- SUPABASE SQL SCHEMA FOR ONBOARDING CALL SCHEDULING
-- ============================================================================
-- This file contains all the necessary SQL for creating tables to track
-- scheduled onboarding calls for new subscribers.
--
-- Execute these queries in your Supabase SQL Editor:
-- 1. Go to your Supabase project > SQL Editor
-- 2. Run each block separately in order
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: onboarding_calls
-- Stores scheduled call details
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.onboarding_calls (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User Information
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT, -- Optional, if we have it

  -- Call Details
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL, -- e.g., "10:00 AM", "14:30"
  duration_minutes INTEGER DEFAULT 15,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'SCHEDULED', -- SCHEDULED, COMPLETED, CANCELLED, NO_SHOW
  
  -- Admin Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_call_status CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_onboarding_calls_date
  ON public.onboarding_calls(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_onboarding_calls_phone
  ON public.onboarding_calls(phone);

-- Add comment to table
COMMENT ON TABLE public.onboarding_calls IS 'Stores scheduled onboarding and payment assistance calls';

-- ----------------------------------------------------------------------------
-- FUNCTION: Update updated_at timestamp automatically
-- ----------------------------------------------------------------------------
-- Reusing existing function if available, otherwise creating it
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_onboarding_calls_updated_at ON public.onboarding_calls;
CREATE TRIGGER update_onboarding_calls_updated_at
  BEFORE UPDATE ON public.onboarding_calls
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.onboarding_calls ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role (backend) full access
CREATE POLICY "Service role has full access on onboarding_calls"
  ON public.onboarding_calls
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Allow anonymous users to insert (schedule calls)
CREATE POLICY "Anonymous users can schedule calls"
  ON public.onboarding_calls
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Authenticated users can read their own calls (if email matches)
CREATE POLICY "Users can read own calls"
  ON public.onboarding_calls
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

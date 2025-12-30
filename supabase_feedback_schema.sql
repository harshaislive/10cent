-- ============================================================================
-- SUPABASE SQL SCHEMA FOR FEEDBACK SYSTEM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: feedback
-- Stores qualitative feedback from trial stays
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- User Info (Optional, can be anonymous)
  name TEXT,
  phone TEXT,
  
  -- Feedback
  rating INTEGER, -- 1-5 scale (internal use mostly)
  feelings TEXT, -- The main qualitative answer
  highlights TEXT, -- "What stood out?"
  
  -- Metadata
  stay_location TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts
CREATE POLICY "Anonymous users can submit feedback"
  ON public.feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow service role full access
CREATE POLICY "Service role has full access on feedback"
  ON public.feedback
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

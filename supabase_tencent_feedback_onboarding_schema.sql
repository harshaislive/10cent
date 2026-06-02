-- ============================================================================
-- 10CENT SUPABASE SCHEMA: FEEDBACK + ONBOARDING CALLS
-- ============================================================================
-- Run this in the shared Supabase project's SQL editor after
-- supabase_tencent_trial_booking_schema.sql.
--
-- These are the two remaining Supabase-backed features in the 10cent app.
-- They live in the tencent schema so this project does not depend on public.*
-- tables in a shared Supabase project.
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS tencent;

GRANT USAGE ON SCHEMA tencent TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA tencent TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA tencent TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA tencent TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA tencent
  GRANT ALL ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA tencent
  GRANT ALL ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA tencent
  GRANT EXECUTE ON FUNCTIONS TO service_role;

-- ----------------------------------------------------------------------------
-- TABLE: tencent.feedback
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tencent.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  phone TEXT,
  rating INTEGER,
  feelings TEXT,
  highlights TEXT,
  stay_location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE tencent.feedback IS
  '10cent qualitative feedback from trial stays';

CREATE INDEX IF NOT EXISTS idx_tencent_feedback_phone
  ON tencent.feedback(phone);

CREATE INDEX IF NOT EXISTS idx_tencent_feedback_stay_location
  ON tencent.feedback(stay_location);

CREATE INDEX IF NOT EXISTS idx_tencent_feedback_created_at
  ON tencent.feedback(created_at);

-- ----------------------------------------------------------------------------
-- TABLE: tencent.onboarding_calls
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tencent.onboarding_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 15,
  status TEXT NOT NULL DEFAULT 'SCHEDULED',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_tencent_call_status CHECK (
    status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
  )
);

COMMENT ON TABLE tencent.onboarding_calls IS
  '10cent onboarding and payment assistance call scheduling';

CREATE INDEX IF NOT EXISTS idx_tencent_onboarding_calls_date
  ON tencent.onboarding_calls(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_tencent_onboarding_calls_phone
  ON tencent.onboarding_calls(phone);

CREATE INDEX IF NOT EXISTS idx_tencent_onboarding_calls_status
  ON tencent.onboarding_calls(status);

-- ----------------------------------------------------------------------------
-- updated_at trigger for onboarding calls
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION tencent.update_onboarding_calls_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_onboarding_calls_updated_at
  ON tencent.onboarding_calls;

CREATE TRIGGER update_onboarding_calls_updated_at
  BEFORE UPDATE ON tencent.onboarding_calls
  FOR EACH ROW
  EXECUTE FUNCTION tencent.update_onboarding_calls_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
ALTER TABLE tencent.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE tencent.onboarding_calls ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on feedback"
  ON tencent.feedback;

CREATE POLICY "Service role full access on feedback"
  ON tencent.feedback
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on onboarding_calls"
  ON tencent.onboarding_calls;

CREATE POLICY "Service role full access on onboarding_calls"
  ON tencent.onboarding_calls
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;

-- ============================================================================
-- CURRENT 10CENT TABLES EXPECTED IN SCHEMA tencent
-- ============================================================================
-- tencent.trial_requests
-- tencent.trial_request_notes
-- tencent.trial_request_payment_events
-- tencent.feedback
-- tencent.onboarding_calls
-- tencent.trial_requests_summary
-- ============================================================================

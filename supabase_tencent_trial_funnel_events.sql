-- ============================================================================
-- 10CENT SUPABASE MIGRATION: trial funnel events + follow-up orchestration
-- ============================================================================
-- Additive migration. Run after supabase_tencent_trial_booking_schema.sql.
-- This does not delete or rewrite existing rows.
-- ============================================================================

BEGIN;

CREATE SCHEMA IF NOT EXISTS tencent;

ALTER TABLE tencent.trial_requests
  ADD COLUMN IF NOT EXISTS ezee_payment_status TEXT NOT NULL DEFAULT 'NOT_STARTED',
  ADD COLUMN IF NOT EXISTS ezee_payment_attempted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS ezee_payment_posted_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS ezee_payment_error TEXT,
  ADD COLUMN IF NOT EXISTS ezee_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS ezee_currency_id TEXT,
  ADD COLUMN IF NOT EXISTS ezee_payment_amount NUMERIC,
  ADD COLUMN IF NOT EXISTS ezee_payment_payload JSONB;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'valid_ezee_payment_status'
      AND conrelid = 'tencent.trial_requests'::regclass
  ) THEN
    ALTER TABLE tencent.trial_requests
      ADD CONSTRAINT valid_ezee_payment_status CHECK (
        ezee_payment_status IN ('NOT_STARTED', 'PENDING', 'POSTED', 'FAILED')
      );
  END IF;
END $$;

ALTER TABLE tencent.trial_requests
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS landing_url TEXT,
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS utm_medium TEXT,
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
  ADD COLUMN IF NOT EXISTS utm_content TEXT,
  ADD COLUMN IF NOT EXISTS utm_term TEXT,
  ADD COLUMN IF NOT EXISTS attribution_payload JSONB;

CREATE TABLE IF NOT EXISTS tencent.trial_funnel_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_request_id UUID REFERENCES tencent.trial_requests(id) ON DELETE SET NULL,
  request_id TEXT,
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  event_source TEXT NOT NULL DEFAULT '10cent',
  event_stage TEXT,
  name TEXT,
  email TEXT,
  phone TEXT,
  location_slug TEXT,
  location_name TEXT,
  check_in_date DATE,
  check_out_date DATE,
  duration_nights INTEGER,
  room_count INTEGER,
  adults INTEGER,
  children INTEGER,
  guest_count INTEGER,
  amount NUMERIC,
  currency TEXT DEFAULT 'INR',
  page_url TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_content TEXT,
  utm_term TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE tencent.trial_funnel_events IS
  'Pre-submit and ecommerce-style funnel events for 10cent trial booking journeys';

CREATE TABLE IF NOT EXISTS tencent.trial_followup_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_request_id UUID REFERENCES tencent.trial_requests(id) ON DELETE SET NULL,
  request_id TEXT,
  session_id TEXT,
  channel TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  template_key TEXT,
  recipient TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'QUEUED',
  provider TEXT,
  provider_message_id TEXT,
  error_message TEXT,
  payload JSONB,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_trial_followup_channel CHECK (
    channel IN ('whatsapp', 'email', 'sms', 'manual')
  ),
  CONSTRAINT valid_trial_followup_status CHECK (
    status IN ('QUEUED', 'SENT', 'FAILED', 'SKIPPED', 'CANCELLED')
  )
);

COMMENT ON TABLE tencent.trial_followup_messages IS
  'Outbound WhatsApp/email follow-up log for 10cent trial booking funnel';

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_session_id
  ON tencent.trial_requests(session_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_ezee_payment_status
  ON tencent.trial_requests(ezee_payment_status);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_funnel_events_session
  ON tencent.trial_funnel_events(session_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_funnel_events_request_id
  ON tencent.trial_funnel_events(request_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_funnel_events_trial_request_id
  ON tencent.trial_funnel_events(trial_request_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_funnel_events_event_name
  ON tencent.trial_funnel_events(event_name);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_funnel_events_created_at
  ON tencent.trial_funnel_events(created_at);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_followup_messages_request_id
  ON tencent.trial_followup_messages(request_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_followup_messages_status
  ON tencent.trial_followup_messages(status);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_followup_messages_scheduled_at
  ON tencent.trial_followup_messages(scheduled_at);

ALTER TABLE tencent.trial_funnel_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tencent.trial_followup_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on trial_funnel_events"
  ON tencent.trial_funnel_events;

CREATE POLICY "Service role full access on trial_funnel_events"
  ON tencent.trial_funnel_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on trial_followup_messages"
  ON tencent.trial_followup_messages;

CREATE POLICY "Service role full access on trial_followup_messages"
  ON tencent.trial_followup_messages
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

COMMIT;

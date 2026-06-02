-- ============================================================================
-- 10CENT SUPABASE SCHEMA: TRIAL BOOKING + EXPERIENCES PAYMENT BRIDGE
-- ============================================================================
-- Run this in the shared Supabase project's SQL editor.
--
-- This creates a separate schema named "tencent" so 10cent data does not mix
-- with other websites that use the same Supabase project.
--
-- Code should query this schema with:
-- supabase.schema('tencent').from('trial_requests')
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
-- TABLE: tencent.trial_requests
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tencent.trial_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Public/request identifiers
  request_id TEXT UNIQUE NOT NULL,

  -- Guest details
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Stay/property details
  location TEXT NOT NULL,
  location_slug TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  check_in_date DATE,
  check_out_date DATE,
  duration_nights INTEGER DEFAULT 2,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  guest_count INTEGER,
  flexible_dates BOOLEAN DEFAULT false,
  special_requests TEXT,

  -- eZee availability snapshot
  estimated_cost NUMERIC,
  availability_data JSONB,
  is_date_available BOOLEAN,
  available_rooms JSONB,

  -- Selected eZee room/rate details
  selected_room_id TEXT,
  selected_room_name TEXT,
  selected_rate_plan_id TEXT,
  selected_rate_plan_name TEXT,
  selected_room_payload JSONB,

  -- Request lifecycle
  request_status TEXT NOT NULL DEFAULT 'PENDING',
  status_notes TEXT,

  -- Experiences payment bridge
  payment_status TEXT NOT NULL DEFAULT 'NOT_STARTED',
  experiences_checkout_id TEXT,
  experiences_checkout_url TEXT,
  experiences_checkout_token_hash TEXT,
  checkout_expires_at TIMESTAMP WITH TIME ZONE,
  payment_amount NUMERIC,
  payment_currency TEXT NOT NULL DEFAULT 'INR',
  payment_gateway TEXT DEFAULT 'phonepe',
  payment_transaction_id TEXT,
  payment_reference JSONB,
  payment_link_sent_at TIMESTAMP WITH TIME ZONE,
  payment_started_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_failed_at TIMESTAMP WITH TIME ZONE,
  payment_webhook_received_at TIMESTAMP WITH TIME ZONE,
  payment_webhook_payload JSONB,

  -- eZee booking/blocking after payment succeeds
  ezee_booking_status TEXT NOT NULL DEFAULT 'NOT_STARTED',
  ezee_booking_attempted_at TIMESTAMP WITH TIME ZONE,
  ezee_booking_created_at TIMESTAMP WITH TIME ZONE,
  ezee_booking_error TEXT,
  ezee_reservation_no TEXT,
  ezee_inventory_mode TEXT,

  -- Internal follow-up/admin
  contacted_at TIMESTAMP WITH TIME ZONE,
  confirmed_booking_id UUID,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_request_status CHECK (
    request_status IN (
      'PENDING',
      'AVAILABLE',
      'WAITLIST',
      'PENDING_PAYMENT',
      'PAYMENT_LINK_SENT',
      'PAYMENT_STARTED',
      'PAID',
      'PAYMENT_FAILED',
      'PAYMENT_EXPIRED',
      'EZEE_BOOKING_CREATED',
      'EZEE_BOOKING_FAILED',
      'CONFIRMED',
      'CANCELLED'
    )
  ),
  CONSTRAINT valid_payment_status CHECK (
    payment_status IN (
      'NOT_STARTED',
      'PENDING_PAYMENT',
      'PAYMENT_LINK_SENT',
      'PAYMENT_STARTED',
      'PAID',
      'FAILED',
      'EXPIRED',
      'REFUNDED'
    )
  ),
  CONSTRAINT valid_ezee_booking_status CHECK (
    ezee_booking_status IN (
      'NOT_STARTED',
      'PENDING',
      'CREATED',
      'FAILED',
      'CANCELLED'
    )
  )
);

COMMENT ON TABLE tencent.trial_requests IS
  '10cent trial stay requests, experiences payment bridge state, and post-payment eZee booking status';

-- ----------------------------------------------------------------------------
-- TABLE: tencent.trial_request_notes
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tencent.trial_request_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_request_id UUID NOT NULL REFERENCES tencent.trial_requests(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  noted_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE tencent.trial_request_notes IS
  'Internal admin notes for 10cent trial requests';

-- ----------------------------------------------------------------------------
-- TABLE: tencent.trial_request_payment_events
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tencent.trial_request_payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trial_request_id UUID NOT NULL REFERENCES tencent.trial_requests(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '10cent',
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE tencent.trial_request_payment_events IS
  'Audit log for checkout creation, payment webhooks, payment status checks, and eZee booking attempts';

-- ----------------------------------------------------------------------------
-- Indexes
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_request_id
  ON tencent.trial_requests(request_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_email
  ON tencent.trial_requests(email);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_phone
  ON tencent.trial_requests(phone);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_status
  ON tencent.trial_requests(request_status);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_payment_status
  ON tencent.trial_requests(payment_status);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_location
  ON tencent.trial_requests(location_slug);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_preferred_date
  ON tencent.trial_requests(preferred_date);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_check_in_date
  ON tencent.trial_requests(check_in_date);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_checkout_id
  ON tencent.trial_requests(experiences_checkout_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_checkout_expires_at
  ON tencent.trial_requests(checkout_expires_at);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_transaction_id
  ON tencent.trial_requests(payment_transaction_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_ezee_booking_status
  ON tencent.trial_requests(ezee_booking_status);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_request_notes_request_id
  ON tencent.trial_request_notes(trial_request_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_payment_events_request_id
  ON tencent.trial_request_payment_events(trial_request_id);

CREATE INDEX IF NOT EXISTS idx_tencent_trial_payment_events_event_type
  ON tencent.trial_request_payment_events(event_type);

-- ----------------------------------------------------------------------------
-- updated_at trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION tencent.update_trial_requests_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_trial_requests_updated_at_trigger
  ON tencent.trial_requests;

CREATE TRIGGER update_trial_requests_updated_at_trigger
  BEFORE UPDATE ON tencent.trial_requests
  FOR EACH ROW
  EXECUTE FUNCTION tencent.update_trial_requests_updated_at();

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
ALTER TABLE tencent.trial_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tencent.trial_request_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tencent.trial_request_payment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role full access on trial_requests"
  ON tencent.trial_requests;

CREATE POLICY "Service role full access on trial_requests"
  ON tencent.trial_requests
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on trial_request_notes"
  ON tencent.trial_request_notes;

CREATE POLICY "Service role full access on trial_request_notes"
  ON tencent.trial_request_notes
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "Service role full access on trial_request_payment_events"
  ON tencent.trial_request_payment_events;

CREATE POLICY "Service role full access on trial_request_payment_events"
  ON tencent.trial_request_payment_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- Summary view
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW tencent.trial_requests_summary AS
SELECT
  DATE_TRUNC('day', created_at) as request_date,
  COUNT(*) as total_requests,
  COUNT(*) FILTER (WHERE request_status = 'PENDING') as pending_requests,
  COUNT(*) FILTER (WHERE request_status = 'AVAILABLE') as available_requests,
  COUNT(*) FILTER (WHERE request_status = 'WAITLIST') as waitlist_requests,
  COUNT(*) FILTER (WHERE request_status = 'PENDING_PAYMENT') as pending_payment_requests,
  COUNT(*) FILTER (WHERE payment_status = 'PAYMENT_LINK_SENT') as payment_link_sent_requests,
  COUNT(*) FILTER (WHERE payment_status = 'PAID') as paid_requests,
  COUNT(*) FILTER (WHERE payment_status IN ('FAILED', 'EXPIRED')) as payment_failed_requests,
  COUNT(*) FILTER (WHERE ezee_booking_status = 'CREATED') as ezee_booking_created_requests,
  COUNT(*) FILTER (WHERE ezee_booking_status = 'FAILED') as ezee_booking_failed_requests,
  COUNT(*) FILTER (WHERE request_status = 'CONFIRMED') as confirmed_requests,
  COUNT(*) FILTER (WHERE is_date_available = true) as dates_available_count
FROM tencent.trial_requests
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY request_date DESC;

COMMENT ON VIEW tencent.trial_requests_summary IS
  'Daily summary of 10cent trial requests, payments, and eZee booking status';

COMMIT;

-- ============================================================================
-- IMPORTANT SUPABASE DASHBOARD STEP
-- ============================================================================
-- If the frontend/backend uses the Supabase REST client against this schema,
-- add "tencent" under:
-- Project Settings > API > Data API Settings > Exposed schemas
--
-- If all writes happen only through service-role server code, RLS remains locked
-- down to service_role, which is the safest current setup.
-- ============================================================================

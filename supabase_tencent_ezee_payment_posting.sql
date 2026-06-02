-- ============================================================================
-- 10CENT SUPABASE MIGRATION: eZee PMS payment posting state
-- ============================================================================
-- Run this after supabase_tencent_trial_booking_schema.sql if the tencent schema
-- already exists. This is additive and does not delete existing data.
-- ============================================================================

BEGIN;

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
        ezee_payment_status IN (
          'NOT_STARTED',
          'PENDING',
          'POSTED',
          'FAILED'
        )
      );
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_tencent_trial_requests_ezee_payment_status
  ON tencent.trial_requests(ezee_payment_status);

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
  COUNT(*) FILTER (WHERE ezee_payment_status = 'POSTED') as ezee_payment_posted_requests,
  COUNT(*) FILTER (WHERE ezee_payment_status = 'FAILED') as ezee_payment_failed_requests,
  COUNT(*) FILTER (WHERE request_status = 'CONFIRMED') as confirmed_requests,
  COUNT(*) FILTER (WHERE is_date_available = true) as dates_available_count
FROM tencent.trial_requests
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY request_date DESC;

COMMIT;

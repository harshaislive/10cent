-- ============================================================================
-- SUPABASE SQL SCHEMA FOR PHONEPE PAYMENT INTEGRATION
-- ============================================================================
-- This file contains all the necessary SQL for creating tables to track
-- trial token payments through PhonePe payment gateway.
--
-- Execute these queries in your Supabase SQL Editor:
-- 1. Go to your Supabase project > SQL Editor
-- 2. Run each block separately in order
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: trial_payments
-- Stores all payment transactions from PhonePe
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trial_payments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- PhonePe Transaction Details
  merchant_transaction_id TEXT UNIQUE NOT NULL, -- PhonePe's transaction ID
  phonepe_transaction_id TEXT, -- PhonePe's internal transaction ID (from callback)

  -- Payment Amounts
  amount_in_paise INTEGER NOT NULL, -- Amount in paise (as sent to PhonePe)
  amount_in_rupees INTEGER NOT NULL GENERATED ALWAYS AS (amount_in_paise / 100) STORED,

  -- Payment Status
  payment_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED, REFUNDED
  payment_code TEXT, -- PhonePe response code (PAYMENT_SUCCESS, PAYMENT_FAILED, etc.)

  -- User Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Trial Details
  trial_location TEXT NOT NULL, -- e.g., 'Blyton, Coorg', 'Hammiyala, Coorg'
  trial_location_slug TEXT NOT NULL, -- e.g., 'blyton_coorg'

  -- Token Information
  token_amount INTEGER NOT NULL DEFAULT 1, -- ₹1 (testing)
  is_adjustable BOOLEAN DEFAULT true, -- Can be adjusted toward full subscription
  subscription_amount INTEGER DEFAULT 1760000, -- ₹17.6 Lakhs (full subscription)
  adjusted_amount INTEGER DEFAULT 0, -- Amount adjusted if user subscribes

  -- Timestamps
  payment_initiated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  payment_completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- PhonePe Response Data (JSON)
  payment_response JSONB, -- Full PhonePe response for debugging

  -- Additional Notes
  notes TEXT,

  CONSTRAINT valid_payment_status CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'))
);

-- Create index for faster lookups by merchant transaction ID
CREATE INDEX IF NOT EXISTS idx_trial_payments_merchant_transaction_id
  ON public.trial_payments(merchant_transaction_id);

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_trial_payments_email
  ON public.trial_payments(email);

CREATE INDEX IF NOT EXISTS idx_trial_payments_phone
  ON public.trial_payments(phone);

-- Create index for payment status
CREATE INDEX IF NOT EXISTS idx_trial_payments_status
  ON public.trial_payments(payment_status);

-- Add comment to table
COMMENT ON TABLE public.trial_payments IS 'Stores all PhonePe payment transactions for trial token bookings';

-- ----------------------------------------------------------------------------
-- TABLE: trial_bookings
-- Stores actual booking details after successful payment
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trial_bookings (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key to payment
  payment_id UUID REFERENCES public.trial_payments(id) ON DELETE SET NULL,

  -- User Information (copied from payment for redundancy)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,

  -- Trial Details
  trial_location TEXT NOT NULL,
  trial_location_slug TEXT NOT NULL,

  -- Booking Dates
  check_in_date DATE,
  check_out_date DATE,
  duration_nights INTEGER DEFAULT 2,

  -- Booking Status
  booking_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, CONFIRMED, CANCELLED, COMPLETED
  confirmation_sent BOOLEAN DEFAULT false,

  -- Team Notes
  admin_notes TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_booking_status CHECK (booking_status IN ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'))
);

-- Create indexes for bookings
CREATE INDEX IF NOT EXISTS idx_trial_bookings_payment_id
  ON public.trial_bookings(payment_id);

CREATE INDEX IF NOT EXISTS idx_trial_bookings_email
  ON public.trial_bookings(email);

CREATE INDEX IF NOT EXISTS idx_trial_bookings_status
  ON public.trial_bookings(booking_status);

-- Add comment to table
COMMENT ON TABLE public.trial_bookings IS 'Stores confirmed trial bookings after successful payment';

-- ----------------------------------------------------------------------------
-- TABLE: subscription_adjustments
-- Tracks when trial tokens are adjusted toward full subscriptions
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_adjustments (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign Key to original payment
  trial_payment_id UUID NOT NULL REFERENCES public.trial_payments(id) ON DELETE CASCADE,

  -- Subscription Details
  subscription_id TEXT, -- Your internal subscription ID
  subscription_amount INTEGER NOT NULL, -- Full subscription amount (e.g., 1760000)

  -- Adjustment Details
  adjusted_token_amount INTEGER NOT NULL DEFAULT 1, -- Token amount applied
  remaining_balance INTEGER NOT NULL GENERATED ALWAYS AS (subscription_amount - adjusted_token_amount) STORED,

  -- Timestamps
  adjusted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Notes
  notes TEXT
);

-- Create index for adjustments
CREATE INDEX IF NOT EXISTS idx_subscription_adjustments_trial_payment_id
  ON public.subscription_adjustments(trial_payment_id);

-- Add comment to table
COMMENT ON TABLE public.subscription_adjustments IS 'Tracks when trial tokens are adjusted toward full 10-year subscriptions';

-- ----------------------------------------------------------------------------
-- FUNCTION: Update updated_at timestamp automatically
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_trial_payments_updated_at
  BEFORE UPDATE ON public.trial_payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trial_bookings_updated_at
  BEFORE UPDATE ON public.trial_bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS on all tables and set up policies
-- ----------------------------------------------------------------------------

-- Enable RLS
ALTER TABLE public.trial_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trial_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_adjustments ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role (backend) full access
CREATE POLICY "Service role has full access on trial_payments"
  ON public.trial_payments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access on trial_bookings"
  ON public.trial_bookings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access on subscription_adjustments"
  ON public.subscription_adjustments
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Users can only read their own payments (based on email)
CREATE POLICY "Users can read own trial_payments"
  ON public.trial_payments
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

CREATE POLICY "Users can read own trial_bookings"
  ON public.trial_bookings
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

-- ----------------------------------------------------------------------------
-- HELPER VIEW: payment_summary
-- A view to get payment statistics
-- ----------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.payment_summary AS
SELECT
  DATE_TRUNC('day', created_at) as payment_date,
  COUNT(*) as total_payments,
  COUNT(*) FILTER (WHERE payment_status = 'SUCCESS') as successful_payments,
  COUNT(*) FILTER (WHERE payment_status = 'PENDING') as pending_payments,
  COUNT(*) FILTER (WHERE payment_status = 'FAILED') as failed_payments,
  SUM(amount_in_rupees) FILTER (WHERE payment_status = 'SUCCESS') as total_revenue
FROM public.trial_payments
GROUP BY DATE_TRUNC('day', created_at)
ORDER BY payment_date DESC;

COMMENT ON VIEW public.payment_summary IS 'Daily summary of payment statistics';

-- ============================================================================
-- SAMPLE QUERIES FOR COMMON OPERATIONS
-- ============================================================================

-- -- 1. Get all successful payments with user details
-- SELECT
--   id,
--   merchant_transaction_id,
--   name,
--   email,
--   phone,
--   trial_location,
--   amount_in_rupees,
--   payment_status,
--   payment_initiated_at,
--   payment_completed_at
-- FROM public.trial_payments
-- WHERE payment_status = 'SUCCESS'
-- ORDER BY payment_completed_at DESC;

-- -- 2. Get payment status by merchant transaction ID
-- SELECT * FROM public.trial_payments
-- WHERE merchant_transaction_id = 'MT1234567890abcd';

-- -- 3. Get all bookings for a specific email
-- SELECT
--   tb.*,
--   tp.amount_in_rupees,
--   tp.payment_status
-- FROM public.trial_bookings tb
-- LEFT JOIN public.trial_payments tp ON tb.payment_id = tp.id
-- WHERE tb.email = 'user@example.com'
-- ORDER BY tb.created_at DESC;

-- -- 4. Update payment status (for webhook callback)
-- UPDATE public.trial_payments
-- SET
--   payment_status = 'SUCCESS',
--   payment_code = 'PAYMENT_SUCCESS',
--   payment_completed_at = NOW(),
--   payment_response = '{"success": true}'
-- WHERE merchant_transaction_id = 'MT1234567890abcd';

-- -- 5. Create a booking from a successful payment
-- INSERT INTO public.trial_bookings (
--   payment_id,
--   name,
--   email,
--   phone,
--   trial_location,
--   trial_location_slug,
--   booking_status
-- )
-- SELECT
--   id as payment_id,
--   name,
--   email,
--   phone,
--   trial_location,
--   trial_location_slug,
--   'PENDING' as booking_status
-- FROM public.trial_payments
-- WHERE merchant_transaction_id = 'MT1234567890abcd'
--   AND payment_status = 'SUCCESS'
--   AND NOT EXISTS (
--     SELECT 1 FROM public.trial_bookings
--     WHERE payment_id = trial_payments.id
--   );

-- ============================================================================
-- END OF SUPABASE SQL SCHEMA
-- ============================================================================

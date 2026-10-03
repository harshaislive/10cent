-- Envision storage setup applied on 3 October 2026 to project
-- isdbyvwocudnlwzghphw, through its authenticated SQL editor.
-- No existing booking/payment table was changed.
BEGIN;
CREATE SCHEMA IF NOT EXISTS tencent;
CREATE TABLE IF NOT EXISTS tencent.envision_journeys (
  token_hash text PRIMARY KEY CHECK (token_hash ~ '^[a-f0-9]{64}$'),
  revision integer NOT NULL CHECK (revision >= 1),
  document jsonb NOT NULL CHECK (jsonb_typeof(document) = 'object'),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK ((document->>'revision')::integer = revision)
);
ALTER TABLE tencent.envision_journeys ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE tencent.envision_journeys FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA tencent TO service_role;
GRANT SELECT, INSERT, UPDATE ON TABLE tencent.envision_journeys TO service_role;
CREATE INDEX IF NOT EXISTS envision_journeys_state_idx ON tencent.envision_journeys ((document->>'state'));
-- Only the server uses this table. Public responses omit contact data,
-- permission records, internal events, attribution and previous versions.
-- A 256-bit bearer link grants calendar view/edit access, not payment authority.
COMMIT;

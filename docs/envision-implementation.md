# Envision implementation

Local build, 3 October 2026.

## Available now

- `/envision`: six question screens for motivation, companions, travel, timing, rhythm and Beforest landscapes. Uses site catalogue photos and Arizona typography.
- `/my-year/[token]`: mobile-first cinematic calendar, continuous photo visits, personal one-liners, sticky night/break totals and month navigation. Editable dates/landscape/nights/group size, contact and separate channel permissions, private-link copy and Blyton trial handoff remain available.
- Anonymous progress is saved after each completed screen. Reopening `/envision` restores preferences; a generated year offers a resume path. A previously unanswered motive or place preference remains unknown in the record.
- The generator uses desired time away and timing preferences. It does not calculate paid member-nights, child eligibility, household entitlements or live accommodation availability. School holiday dates are not inferred. Route distance is not fabricated.
- Source tags, preferences, answer/calendar versions and an idempotent event history are stored server-side. Operating stage only advances through started, preferences added, generated, viewed, saved and trial interest. `trial_clicked` does not imply a submitted booking or solution awareness.

## Selected visual direction

Harsha selected the third concept, Cinematic Calendar, correcting the previous selection of the fifth. The implementation uses dark earth, ivory, rich red and coral controls, with actual Arizona brand typography. Green occurs only in natural landscape photography. Preferences still drive the calendar and marketing data; the shorter visual presentation does not remove collected answers.

Mobile checks covered 390 × 844 and 320 × 700; desktop covered 1440 × 900. Month jumps and continuous scroll worked. Editing five nights to four changed the total from 30 to 29 and survived reload. A synthetic contact saved with all messaging permissions unchecked. The preference edit link restored the selected motivation. No outbound messages or payments were made. Evidence: `docs/design/envision-cinematic/`; visual review: `design-qa.md`.

## Local preview storage

**Update, 3 October:** This checkout now sets `ENVISION_STORAGE_MODE=supabase` and saves to `tencent.envision_journeys` in project `isdbyvwocudnlwzghphw`. The reviewed table setup was applied through the authenticated SQL editor. All five existing local preview documents were copied and verified without changing their private links; their local files remain intact.

Verified through the running app API: generation, contact saving, editing, reopening, duplicate event replay, conflicting edits returning 409 and cross-origin writes returning 403. A direct database read matched the final revision and recorded one copy of the repeated event. The saved calendar also survived a development-server restart. One synthetic test journey is labelled `utm_source=envision_storage_test`; it has no email, WhatsApp or calling permissions. Exclude that source and migrated previews from live campaigns. Proof: `docs/design/envision-cinematic/database-verification.json`.

**Hosted update, 3 October:** Deployed commit `b7b626d` to https://10percent.beforest.co/envision through the existing Coolify app with runtime `ENVISION_STORAGE_MODE=supabase`. Hosted generation, saving, editing and reopening passed; a direct Supabase read matched the final revision and calendar. Proof: `docs/design/envision-cinematic/deployment-verification.json` and `deployed-mobile.png`. The synthetic hosted journey is labelled `utm_source=envision_deployment_test` and has all channel permissions unchecked. Exclude it from campaigns. This deployment does not activate messaging, shared audience automation or booking attribution.

### Local file fallback when explicitly developing without cloud storage

`next dev` uses `.local/envision`, which Git ignores. This is durable across development-server restarts on this machine, but is not cloud storage or a production database. Link filenames use a SHA-256 hash; the original bearer token is not stored server-side. The same link opens the latest calendar. Links expire after 180 days in this first implementation; review retention/access terms before deployment.

Local writes are serialized per journey and use atomic file replacement. This adapter supports one local process. Supabase uses revision-based conditional updates and retries, so concurrent database writes cannot silently erase event history. A repeated event ID does not apply again.

Default production saving is disabled unless `ENVISION_STORAGE_MODE=supabase` is explicitly set. It never silently falls back to local files in production.

## Database deployment work

`docs/envision-storage.sql` was applied to the configured project on 3 October. The server adapter uses `tencent.envision_journeys`. Each record includes contact permissions, source tags, full event history and calendar versions in its document. Direct anonymous/authenticated table access is revoked; only the server service role accesses it. It does not modify booking or payment records.

Deployment checks completed and remaining integration work:

1. Completed: deployment targets the verified database and reviewed schema.
2. Completed: `ENVISION_STORAGE_MODE=supabase` is set in the deployed runtime; hosted generation, saving, editing and reopening passed.
3. Decide whether an owner login is needed in addition to the private bearer link. Anyone holding a link can view and edit the imagined calendar; contact email/phone and permission history are not returned by the public API.
4. Add durable edge rate limits. The local start endpoint uses an in-process throttle only.
5. Connect identity from the walkthrough rather than asking for details again. Anonymous and known journeys are not yet deduplicated across separate links by contact identity.
6. Connect events and stages to Windmill's shared audience projector/outbox, inactivity timers and reminder cancellation. No nurture is dispatched in this build.
7. Verify trial request attribution end to end. The CTA opens the existing `/?trial=booking` route with `calendar_id`; date/party prefill and booking-side identity joins remain pending.

## Analytics and messages

External production analytics do not run in development. Envision and private calendar routes do not load the global GA/Meta wrapper or Typeform scripts. Opening the generated year uses a fresh document to clear scripts from previous pages. Future production measurement must send approved events without bearer tokens or contact data. The local journey event ledger runs independently of external analytics.

Saving details does not send email, WhatsApp or a call. Delivery adapters, templates, Sarvam/OpenClaw orchestration and production reporting are subsequent tasks.

## Sources

Names/descriptions/photo URLs: existing `src/app/page.tsx`, collective cards and Blyton section. Preferences: Harsha's reviewed question design and 3 October imaginative-calendar scope correction.

Server adapter uses filtered conditional updates as documented at https://supabase.com/docs/reference/javascript/update and server-only table permissions following https://supabase.com/docs/guides/database/postgres/row-level-security.

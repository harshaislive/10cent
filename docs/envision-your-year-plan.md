# Envision your life with 10cent

Planning brief, 1 October 2026. Repository inspected on master at 51d5caf. No implementation or live integration changes made.

Scope corrected by Harsha, 3 October 2026: Envision is an imaginative calendar. Membership allowance, child counting, household eligibility and permitted stay lengths do not gate this experience. Those rules belong to actual offers and booking.

## Purpose

Help a visitor picture recurring time in Beforest landscapes, save a personal calendar, and request a suitable trial at Blyton. This is the modular experience lead magnet, separate from the internal pricing calculator.

## Build sequence

1. Establish the Beforest catalogue using names, descriptions and existing photography from the site: Poomaale 1.0, Poomaale 2.0, Hammiyala, Hyderabad, Bhopal and Mumbai. Use original Beforest archive imagery where more photos are needed. Suggested visits are imaginative; actual booking options come from the existing trial journey. Do not invent facilities or seasonal claims.
2. Add a dedicated `/envision` route with six short question screens covering what they want from time away, who is coming, travel effort, timing, stay rhythm and preferred landscapes. Each answer should improve both the calendar and subsequent messages. Use the question-to-message mapping in `docs/envision-your-year-questions.md`. Ask about concerns and the next step after showing the result. Reuse existing brand fonts and image handling. Capture name/email during the walkthrough handoff and WhatsApp for sending the saved calendar, with separate channel permissions.
3. Create a repeatable imaginative calendar generator. Use preferred timing, stay rhythm, companions and selected places to suggest visits without overlapping dates. Let people edit dates, places, group size and desired time away. Show suggested nights as time in their imagined year, not as a membership allowance. Do not apply child-counting rules, entitlement deductions, eligibility gates or leftover member-night balances.
4. Show an image-led year view and a readable list of proposed visits. Each card shows collective, photo, suggested dates, stay length and companions, with a reason it fits their choices. Add a short note: "A picture of your possible year. Actual stays depend on availability and booking terms." No membership entitlement or reservation is created by this calendar.
5. Save preferences and calendar versions in the database. Return a stable private link with no personal data in its URL. Provide explicit access controls and a manageable way to reopen and edit it. Agree retention and link expiry rules before production.
6. Connect the trial CTA to the existing Blyton booking journey. Carry their preferred timing and party details where supported, then check real dates, rooms, guest eligibility and prices there. A suggested visit to another collective can still lead to a first trial at Blyton; explain that invitation clearly. Offer alternatives if preferred dates are unavailable. Reuse the checkout and confirmation bridge rather than creating a second payment flow.
7. Add lead-magnet started, preferences saved, result generated, result viewed, result edited, link requested, question asked and trial handoff events. Include lead-magnet ID/version, session/person IDs, source attribution and dedupe keys. Keep stated preferences separate from observed behaviour and agent interpretations. Save answer changes so future messages use the latest preferences. Integrate with the shared state and outbox plan. Schedule relevant follow-ups separately; preview them first.
8. Verify mobile usability, accessibility, preference-based suggestions, date edits, overlapping dates, private-link access, persistence, event dedupe and the handoff to actual trial availability. Run type checks and the production build. Present the local journey for review before deployment.

## Reuse from this repository

- Next.js App Router, TypeScript, Tailwind and existing Beforest brand assets.
- Collective information and photo references currently in `src/app/page.tsx`.
- Blyton room/date flow in `TrialStayRequestFormEzeeV3.tsx` and existing availability routes.
- Trial funnel event route and analytics components, after checking their contract.
- Existing external experiences checkout bridge and payment confirmation flow.

## Information still to confirm

- Any additional factual landscape descriptions or imagery beyond the existing website catalogue. Actual stay eligibility is checked in the booking journey.
- Whether calendar date suggestions use preferred weekends, manually chosen dates, or both.
- Database connection verified read-only on 3 October 2026 using the local `.env`: existing `tencent.trial_requests`, `tencent.trial_funnel_events` and `tencent.trial_followup_messages` returned HTTP 200 with zero rows requested. Envision storage tables and access controls still need implementation. Establish the intended development/write boundary before applying schema changes. Local preview also needs a local base URL and non-production analytics setting; dependencies are not yet installed.
- Trial pricing and the existing external checkout contract before showing paid offers. The agreed membership-credit window is 30 days after verified trial completion.

## Deliverable order

First: website landscape catalogue and one local input-to-imaginative-calendar vertical slice. Sunith's commercial rules are not a prerequisite.
Second: editable calendar and private saved links.
Third: Blyton trial handoff and measured events.
Fourth: staged personalised nurture integration and rollout checks.

Completed work should include a preview, source references and verification evidence in the 10percent Funnel Space. This document does not create Zoho tasks; owner and start/end dates must be supplied by Harsha first.

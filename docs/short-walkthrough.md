# Short walkthrough: 10% Life

Route: `/10percent-life`. Built in the same Next.js app as `/envision`.

## Narrative source

Read `harshaislive/gemini-live-ppt`, branch `direct-gemini`, commit `22a884e51942984e14f8e92e5e84a973e8fbdd5d`.

The current narrated flow is defined by `client/app/presentationScript.ts`, which pairs eight committed WAV files with transcripts. The short page condenses that sequence, rather than copying the older flow and pricing notes in `server/content/knowledge/`.

| Short page | Narration source |
| --- | --- |
| The land comes first | 01-opening-definition.wav |
| Recurring access without ownership; a rhythm of return | 02-access-without-ownership.wav, 03-why-ten-percent.wav |
| Person-nights and the relationship to landscapes | 04-what-it-feels-like.wav, 05-proof-and-limit.wav |
| Living, working collectives | 06-membership-structure.wav |
| Trial at Blyton after the personal-year bridge | 07-blyton-first.wav, 08-decision-close.wav |

The extra Envision step follows Harsha's agreed funnel. The cloned walkthrough currently points its trial CTA directly at `https://10percent.beforest.co/?trial=booking`. That producer is unchanged in this implementation.

## Experience

Mobile-first photo-led story, Arizona Flare throughout, Beforest earth/red/paper colours, four reading chapters, horizontally scrollable real landscape cards, an illustrative calendar preview, native expandable FAQs and a sticky Envision invitation. No autoplay audio, passcode gate, contact form, pricing claim or free-trial claim on this page.

Photographs reuse the existing 10cent library: PBR_0209, the Blyton verandah and the source-backed landscape images in `src/lib/envision/model.ts`. Membership is described in **person-nights**. The calendar preview is explicitly illustrative and does not promise availability or entitlements.

## Handoff

- Ordinary anchors load Envision as a fresh document.
- UTMs are preserved in the server-rendered destination, before hydration.
- `entry_path=short_walkthrough` and an optional `recovery_bucket=25|50|75|100` are saved in a newly created Envision journey's attribution.
- `watched=50` is a convenient campaign URL input. It is unverified campaign context, never watch evidence, identity, permission or an audience-state override.
- Names, emails, phone numbers, passcodes and private calendar tokens are excluded from the handoff.
- The existing Envision adapter resumes a browser's saved journey. An existing journey retains its original acquisition attribution. Recording later recovery assists against an existing journey remains a shared-ledger task.
- Typeform scripts and its competing mobile CTA are excluded on this route.

Example campaign link: `/10percent-life?utm_source=meta&utm_medium=retargeting&utm_campaign=walkthrough_recovery&watched=50`.

## Measurement boundary

Browser signals: `reading_page_viewed`, `reading_section_viewed`, `reading_faq_opened`, `envision_clicked`. They are exposed through `dataLayer` and the `beforest:reading` event, and sent to GA when the existing GA runtime is available. A bounded sessionStorage trace is only preview evidence. These signals are **not yet persisted to a shared database event ledger**, and GA delivery is not guaranteed before its script loads. Windmill recovery scheduling and cancellation are separate pending integrations.

No page view is classified automatically as solution awareness or a trial request. No messages, calls, booking or payment jobs are dispatched here.

## Verification

5 October: type checks passed; 320 × 700, 390 × 844 and 1440 × 900 browser review passed with no document-level horizontal overflow. Arizona was used in inspected copy and controls. FAQ expansion and the Envision CTA worked. Campaign and bucket context matched the synthetic record in `tencent.envision_journeys` after saving a preference. Existing saved-year routing was also observed.

The synthetic source `short_walkthrough_test` must be excluded from campaigns. No contact was attached to that test record.

Browser proof: `C:/Users/harsh/.codex/visualizations/2026/10/05/short-walkthrough/`. Production build/deployment results are recorded in the parent rollout note after completion.

Existing Supabase filtering was verified against https://supabase.com/docs/reference/javascript/using-filters. No schema, credentials, runtime environment or table-permission changes were needed.

## Golden thread copy refinement, 5 October

The page now carries one promise: **Give time in nature a place in your year.** The headings move from room for wilderness, to knowing a place, to returning, choosing landscapes, picturing a personal year and experiencing Blyton. All primary invitations say Envision your year. Metadata follows the same promise.

The reusable source-backed method is versioned under `docs/skills/golden-thread-copywriting/` and installed in Harsha's Codex skills. Its Beforest guide preserves paid-trial, illustrative-calendar and person-night distinctions. No design, booking, payment or attribution behavior was changed. Type checks, production build and responsive review passed at 320, 390 and 1440 pixels.

## Four clear hero versions

Harsha approved the four direct headline/subline pairs and requested rotation. The hero defaults to "Stay in nature. Come back throughout the year." Each pair changes together every 12 seconds. Grid stacking reserves the longest copy's height, keeping Envision in one position. Numbered selection pauses the rotation; a separate pause/resume button gives control. Keyboard focus on the copy/CTA pauses it. Hover pauses temporarily. Hidden tabs and off-screen heroes stop the timer. Reduced-motion visitors receive a static default and can choose other versions manually. Automatic changes are not announced as a live region.

Local type checking/build and rendered checks passed. All four pairs showed without overlap at 390px, with identical CTA positions. A 320px check passed for overflow and CTA clearance. Desktop and automatic advancement were checked separately. This is a presentation rotation, not a conversion experiment or an audience-classification rule. Attribution and the Envision destination are unchanged.

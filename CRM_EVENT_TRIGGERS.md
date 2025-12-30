# The 10% Club: Customer Lifecycle & Event Triggers

This document maps the **Zoho CRM Stages** to specific website actions and defines the communication triggers required to facilitate a "Grand & Premium" member experience.

The goal is to automate high-touch, editorial-style communications that build anticipation, confirm status, and deepen the member's relationship with the brand ("The Art of Return").

---

## 1. CRM Stage: Webinar Registered
**Status:** *The Initiate*
**Goal:** Build anticipation and ensure attendance.

| Event / Trigger | Timeframe | Website Source | Communication Theme |
| :--- | :--- | :--- | :--- |
| **Registration Confirmed** | Immediate | Typeform Submission / `webinar_registration` | **"The Seat is Held."**<br>Confirm the date. Emphasize that this is a curated conversation, not a broadcast. |
| **The Preparation** | 48 Hours Before | Automated Cron | **"Prepare for Silence."**<br>Send a "Manifesto" or a short read (e.g., "Why We Are Exhausted"). Ask them to come prepared to listen, not just watch. |
| **The Gathering** | 1 Hour Before | Automated Cron | **"The Doors Open."**<br>Direct link. Reminder that this session will not be purely transactional. |

---

## 2. CRM Stage: Webinar Attended
**Status:** *The Observer*
**Goal:** Move from passive observation to active trial.

| Event / Trigger | Timeframe | Zoom/Webinar Integration | Communication Theme |
| :--- | :--- | :--- | :--- |
| **The Protocol Continues** | 2 Hours Post-Webinar | `webinar_attended` webhook | **"The Conversation Has Just Begun."**<br>Thank them for their time. Invite them to the next step: The Trial. Link to `/confirmation?action=trial`. |
| **The Missed Connection** (If No Show) | 2 Hours Post-Webinar | `webinar_absent` webhook | **"The Empty Chair."**<br>We missed you. Here is the recording. The wilderness waits for no one, but we have held the door ajar for 24 hours. |
| **Nurture: The Philosophy** | +3 Days | CRM Workflow | **"The 10% Solution."**<br>Deep dive into the math of happiness (30 days/10 years). Soft nudge to Trial. |

---

## 3. CRM Stage: Trial User (Token Paid)
**Status:** *The Seeker*
**Goal:** Ensure the trial experience is flawless and "magic" to justify the ₹17.6L upgrade.
**Website Action:** User pays ₹1 token via `PaymentSuccessPage`.

| Event / Trigger | Timeframe | Website Source | Communication Theme |
| :--- | :--- | :--- | :--- |
| **Token Secured** | Immediate | `payment_success` | **"The Commitment."**<br>Formal acknowledgement of the token. "You have taken the first step." |
| **Booking Confirmed** | Manual/Admin Approval | `booking_confirmed` | **"The Sanctuary Awaits."**<br>Dates locked (e.g., Blyton, Coorg). Itinerary revealed. |
| **Pre-Arrival Guide** | 3 Days Before Check-in | CRM Date Field | **"Pack Light, Carry Less."**<br>What to bring. More importantly, what to leave behind (laptop, anxiety). Weather and wildlife forecast. |
| **Arrival Morning** | Day of Check-in | CRM Date Field | **"Welcome Home."**<br>SMS/WhatsApp: "The gate is open. The coffee is brewing. Drive safe." |
| **The Departure** | Day of Check-out | CRM Date Field | **"The Return."**<br>"You return to the city today, but you do not leave the forest behind." |
| **The Reflection** | +1 Day Post-Stay | CRM Workflow | **"How Was The Silence?"**<br>Feedback form. Not a generic survey—questions about how they *felt*. |

---

## 4. CRM Stage: Active Prospect
**Status:** *The Candidate*
**Goal:** Convert Trial User to Full Member (₹17.6L).
**Website Action:** User schedules onboarding call via `OnboardingScheduler`.

| Event / Trigger | Timeframe | Website Source | Communication Theme |
| :--- | :--- | :--- | :--- |
| **Call Scheduled** | Immediate | `schedule-call` API | **"The Protocol Begins."**<br>Calendar invite. "We prepare for our conversation on [Date]." |
| **Call Reminder** | 2 Hours Before | CRM Workflow | **"A Moment of Pause."**<br>Reminder of the onboarding call. "Please have your questions ready." |
| **Post-Call Proposal** | Post-Call | Manual Trigger | **"The Covenant."**<br>The formal invitation to join the 10% Club. Payment link for the full membership. |

---

## 5. CRM Stage: Member Onboarding
**Status:** *The Member*
**Goal:** Celebration, Validation, and Logistics.
**Website Action:** Full Membership Payment Completed.

| Event / Trigger | Timeframe | Website Source | Communication Theme |
| :--- | :--- | :--- | :--- |
| **Welcome to the Fold** | Immediate | Payment Success | **"You Are One of Us."**<br>Grand welcome email. Digital Membership Card. Access to the "Inner Circle" portal. |
| **The Welcome Kit** | +7 Days | Logistics Trigger | **"A Physical Token."**<br>Notification that the Welcome Kit (Keys/Journal/Artifact) has been shipped. |
| **First Booking Prompt** | +30 Days | CRM Workflow | **"The Forest Misses You."**<br>If they haven't booked their first official stay yet. "Your 30 nights await." |

---

## 6. The Legacy (Lifecycle & Reputation)
**Status:** *The Custodian*
**Goal:** Increase Recency, Frequency, and Brand Evangelism.

| Event / Trigger | Frequency | Trigger Logic | Communication Theme |
| :--- | :--- | :--- | :--- |
| **The Anniversary** | Yearly | Join Date | **"One Year of Return."**<br>Recap of their stays. Impact report (e.g., "You protected X acres this year"). |
| **New Collective Launch** | Ad-hoc | New Product | **"A New Sanctuary."**<br>Exclusive first access to new properties (e.g., Bhopal/Mumbai launch). |
| **Seasonal Rhythms** | Quarterly | Season Change | **"The Monsoons Have Arrived."**<br>Editorial update on how the landscape is changing. "Come see the rain in Coorg." |
| **The Gift of Silence** | Ad-hoc | Referral System | **"Share the Quiet."**<br>Invite a friend to experience a trial. "The greatest gift is peace." |

---

## Technical Implementation Notes

### Webhooks needed:
1.  `webinar_registration` -> Zoho CRM (Create Lead)
2.  `trial_request` -> Zoho CRM (Update Stage: Trial User)
3.  `payment_success` (Token) -> Zoho CRM (Update Field: Token Paid)
4.  `schedule_call` -> Zoho CRM (Update Stage: Active Prospect, Create Meeting)

### Database Tables (Supabase):
*   `trial_requests` (Existing)
*   `trial_payments` (Existing)
*   `onboarding_calls` (Created)
*   `member_events` (Proposed: To track attendance and stay history)

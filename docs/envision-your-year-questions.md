# Questions that make the year and the conversation personal

Planning proposal, 1 October 2026. This updates the experience-calculator question design. It does not implement the form or start any messages.

Scope corrected by Harsha, 3 October 2026: these answers create an imaginative year and useful marketing preferences. They do not calculate membership entitlements. Actual guest rules, availability and pricing belong to the existing booking and offer pages.

## What we want to learn

The calendar is the immediate result. The answers also help us understand why someone is interested, what would make a stay practical, and what they need before requesting a trial.

Use six short screens with visual choices. Let people say "Help me choose" or "I'm not sure". Show the year before asking follow-up questions about concerns. Reuse answers already given in the walkthrough rather than asking twice.

## Before the result

| Screen and question | Suggested choices and follow-up | What it changes in the calendar | What it changes in our messages |
| --- | --- | --- | --- |
| 1. What would you like more room for in your year? | Choose up to two: time together as a family; quiet time on my own; time together as a couple; walking and exploring; getting to know a place through return visits. Optional: "Something else". | Explain each stay through their chosen reason, using verified experiences. | Lead with their reason for coming. A family message can talk about time together; a solo message can talk about time to themselves. |
| 2. Who would you picture coming with you? | Solo; partner; family; friends; it varies. Then ask how many people they picture, optionally distinguishing adults and children. Ask "Would you sometimes come on your own?" only when useful. | Show the companions they picture on each visit. Let group size change between visits without applying membership or child-counting rules. | Use the right party angle and practical guidance. Do not assume every family wants children's activities or every solo visitor wants solitude. |
| 3. Where would you usually start your journey? | Home city. Then: "What kind of journey would feel manageable?" A nearby drive; a longer drive; a flight is fine; help me choose. | Suggest plausible places and explain travel assumptions. Use verified travel information when available. | Address the effort of getting there. Do not describe a place as nearby until the route is checked. |
| 4. When is it easiest for you to make time? | Weekends; school holidays; planned leave; flexible weekdays; not sure. Optional months or date windows, with multiple selections. Seasons can be a visual preference within this screen. | Fit suggested stays around their actual availability. Label dates as suggestions, not reservations. | Refer to the window they chose. Offer to check a suitable trial date instead of sending a generic invitation. |
| 5. What rhythm would suit you? | A few short stays; fewer longer stays; a mix; help me choose. Let them pick a typical stay length and whether they prefer returning to one place or exploring several. | Spread imagined visits across their preferred windows. Show desired time away without tying it to a paid allowance or showing entitlement leftovers. | Talk about the rhythm they chose. Refer to imagined visits as possibilities, not purchased nights. |
| 6. Which Beforest landscapes would you like to spend time in? | Real photos and names from the website catalogue. Choose favourites, or "Help me choose". Offer a short factual description for each. | Select relevant places for the imagined year. Actual booking options are checked in the existing trial journey. | Use the places they selected and authentic images. Invite them to a first trial at Blyton even if they pictured another landscape, explaining the connection without implying the other place is currently bookable. |

Introductory copy: "Let's make room for time in the wilderness. A few choices will help us picture a year that fits your life."

An unknown answer is useful. It tells us to help someone choose rather than pretend we know their preference. Companions personalise the imagined visits and messages; they do not consume member-night credits here. Add a short result note: "A picture of your possible year. Actual stays depend on availability and booking terms."

## After they see their year

These are optional choices beside the result, not another required questionnaire.

| Question | Choices | How we use it |
| --- | --- | --- |
| Does this year feel like yours? | Looks right; change the dates; change the places; change who is coming. | Save changes, regenerate the year and use the latest version in future messages. |
| What would you like to understand before trying a stay? | How the membership works; what a stay is like; travelling with my group; dates and availability; pricing; something else; nothing yet. | Answer that specific concern from the approved knowledge base, then offer the relevant next step. Do not treat every question as a booking request. |
| Would you like to try a stay from this year? | Check trial dates; ask a question; keep exploring my year. | Record an explicit action. Trial-date interest opens the existing Blyton journey; a question opens WhatsApp help; exploration remains in the relevant nurture stage. |

Name and email come from the walkthrough where available. Ask for WhatsApp when they request their saved year. Explain delivery and follow-up separately, and keep WhatsApp, email and calling permissions separate. Requesting a link does not itself grant permission for calls.

Do not ask for income, children's names or exact ages, or other personal information that does not improve this experience. Ask about pricing preferences later if they want help comparing confirmed offers.

## Examples of how an answer becomes a useful message

Draft examples for review. Send only when the underlying selections and calendar are present. A suggested date needs an availability check before booking.

- Family of three, time together, school holidays: "You chose more time together and the school holidays. Your year includes a stay for the three of you in [selected month]. Would you like us to check a Blyton trial that fits that window?"
- Solo, walking and exploring, flexible weekdays: "You chose walking and exploring, with room to travel on weekdays. Reopen your year to see the places you picked, or check dates for a Blyton trial."
- Unsure about travel: "You wanted to understand the journey before choosing dates. Tell us where you would be travelling from and we can help with verified information about getting to Blyton."
- Started but did not see the result: "Your year is saved where you left it. Open your link to continue choosing the places and dates that fit you."

Use one useful next step in each message. Do not repeat the entire profile back to someone. Use real calendar details, not guessed motives, invented availability or generic urgency.

## What the database needs to remember

- Their stated preferences: reasons, party type, adults/children count, variable group size, home city, travel preference, available windows, stay rhythm, preferred places and concerns.
- Their calendar: stable private link, calendar ID, version, suggested stays, edits, and whether availability has actually been checked.
- Their actions: start, abandon, return, generate, view, edit, reopen from a message, ask a question, check trial dates and request a trial. Viewing a result is different from merely generating one.
- Their permissions: separate delivery/follow-up choices for each channel, with source and timestamp.
- Their history: answer changes with timestamps and source. Link records to the known person only when identity is resolved; keep anonymous sessions separate until then.
- Agent interpretations: classification, supporting evidence, confidence and model/rule version. Store these separately from what the person explicitly told us.

Avoid a single rigid "solo" or "family" label. A person can plan a family stay now and a solo stay later. Use the party and motive relevant to the next proposed stay.

## How agents choose the next conversation

1. Windmill saves the action and the latest answers, then checks the person's current stage and channel permissions.
2. Jev interprets the evidence. Missing answers stay unknown. Generating a calendar does not prove purchase intent or affordability.
3. The OpenClaw nurture agent selects the reason, calendar stay and concern relevant to the next step. It uses approved knowledge for the message; arithmetic, availability and payment facts come from their source systems.
4. Windmill schedules one permitted touch through the shared outbox. Existing recovery limits apply: days 1, 4 and 8, at most three scheduled recovery touches across channels in that sequence. Link delivery is a requested service action and is tracked separately. Progress or a reply cancels obsolete reminders.
5. WhatsApp questions and Sarvam call outcomes update the same record. Sarvam is considered only after calculator use or for resume help, with calling permission and a suitable reason.
6. A submitted trial request stops awareness recovery and starts main product nurture. Existing booking follow-ups continue according to the verified booking stage. The agreed trial-credit window begins after verified stay completion and lasts 30 days.

## What we measure

Measure starts and exits at each question, result views, saved-link requests, return visits, trial-date checks and submitted trial requests. Compare these by stated motive, party, timing and source. Compare personalised messages with a baseline within comparable stages; delivery or an open alone does not establish impact.

Keep solution awareness as an evidence-based interpretation, not an automatic label for every calculator user. Our conversion goal remains trial requests.

## Tasks to include in implementation

1. Use the six proposed screens and the existing website landscape catalogue. Sunith's membership and child-counting rules do not block Envision; apply confirmed commercial rules in actual offers and booking instead.
2. Build the typed answer model, editable calendar records and preference history.
3. Add per-question and journey events, private saved links and identity linking.
4. Draft message variants by motive, party, timing and concern, with an approved knowledge source for each claim.
5. Connect the state/outbox workflow and cancellation rules, then preview messages using synthetic profiles.
6. Add a report showing question drop-offs and trial requests by preference segment.

These are local planning tasks. Any Zoho task creation belongs in the BI project and needs Harsha's explicit owner, start date and end date first.

import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import StickyTrialCta from '@/components/StickyTrialCta'

export const metadata: Metadata = {
  title: 'The Second Conversation | Beforest 10cent Club',
  description:
    'A clear summary of the March 14, 2026 10% Lifestyle webinar, with the central argument and the practical clarifications that followed.',
}

const openingBullets = [
  'This was not presented as a resort offer or a holiday discount.',
  'It was framed as a disciplined periodic reset, not as escapism.',
  'It was positioned as a doorway into the Beforest landscapes for people not yet ready for ownership.',
]

const questions = [
  'Why is the allocation counted as 30 person-nights instead of family nights?',
  'What exactly does the INR 17.6 lakh include?',
  'Can the nights be used across different collectives?',
  'How many members will be admitted at this stage?',
  'Can families come, and do children count toward the allocation?',
  'If someone later joins a collective, can this fee be adjusted?',
]

const clarifications = [
  'The structure discussed was 30 person-nights a year across Beforest hospitality landscapes, over a 10-year period, at INR 17.6 lakh.',
  'The framing remained consistent: this is access, not ownership, and not an investment substitute for joining a collective.',
  'The stay includes accommodation, three meals, snacks, and coffee; additional community kitchen purchases, where available, are separate.',
  'Immediate family can join, but usage is still counted against person-nights; children below 12 do not count toward that tally.',
  'Members can use nights across current and future collectives, subject to availability, with capacity initially limited to roughly 100 to 120 members.',
]

const faqItems = [
  {
    question: 'Why is the allocation counted as 30 person-nights instead of family nights?',
    answer:
      'Because the product was explicitly designed as an individual commitment first. The argument in the room was that real transformation happens at the level of personal rhythm, even if immediate family participation is still allowed.',
  },
  {
    question: 'What exactly does the INR 17.6 lakh include?',
    answer:
      'It includes the stay itself along with meals, snacks, and coffee. The practical framing was simple: the core hospitality needed for the reset is included, while optional extras such as community kitchen purchases are not.',
  },
  {
    question: 'Can the nights be used across different collectives?',
    answer:
      'Yes. The explanation given was that members can book across existing and future Beforest collectives, subject to availability, rather than being tied to a single location.',
  },
  {
    question: 'How many members will be admitted at this stage?',
    answer:
      'The rollout described in the webinar was intentionally limited to around 100 to 120 members. The stated reason was to protect booking reliability and expand only when capacity grows.',
  },
  {
    question: 'Can families come, and do children count toward the allocation?',
    answer:
      'Immediate family participation is allowed, but it is still counted within the person-night structure. Children below 12 were explicitly excluded from that count.',
  },
  {
    question: 'If someone later joins a collective, can this fee be adjusted?',
    answer:
      'Yes, that possibility was presented as part of the on-ramp logic. If someone later becomes a permanent member in a collective, the experience fee can be offset toward that move, subject to availability in the relevant collective.',
  },
]

const audioClipUrl = '/10-Percent-Lifestyle-Beforest-14march_2026-03-14-clip.mp3'

export default function SecondConversationPage() {
  return (
    <main className="min-h-screen bg-warm-white pb-32 text-text-primary">
      <section className="section-padding pb-8">
        <div className="container-max max-w-6xl">
          <div className="border-b border-text-primary/10 pb-6 text-xs uppercase tracking-[0.26em] text-text-secondary">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src="/10-Club-01.png"
                  alt="Beforest 10% Club"
                  width={80}
                  height={80}
                  className="h-12 w-auto"
                  priority
                />
              </Link>
              <span>March 14, 2026 • The Second Gathering</span>
            </div>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-brand-red">
                The Second Conversation
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-light leading-[0.94] md:text-7xl">
                The 10% Lifestyle
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-text-secondary md:text-xl">
                March 14, 2026
              </p>

              <div className="mt-10 max-w-3xl space-y-6 text-lg leading-relaxed text-text-secondary md:text-xl">
                <p>
                  This page is for those who joined the second webinar and for those who
                  want the argument in its cleaner form.
                </p>
                <p>
                  It keeps the central thesis, the practical concerns raised in the room,
                  and the decisions that followed, without the friction of the live call.
                </p>
              </div>
            </div>

            <aside className="border-t border-text-primary/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                Opening Position
              </p>
              <ul className="mt-5 space-y-4">
                {openingBullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-red" />
                    <span className="text-base leading-relaxed text-text-secondary">{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 border-t border-text-primary/10 pt-6">
                <div className="text-3xl font-light text-brand-red">Summary</div>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  A second room, a clearer explanation, and sharper operational questions.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding py-8">
        <div className="container-max max-w-6xl">
          <div className="border-y border-text-primary/10 py-8">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                  Recording
                </p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  This session was recorded as audio.
                </h2>
                <p className="mt-6 max-w-xl text-base leading-relaxed text-text-secondary md:text-lg">
                  The audio excerpt used for this page sits here, and the rest of the page
                  carries the essential frame and practical clarifications from the room.
                </p>
              </div>

              <div className="rounded-[2rem] border border-text-primary/10 bg-[#f6f1e9] p-8 shadow-[0_20px_60px_rgba(0,33,64,0.08)]">
                <div className="rounded-[1.5rem] border border-text-primary/10 bg-[#fbf7f0] px-6 py-8">
                  <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                    Audio Recording
                  </p>
                  <p className="mt-4 text-2xl font-light text-text-primary md:text-3xl">
                    Listen to the webinar segment used for this page.
                  </p>
                  <p className="mt-4 max-w-lg text-base leading-relaxed text-text-secondary">
                    This page uses only the portion from 09:18 to 48:31 of the March 14
                    recording.
                  </p>
                  <audio
                    controls
                    preload="metadata"
                    className="mt-6 w-full"
                    src={audioClipUrl}
                  >
                    Your browser does not support the audio element.
                  </audio>
                  <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                    Clip window: 09:18 to 48:31.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-12 pt-8 lg:grid-cols-[1fr_1fr]">
            <article>
              <div className="border-b border-text-primary/10 pb-4">
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                  Main Argument
                </p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  What We Wanted To Make Clear
                </h2>
              </div>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>
                  The core argument was not about travel, leisure, or discounted access. It
                  was about the nervous system. The webinar made the case that modern life
                  produces a continuous layer of hidden stress because our bodies are asked
                  to process environments they did not evolve for.
                </p>
                <p>
                  The answer proposed was not escape. It was rhythm. Protect 10% of life,
                  or roughly 30 days a year, for immersion in restored natural landscapes
                  that allow the system to reset instead of merely being distracted.
                </p>
                <p>
                  That is why the 10% Lifestyle was described as narrower than a hospitality
                  product and more serious than a holiday product. It is meant to function
                  as recurring calibration.
                </p>
                <p>
                  The offer therefore sits between alignment and ownership: a structured
                  doorway for those who feel the pull of this life but are not yet ready to
                  enter a collective fully.
                </p>
              </div>
            </article>

            <article>
              <div className="border-b border-text-primary/10 pb-4">
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                  What We Discussed
                </p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  The practical points we covered
                </h2>
              </div>

              <ul className="mt-8 space-y-4">
                {clarifications.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 border-b border-text-primary/8 pb-4"
                  >
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-red" />
                    <span className="text-base leading-relaxed text-text-secondary md:text-lg">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding py-8">
        <div className="container-max max-w-6xl">
          <div className="border-y border-text-primary/10 py-8">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                  Questions Raised In The Room
                </p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  The questions moved quickly to execution.
                  <span className="block">That was the right move.</span>
                </h2>
              </div>

              <div className="grid gap-3">
                {questions.map((question) => (
                  <div
                    key={question}
                    className="border-b border-text-primary/10 pb-3 text-base leading-relaxed text-text-secondary md:text-lg"
                  >
                    {question}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding py-8">
        <div className="container-max max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
            <article>
              <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                What The Evening Revealed
              </p>
              <h2 className="mt-3 text-3xl font-light md:text-5xl">
                The room did not ask leisure questions. It asked structural ones.
              </h2>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>
                  People asked about counting logic, cross-collective access, meals,
                  membership caps, children, and what happens if this later turns into
                  collective participation.
                </p>
                <p>
                  That mattered. It meant the conversation had already moved beyond vague
                  interest and into how this would actually be lived.
                </p>
              </div>
            </article>

            <article>
              <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                Closing Note
              </p>
              <h2 className="mt-3 text-3xl font-light md:text-5xl">
                What remains after the second conversation
              </h2>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>
                  The claim remained firm: nature is not being offered here as indulgence.
                  It is being offered as a recurring condition for steadiness, clarity, and
                  return.
                </p>
                <p>
                  This page is meant to preserve that claim in a form that is easier to
                  revisit, share, and act on.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="section-padding pt-4">
        <div className="container-max max-w-6xl">
          <div className="border-t border-text-primary/10 pt-8">
            <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">FAQ</p>
            <h2 className="mt-3 text-3xl font-light md:text-5xl">
              Questions that came up in the room
            </h2>

            <div className="mt-10 divide-y divide-text-primary/10 border-y border-text-primary/10">
              {faqItems.map((item) => (
                <div
                  key={item.question}
                  className="grid gap-4 py-6 md:grid-cols-[0.42fr_0.58fr] md:gap-8"
                >
                  <h3 className="text-lg font-light leading-relaxed text-text-primary md:text-2xl">
                    {item.question}
                  </h3>
                  <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div id="embedded-trial-cta" className="mt-10">
              <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">
                Next Steps
              </p>
              <h3 className="mt-3 text-2xl font-light text-text-primary md:text-4xl">
                Continue in the way that feels right to you.
              </h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-text-primary/10 bg-[#fdfbf7] p-6">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-text-secondary">
                    Experience Before Commitment
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-primary md:text-base">
                    The landscapes will make the argument more clearly than any webinar can.
                  </p>
                  <div className="mt-5">
                    <a
                      href="https://hospitality.beforest.co"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-4 text-sm uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-lg hover:-translate-y-0.5"
                    >
                      Book A Trial Stay
                    </a>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-text-primary/10 bg-[#fdfbf7] p-6">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-text-secondary">
                    If You Already Know
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-text-primary md:text-base">
                    If the direction is already clear, write to us directly about joining the
                    10% Lifestyle.
                  </p>
                  <div className="mt-5">
                    <a
                      href="https://wa.me/918977945351?text=I%27d%20like%20to%20subscribe%20to%2010%25%20Lifestyle"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-text-primary/15 px-8 py-4 text-sm uppercase tracking-[0.22em] text-text-primary transition-colors hover:border-brand-red hover:text-brand-red"
                    >
                      Join The 10% Lifestyle
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StickyTrialCta targetId="embedded-trial-cta" />
    </main>
  )
}

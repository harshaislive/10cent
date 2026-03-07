import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Founding Silence | Beforest 10cent Club',
  description: 'A refined summary for those who joined the first conversation around the 10% life, with an invitation to experience the land in person.',
}

const openingBullets = [
  'This was not framed as a holiday club.',
  'It was not framed as a shortcut to ownership.',
  'It was framed as a disciplined way to return to nature, again and again.'
]

const questions = [
  'How does this work for couples and families?',
  'Why count usage as person-nights instead of family nights?',
  'Can the nights be used in long stretches?',
  'Will unused nights carry forward?',
  'How much of the allocation can sit on weekends?',
  'How is this actually different from a conventional timeshare?'
]

const faqItems = [
  {
    question: 'How does this work for couples and families?',
    answer: 'The webinar clarified that immediate family participation is allowed. Usage, however, was explained in terms of person-nights rather than a single family-night unit.'
  },
  {
    question: 'Why count usage as person-nights instead of family nights?',
    answer: 'The explanation given was philosophical as much as operational: the product is meant as a recurring reset practice for individuals, while still making room for family participation.'
  },
  {
    question: 'Can the nights be used in long stretches?',
    answer: 'Yes, that was discussed as possible, subject to availability and the broader effort to keep access equitable across members.'
  },
  {
    question: 'Will unused nights carry forward?',
    answer: 'No. The position stated in the webinar was that unused nights should expire, because the idea is to build a rhythm of return rather than a stockpile of holiday inventory.'
  },
  {
    question: 'How much of the allocation can sit on weekends?',
    answer: 'A weekday-weekend balance was described, with the intention of keeping access workable for everyone rather than allowing demand to collapse onto a few peak dates.'
  },
  {
    question: 'How is this actually different from a conventional timeshare?',
    answer: 'The answer offered in the room was that the similarity is only transactional. The real difference lies in density, intent, and the philosophy of recurring immersion rather than leisure consumption.'
  }
]

const clarifications = [
  'The structure discussed was 30 nights a year across Beforest hospitality landscapes, over a 10-year window, at an introductory INR 17.6 lakh.',
  'The product was positioned as access, not ownership, and as a bridge for aligned people not yet ready to buy into a collective.',
  'Immediate family participation was allowed, while children under 12 were described as not counting toward person-night usage.',
  'No carry-forward was defended as a matter of philosophy: the aim was rhythm, not accumulation.',
  'The conversation consistently returned to one idea: this should be understood as a recurring reset practice, not as a leisure product.'
]

export default function FoundingSilencePage() {
  return (
    <main className="min-h-screen bg-warm-white text-text-primary">
      <section className="section-padding pb-8">
        <div className="container-max max-w-6xl">
          <div className="border-b border-text-primary/10 pb-6 text-xs uppercase tracking-[0.26em] text-text-secondary">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/" className="transition-colors hover:text-brand-red">
                Beforest 10cent Club
              </Link>
              <span>March 7, 2026 • The First Gathering</span>
            </div>
          </div>

          <div className="grid gap-10 py-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-brand-red">
                The Founding Silence
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-light leading-[0.94] md:text-7xl">
                For those who were there
                <span className="block">before this became a category.</span>
              </h1>

              <div className="mt-10 max-w-3xl space-y-6 text-lg leading-relaxed text-text-secondary md:text-xl">
                <p>
                  This page is a refined record of the first webinar, shared primarily for those who attended.
                  It gathers the main argument, the key questions raised in the room, and the practical clarifications that followed.
                </p>
                <p>
                  The title remains ceremonial, but the purpose here is simple:
                  to return the evening in a cleaner, quieter form, without the noise of the live call.
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
                  One evening, one proposition, and one early group of listeners who helped test whether the idea could hold under practical scrutiny.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section-padding py-8">
        <div className="container-max max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
            <article>
              <div className="border-b border-text-primary/10 pb-4">
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Main Argument</p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  What the webinar argued
                </h2>
              </div>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>
                  The strongest idea presented that evening was not ownership, not hospitality, not even land.
                  It was rhythm. The argument was that modern life does not merely exhaust us through speed.
                  It exhausts us through continuous sensory demand, continuous decision load, and continuous interruption.
                </p>
                <p>
                  Nature, in this framing, was not luxury. It was calibration.
                  The 10% Club was therefore described not as an escape hatch, but as a recurring reset.
                  Something closer to a practice than a purchase.
                </p>
                <p>
                  That made the offer much narrower. It also made it more serious.
                </p>
                <p>
                  In that sense, the webinar was less a pitch than a framing device. It gave attendees a way to understand the 10% Club on its own terms.
                </p>
              </div>
            </article>

            <article>
              <div className="border-b border-text-primary/10 pb-4">
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Offer, Clearly Stated</p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  What was actually being offered
                </h2>
              </div>

              <ul className="mt-8 space-y-4">
                {clarifications.map((item) => (
                  <li key={item} className="flex items-start gap-3 border-b border-text-primary/8 pb-4">
                    <span className="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-brand-red" />
                    <span className="text-base leading-relaxed text-text-secondary md:text-lg">{item}</span>
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
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Questions Raised In The Room</p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  The questions were practical.
                  <span className="block">That was a good sign.</span>
                </h2>
              </div>

              <div className="grid gap-3">
                {questions.map((question) => (
                  <div key={question} className="border-b border-text-primary/10 pb-3 text-base leading-relaxed text-text-secondary md:text-lg">
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
              <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">What The Evening Revealed</p>
              <h2 className="mt-3 text-3xl font-light md:text-5xl">
                This was not passive interest.
              </h2>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>
                  People did not respond like passive attendees. They responded like evaluators.
                  They wanted to know how the idea would behave under the pressure of real life:
                  family, fairness, frequency, planning, and value.
                </p>
                <p>
                  That matters because it tells us what the webinar actually achieved:
                  it moved the conversation from abstract philosophy into lived feasibility.
                </p>
              </div>
            </article>

            <article>
              <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Closing Note</p>
              <h2 className="mt-3 text-3xl font-light md:text-5xl">
                What remains after the first conversation
              </h2>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>
                  What the webinar left behind was not a closed conclusion, but a clearer frame.
                  It gave attendees a shared vocabulary for thinking about access, reset, family usage, and the difference between nature as leisure and nature as practice.
                </p>
                <p>
                  This page is meant to preserve that frame in a quieter, more readable form.
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
              Questions from attendees, answered plainly
            </h2>

            <div className="mt-10 divide-y divide-text-primary/10 border-y border-text-primary/10">
              {faqItems.map((item) => (
                <div key={item.question} className="grid gap-4 py-6 md:grid-cols-[0.42fr_0.58fr] md:gap-8">
                  <h3 className="text-lg font-light leading-relaxed text-text-primary md:text-2xl">
                    {item.question}
                  </h3>
                  <p className="text-base leading-relaxed text-text-secondary md:text-lg">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

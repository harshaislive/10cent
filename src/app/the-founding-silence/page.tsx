import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Founding Silence | Beforest 10cent Club',
  description: 'A refined summary for those who joined the first conversation around the 10% life, with an invitation to experience the land in person.',
}

const openingBullets = [
  'We did not frame this as a holiday club.',
  'We did not frame this as a shortcut to ownership.',
  'We framed it as a disciplined way to return to nature, again and again.'
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
    answer: 'We allow immediate family participation. At the same time, we explained usage in terms of person-nights rather than a single family-night unit.'
  },
  {
    question: 'Why count usage as person-nights instead of family nights?',
    answer: 'Our reasoning is philosophical as much as operational: we mean this as a recurring reset practice for individuals, while still making room for family participation.'
  },
  {
    question: 'Can the nights be used in long stretches?',
    answer: 'Yes. We discussed that as possible, subject to availability and the broader effort to keep access equitable across members.'
  },
  {
    question: 'Will unused nights carry forward?',
    answer: 'No. Our position is that unused nights should expire, because the idea is to build a rhythm of return rather than a stockpile of holiday inventory.'
  },
  {
    question: 'How much of the allocation can sit on weekends?',
    answer: 'We described a 2:1 weekday-to-weekend balance. In simple terms, for every weekend booking, we ask members to book roughly two weekday nights as well, so access does not collapse onto a small number of peak dates.'
  },
  {
    question: 'How is this actually different from a conventional timeshare?',
    answer: 'Our answer is that the similarity is only transactional. The real difference lies in density, intent, and the philosophy of recurring immersion rather than leisure consumption.'
  }
]

const clarifications = [
  'We discussed a structure of 30 nights a year across Beforest hospitality landscapes, over a 10-year window, at an introductory INR 17.6 lakh.',
  'We spoke about access, not ownership, and about this as a bridge for people who feel aligned but are not ready to buy into a collective.',
  'We clarified that immediate family participation is allowed, while children under 12 do not count toward person-night usage.',
  'We defended no carry-forward as a matter of philosophy: the aim is rhythm, not accumulation.',
  'We kept returning to one idea: this should be understood as a recurring reset practice, not as a leisure product.'
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
                  We are sharing this page primarily for those who attended the first webinar.
                  It gathers the main argument, the key questions raised in the room, and the practical clarifications that followed.
                </p>
                <p>
                  The title remains ceremonial, but our purpose here is simple:
                  to return that evening in a cleaner, quieter form, without the noise of the live call.
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
                  One evening, one conversation, and one early group of listeners who helped us test whether this way of thinking could hold under practical scrutiny.
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
                  What we were trying to say
                </h2>
              </div>

              <div className="mt-8 space-y-6 text-base leading-relaxed text-text-secondary md:text-lg">
                <p>
                  The strongest idea we presented that evening was not ownership, not hospitality, not even land.
                  It was rhythm. Our argument was that modern life does not merely exhaust us through speed.
                  It exhausts us through continuous sensory demand, continuous decision load, and continuous interruption.
                </p>
                <p>
                  Nature, in our framing, was not luxury. It was calibration.
                  The 10% Club was therefore not an escape hatch, but a recurring reset.
                  Something closer to a practice than a plan you buy into and forget.
                </p>
                <p>
                  That makes what we are saying narrower. It also makes it more serious.
                </p>
                <p>
                  In that sense, this was less a pitch than an attempt to name something clearly. We wanted to speak about the 10% Club on its own terms.
                </p>
              </div>
            </article>

            <article>
              <div className="border-b border-text-primary/10 pb-4">
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">What We Discussed</p>
                <h2 className="mt-3 text-3xl font-light md:text-5xl">
                  The practical points we covered
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
                  They wanted to know how this would behave under the pressure of real life:
                  family, fairness, frequency, planning, and value.
                </p>
                <p>
                  That matters to us because it tells us what the webinar actually achieved:
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
                  What we wanted to leave behind was not a closed conclusion, but a clearer frame.
                  A shared vocabulary for thinking about access, reset, family stays, and the difference between nature as leisure and nature as practice.
                </p>
                <p>
                  We hope this page preserves that frame in a quieter, more readable form.
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

            <div className="mt-10 flex justify-start">
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
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-text-primary/10 bg-warm-white/95 px-4 py-3 backdrop-blur-md shadow-[0_-6px_24px_rgba(0,33,64,0.08)]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-text-secondary">
              Experience Before Commitment
            </p>
            <p className="mt-1 text-sm leading-relaxed text-text-primary md:text-base">
              The land will explain this more clearly than we can.
            </p>
          </div>

          <a
            href="https://hospitality.beforest.co"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-brand-red px-6 py-3 text-sm uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-lg hover:-translate-y-0.5"
          >
            Book A Trial Stay
          </a>
        </div>
      </div>
    </main>
  )
}

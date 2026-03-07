import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'The Founding Silence | Beforest 10cent Club',
  description: 'For those who joined the first conversation around the 10% life. A quiet marker of what began, and an invitation to experience it in person.',
}

const ideas = [
  {
    title: 'A Different Premise',
    body: 'The first gathering did not ask whether wilderness could entertain us. It asked whether it could reorder us. That subtle shift changed the entire conversation.'
  },
  {
    title: 'A More Serious Offer',
    body: 'What emerged was not a holiday product, but a structure for recurring return. Access was framed as discipline, not indulgence.'
  },
  {
    title: 'A Shared Recognition',
    body: 'The people in that room were not looking for another category of luxury. They were trying to name a hunger modern life no longer knows how to describe.'
  }
]

const questions = [
  'How would this work for couples, children, and immediate family?',
  'Could the nights be used in long, meaningful stretches?',
  'Would unused nights carry into the following year?',
  'How much of the allocation could sit on weekends?',
  'How different is this from the holiday-club model everyone already knows?',
  'If the idea feels right, what is the most honest next step?'
]

const resolved = [
  'The structure discussed was 30 nights a year across Beforest hospitality landscapes, over a 10-year window, at an introductory INR 17.6 lakh.',
  'The product was explained as access rather than ownership, and as a bridge for aligned people not yet ready for full collective commitment.',
  'Usage was framed through person-nights, while still allowing immediate family participation and excluding children under 12 from that count.',
  'The no-carry-forward stance was defended on principle: this was meant to become a rhythm, not an annual accumulation.',
  'The most credible path forward was not more abstraction. It was a stay on the land.'
]

export default function FoundingSilencePage() {
  return (
    <main className="theme-v3 v3-page min-h-screen bg-warm-light text-text-primary">
      <div className="v3-page__frame hidden md:block" />
      <div className="v3-page__corner v3-page__corner--tl hidden lg:block" />
      <div className="v3-page__corner v3-page__corner--br hidden lg:block" />

      <section className="section-padding relative z-10 pb-10">
        <div className="container-max">
          <div className="mb-10 flex items-center justify-between gap-4 text-sm uppercase tracking-[0.28em] text-text-secondary">
            <Link href="/" className="transition-colors hover:text-brand-red">
              Beforest 10cent Club
            </Link>
            <span>The Founding Silence</span>
          </div>

          <div className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <div className="mb-6 inline-flex items-center rounded-full border border-brand-red/20 bg-brand-red/10 px-5 py-2 text-xs uppercase tracking-[0.28em] text-brand-red">
                March 7, 2026 • The First Gathering
              </div>

              <h1 className="max-w-4xl text-5xl font-light leading-[0.95] text-text-primary md:text-7xl">
                The Founding Silence
                <span className="mt-3 block text-brand-red">For those who were there before this became a category.</span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-text-secondary md:text-xl">
                Before there was a programme to explain, there was a room willing to listen differently.
                The first conversation around the 10% life was not loud, not promotional, not defensive.
                It was careful. It was searching. It was the moment the idea first met recognition.
              </p>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.75rem] border border-text-primary/10 bg-white/65 p-5 backdrop-blur-sm">
                  <div className="text-3xl font-light text-brand-red">10%</div>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    The proposition was simple: a deliberate fraction of life in nature can restore proportion to the rest.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-text-primary/10 bg-white/65 p-5 backdrop-blur-sm">
                  <div className="text-3xl font-light text-brand-red">30</div>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    Nights a year were described not as leisure inventory, but as a repeatable rhythm of return.
                  </p>
                </div>
                <div className="rounded-[1.75rem] border border-text-primary/10 bg-white/65 p-5 backdrop-blur-sm">
                  <div className="text-3xl font-light text-brand-red">1st</div>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    This page marks the first circle of listeners who encountered the idea while it was still intimate.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-text-primary/10 bg-[#f6f1e9] p-4 shadow-[0_30px_90px_rgba(0,33,64,0.16)]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <Image
                  src="/PBR_0209.jpg"
                  alt="Beforest landscape"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002140]/75 via-[#002140]/12 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#ffc083]">
                    Why Silence
                  </p>
                  <p className="mt-3 max-w-md text-lg leading-relaxed text-white md:text-xl">
                    Because the strongest part of that first meeting was not the pitch. It was the shared recognition that noise had become normal, and that another rhythm might still be possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding relative z-10 py-10">
        <div className="container-max">
          <div className="mb-10 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-red">What Began There</p>
            <h2 className="mt-4 text-4xl font-light md:text-6xl">
              Three things became unmistakably clear in that first room.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {ideas.map((idea) => (
              <article
                key={idea.title}
                className="rounded-[2rem] border border-text-primary/10 bg-white/70 p-8 backdrop-blur-sm"
              >
                <h3 className="text-2xl font-light leading-tight text-text-primary">
                  {idea.title}
                </h3>
                <p className="mt-5 text-base leading-relaxed text-text-secondary">
                  {idea.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding relative z-10 py-10">
        <div className="container-max grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-text-primary/10 bg-[#002140] p-8 text-white shadow-[0_25px_80px_rgba(0,33,64,0.22)] md:p-10">
            <p className="text-sm uppercase tracking-[0.28em] text-[#ffc083]">What The Room Asked</p>
            <h2 className="mt-4 text-3xl font-light md:text-5xl">
              The questions were practical. That was a good sign.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/75">
              This was not the behavior of a passive audience. People immediately began testing family fit, fairness, flexibility, and whether the offer could preserve its philosophy without collapsing into a generic holiday product.
            </p>

            <div className="mt-8 grid gap-3">
              {questions.map((question) => (
                <div
                  key={question}
                  className="rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-relaxed text-white/90"
                >
                  {question}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-text-primary/10 bg-white/70 p-8 backdrop-blur-sm md:p-10">
            <p className="text-sm uppercase tracking-[0.28em] text-brand-red">What Was Settled</p>
            <h2 className="mt-4 text-3xl font-light md:text-5xl">
              The answers sharpened the idea instead of diluting it.
            </h2>

            <div className="mt-8 space-y-4">
              {resolved.map((point) => (
                <div key={point} className="flex items-start gap-4 rounded-[1.5rem] border border-text-primary/10 bg-[#fdfbf7] px-5 py-5">
                  <div className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-brand-red" />
                  <p className="text-base leading-relaxed text-text-secondary">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding relative z-10 py-10">
        <div className="container-max">
          <div className="rounded-[2.25rem] border border-text-primary/10 bg-gradient-to-br from-white/80 via-[#f6f1e9]/90 to-[#dde6d1]/80 p-8 shadow-[0_30px_90px_rgba(0,33,64,0.12)] md:p-12">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-brand-red">What Comes After A Founding Silence</p>
                <h2 className="mt-4 text-4xl font-light leading-tight md:text-6xl">
                  Not a harder sell.
                  <span className="block text-brand-red">A quieter proof.</span>
                </h2>
              </div>

              <div>
                <p className="text-lg leading-relaxed text-text-secondary">
                  If you were moved by that first conversation, the next step should remain faithful to its tone.
                  Do not rush into abstraction, and do not rush into commitment.
                  Go and stay.
                </p>
                <p className="mt-5 text-lg leading-relaxed text-text-secondary">
                  Walk the landscape. Sit through the stillness. Let the proposition be tested by experience rather than explanation.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <a
                    href="https://hospitality.beforest.co"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-full bg-brand-red px-8 py-4 text-sm uppercase tracking-[0.22em] text-white transition-all duration-300 hover:bg-brand-dark hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Book A Trial Stay
                  </a>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-text-primary/15 px-8 py-4 text-sm uppercase tracking-[0.22em] text-text-primary transition-colors hover:border-brand-red hover:text-brand-red"
                  >
                    Return To Main Page
                  </Link>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-text-secondary">
                  Trial stays are hosted at `hospitality.beforest.co`.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

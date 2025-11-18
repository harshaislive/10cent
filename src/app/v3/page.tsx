import ScrollProgress from '@/components/ScrollProgress'
import HeroSection from '@/components/HeroSection'
import WildernessExperienceSection from '@/components/WildernessExperienceSection'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import WebinarSection from '@/components/WebinarSection'
import ValidationSection from '@/components/ValidationSection'
import AccessSection from '@/components/AccessSection'
import MicroFooter from '@/components/MicroFooter'

export default function HomeV3() {
  return (
    <div className="v3-page theme-v3 min-h-screen bg-warm-white text-text-primary">
      <div className="v3-page__frame" aria-hidden="true" />
      <div className="v3-page__corner v3-page__corner--tl" aria-hidden="true" />
      <div className="v3-page__corner v3-page__corner--br" aria-hidden="true" />

      <main className="relative z-10">
        <ScrollProgress />

        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <WildernessExperienceSection />
        <WebinarSection />
        <ValidationSection />

        <AccessSection />

        {/* Footer */}
        <MicroFooter />
      </main>
    </div>
  )
}

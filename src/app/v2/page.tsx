import ScrollProgress from '@/components/ScrollProgress'
import HeroSection from '@/components/HeroSection'
import WildernessExperienceSection from '@/components/WildernessExperienceSection'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import WebinarSection from '@/components/WebinarSection'
import ValidationSection from '@/components/ValidationSection'
import AccessSection from '@/components/AccessSection'
import MicroFooter from '@/components/MicroFooter'

export default function HomeV2() {
  return (
    <div className="theme-v2 min-h-screen bg-warm-white text-text-primary">
      <main className="relative">
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

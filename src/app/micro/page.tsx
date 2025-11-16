import MicroHeroSection from '@/components/MicroHeroSection'
import MembershipSection from '@/components/MembershipSection'
import PhilosophySection from '@/components/PhilosophySection'
import MemberProfileSection from '@/components/MemberProfileSection'
import WhyNowSection from '@/components/WhyNowSection'
import ApplySection from '@/components/ApplySection'
import MicroFooter from '@/components/MicroFooter'

export default function MicroLandingPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <MicroHeroSection />
      <MembershipSection />
      <PhilosophySection />
      <MemberProfileSection />
      <WhyNowSection />
      <ApplySection />
      <MicroFooter />
    </main>
  )
}
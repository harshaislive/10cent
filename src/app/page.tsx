import ScrollProgress from '@/components/ScrollProgress'
import HeroSection from '@/components/HeroSection'
import WildernessExperienceSection from '@/components/WildernessExperienceSection'
import ProblemSection from '@/components/ProblemSection'
import SolutionSection from '@/components/SolutionSection'
import WebinarSection from '@/components/WebinarSection'
import ValidationSection from '@/components/ValidationSection'
import AccessSection from '@/components/AccessSection'

export default function Home() {
  return (
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
      <footer className="bg-text-primary text-white py-12">
        <div className="container-max">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-arizona text-xl mb-4 text-sustainable-green">
                Beforest 10cent Club
              </h3>
              <p className="text-sm opacity-80 font-arizona">
                10% of your life spent with nature restores 100% of your nature.
              </p>
            </div>

            <div>
              <h4 className="font-arizona text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm font-arizona">
                <li><a href="#webinar" className="hover:text-sustainable-green transition-colors">Webinar Details</a></li>
                <li><a href="#validation" className="hover:text-sustainable-green transition-colors">Results & Testimonials</a></li>
                <li><a href="#access" className="hover:text-sustainable-green transition-colors">Register Now</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-arizona text-lg mb-4">Contact</h4>
              <div className="space-y-2 text-sm opacity-80 font-arizona">
                <p>hello@beforest.co</p>
                <p>+91 80880 12345</p>
                <div className="flex gap-4 mt-4">
                  <a href="#" className="hover:text-sustainable-green transition-colors">Instagram</a>
                  <a href="#" className="hover:text-sustainable-green transition-colors">LinkedIn</a>
                  <a href="#" className="hover:text-sustainable-green transition-colors">Twitter</a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-sm opacity-60 font-arizona">
              © 2024 Beforest 10cent Club. All rights reserved. |
              <a href="#" className="hover:text-sustainable-green transition-colors">Privacy Policy</a> |
              <a href="#" className="hover:text-sustainable-green transition-colors">Terms of Service</a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}
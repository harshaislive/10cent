'use client'

import TypeformButton from './TypeformButton'
import { TYPEFORM_CONFIG } from '@/config/typeform'
import { getNextSaturdayWithTime } from '@/utils/dateUtils'

export default function AccessSection() {
  return (
    <section id="access" className="section-padding bg-text-primary text-white relative overflow-hidden">
      {/* Subtle organic background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-40 left-20 w-64 h-64 bg-sustainable-green rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-red rounded-full blur-3xl" />
      </div>

      <div className="container-max relative z-10">
        {/* Original content with editorial design */}
        <div className="text-center mb-12">
          <p className="text-xl md:text-2xl font-arizona font-light text-sustainable-green/90 max-w-3xl mx-auto mb-6">
            Your inner landscape could use a little rewilding.
          </p>
          <h2 className="text-4xl md:text-6xl font-arizona font-light mb-6 text-white leading-tight">
            We've Held A Seat Under The Trees For You
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="border border-white/10 rounded-lg p-8 md:p-12">
            <h3 className="text-2xl font-arizona font-light mb-6 text-white text-center">
              Join Me
            </h3>

            <p className="text-white/90 font-arizona text-lg leading-relaxed text-center mb-8">
              The world never stops pulling at you. There's a space here where you can finally pause.
            </p>

            <div className="max-w-xs mx-auto">
              <TypeformButton
                formId={TYPEFORM_CONFIG.FORM_ID}
                className="w-full bg-sustainable-green text-text-primary px-8 py-4 font-arizona text-sm tracking-wide rounded-lg transition-all duration-300 hover:bg-white hover:text-text-primary border border-sustainable-green/20"
              >
                Join the conversation
              </TypeformButton>
            </div>

            <p className="text-sm text-center text-white/60 font-arizona mt-6">
              This is where your journey begins. Your information stays sacred and will never be shared.
            </p>

            <div className="mt-12 pt-12 border-t border-white/10">
              <h3 className="text-2xl font-arizona font-light mb-8 text-white text-center">
                What to Expect
              </h3>

              <div className="space-y-6 max-w-md mx-auto">
                <div className="text-center">
                  <h4 className="text-sm uppercase tracking-wide text-sustainable-green font-arizona mb-2">When We'll Meet</h4>
                  <p className="text-white font-arizona">{getNextSaturdayWithTime()}</p>
                </div>

                <div className="text-center">
                  <h4 className="text-sm uppercase tracking-wide text-sustainable-green font-arizona mb-2">How We'll Connect</h4>
                  <p className="text-white font-arizona">A casual Zoom conversation</p>
                </div>

                <div className="text-center">
                  <h4 className="text-sm uppercase tracking-wide text-sustainable-green font-arizona mb-2">Time Together</h4>
                  <p className="text-white font-arizona">60 minutes</p>
                </div>

                <div className="text-center">
                  <h4 className="text-sm uppercase tracking-wide text-sustainable-green font-arizona mb-2">Group Size</h4>
                  <p className="text-white font-arizona">Just 20 of us</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        </div>
    </section>
  )
}
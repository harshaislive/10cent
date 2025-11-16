'use client'

import TypeformButton from './TypeformButton'

export default function AccessSection() {

  return (
    <section id="access" className="section-padding bg-gradient-to-br from-brand-red to-brand-dark text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-max relative z-10">
        {/* Urgency Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-xs border border-white/30 px-6 py-3 rounded-full">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Registrations close on Friday 2PM
            </span>
          </div>
        </div>

        {/* Wilderness Hero Message */}
        <div className="relative -mx-8 lg:-mx-16 mb-16 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-arizona font-light mb-4 text-white">
              We've Held A Seat Under The Trees For You
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto text-white font-arizona">
              Because we're opening to only 150 members.
              <br />
              <span className="text-sustainable-green">Your inner landscape could use a little rewilding.</span>
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Registration Form */}
          <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-arizona font-medium mb-6">
              Reserve Your Place
            </h3>

            <div className="space-y-6">
              <p className="text-white/90 font-arizona text-lg leading-relaxed">
                In a world that never stops, there's a place where time stands still.
                <br />
                <span className="text-sustainable-green text-xl">Your soul remembers this home.</span>
                <br />
                <span className="text-white/70">Only 150 souls will hear the wilderness call this season.</span>
              </p>

              <TypeformButton
                formId="01KA5X0AM1KH7WRX1ZB994N2TG"
                className="w-full bg-white text-brand-dark px-8 py-4 font-arizona font-medium text-sm tracking-wide uppercase rounded-lg transition-all duration-300 hover:bg-sustainable-green hover:shadow-2xl hover:-translate-y-1"
              >
                Answer The Wilderness Call
              </TypeformButton>

              <p className="text-xs text-center opacity-80 font-arizona">
                Your journey begins here. Your information is sacred and will never be shared.
              </p>
            </div>
          </div>

          {/* Webinar Details */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xs border border-white/20 rounded-2xl p-8">
              <h3 className="text-2xl font-arizona font-medium mb-6">
                Strategic Briefing Details
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sustainable-green/20 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium font-arizona">Date & Time</div>
                    <div className="text-sm opacity-80 font-arizona">Saturday, 6:00 PM IST, 15 Nov 2025</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sustainable-green/20 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="20" height="16" x="2" y="4" rx="2" ry="2"></rect>
                      <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                      <rect width="8" height="6" x="6" y="8" rx="1" ry="1"></rect>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium font-arizona">Format</div>
                    <div className="text-sm opacity-80 font-arizona">Live Zoom Webinar + Q&A</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sustainable-green/20 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium font-arizona">Duration</div>
                    <div className="text-sm opacity-80 font-arizona">60 minutes + 30 min Q&A</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sustainable-green/20 rounded-full flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div>
                    <div className="font-medium font-arizona">Limited Spots</div>
                    <div className="text-sm opacity-80 font-arizona">Only 50 participants</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-xs border border-white/20 px-8 py-4 rounded-full">
            <span className="text-sm font-medium font-arizona">
              Seed Member Benefits Available for the first 25 members
            </span>
            <div className="w-8 h-8 bg-sustainable-green rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-dark">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 bg-sustainable-green/20 rounded-full blur-2xl animate-float" />
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '3s' }} />
    </section>
  )
}
'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function AccessSection() {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: '',
    role: '',
    company: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Show success message
      alert('Registration successful! Check your email for confirmation.')
      setFormData({ firstName: '', email: '', phone: '', role: '', company: '' })
    }, 2000)
  }

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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide font-arizona">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    placeholder="Your first name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide font-arizona">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide font-arizona">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 uppercase tracking-wide font-arizona">
                    What Best Describes You? *
                  </label>
                  <select
                    name="role"
                    required
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                  >
                    <option value="" className="bg-brand-dark">Select...</option>
                    <option value="founder" className="bg-brand-dark">Business Owner/Founder</option>
                    <option value="executive" className="bg-brand-dark">Executive/Director</option>
                    <option value="professional" className="bg-brand-dark">Professional (Doctor/Lawyer/Consultant)</option>
                    <option value="investor" className="bg-brand-dark">Investor</option>
                    <option value="other" className="bg-brand-dark">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 uppercase tracking-wide font-arizona">
                  Company/Organization
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
                  placeholder="Your company (optional)"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-white text-brand-dark px-8 py-4 font-arizona font-medium text-sm tracking-wide uppercase rounded-lg transition-all duration-300 hover:bg-sustainable-green hover:shadow-2xl hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
              >
                {isSubmitting ? 'Securing Your Place...' : 'Confirm My Place Now'}
              </button>

              <p className="text-xs text-center opacity-80 font-arizona">
                Your information is secure and will never be shared. By registering, you agree to
                receive webinar details and follow-up communication.
              </p>
            </form>
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
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle, ArrowRight, Calendar as CalendarIcon, Users, Loader2, CheckCircle2, AlertCircle, Info } from 'lucide-react'
import axios from 'axios'

interface TrialRequestModalProps {
  isOpen: boolean
  onClose: () => void
  locationName: string
  location: string
  locationSlug: string
}

type AvailabilityStatus = 'idle' | 'checking' | 'available' | 'sold_out' | 'error'

export default function TrialRequestModal({
  isOpen,
  onClose,
  locationName,
  location,
  locationSlug
}: TrialRequestModalProps) {
  const [step, setStep] = useState<'intro' | 'form' | 'processing' | 'success'>('intro')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    guestCount: '2',
    specialRequests: '',
  })

  // Availability State
  const [availabilityStatus, setAvailabilityStatus] = useState<AvailabilityStatus>('idle')
  const [availableRooms, setAvailableRooms] = useState<any[]>([])
  const [availabilityError, setAvailabilityError] = useState('')

  // Success State
  const [successData, setSuccessData] = useState<{
    requestId: string
    status: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (!isOpen) {
      resetModal()
    }
  }, [isOpen])

  const resetModal = () => {
    setStep('intro')
    setFormData({
      name: '',
      email: '',
      phone: '',
      preferredDate: '',
      guestCount: '2',
      specialRequests: '',
    })
    setAvailabilityStatus('idle')
    setAvailableRooms([])
    setAvailabilityError('')
    setSuccessData(null)
    setIsSubmitting(false)
  }

  // Check availability when date changes
  useEffect(() => {
    if (formData.preferredDate) {
      checkAvailability(formData.preferredDate)
    } else {
      setAvailabilityStatus('idle')
      setAvailableRooms([])
    }
  }, [formData.preferredDate])

  const checkAvailability = async (date: string) => {
    setAvailabilityStatus('checking')
    setAvailableRooms([])
    setAvailabilityError('')

    try {
      // Format date to YYYY-MM-DD for the API
      const formattedDate = new Date(date).toISOString().split('T')[0]

      const { data } = await axios.get(`/api/availability/check?startDate=${formattedDate}`)

      if (data.data?.available) {
        setAvailabilityStatus('available')
        setAvailableRooms(data.data.rooms || [])
      } else {
        setAvailabilityStatus('sold_out')
        setAvailableRooms([])
      }
    } catch (error) {
      console.error('Availability check failed:', error)
      setAvailabilityStatus('error')
      setAvailabilityError('Could not check availability. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formattedDate = new Date(formData.preferredDate).toISOString().split('T')[0]

      const { data } = await axios.post('/api/trial-request', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: locationName,
        locationSlug: locationSlug,
        preferredDate: formattedDate,
        durationNights: 2,
        guestCount: parseInt(formData.guestCount),
        specialRequests: formData.specialRequests || null,
      })

      setSuccessData({
        requestId: data.requestId,
        status: data.status,
        message: data.message,
      })
      setStep('success')
    } catch (error: any) {
      console.error('Trial request failed:', error)
      const errorMsg = error.response?.data?.error || 'Failed to submit request. Please try again.'
      setAvailabilityError(errorMsg)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  // Get maximum date (1 year from now)
  const getMaxDate = () => {
    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() + 1)
    return maxDate.toISOString().split('T')[0]
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#342e29]/95 backdrop-blur-md text-[#fdfbf7] flex items-center justify-center overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 hover:rotate-90 transition-transform duration-300 z-50 text-[#fdfbf7]"
          >
            <XCircle className="w-8 h-8 opacity-50 hover:opacity-100" />
          </button>

          <div className="w-full max-w-3xl px-6 relative z-10">
            {/* STEP 1: INTRO */}
            {step === 'intro' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full border border-[#ffc083] text-[#ffc083] flex items-center justify-center mx-auto mb-8">
                  <CalendarIcon className="w-8 h-8" />
                </div>

                <p className="text-[#86312b] uppercase tracking-[0.3em] text-xs font-bold mb-6">
                  Begin Your Journey
                </p>

                <h2 className="text-4xl md:text-6xl font-light mb-8 font-arizona leading-tight">
                  The Art of Arriving
                </h2>

                <div className="max-w-2xl mx-auto space-y-8 text-lg md:text-xl font-arizona font-light border-l border-[#fdfbf7]/20 pl-8 text-left mb-12">
                  <p>
                    Select your preferred dates at <strong>{locationName}</strong>, and we'll hold space for you.
                  </p>
                  <p className="opacity-80">
                    The wilderness doesn't rush, and neither do we. We'll reach out to confirm your dates and prepare for your arrival.
                  </p>
                  <p className="text-base opacity-70 italic">
                    Think of it as reserving your place in nature—a quiet beginning to something lasting.
                  </p>
                </div>

                {/* The Commitment - Visual Breakdown */}
                <div className="max-w-xl mx-auto mb-12 p-8 border border-[#fdfbf7]/10 bg-[#fdfbf7]/5">
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-60">Trial Stay</span>
                      <span className="font-arizona text-xl">2 Nights</span>
                    </div>
                    <div className="h-px bg-[#fdfbf7]/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-60">Your Token</span>
                      <span className="font-arizona text-xl">₹1</span>
                    </div>
                    <div className="h-px bg-[#fdfbf7]/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-60">10-Year Membership</span>
                      <span className="font-arizona text-xl">₹17,60,000</span>
                    </div>
                    <div className="h-px bg-[#fdfbf7]/20" />
                    <div className="flex justify-between items-center text-[#ffc083]">
                      <span className="text-sm font-medium">Fully Adjustable</span>
                      <span className="font-arizona text-xl">Your token applies</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('form')}
                  className="bg-[#fdfbf7] text-[#342e29] px-12 py-5 uppercase tracking-widest text-sm font-bold hover:bg-[#ffc083] transition-colors flex items-center gap-3 mx-auto group"
                >
                  <span>Select Your Dates</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: FORM */}
            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-left max-w-2xl mx-auto max-h-[85vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-2"
              >
                <div className="mb-12 pl-1">
                  <button
                    onClick={() => setStep('intro')}
                    className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity mb-4 flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" /> Back
                  </button>
                  <p className="text-[#ffc083] uppercase tracking-widest text-xs font-medium mb-3">Choose Your Dates</p>
                  <h2 className="text-3xl md:text-5xl font-light font-arizona">{locationName}</h2>
                  <p className="text-[#fdfbf7]/60 font-arizona mt-2 text-sm">2 nights of wilderness immersion</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-10">
                    {/* Date Selection */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        Preferred Check-in Date
                      </label>
                      <input
                        type="date"
                        required
                        min={getMinDate()}
                        max={getMaxDate()}
                        value={formData.preferredDate}
                        onChange={e => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10"
                      />

                      {/* Availability Status */}
                      {formData.preferredDate && (
                        <div className="mt-3">
                          {availabilityStatus === 'checking' && (
                            <div className="flex items-center gap-2 text-sm opacity-70">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Checking availability...</span>
                            </div>
                          )}

                          {availabilityStatus === 'available' && (
                            <div className="p-4 bg-[#ffc083]/10 border border-[#ffc083]/30 rounded">
                              <div className="flex items-center gap-2 text-[#ffc083] mb-2">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="font-medium">Available!</span>
                              </div>
                              {availableRooms.length > 0 && (
                                <div className="text-sm opacity-80">
                                  {availableRooms.map((room: any) => (
                                    <div key={room.name} className="flex justify-between items-center py-1">
                                      <span>{room.name}</span>
                                      <span className="text-[#ffc083]">₹{room.price}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}

                          {availabilityStatus === 'sold_out' && (
                            <div className="p-4 bg-[#86312b]/20 border border-[#86312b]/30 rounded">
                              <div className="flex items-center gap-2 text-[#86312b] mb-2">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-medium">Fully Booked</span>
                              </div>
                              <p className="text-sm opacity-80">
                                This date is sold out. You can still submit your request and we'll add you to the waitlist.
                              </p>
                            </div>
                          )}

                          {availabilityStatus === 'error' && (
                            <div className="p-4 bg-red-900/20 border border-red-700/30 rounded">
                              <div className="flex items-center gap-2 text-red-400">
                                <AlertCircle className="w-5 h-5" />
                                <span className="text-sm">{availabilityError}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Guest Count */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Number of Guests
                      </label>
                      <select
                        required
                        value={formData.guestCount}
                        onChange={e => setFormData({ ...formData, guestCount: e.target.value })}
                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors"
                      >
                        <option value="1" className="bg-[#342e29]">1 Guest</option>
                        <option value="2" className="bg-[#342e29]">2 Guests</option>
                        <option value="3" className="bg-[#342e29]">3 Guests</option>
                        <option value="4" className="bg-[#342e29]">4 Guests</option>
                        <option value="5" className="bg-[#342e29]">5+ Guests</option>
                      </select>
                    </div>

                    {/* Name */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest opacity-60">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10"
                        placeholder="Your Full Name"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest opacity-60">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest opacity-60">Email Address</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10"
                        placeholder="your@email.com"
                      />
                    </div>

                    {/* Special Requests */}
                    <div className="space-y-3">
                      <label className="text-[10px] uppercase tracking-widest opacity-60">Special Requests (Optional)</label>
                      <textarea
                        value={formData.specialRequests}
                        onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-lg font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10 resize-none"
                        placeholder="Any special requirements or notes..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Info Note */}
                  <div className="mt-12 p-6 border border-[#fdfbf7]/10 bg-[#fdfbf7]/5">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-[#ffc083] shrink-0 mt-1" />
                      <div className="text-sm opacity-70 font-arizona leading-relaxed">
                        <p className="mb-2">We'll reach out within 24-48 hours to confirm your dates and prepare your arrival. The wilderness awaits your presence.</p>
                        <p className="text-xs opacity-50">Your ₹1 token secures your trial—fully adjustable toward your 10-year membership.</p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.preferredDate}
                    className="w-full bg-[#fdfbf7] text-[#342e29] py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#ffc083] transition-colors flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: SUCCESS */}
            {step === 'success' && successData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-2xl mx-auto"
              >
                <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto mb-8 ${
                  successData.status === 'AVAILABLE'
                    ? 'border-[#ffc083] text-[#ffc083]'
                    : 'border-[#86312b] text-[#86312b]'
                }`}>
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <p className="text-[#86312b] uppercase tracking-[0.3em] text-xs font-bold mb-6">
                  Space Held
                </p>

                <h2 className="text-4xl font-light font-arizona mb-6">
                  {successData.status === 'AVAILABLE' ? 'Your Dates Await' : 'On the List'}
                </h2>

                <p className="text-lg opacity-80 font-arizona mb-8 leading-relaxed">
                  {successData.status === 'AVAILABLE'
                    ? "We've received your request. The wilderness will reach out within 24-48 hours to confirm your dates and prepare for your arrival."
                    : "The dates you've chosen are fully occupied. We've added you to the waitlist—if space opens, you'll be the first to know."}
                </p>

                <div className="p-6 border border-[#fdfbf7]/10 bg-[#fdfbf7]/5 mb-8">
                  <p className="text-sm opacity-60 mb-2">Your Reference</p>
                  <p className="text-2xl font-arizona text-[#ffc083]">{successData.requestId}</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      resetModal()
                      onClose()
                    }}
                    className="bg-[#fdfbf7] text-[#342e29] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#ffc083] transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

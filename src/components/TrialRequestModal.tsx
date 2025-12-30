'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle, ArrowRight, Calendar as CalendarIcon, Loader2, CheckCircle2, AlertCircle, Info, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'

interface TrialRequestModalProps {
  isOpen: boolean
  onClose: () => void
  locationName: string
  location: string
  locationSlug: string
}

type DayAvailability = {
  date: string
  displayDate: string
  dayName: string
  month: string
  available: boolean | null // null = checking, true = available, false = sold out
  rooms?: any[]
}

type Step = 'intro' | 'calendar' | 'form' | 'processing' | 'success'

export default function TrialRequestModal({
  isOpen,
  onClose,
  locationName,
  location,
  locationSlug
}: TrialRequestModalProps) {
  const [step, setStep] = useState<Step>('intro')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    selectedDate: '',
    specialRequests: '',
  })

  // Calendar State
  const [days, setDays] = useState<DayAvailability[]>([])
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false)
  const [currentMonthStart, setCurrentMonthStart] = useState<Date>(new Date())

  // Success State
  const [successData, setSuccessData] = useState<{
    requestId: string
    status: string
    message: string
  } | null>(null)

  useEffect(() => {
    if (!isOpen) {
      resetModal()
    } else if (step === 'calendar' && days.length === 0) {
      loadCalendarDays()
    }
  }, [isOpen, step, days.length, currentMonthStart])

  const resetModal = () => {
    setStep('intro')
    setFormData({
      name: '',
      email: '',
      phone: '',
      selectedDate: '',
      specialRequests: '',
    })
    setDays([])
    setSuccessData(null)
    setIsSubmitting(false)
    setCurrentMonthStart(new Date())
  }

  // Load 15 days starting from currentMonthStart
  const loadCalendarDays = async () => {
    // First, generate and display the 15 days immediately
    const newDays: DayAvailability[] = []

    // Generate 15 days
    for (let i = 0; i < 15; i++) {
      const date = new Date(currentMonthStart)
      date.setDate(date.getDate() + i)

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const displayDate = date.getDate().toString()
      const dateStr = date.toISOString().split('T')[0]

      newDays.push({
        date: dateStr,
        displayDate,
        dayName,
        month,
        available: null, // Will be updated after API call
      })
    }

    setDays(newDays)

    // Then check availability for all 15 days concurrently in background
    try {
      const availabilityPromises = newDays.map(day =>
        axios.get(`/api/availability/check?startDate=${day.date}`)
      )

      const responses = await Promise.allSettled(availabilityPromises)

      const updatedDays = newDays.map((day, index) => {
        const response = responses[index]
        if (response.status === 'fulfilled' && response.value.data?.data) {
          return {
            ...day,
            available: response.value.data.data.available,
            rooms: response.value.data.data.rooms || [],
          }
        }
        return { ...day, available: null }
      })

      setDays(updatedDays)
    } catch (error) {
      console.error('Error checking availability:', error)
    }
  }

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonthStart)
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 15)
    } else {
      newDate.setDate(newDate.getDate() + 15)
    }
    setCurrentMonthStart(newDate)
    setDays([]) // Will trigger reload
  }

  const handleDateSelect = (date: string) => {
    setFormData({ ...formData, selectedDate: date })
    setStep('form')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStep('processing')

    try {
      const { data } = await axios.post('/api/trial-request', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: locationName,
        locationSlug: locationSlug,
        preferredDate: formData.selectedDate,
        durationNights: 2,
        guestCount: 2,
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
      alert(errorMsg)
      setStep('form')
      setIsSubmitting(false)
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
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

          <div className="w-full max-w-4xl px-6 relative z-10">
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
                    Select your preferred dates at <strong>{locationName}</strong> for a 2-night wilderness stay for two.
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
                      <span className="font-arizona text-xl">2 Nights · 2 Guests</span>
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
                  onClick={() => setStep('calendar')}
                  className="bg-[#fdfbf7] text-[#342e29] px-12 py-5 uppercase tracking-widest text-sm font-bold hover:bg-[#ffc083] transition-colors flex items-center gap-3 mx-auto group"
                >
                  <span>Select Your Dates</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: CALENDAR */}
            {step === 'calendar' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-left"
              >
                <div className="mb-8 flex items-center justify-between">
                  <button
                    onClick={() => setStep('intro')}
                    className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" /> Back
                  </button>
                  <div className="text-right">
                    <p className="text-[#ffc083] uppercase tracking-widest text-xs font-medium">Choose Your Dates</p>
                    <h2 className="text-2xl md:text-4xl font-light font-arizona">{locationName}</h2>
                  </div>
                </div>

                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => handleMonthChange('prev')}
                    className="p-2 hover:bg-[#fdfbf7]/10 rounded-full transition-colors"
                    disabled={isLoadingCalendar}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-arizona text-lg">
                    {days.length > 0
                      ? (() => {
                          const firstDay = days[0];
                          const lastDay = days[days.length - 1];
                          const firstYear = new Date(firstDay.date).getFullYear();
                          const lastYear = new Date(lastDay.date).getFullYear();
                          
                          if (firstDay.month === lastDay.month && firstYear === lastYear) {
                            return `${firstDay.month} ${firstYear}`;
                          }
                          return `${firstDay.month} - ${lastDay.month} ${lastYear}`;
                        })()
                      : new Date(currentMonthStart).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    }
                  </span>
                  <button
                    onClick={() => handleMonthChange('next')}
                    className="p-2 hover:bg-[#fdfbf7]/10 rounded-full transition-colors"
                    disabled={isLoadingCalendar}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Calendar Grid - 15 Days */}
                {days.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ffc083] mb-4" />
                    <p className="text-sm opacity-60 font-arizona">Loading calendar...</p>
                  </div>
                ) : (
                  <>
                    {/* Loading hint when any day is still checking */}
                    {days.some(d => d.available === null) && (
                      <div className="flex items-center justify-center gap-2 mb-4 text-xs opacity-50">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Checking availability... (may take 10-15 seconds)</span>
                      </div>
                    )}

                    <div className="grid grid-cols-5 gap-3 mb-8">
                    {days.map((day, index) => (
                      <motion.button
                        key={day.date}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => day.available === true && handleDateSelect(day.date)}
                        disabled={day.available !== true}
                        className={`
                          relative p-4 rounded-lg border text-center transition-all
                          ${day.available === true
                            ? 'border-[#ffc083] bg-[#ffc083]/10 hover:bg-[#ffc083]/20 cursor-pointer'
                            : day.available === false
                            ? 'border-[#86312b]/30 bg-[#86312b]/10 cursor-not-allowed opacity-50'
                            : 'border-[#fdfbf7]/20 bg-[#fdfbf7]/5'
                          }
                        `}
                      >
                        {/* Day Name */}
                        <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">{day.dayName}</p>

                        {/* Date */}
                        <p className="text-2xl font-arizona mb-0 leading-none">{day.displayDate}</p>
                        <p className="text-[10px] uppercase tracking-wider opacity-60 mb-2">{day.month}</p>

                        {/* Status */}
                        {day.available === null && day.available !== false && (
                          <div className="flex justify-center">
                            <Loader2 className="w-4 h-4 animate-spin opacity-50" />
                          </div>
                        )}
                        {day.available === true && (
                          <div className="flex items-center justify-center gap-1 text-[#ffc083] text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Available</span>
                          </div>
                        )}
                        {day.available === false && (
                          <div className="flex items-center justify-center gap-1 text-[#86312b] text-xs">
                            <AlertCircle className="w-3 h-3" />
                            <span>Sold Out</span>
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  </>
                )}

                {/* Legend */}
                <div className="flex items-center justify-center gap-6 text-xs opacity-60">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded border border-[#ffc083] bg-[#ffc083]/10" />
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded border border-[#86312b]/30 bg-[#86312b]/10" />
                    <span>Sold Out</span>
                  </div>
                </div>

                {/* Selected Date Info */}
                {formData.selectedDate && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 border border-[#fdfbf7]/10 bg-[#fdfbf7]/5 text-center"
                  >
                    <p className="text-sm opacity-60 mb-1">Selected Check-in</p>
                    <p className="text-xl font-arizona">
                      {new Date(formData.selectedDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm opacity-60 mt-2">2 nights · 2 guests</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* STEP 3: FORM */}
            {step === 'form' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="text-left max-w-2xl mx-auto max-h-[85vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-2"
              >
                <div className="mb-12 pl-1">
                  <button
                    onClick={() => setStep('calendar')}
                    className="text-[10px] uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity mb-4 flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" /> Back to Calendar
                  </button>
                  <p className="text-[#ffc083] uppercase tracking-widest text-xs font-medium mb-3">Your Details</p>
                  <h2 className="text-3xl md:text-5xl font-light font-arizona">{locationName}</h2>
                  <p className="text-[#fdfbf7]/60 font-arizona mt-2">
                    {new Date(formData.selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })}
                    {' · '} 2 nights · 2 guests
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-10">
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
                    disabled={isSubmitting}
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

            {/* STEP 4: PROCESSING */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#ffc083] text-[#ffc083] flex items-center justify-center mx-auto mb-8">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <h2 className="text-4xl font-light font-arizona mb-4">Holding Your Space</h2>
                <p className="opacity-70 max-w-md mx-auto font-arizona">
                  The wilderness is preparing for your arrival...
                </p>
              </motion.div>
            )}

            {/* STEP 5: SUCCESS */}
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

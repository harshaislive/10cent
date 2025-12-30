'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, Clock, User, Phone, CheckCircle2, ChevronRight, ChevronLeft, Loader2, ArrowRight } from 'lucide-react'
import axios from 'axios'

export default function OnboardingScheduler() {
  const [step, setStep] = useState<'datetime' | 'details' | 'success'>('datetime')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())

  // Initialize Calendar Days (2 weeks)
  useEffect(() => {
    const days = []
    // Start from today
    const start = new Date(currentWeekStart)
    for (let i = 0; i < 14; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i)
      days.push(d)
    }
    setCalendarDays(days)
  }, [currentWeekStart])

  const timeSlots = [
    "10:00 AM", "10:15 AM", "10:30 AM", "10:45 AM",
    "11:00 AM", "11:15 AM", "11:30 AM", "11:45 AM",
    "12:00 PM", "12:15 PM", "12:30 PM", "12:45 PM",
    "02:00 PM", "02:15 PM", "02:30 PM", "02:45 PM",
    "03:00 PM", "03:15 PM", "03:30 PM", "03:45 PM",
    "04:00 PM", "04:15 PM", "04:30 PM", "04:45 PM",
    "05:00 PM", "05:15 PM", "05:30 PM", "05:45 PM"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)
    try {
      await axios.post('/api/schedule-call', {
        name: formData.name,
        phone: formData.phone,
        scheduledDate: selectedDate.toISOString().split('T')[0],
        scheduledTime: selectedTime
      })
      setStep('success')
    } catch (error) {
      console.error('Failed to schedule call:', error)
      alert('Failed to schedule call. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWeekChange = (direction: 'prev' | 'next') => {
    const newStart = new Date(currentWeekStart)
    if (direction === 'next') {
      newStart.setDate(newStart.getDate() + 7)
    } else {
      // Don't go to past
      const today = new Date()
      today.setHours(0,0,0,0)
      const potentialPrev = new Date(newStart)
      potentialPrev.setDate(potentialPrev.getDate() - 7)
      
      if (potentialPrev < today) {
        newStart.setDate(today.getDate())
      } else {
        newStart.setDate(newStart.getDate() - 7)
      }
    }
    setCurrentWeekStart(newStart)
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white/50 backdrop-blur-sm border border-[#342e29]/10 rounded-xl overflow-hidden p-6 md:p-12">
      <AnimatePresence mode="wait">
        {step === 'datetime' && (
          <motion.div
            key="datetime"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-light font-arizona mb-4 text-[#342e29]">
                Schedule Your Onboarding
              </h2>
              <p className="opacity-60 max-w-lg mx-auto">
                Select a convenient time for a 15-minute call to assist with your payment and welcome you to the club.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Calendar Section */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-arizona text-xl text-[#86312b]">Select Date</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleWeekChange('prev')} className="p-1 hover:bg-[#342e29]/5 rounded">
                      <ChevronLeft className="w-5 h-5 opacity-50" />
                    </button>
                    <button onClick={() => handleWeekChange('next')} className="p-1 hover:bg-[#342e29]/5 rounded">
                      <ChevronRight className="w-5 h-5 opacity-50" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {calendarDays.slice(0, 7).map((date) => {
                    const isSelected = selectedDate?.toDateString() === date.toDateString()
                    const isToday = new Date().toDateString() === date.toDateString()
                    
                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => setSelectedDate(date)}
                        className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                          isSelected
                            ? 'border-[#86312b] bg-[#86312b]/5 text-[#86312b]'
                            : 'border-[#342e29]/10 hover:border-[#86312b]/30 hover:bg-white/50'
                        }`}
                      >
                        <span className="font-arizona text-lg">
                          {date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </span>
                        {isToday && <span className="text-[10px] uppercase tracking-widest opacity-50">Today</span>}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Time Section */}
              <div className={`transition-opacity duration-300 ${!selectedDate ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-arizona text-xl text-[#86312b]">Select Time</h3>
                  {selectedDate && (
                    <span className="text-sm opacity-50">
                      {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-2 text-sm border rounded transition-all duration-200 ${
                        selectedTime === time
                          ? 'border-[#86312b] bg-[#86312b] text-white'
                          : 'border-[#342e29]/10 hover:border-[#86312b] hover:text-[#86312b]'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 flex justify-end">
              <button
                disabled={!selectedDate || !selectedTime}
                onClick={() => setStep('details')}
                className="bg-[#342e29] text-[#fdfbf7] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
              >
                Next Step
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-xl mx-auto"
          >
            <div className="text-center mb-10">
              <button 
                onClick={() => setStep('datetime')}
                className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 mb-6 flex items-center gap-2 mx-auto"
              >
                <ArrowRight className="w-3 h-3 rotate-180" /> Change Date/Time
              </button>
              <h2 className="text-3xl md:text-4xl font-light font-arizona mb-2 text-[#342e29]">
                Your Details
              </h2>
              <p className="text-[#86312b] font-medium">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <User className="w-3 h-3" /> Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-transparent border-b border-[#342e29]/20 py-3 text-xl font-light focus:outline-none focus:border-[#86312b] transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest opacity-60 flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-transparent border-b border-[#342e29]/20 py-3 text-xl font-light focus:outline-none focus:border-[#86312b] transition-colors"
                  placeholder="Enter your phone number"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#342e29] text-[#fdfbf7] py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors flex items-center justify-center gap-3 mt-8 disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full border-2 border-[#86312b] text-[#86312b] flex items-center justify-center mx-auto mb-8 bg-[#86312b]/5">
              <CalendarIcon className="w-10 h-10" />
            </div>

            <h2 className="text-4xl md:text-5xl font-light font-arizona mb-6 text-[#342e29]">
              All Set.
            </h2>

            <p className="text-lg opacity-70 max-w-lg mx-auto mb-8 font-arizona">
              Your call is scheduled for <strong>{selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{selectedTime}</strong>.
            </p>
            
            <p className="text-sm opacity-50">
              We'll call you on {formData.phone} to assist with your onboarding.
            </p>

            <div className="mt-12">
               <a href="/" className="inline-block border-b border-[#342e29] pb-1 text-[#342e29] text-xs uppercase tracking-widest hover:text-[#86312b] hover:border-[#86312b] transition-colors">
                 Return to Home
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

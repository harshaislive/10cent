'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar as CalendarIcon, User, Phone, CheckCircle2, ChevronRight, ChevronLeft, Loader2, ArrowRight, ShieldCheck, Sparkles, Feather } from 'lucide-react'
import axios from 'axios'

// --- Utility Components ---
const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[0] opacity-[0.03] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
)

const SectionHeader = ({ number, title, subtitle }: { number: string, title: string, subtitle?: string }) => (
  <div className="flex flex-col gap-4 mb-12 text-[#342e29]">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4"
    >
      <span className="text-xs font-bold tracking-[0.2em] uppercase py-1 px-2 border border-[#342e29]/30">
        {number}
      </span>
      <div className="h-px flex-1 bg-[#342e29]/20" />
    </motion.div>
    <div className="overflow-hidden">
      <motion.h2
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-4xl md:text-6xl font-light leading-[0.9] tracking-tight font-arizona"
      >
        {title}
      </motion.h2>
    </div>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="max-w-md text-lg font-arizona italic opacity-80 ml-auto mr-0 text-right"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
)

export default function OnboardingScheduler() {
  const [step, setStep] = useState<'intro' | 'datetime' | 'details' | 'success'>('intro')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', phone: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [calendarDays, setCalendarDays] = useState<Date[]>([])
  const [currentWeekStart, setCurrentWeekStart] = useState(new Date())

  // Initialize Calendar Days (2 weeks)
  useEffect(() => {
    const days = []
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
    <div className="w-full max-w-6xl mx-auto relative">
      {/* Background styling handled by parent container usually, but ensuring z-index */}
      <NoiseOverlay />
      
      <AnimatePresence mode="wait">
        
        {/* STEP 1: INTRO */}
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-12 gap-12 md:gap-24 relative z-10"
          >
            <div className="md:col-span-5 flex flex-col justify-between">
              <div>
                <SectionHeader 
                  number="01" 
                  title="The Initiation." 
                  subtitle="A conversation to bridge your world with ours." 
                />
                <p className="text-xl font-light font-arizona leading-relaxed text-[#342e29]/80 mt-8 mb-12">
                  You have chosen to pause. To return. This conversation is not a transaction, but an initiation into the 10% life.
                </p>
                <div className="hidden md:block">
                  <button
                    onClick={() => setStep('datetime')}
                    className="bg-[#342e29] text-[#fdfbf7] px-10 py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors inline-flex items-center gap-4 group"
                  >
                    Begin The Protocol
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 bg-[#fffdf9] border border-[#342e29]/10 p-8 md:p-16 relative">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                 <Feather className="w-24 h-24" />
              </div>
              
              <h3 className="font-arizona text-2xl text-[#342e29] mb-8">The Agenda</h3>
              
              <div className="space-y-10 border-l border-[#342e29]/10 pl-8 ml-2">
                <div className="relative">
                  <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full bg-[#86312b]" />
                  <h4 className="text-lg font-medium text-[#342e29] mb-1">Introduction</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-arizona">Meet your dedicated guide who will welcome you to the collective.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full bg-[#342e29]/20" />
                  <h4 className="text-lg font-medium text-[#342e29] mb-1">The Commitment</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-arizona">Formalizing your membership (£17.6L) through our secure channels.</p>
                </div>
                
                <div className="relative">
                  <div className="absolute -left-[37px] top-1 w-3 h-3 rounded-full bg-[#342e29]/20" />
                  <h4 className="text-lg font-medium text-[#342e29] mb-1">The Return</h4>
                  <p className="text-sm opacity-60 leading-relaxed font-arizona">Immediate access to the sanctuaries. Your pause begins now.</p>
                </div>
              </div>

              <div className="mt-16 pt-8 border-t border-[#342e29]/10">
                <p className="text-xs uppercase tracking-widest opacity-50 mb-4">Please Have Ready</p>
                <div className="flex items-center gap-3 text-[#342e29]">
                  <ShieldCheck className="w-5 h-5 opacity-60" />
                  <span className="font-arizona">Your preferred mode of commitment (Card / Netbanking).</span>
                </div>
              </div>

              <div className="md:hidden mt-12">
                <button
                  onClick={() => setStep('datetime')}
                  className="w-full bg-[#342e29] text-[#fdfbf7] px-8 py-5 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors flex items-center justify-center gap-3 group"
                >
                  Begin The Protocol
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: DATETIME */}
        {step === 'datetime' && (
          <motion.div
            key="datetime"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-12 gap-12 relative z-10"
          >
            <div className="md:col-span-4">
              <button 
                onClick={() => setStep('intro')}
                className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 mb-8 flex items-center gap-2 transition-opacity"
              >
                <ArrowRight className="w-3 h-3 rotate-180" /> Return
              </button>
              
              <SectionHeader 
                number="02" 
                title="The Pause." 
                subtitle="Select a moment of silence." 
              />
              
              <p className="text-lg font-arizona opacity-70 leading-relaxed">
                Time is the currency we value most. Choose a window that allows you to be fully present.
              </p>
            </div>

            <div className="md:col-span-8 bg-[#fffdf9] border border-[#342e29]/10 p-6 md:p-12">
              <div className="grid md:grid-cols-2 gap-12">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-6 border-b border-[#342e29]/10 pb-4">
                    <span className="font-arizona text-lg text-[#86312b]">Date</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleWeekChange('prev')} className="p-1 hover:bg-[#342e29]/5 rounded transition-colors">
                        <ChevronLeft className="w-5 h-5 opacity-50" />
                      </button>
                      <button onClick={() => handleWeekChange('next')} className="p-1 hover:bg-[#342e29]/5 rounded transition-colors">
                        <ChevronRight className="w-5 h-5 opacity-50" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    {calendarDays.slice(0, 7).map((date) => {
                      const isSelected = selectedDate?.toDateString() === date.toDateString()
                      
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => setSelectedDate(date)}
                          className={`w-full flex items-center justify-between p-4 border-l-2 transition-all duration-300 group ${
                            isSelected
                              ? 'border-[#86312b] bg-[#86312b]/5'
                              : 'border-transparent hover:bg-[#342e29]/5'
                          }`}
                        >
                          <span className={`font-arizona text-lg ${isSelected ? 'text-[#86312b]' : 'text-[#342e29]'}`}>
                            {date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })}
                          </span>
                          <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#86312b]' : 'bg-[#342e29]/10 group-hover:bg-[#342e29]/30'}`} />
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Time */}
                <div className={`transition-opacity duration-500 ${!selectedDate ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between mb-6 border-b border-[#342e29]/10 pb-4">
                    <span className="font-arizona text-lg text-[#86312b]">Time</span>
                    {selectedDate && (
                      <span className="text-xs uppercase tracking-widest opacity-50">
                        {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 px-4 text-sm font-light transition-all duration-300 text-left ${
                          selectedTime === time
                            ? 'bg-[#86312b] text-white shadow-md'
                            : 'bg-[#fdfbf7] hover:bg-[#342e29]/5 text-[#342e29]'
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
                  className="bg-[#342e29] text-[#fdfbf7] px-10 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  Confirm Moment
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: DETAILS */}
        {step === 'details' && (
          <motion.div
            key="details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid md:grid-cols-12 gap-12 relative z-10"
          >
            <div className="md:col-span-4">
              <button 
                onClick={() => setStep('datetime')}
                className="text-xs uppercase tracking-widest opacity-50 hover:opacity-100 mb-8 flex items-center gap-2 transition-opacity"
              >
                <ArrowRight className="w-3 h-3 rotate-180" /> Change Time
              </button>
              
              <SectionHeader 
                number="03" 
                title="The Identity." 
                subtitle="Who shall we welcome?" 
              />
              
              <div className="bg-[#fffdf9] p-6 border border-[#342e29]/10 mt-8">
                <p className="text-xs uppercase tracking-widest opacity-50 mb-2">Selected Moment</p>
                <p className="text-xl font-arizona text-[#86312b]">
                  {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-lg font-arizona opacity-70">at {selectedTime}</p>
              </div>
            </div>

            <div className="md:col-span-8 bg-[#fffdf9] border border-[#342e29]/10 p-8 md:p-16 flex flex-col justify-center">
              <form onSubmit={handleSubmit} className="space-y-12 max-w-lg mx-auto w-full">
                <div className="space-y-4 group">
                  <label className="text-xs uppercase tracking-widest opacity-60 flex items-center gap-2 group-focus-within:text-[#86312b] transition-colors">
                    <User className="w-3 h-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-[#342e29]/20 py-4 text-2xl font-arizona focus:outline-none focus:border-[#86312b] transition-colors placeholder:text-[#342e29]/10"
                    placeholder="Your Name"
                  />
                </div>

                <div className="space-y-4 group">
                  <label className="text-xs uppercase tracking-widest opacity-60 flex items-center gap-2 group-focus-within:text-[#86312b] transition-colors">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-[#342e29]/20 py-4 text-2xl font-arizona focus:outline-none focus:border-[#86312b] transition-colors placeholder:text-[#342e29]/10"
                    placeholder="+91..."
                  />
                </div>

                <div className="pt-8">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#342e29] text-[#fdfbf7] py-6 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors flex items-center justify-center gap-3 disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Formalizing...
                      </>
                    ) : (
                      <>
                        Confirm Appointment
                        <span className="w-px h-4 bg-[#fdfbf7]/20 mx-2" />
                        <span className="font-serif italic font-normal text-lg lowercase">the protocol begins</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center relative z-10"
          >
            <div className="w-32 h-32 rounded-full border border-[#86312b] text-[#86312b] flex items-center justify-center mb-12 bg-[#86312b]/5 relative">
              <Sparkles className="w-12 h-12" strokeWidth={1} />
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#342e29] rounded-full flex items-center justify-center text-[#fdfbf7]"
              >
                <CheckCircle2 className="w-5 h-5" />
              </motion.div>
            </div>

            <h2 className="text-6xl md:text-8xl font-light font-arizona mb-8 text-[#342e29]">
              The Date is Set.
            </h2>

            <p className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto mb-16 font-arizona leading-relaxed">
              We await our conversation on <br/>
              <span className="text-[#86312b] border-b border-[#86312b]/30 pb-1">
                {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span> at <span className="text-[#86312b]">{selectedTime}</span>.
            </p>
            
            <p className="text-sm uppercase tracking-widest opacity-40">
              A guide will contact you on {formData.phone}
            </p>

            <div className="mt-20">
               <a href="/" className="inline-block border-b border-[#342e29] pb-1 text-[#342e29] text-xs uppercase tracking-widest hover:text-[#86312b] hover:border-[#86312b] transition-colors">
                 Return to Wilderness
               </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

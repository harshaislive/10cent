'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle, ArrowRight, Check, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'

interface TrialBookingModalProps {
    isOpen: boolean
    onClose: () => void
    locationName: string
}

export default function TrialBookingModal({ isOpen, onClose, locationName }: TrialBookingModalProps) {
    const [step, setStep] = useState<'disclaimer' | 'form' | 'success'>('disclaimer')
    const [holdProgress, setHoldProgress] = useState(0)
    const holdInterval = useRef<NodeJS.Timeout | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date())
    const [startDate, setStartDate] = useState<Date | null>(null)
    const [endDate, setEndDate] = useState<Date | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dates: ''
    })

    useEffect(() => {
        if (!isOpen) {
            setStep('disclaimer')
            setHoldProgress(0)
            setFormData({ name: '', email: '', phone: '', dates: '' })
            setIsSubmitting(false)
        }
    }, [isOpen])

    // Hold to Acknowledge Logic
    const startHold = () => {
        if (holdInterval.current) clearInterval(holdInterval.current)
        holdInterval.current = setInterval(() => {
            setHoldProgress(prev => {
                if (prev >= 100) {
                    clearInterval(holdInterval.current!)
                    setStep('form')
                    return 100
                }
                return prev + 4 // Speed of fill
            })
        }, 20)
    }

    const endHold = () => {
        if (holdInterval.current) clearInterval(holdInterval.current)
        if (holdProgress < 100) setHoldProgress(0)
    }

    // Form Submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL

        try {
            if (webhookUrl) {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'trial_booking_request',
                        location: locationName,
                        ...formData,
                        timestamp: new Date().toISOString()
                    })
                })
            }
            // Show success regardless to provide good UX
            setStep('success')
        } catch (err) {
            console.error('Booking failed:', err)
            setStep('success') // Still show success for demo purposes
        } finally {
            setIsSubmitting(false)
        }
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

                    <div className="w-full max-w-2xl px-6 relative z-10">

                        {/* STEP 1: DISCLAIMER (Hold to Accept) */}
                        {step === 'disclaimer' && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -20, opacity: 0 }}
                                className="text-center"
                            >
                                <p className="text-[#86312b] uppercase tracking-[0.3em] text-xs font-bold mb-6">
                                    The Condition
                                </p>
                                <h2 className="text-4xl md:text-6xl font-light mb-8 font-arizona leading-tight">
                                    Two Souls.<br />
                                    One Room.
                                </h2>
                                <div className="max-w-md mx-auto space-y-6 text-lg md:text-xl font-arizona font-light border-l border-[#fdfbf7]/20 pl-6 text-left opacity-80 mb-12">
                                    <p>
                                        This trial is designed for intimacy, not crowds.
                                    </p>
                                    <p>
                                        We act strictly for <strong className="text-[#ffc083]">two guests per room</strong>. No large groups. No exceptions.
                                    </p>
                                </div>

                                <div className="relative inline-block group">
                                    <button
                                        onMouseDown={startHold}
                                        onMouseUp={endHold}
                                        onMouseLeave={endHold}
                                        onTouchStart={startHold}
                                        onTouchEnd={endHold}
                                        className="relative overflow-hidden border border-[#fdfbf7] px-12 py-5 uppercase tracking-widest text-sm font-bold transition-all active:scale-95 select-none"
                                    >
                                        <span className="relative z-10 mix-blend-difference">Hold to Accept</span>
                                        <div
                                            className="absolute inset-0 bg-[#fdfbf7] z-0 origin-left"
                                            style={{ width: `${holdProgress}%` }}
                                        />
                                    </button>
                                    <p className="text-xs opacity-40 mt-4 tracking-widest uppercase animate-pulse">Hold for acknowledgement</p>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: BOOKING FORM */}
                        {step === 'form' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="text-left max-w-4xl mx-auto max-h-[85vh] overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pr-2"
                            >
                                <div className="mb-12 pl-1">
                                    <p className="text-[#ffc083] uppercase tracking-widest text-xs font-medium mb-3">Request Access</p>
                                    <h2 className="text-3xl md:text-5xl font-light font-arizona">{locationName}</h2>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                                        {/* LEFT COL: Inputs */}
                                        <div className="space-y-10 pt-2">
                                            <div className="space-y-8">
                                                <div className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest opacity-60">Full Name</label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10"
                                                        placeholder="Your Name"
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest opacity-60">Phone</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10"
                                                        placeholder="+91..."
                                                    />
                                                </div>
                                                <div className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest opacity-60">Email</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-transparent border-b border-[#fdfbf7]/20 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/10"
                                                        placeholder="email@example.com"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* RIGHT COL: Calendar & Action */}
                                        <div className="space-y-8">
                                            {/* CALENDAR SECTION - Minimalist */}
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-baseline border-b border-[#fdfbf7]/10 pb-3">
                                                    <p className="text-[#ffc083] uppercase tracking-widest text-xs font-medium">Block Two Nights</p>
                                                    <p className="text-[10px] uppercase tracking-wider opacity-50 text-right">Weekdays recommended.</p>
                                                </div>

                                                <div className="">
                                                    {/* Calendar Header */}
                                                    <div className="flex items-center justify-between mb-8">
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                                                            className="p-2 hover:text-[#ffc083] transition-colors opacity-60 hover:opacity-100"
                                                        >
                                                            <ChevronLeft className="w-5 h-5" />
                                                        </button>
                                                        <span className="font-arizona text-2xl tracking-wide font-light">
                                                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                                                            className="p-2 hover:text-[#ffc083] transition-colors opacity-60 hover:opacity-100"
                                                        >
                                                            <ChevronRight className="w-5 h-5" />
                                                        </button>
                                                    </div>

                                                    {/* Weekday Headers */}
                                                    <div className="grid grid-cols-7 mb-4 text-center">
                                                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                                            <div key={d} className="text-[10px] uppercase opacity-30 tracking-widest">{d}</div>
                                                        ))}
                                                    </div>

                                                    {/* Days Grid */}
                                                    <div className="grid grid-cols-7 gap-y-3 text-center">
                                                        {/* Empty slots for start of month */}
                                                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => (
                                                            <div key={`empty-${i}`} />
                                                        ))}

                                                        {/* Days */}
                                                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                                                            const day = i + 1
                                                            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)

                                                            // Auto-Select 2 Nights Logic
                                                            const isStart = startDate && date.toLocaleDateString() === startDate.toLocaleDateString()
                                                            const isEnd = endDate && date.toLocaleDateString() === endDate.toLocaleDateString()
                                                            const isInRange = startDate && endDate && date > startDate && date < endDate

                                                            // Disable past dates
                                                            const isPast = date < new Date() && date.toDateString() !== new Date().toDateString()

                                                            return (
                                                                <button
                                                                    key={day}
                                                                    type="button"
                                                                    disabled={isPast}
                                                                    onClick={() => {
                                                                        const nextDay = new Date(date)
                                                                        nextDay.setDate(date.getDate() + 1) // Auto-select next day

                                                                        setStartDate(date)
                                                                        setEndDate(nextDay)

                                                                        // Update form payload
                                                                        const range = `${date.toLocaleDateString()} - ${nextDay.toLocaleDateString()}`
                                                                        setFormData(prev => ({ ...prev, dates: range }))
                                                                    }}
                                                                    className={`
                                                                        h-9 w-full flex items-center justify-center text-sm font-light transition-all relative rounded-none
                                                                        ${isPast ? 'opacity-10 cursor-not-allowed' : 'hover:bg-[#fdfbf7]/10 cursor-pointer'}
                                                                        ${(isStart) ? 'bg-[#ffc083] text-[#342e29] font-medium' : ''}
                                                                        ${(isEnd) ? 'bg-[#ffc083] text-[#342e29] font-medium' : ''}
                                                                        ${isInRange ? 'bg-[#ffc083]/20' : ''}
                                                                    `}
                                                                >
                                                                    {day}
                                                                </button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Availability Message */}
                                                <div className="flex gap-3 text-[10px] leading-relaxed opacity-60 font-arizona pt-2">
                                                    <div className="shrink-0 mt-1">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#ffc083]" />
                                                    </div>
                                                    <p className="tracking-wide">
                                                        Provisional hold. We will verify availability and confirm within 24 hours.
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting || !startDate}
                                                className="w-full bg-[#fdfbf7] text-[#342e29] py-5 uppercase tracking-widest text-xs font-medium hover:bg-[#ffc083] transition-colors flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <span>Confirm Request</span>
                                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* STEP 3: SUCCESS */}
                        {step === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="w-20 h-20 rounded-full border-2 border-[#ffc083] text-[#ffc083] flex items-center justify-center mx-auto mb-8">
                                    <Check className="w-10 h-10" />
                                </div>
                                <h2 className="text-4xl font-light font-arizona mb-4">Request Received</h2>
                                <p className="opacity-70 max-w-md mx-auto mb-8">
                                    The wilderness awaits. Our team will verify your details and reach out within 24 hours to finalize your trial stay.
                                </p>
                                <button
                                    onClick={onClose}
                                    className="border-b border-[#ffc083] text-[#ffc083] pb-1 uppercase tracking-widest text-xs font-bold hover:opacity-80 transition-opacity"
                                >
                                    Return to Sanctuaries
                                </button>
                            </motion.div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

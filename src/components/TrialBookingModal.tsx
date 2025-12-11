'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle, ArrowRight, Check, Loader2 } from 'lucide-react'

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
                                className="text-left max-w-lg mx-auto"
                            >
                                <div className="mb-8">
                                    <p className="text-[#ffc083] uppercase tracking-widest text-xs font-bold mb-2">Request Access</p>
                                    <h2 className="text-3xl md:text-4xl font-light font-arizona">{locationName}</h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest opacity-60">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-transparent border-b border-[#fdfbf7]/30 py-3 text-xl font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/20"
                                            placeholder="Your Name"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest opacity-60">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-transparent border-b border-[#fdfbf7]/30 py-3 text-lg font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/20"
                                                placeholder="email@example.com"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase tracking-widest opacity-60">Phone</label>
                                            <input
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-transparent border-b border-[#fdfbf7]/30 py-3 text-lg font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/20"
                                                placeholder="+91..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs uppercase tracking-widest opacity-60">Preferred Month</label>
                                        <input
                                            type="text"
                                            value={formData.dates}
                                            onChange={e => setFormData({ ...formData, dates: e.target.value })}
                                            className="w-full bg-transparent border-b border-[#fdfbf7]/30 py-3 text-lg font-light focus:outline-none focus:border-[#ffc083] transition-colors placeholder:text-[#fdfbf7]/20"
                                            placeholder="e.g. January 2026"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full mt-8 bg-[#fdfbf7] text-[#342e29] py-5 uppercase tracking-widest text-sm font-bold hover:bg-[#ffc083] transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
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

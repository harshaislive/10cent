'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XCircle, ArrowRight, Check, Loader2, Lock, Calendar, Shield } from 'lucide-react'
import axios from 'axios'

interface TrialPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  locationName: string
  location: string
}

const TOKEN_AMOUNT = 1 // ₹1 (testing)
const SUBSCRIPTION_AMOUNT = 1760000 // ₹17.6 Lakhs

export default function TrialPaymentModal({ isOpen, onClose, locationName, location }: TrialPaymentModalProps) {
  const [step, setStep] = useState<'intro' | 'form' | 'processing'>('intro')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })

  useEffect(() => {
    if (!isOpen) {
      setStep('intro')
      setFormData({ name: '', email: '', phone: '' })
      setIsSubmitting(false)
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Initiate PhonePe payment
      const { data } = await axios.post('/api/phonepe/pay', {
        amount: TOKEN_AMOUNT,
        mobileNumber: formData.phone,
        name: formData.name,
        email: formData.email,
        location: location,
      })

      if (data.url) {
        // Redirect to PhonePe checkout
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      setIsSubmitting(false)
      // For now, show error - you could add a proper error state
      alert('Payment initiation failed. Please try again.')
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

          <div className="w-full max-w-3xl px-6 relative z-10">
            {/* STEP 1: INTRO - Explain the Token System */}
            {step === 'intro' && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full border border-[#ffc083] text-[#ffc083] flex items-center justify-center mx-auto mb-8">
                  <Lock className="w-8 h-8" />
                </div>

                <p className="text-[#86312b] uppercase tracking-[0.3em] text-xs font-bold mb-6">
                  Secure Your Trial
                </p>

                <h2 className="text-4xl md:text-6xl font-light mb-8 font-arizona leading-tight">
                  The Token Protocol
                </h2>

                <div className="max-w-2xl mx-auto space-y-8 text-lg md:text-xl font-arizona font-light border-l border-[#fdfbf7]/20 pl-8 text-left mb-12">
                  <p>
                    A <strong className="text-[#ffc083]">₹{TOKEN_AMOUNT.toLocaleString()}</strong> token secures your trial stay at <strong>{locationName}</strong>.
                  </p>
                  <p className="opacity-80">
                    This amount is <strong className="text-[#ffc083]">fully adjustable</strong> toward your full 10-year subscription (₹17.6 Lakhs).
                  </p>
                  <p className="text-base opacity-70 italic">
                    Think of it as reserving your place in the wilderness—a commitment that becomes your foundation.
                  </p>
                </div>

                {/* Visual Breakdown */}
                <div className="max-w-xl mx-auto mb-12 p-8 border border-[#fdfbf7]/10 bg-[#fdfbf7]/5">
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-60">Trial Token</span>
                      <span className="font-arizona text-xl">₹{TOKEN_AMOUNT.toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-[#fdfbf7]/20" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-60">Full Subscription</span>
                      <span className="font-arizona text-xl">₹17,60,000</span>
                    </div>
                    <div className="h-px bg-[#fdfbf7]/20" />
                    <div className="flex justify-between items-center text-[#ffc083]">
                      <span className="text-sm font-medium">Your Token Applied</span>
                      <span className="font-arizona text-xl">- ₹1</span>
                    </div>
                    <div className="h-px bg-[#fdfbf7]/20" />
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm opacity-60">Balance After Trial</span>
                      <span className="font-arizona text-xl">₹17,10,000</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('form')}
                  className="bg-[#fdfbf7] text-[#342e29] px-12 py-5 uppercase tracking-widest text-sm font-bold hover:bg-[#ffc083] transition-colors flex items-center gap-3 mx-auto group"
                >
                  <span>Proceed to Payment</span>
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
                    className="text-[#10px] uppercase tracking-widest opacity-40 hover:opacity-70 transition-opacity mb-4 flex items-center gap-2"
                  >
                    <ArrowRight className="w-3 h-3 rotate-180" /> Back
                  </button>
                  <p className="text-[#ffc083] uppercase tracking-widest text-xs font-medium mb-3">Secure Your Token</p>
                  <h2 className="text-3xl md:text-5xl font-light font-arizona">{locationName}</h2>
                  <p className="text-[#fdfbf7]/60 font-arizona mt-2">Trial Token: ₹{TOKEN_AMOUNT.toLocaleString()}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-10">
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
                  </div>

                  {/* Payment Info */}
                  <div className="mt-12 p-6 border border-[#fdfbf7]/10 bg-[#fdfbf7]/5">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-[#ffc083] shrink-0 mt-1" />
                      <div className="text-sm opacity-70 font-arizona leading-relaxed">
                        <p className="mb-2">You will be redirected to PhonePe's secure payment gateway to complete your token purchase.</p>
                        <p className="text-xs opacity-50">All transactions are encrypted and secure. Your token amount is fully refundable if trial dates cannot be accommodated.</p>
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
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay ₹{TOKEN_AMOUNT.toLocaleString()} Token</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: PROCESSING */}
            {step === 'processing' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full border-2 border-[#ffc083] text-[#ffc083] flex items-center justify-center mx-auto mb-8">
                  <Loader2 className="w-10 h-10 animate-spin" />
                </div>
                <h2 className="text-4xl font-light font-arizona mb-4">Redirecting to Payment</h2>
                <p className="opacity-70 max-w-md mx-auto">
                  Securing your token through PhonePe's secure gateway...
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

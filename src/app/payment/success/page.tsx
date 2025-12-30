'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Calendar, MapPin, CreditCard, Home } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [amount, setAmount] = useState<string | null>(null)

  useEffect(() => {
    const tid = searchParams.get('tid')
    const amt = searchParams.get('amount')
    setTransactionId(tid)
    setAmount(amt)

    // TODO: Save payment details to Supabase here
    // This is where you'd call your Supabase API to record the payment
    const savePaymentToSupabase = async () => {
      // Supabase integration will be added here
      console.log('Payment successful:', { tid, amt })
    }

    savePaymentToSupabase()
  }, [searchParams])

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#342e29] font-arizona">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.03] mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        {/* Logo Header */}
        <Link href="/" className="inline-block mb-16">
          <div className="relative w-16 h-16 grayscale hover:grayscale-0 transition-all duration-500">
            <img
              src="/10-Club-01.png"
              alt="Beforest 10% Club"
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        {/* Success Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="w-32 h-32 rounded-full border-2 border-[#86312b] text-[#86312b] flex items-center justify-center mx-auto mb-8 bg-[#86312b]/5">
            <Check className="w-16 h-16" strokeWidth={1.5} />
          </div>

          <h1 className="text-5xl md:text-7xl font-light leading-[0.9] tracking-tight mb-6">
            Token Secured.
          </h1>

          <p className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto font-arizona leading-relaxed">
            Your trial at Blyton, Coorg has been reserved. The wilderness awaits your arrival.
          </p>
        </motion.div>

        {/* Transaction Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-16"
        >
          <div className="border border-[#342e29]/10 p-8 md:p-12 bg-white/30">
            <h2 className="text-lg uppercase tracking-widest text-[#86312b] mb-8">Transaction Details</h2>

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-6 border-b border-[#342e29]/10">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 opacity-50" />
                  <span className="text-sm opacity-60">Token Amount Paid</span>
                </div>
                <span className="text-2xl font-light">
                  {amount ? `₹${parseInt(amount).toLocaleString()}` : '₹1'}
                </span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-6 border-b border-[#342e29]/10">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 opacity-50" />
                  <span className="text-sm opacity-60">Trial Location</span>
                </div>
                <span className="text-xl font-light">Blyton, Coorg</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 pb-6 border-b border-[#342e29]/10">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 opacity-50" />
                  <span className="text-sm opacity-60">Duration</span>
                </div>
                <span className="text-xl font-light">2 Nights / 3 Days</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm opacity-60">Transaction ID</span>
                </div>
                <span className="text-sm font-mono opacity-60">{transactionId || 'Processing...'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-2xl uppercase tracking-widest text-[#342e29] mb-8">What Happens Next</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Verification',
                description: 'Our team will verify your payment details within 24 hours.',
                icon: '✓'
              },
              {
                step: '02',
                title: 'Contact',
                description: 'You will receive a call to confirm your preferred dates.',
                icon: '📞'
              },
              {
                step: '03',
                title: 'Confirmation',
                description: 'Once dates are locked, you will receive a detailed guide for your stay.',
                icon: '📧'
              }
            ].map((item, i) => (
              <div key={i} className="border border-[#342e29]/10 p-6 bg-white/20 hover:bg-white/40 transition-colors">
                <div className="w-12 h-12 rounded-full border border-[#86312b] text-[#86312b] flex items-center justify-center mb-4 text-lg font-arizona">
                  {item.step}
                </div>
                <h3 className="text-lg font-light mb-2">{item.title}</h3>
                <p className="text-sm opacity-60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Token Benefit Reminder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="p-8 border border-[#86312b]/30 bg-[#86312b]/5 mb-16"
        >
          <p className="text-center font-arizona text-xl md:text-2xl leading-relaxed">
            Remember: Your <strong className="text-[#86312b]">₹1 token</strong> is fully adjustable toward your full 10-year subscription.
            <br />
            <span className="text-lg opacity-70">Should you choose to continue with the 10% Club, this amount will be deducted from the ₹17.6 Lakhs membership fee.</span>
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 bg-[#342e29] text-[#fdfbf7] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>

          <a
            href="tel:+919876543210"
            className="inline-flex items-center justify-center gap-3 border border-[#342e29] text-[#342e29] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#342e29] hover:text-[#fdfbf7] transition-colors"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </div>
  )
}

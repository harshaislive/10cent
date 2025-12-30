'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { XCircle, ArrowRight, RefreshCw, Home, Phone } from 'lucide-react'

export default function PaymentFailurePage() {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get('tid')

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

        {/* Failure Animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <div className="w-32 h-32 rounded-full border-2 border-red-700 text-red-700 flex items-center justify-center mx-auto mb-8 bg-red-50">
            <XCircle className="w-16 h-16" strokeWidth={1.5} />
          </div>

          <h1 className="text-5xl md:text-7xl font-light leading-[0.9] tracking-tight mb-6">
            Payment Incomplete.
          </h1>

          <p className="text-xl md:text-2xl opacity-70 max-w-2xl mx-auto font-arizona leading-relaxed">
            The transaction could not be completed. This could be due to a cancellation, network issue, or payment failure.
          </p>
        </motion.div>

        {/* Transaction Details */}
        {transactionId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-16"
          >
            <div className="border border-[#342e29]/10 p-8 md:p-12 bg-white/30">
              <h2 className="text-lg uppercase tracking-widest text-[#86312b] mb-4">Transaction Reference</h2>
              <p className="font-mono text-sm opacity-60">{transactionId}</p>
              <p className="text-sm opacity-50 mt-2">If you were charged, please contact us with this reference for assistance.</p>
            </div>
          </motion.div>
        )}

        {/* Possible Reasons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-xl uppercase tracking-widest text-[#342e29] mb-8">Common Reasons</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Payment Cancelled',
                description: 'The payment was cancelled at the payment gateway.'
              },
              {
                title: 'Insufficient Funds',
                description: 'The payment method did not have sufficient balance.'
              },
              {
                title: 'Transaction Timeout',
                description: 'The payment session expired before completion.'
              },
              {
                title: 'Bank Declined',
                description: 'Your bank declined the transaction for security reasons.'
              }
            ].map((reason, i) => (
              <div key={i} className="border border-[#342e29]/10 p-6 bg-white/20">
                <h3 className="font-medium mb-2">{reason.title}</h3>
                <p className="text-sm opacity-60">{reason.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="p-8 border border-[#342e29]/20 bg-white/30 mb-16"
        >
          <h2 className="text-xl font-light mb-4">Need Assistance?</h2>
          <p className="opacity-70 mb-6 leading-relaxed">
            If you believe this is an error or if your account was debited, please reach out to our team.
            We're here to help resolve any payment-related concerns.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 text-[#86312b] hover:underline"
            >
              <Phone className="w-4 h-4" />
              Call us directly
            </a>
            <span className="opacity-50">or</span>
            <a
              href="mailto:trials@10percentclub.com"
              className="inline-flex items-center gap-2 text-[#86312b] hover:underline"
            >
              Email us at trials@10percentclub.com
            </a>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/confirmation?action=trial"
            className="inline-flex items-center justify-center gap-3 bg-[#342e29] text-[#fdfbf7] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#86312b] transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-3 border border-[#342e29] text-[#342e29] px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-[#342e29] hover:text-[#fdfbf7] transition-colors"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

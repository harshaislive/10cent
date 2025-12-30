'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, CheckCircle2, Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import axios from 'axios'

// Utility Component: Noise Overlay
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

export default function FeedbackPage() {
  const [step, setStep] = useState<'form' | 'success'>('form')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    feelings: '',
    highlights: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await axios.post('/api/feedback', {
        ...formData,
        stay_location: 'Blyton, Coorg' // Default for now
      })
      setStep('success')
    } catch (error) {
      console.error('Feedback failed:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdfbf7] text-[#342e29] font-arizona relative overflow-hidden flex flex-col">
      <NoiseOverlay />
      
      {/* Logo Header */}
      <div className="w-full flex justify-center py-12 relative z-10">
        <Link href="/" className="transition-opacity hover:opacity-70">
          <div className="relative w-16 h-16 grayscale hover:grayscale-0 transition-all duration-500">
            <Image
              src="/10-Club-01.png"
              alt="Beforest 10% Club"
              fill
              className="object-contain"
            />
          </div>
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center p-6 relative z-10 pb-24">
        <AnimatePresence mode="wait">
          {step === 'form' && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl w-full"
            >
              <div className="text-center mb-16">
                <p className="text-[#86312b] uppercase tracking-[0.3em] text-xs font-bold mb-6">
                  The Reflection
                </p>
                <h1 className="text-4xl md:text-6xl font-light leading-tight mb-8">
                  How was the silence?
                </h1>
                <p className="text-lg opacity-60 font-light leading-relaxed max-w-lg mx-auto">
                  We don't measure stars or ratings. We measure the depth of your return. 
                  Tell us about your time in the wilderness.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-12">
                
                {/* Question 1 */}
                <div className="space-y-4">
                  <label className="text-xl md:text-2xl font-light text-[#342e29]">
                    1. How did the forest feel to you?
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-[#342e29]/20 text-xl font-light focus:outline-none focus:border-[#86312b] transition-colors placeholder:text-[#342e29]/10 resize-none py-4"
                    placeholder="Did you find the quiet you were looking for?"
                    value={formData.feelings}
                    onChange={e => setFormData({...formData, feelings: e.target.value})}
                  />
                </div>

                {/* Question 2 */}
                <div className="space-y-4">
                  <label className="text-xl md:text-2xl font-light text-[#342e29]">
                    2. A moment you will carry back?
                  </label>
                  <textarea
                    rows={2}
                    className="w-full bg-transparent border-b border-[#342e29]/20 text-xl font-light focus:outline-none focus:border-[#86312b] transition-colors placeholder:text-[#342e29]/10 resize-none py-4"
                    placeholder="A sound, a sight, or a thought..."
                    value={formData.highlights}
                    onChange={e => setFormData({...formData, highlights: e.target.value})}
                  />
                </div>

                {/* Question 3 - Identification (Optional feel) */}
                <div className="grid md:grid-cols-2 gap-8 pt-8">
                   <div className="space-y-2">
                     <label className="text-xs uppercase tracking-widest opacity-50">Your Name (Optional)</label>
                     <input 
                       type="text"
                       className="w-full bg-transparent border-b border-[#342e29]/20 py-2 focus:outline-none focus:border-[#86312b]"
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                     />
                   </div>
                   <div className="space-y-2">
                     <label className="text-xs uppercase tracking-widest opacity-50">Phone (Optional)</label>
                     <input 
                       type="tel"
                       className="w-full bg-transparent border-b border-[#342e29]/20 py-2 focus:outline-none focus:border-[#86312b]"
                       value={formData.phone}
                       onChange={e => setFormData({...formData, phone: e.target.value})}
                     />
                   </div>
                </div>

                <div className="pt-12 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#342e29] text-[#fdfbf7] px-12 py-5 uppercase tracking-widest text-sm font-bold hover:bg-[#86312b] transition-colors inline-flex items-center gap-4 disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sharing...
                      </>
                    ) : (
                      <>
                        Share My Reflection
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>

              </form>
            </motion.div>
          )}

          {step === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-xl"
            >
              <div className="w-24 h-24 rounded-full border border-[#86312b] text-[#86312b] flex items-center justify-center mx-auto mb-12 bg-[#86312b]/5 relative">
                <Sparkles className="w-10 h-10" strokeWidth={1} />
              </div>

              <h2 className="text-5xl md:text-7xl font-light mb-8 text-[#342e29]">
                Thank you.
              </h2>
              
              <p className="text-xl opacity-70 leading-relaxed font-arizona mb-12">
                "We do not inherit the earth from our ancestors; we borrow it from our children."
              </p>

              <p className="text-lg opacity-60">
                Your words help us protect the silence.
              </p>

              <div className="mt-20">
                <Link href="/" className="inline-block border-b border-[#342e29] pb-1 text-[#342e29] text-xs uppercase tracking-widest hover:text-[#86312b] hover:border-[#86312b] transition-colors">
                  Return Home
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

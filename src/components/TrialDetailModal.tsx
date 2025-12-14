'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, MapPin, Wind, Mountain, Trees } from 'lucide-react'

interface LocationImage {
    desktop: string
    mobile: string
}

interface TrialLocation {
    name: string
    tagline: string
    description: string
    features: string[]
    images: LocationImage[]
}

interface TrialDetailModalProps {
    isOpen: boolean
    onClose: () => void
    location: TrialLocation | null
    onBook: () => void
}

export default function TrialDetailModal({ isOpen, onClose, location, onBook }: TrialDetailModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)

    // Reset selection when location changes
    React.useEffect(() => {
        if (isOpen) setSelectedImageIndex(0)
    }, [isOpen, location])

    if (!location) return null

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[60] bg-[#1a1816] text-[#fdfbf7] overflow-hidden flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="fixed top-6 right-6 z-[70] p-3 group mix-blend-difference text-[#fdfbf7] hover:bg-[#fdfbf7]/10 rounded-full transition-all"
                    >
                        <X className="w-6 h-6 opacity-70 group-hover:opacity-100" />
                    </button>

                    <div className="flex flex-col lg:flex-row h-full w-full">

                        {/* LEFT: Main Gallery (60% Mobile / 65% Desktop) - The "Grandeur" View */}
                        <div className="w-full lg:w-[65%] h-[60vh] lg:h-full flex flex-col bg-black relative z-10">
                            {/* Main Display Frame */}
                            <div className="flex-1 relative w-full h-full overflow-hidden">
                                {location.images.map((img, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={false}
                                        animate={{
                                            opacity: selectedImageIndex === idx ? 1 : 0,
                                            scale: selectedImageIndex === idx ? 1 : 1.05,
                                            zIndex: selectedImageIndex === idx ? 10 : 0
                                        }}
                                        transition={{ duration: 0.7, ease: "easeInOut" }}
                                        className="absolute inset-0 pointer-events-none"
                                    >
                                        <Image
                                            src={img.desktop}
                                            alt={`${location.name} - view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                            quality={95}
                                            priority={idx === 0}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1a1816] to-transparent opacity-60" />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Thumbnail Strip */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-32 bg-gradient-to-t from-[#1a1816]/90 to-transparent flex items-end pb-4 lg:pb-0 lg:items-center px-4 lg:px-6 gap-3 lg:gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden z-20">
                                {location.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`relative w-14 h-12 lg:w-32 lg:h-20 shrink-0 border transition-all duration-300 shadow-lg ${selectedImageIndex === idx
                                            ? 'border-[#ffc083] opacity-100 scale-105'
                                            : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img.desktop}
                                            alt="thumbnails"
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT: Compact Editorial Panel (40% Mobile / 35% Desktop) */}
                        <div className="w-full lg:w-[35%] h-[40vh] lg:h-full bg-[#342e29] border-l border-[#fdfbf7]/5 flex flex-col justify-between relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">

                            {/* Scrollable Content Wrapper */}
                            <div className="flex-1 overflow-y-auto p-6 lg:p-12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-3 mb-3 lg:mb-6">
                                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#ffc083]">The 10% Promise</span>
                                        <div className="h-px w-8 bg-[#fdfbf7]/30" />
                                        <span className="text-[10px] uppercase tracking-[0.2em] opacity-50">Trial Stay</span>
                                    </div>

                                    <h2 className="text-3xl lg:text-5xl xl:text-6xl font-light font-arizona mb-2 lg:mb-4 text-[#fdfbf7] leading-none">
                                        {location.name}
                                    </h2>

                                    <p className="text-[10px] lg:text-sm uppercase tracking-widest font-medium text-[#fdfbf7]/60 mb-4 lg:mb-6 leading-relaxed">
                                        {location.tagline}
                                    </p>

                                    {/* Mobile: Hide Description if screen is too small, or keep it short */}
                                    <p className="text-sm lg:text-lg leading-relaxed font-light font-arizona text-[#fdfbf7]/80 mb-6 lg:mb-8 line-clamp-3 lg:line-clamp-none">
                                        {location.description}
                                    </p>

                                    <div className="space-y-3 mb-4">
                                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                                            {location.features.slice(0, 3).map((feature, i) => (
                                                <span key={i} className="text-xs lg:text-sm font-light opacity-70 flex items-center gap-2">
                                                    <span className="w-1 h-1 rounded-full bg-[#ffc083]" />
                                                    {feature}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Action Footer - Compact */}
                            <div className="p-4 lg:p-6 border-t border-[#fdfbf7]/5 bg-[#342e29]">
                                <button
                                    onClick={onBook}
                                    className="w-full bg-[#fdfbf7] text-[#342e29] py-3 lg:py-4 uppercase tracking-[0.2em] text-[10px] lg:text-xs font-medium hover:bg-[#ffc083] transition-colors duration-500 flex items-center justify-center gap-3 group"
                                >
                                    <span>Book my 10% Trial Here</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

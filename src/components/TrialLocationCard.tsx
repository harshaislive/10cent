'use client'

import React from 'react'
import { motion } from 'framer-motion'
import TrialLocationCarousel from './TrialLocationCarousel'
import { ArrowRight } from 'lucide-react'

interface LocationImage {
    desktop: string
    mobile: string
}

interface TrialLocationCardProps {
    name: string
    tagline: string
    description: string
    features: string[]
    images: LocationImage[]
    index: number
    onBook: (locationName: string) => void
}

export default function TrialLocationCard({
    name,
    tagline,
    description,
    features,
    images,
    index,
    onBook
}: TrialLocationCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="group cursor-pointer relative w-full overflow-hidden border-b border-[#fdfbf7]/10 bg-[#342e29]"
            onClick={() => onBook(name)}
        >
            {/* Immersive Image Container */}
            <div className="relative h-[80vh] md:h-[95vh] w-full overflow-hidden">
                {/* Image Carousel - clear visibility */}
                <div className="absolute inset-0 transition-transform duration-[2.5s] ease-in-out group-hover:scale-105">
                    <TrialLocationCarousel images={images} locationName={name} />
                </div>

                {/* Cinematic Gradient Overlay - carefully tuned for text contrast without hiding image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#342e29] via-[#342e29]/40 to-transparent opacity-80" />
                
                {/* Subtle vignette for focus */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(52,46,41,0.4)_100%)] pointer-events-none" />

                {/* Content Overlay */}
            <div className="absolute inset-0 p-6 md:p-16 flex flex-col justify-between text-[#fdfbf7]">
                
                {/* Top Row: Editorial Numbering */}
                <div className="w-full flex justify-start items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                     <span className="text-sm font-arizona tracking-widest text-[#ffc083]">
                        {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="w-12 h-px bg-[#fdfbf7]/30" />
                    <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">The Sanctuary</span>
                </div>

                <div className="transform translate-y-8 group-hover:translate-y-0 transition-transform duration-700 ease-out max-w-[1800px] mx-auto w-full">
                        
                        {/* Header Row */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                            <div className="max-w-3xl">
                                <p className="text-xs uppercase tracking-[0.3em] font-bold mb-4 text-[#ffc083] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 transform -translate-y-2 group-hover:translate-y-0">
                                    {tagline}
                                </p>
                                <h3 className="text-5xl md:text-7xl lg:text-8xl font-light font-arizona leading-[0.9] text-[#fdfbf7] opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                                    {name}
                                </h3>
                            </div>

                            {/* Arrow Button - Slightly smaller */}
                            <div className="w-16 h-16 rounded-full border border-[#fdfbf7]/20 backdrop-blur-sm bg-[#fdfbf7]/5 flex items-center justify-center group-hover:bg-[#fdfbf7] group-hover:border-[#fdfbf7] transition-all duration-500 shrink-0">
                                <ArrowRight className="w-6 h-6 text-[#fdfbf7] -rotate-45 group-hover:rotate-0 group-hover:text-[#342e29] transition-all duration-500" />
                            </div>
                        </div>

                        {/* Description & Features - Reveal on Hover */}
                        <div className="grid md:grid-cols-12 gap-8 border-t border-[#fdfbf7]/20 pt-6 mt-6 overflow-hidden max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-700 ease-in-out">
                            <div className="md:col-span-6 lg:col-span-5">
                                <p className="text-lg md:text-xl text-[#fdfbf7]/80 font-arizona leading-relaxed font-light">
                                    {description}
                                </p>
                            </div>
                            <div className="md:col-span-6 lg:col-span-7 flex flex-wrap gap-x-6 gap-y-3 items-start justify-start md:justify-end text-[#fdfbf7]/60">
                                {features.map((f, i) => (
                                    <span key={i} className="text-xs uppercase tracking-widest font-bold border-l border-[#fdfbf7]/20 pl-3 first:border-0 first:pl-0">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
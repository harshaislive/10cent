'use client'

import React from 'react'
import TrialLocationCarousel from './TrialLocationCarousel'

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
    onBook,
    className = "",
    heightClass = "h-[80vh] md:h-[95vh]"
}: TrialLocationCardProps & { className?: string, heightClass?: string }) {
    return (
        <div
            className={`group cursor-pointer relative w-full overflow-hidden border-b border-[#fdfbf7]/10 bg-[#342e29] isolate ${className}`}
            onClick={() => onBook(name)}
        >
            {/* Immersive Image Container */}
            <div className={`relative w-full overflow-hidden ${heightClass}`}>
                {/* Image Carousel - clear visibility */}
                <div className="absolute inset-0 transition-transform duration-[2.5s] ease-in-out group-hover:scale-105">
                    <TrialLocationCarousel images={images} locationName={name} />
                </div>

                {/* Cinematic Gradient Overlay - carefully tuned for text contrast without hiding image */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#342e29] via-[#342e29]/40 to-transparent opacity-80 z-20" />

                {/* Subtle vignette for focus */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(52,46,41,0.4)_100%)] pointer-events-none z-20" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-[#fdfbf7] z-30">

                    {/* Width-Constrained Container for ALL Text */}
                    <div className="w-full flex flex-col h-full justify-between">

                        {/* Top Row: Editorial Numbering */}
                        <div className="w-full flex justify-start items-center gap-4 transition-opacity duration-700">
                            <span className="text-sm font-arizona tracking-widest text-[#ffc083]">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <div className="w-12 h-px bg-[#fdfbf7]/30" />
                            <span className="text-[10px] uppercase tracking-[0.3em] opacity-60">The Sanctuary</span>
                        </div>

                        <div className="max-w-[1800px] w-full">
                            {/* Header Row */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-8">
                                <div className="max-w-3xl">
                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-light font-arizona leading-[0.9] text-[#fdfbf7]">
                                        {name}
                                    </h3>
                                </div>

                                {/* CTA Button */}
                                <div className="px-6 py-3 md:px-8 md:py-4 rounded-full border border-[#fdfbf7]/20 backdrop-blur-sm bg-[#fdfbf7]/5 flex items-center justify-center group-hover:bg-[#fdfbf7] group-hover:border-[#fdfbf7] transition-all duration-500 shrink-0">
                                    <span className="text-sm md:text-base text-[#fdfbf7] group-hover:text-[#342e29] transition-all duration-500 uppercase tracking-widest font-medium">
                                        Click to explore
                                    </span>
                                </div>
                            </div>

                            {/* Description & Features */}
                            <div className="grid md:grid-cols-12 gap-8 border-t border-[#fdfbf7]/20 pt-6 mt-6 overflow-hidden max-h-0 opacity-0 group-hover:max-h-[500px] group-hover:opacity-100 transition-all duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)]">
                                <div className="md:col-span-8 lg:col-span-7">
                                    <p className="text-sm md:text-base text-[#fdfbf7]/80 font-arizona leading-relaxed font-light">
                                        {description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
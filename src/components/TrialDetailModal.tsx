'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'
import TrialStayRequestForm from '@/components/TrialStayRequestFormEzeeV3'
import { imagePresets } from '@/utils/supabaseImage'

interface LocationImage {
    desktop: string
    mobile: string
    thumb?: string
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
}

export default function TrialDetailModal({ isOpen, onClose, location }: TrialDetailModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
    const [pendingImageIndex, setPendingImageIndex] = React.useState<number | null>(null)
    const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false)
    const [showRequestForm, setShowRequestForm] = React.useState(false)
    const [requestFormSession, setRequestFormSession] = React.useState(0)
    const preloadCacheRef = React.useRef<HTMLImageElement[]>([])
    const imageSelectionTokenRef = React.useRef(0)
    const selectedImage = location?.images[selectedImageIndex] ?? location?.images[0]
    const selectedDesktopSrc = selectedImage ? imagePresets.heroDesktopFast(selectedImage.desktop) : ''
    const selectedMobileSrc = selectedImage ? imagePresets.heroMobileFast(selectedImage.mobile) : ''

    // Reset selection when location changes
    React.useEffect(() => {
        if (isOpen) {
            setSelectedImageIndex(0)
            setPendingImageIndex(null)
            setIsDescriptionExpanded(false)
            setShowRequestForm(false)
        }
    }, [isOpen, location])

    React.useEffect(() => {
        if (!isOpen || !location) return

        const thumbnailPreloads = location.images.map((img) => {
            const thumbnailPreload = new window.Image()
            thumbnailPreload.src = img.thumb ?? imagePresets.thumbnail(img.desktop)
            return thumbnailPreload
        })

        const displayPreloads = location.images.flatMap((img) => {
            const desktopPreload = new window.Image()
            desktopPreload.src = imagePresets.heroDesktopFast(img.desktop)

            const mobilePreload = new window.Image()
            mobilePreload.src = imagePresets.heroMobileFast(img.mobile)

            return [desktopPreload, mobilePreload]
        })

        preloadCacheRef.current = [...thumbnailPreloads, ...displayPreloads]
    }, [isOpen, location])

    if (!location || location.images.length === 0) return null

    const selectImage = (idx: number) => {
        if (idx === selectedImageIndex || pendingImageIndex !== null) return

        const nextImage = location.images[idx]
        const selectionToken = imageSelectionTokenRef.current + 1
        imageSelectionTokenRef.current = selectionToken
        setPendingImageIndex(idx)

        Promise.allSettled([
            preloadDisplayImage(imagePresets.heroDesktopFast(nextImage.desktop)),
            preloadDisplayImage(imagePresets.heroMobileFast(nextImage.mobile)),
        ]).finally(() => {
            if (imageSelectionTokenRef.current !== selectionToken) return
            setSelectedImageIndex(idx)
            setPendingImageIndex(null)
        })
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed inset-0 z-[100] bg-[#1a1816] text-[#fdfbf7] overflow-hidden flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close trial details"
                        className="fixed top-4 left-4 lg:top-6 lg:left-6 z-[120] inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#fdfbf7] text-[#342e29] shadow-2xl transition-colors duration-300 hover:bg-[#ffc083]"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex flex-col lg:flex-row h-full w-full">

                        {/* LEFT: Main Gallery (60% Mobile / 65% Desktop) - The "Grandeur" View */}
                        <div className="w-full lg:w-[65%] h-[60vh] lg:h-full flex flex-col bg-black relative z-10">
                            {/* Main Display Frame */}
                            <div className="flex-1 relative w-full h-full overflow-hidden bg-[#1a1816]">
                                <AnimatePresence initial={false}>
                                    <motion.div
                                        key={selectedImageIndex}
                                        initial={{ opacity: 1 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 1 }}
                                        transition={{ duration: 0.01 }}
                                        className="absolute inset-0 pointer-events-none will-change-opacity"
                                    >
                                        <Image
                                            src={selectedDesktopSrc}
                                            alt={`${location.name} - view ${selectedImageIndex + 1}`}
                                            fill
                                            className="hidden md:block object-cover"
                                            sizes="(min-width: 1024px) 65vw, 100vw"
                                            quality={78}
                                            priority={selectedImageIndex === 0}
                                            unoptimized={selectedDesktopSrc.includes('supabase.co')}
                                        />
                                        <Image
                                            src={selectedMobileSrc}
                                            alt={`${location.name} - view ${selectedImageIndex + 1}`}
                                            fill
                                            className="md:hidden object-cover"
                                            sizes="100vw"
                                            quality={72}
                                            priority={selectedImageIndex === 0}
                                            unoptimized={selectedMobileSrc.includes('supabase.co')}
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#1a1816] to-transparent opacity-60" />
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            {/* Thumbnail Strip */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 lg:h-32 bg-gradient-to-t from-[#1a1816]/90 to-transparent flex items-end pb-4 lg:pb-0 lg:items-center px-4 lg:px-6 gap-3 lg:gap-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden z-20">
                                {location.images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => selectImage(idx)}
                                        aria-label={`Show ${location.name} image ${idx + 1}`}
                                        aria-busy={pendingImageIndex === idx}
                                        className={`relative w-14 h-12 lg:w-32 lg:h-20 shrink-0 border transition-all duration-300 shadow-lg ${selectedImageIndex === idx
                                            ? 'border-[#ffc083] opacity-100 scale-105'
                                            : pendingImageIndex === idx
                                                ? 'border-[#ffc083]/70 opacity-80'
                                                : 'border-white/20 opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <Image
                                            src={img.thumb ?? imagePresets.thumbnail(img.desktop)}
                                            alt="thumbnails"
                                            fill
                                            className="object-cover"
                                            sizes="(min-width: 1024px) 128px, 56px"
                                            quality={55}
                                            unoptimized={(img.thumb ?? img.desktop).includes('supabase.co')}
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

                                            <p className={`text-sm lg:text-lg leading-relaxed font-light font-arizona text-[#fdfbf7]/80 ${isDescriptionExpanded ? 'mb-3' : 'mb-2'} lg:mb-8 ${isDescriptionExpanded ? '' : 'line-clamp-3'} lg:line-clamp-none`}>
                                                {location.description}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setIsDescriptionExpanded(value => !value)}
                                                className="mb-5 inline-flex text-[10px] uppercase tracking-[0.2em] text-[#ffc083] md:hidden"
                                                aria-expanded={isDescriptionExpanded}
                                            >
                                                {isDescriptionExpanded ? 'Read less' : 'Read more'}
                                            </button>

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
                                            type="button"
                                            onClick={() => {
                                                setRequestFormSession(session => session + 1)
                                                setShowRequestForm(true)
                                            }}
                                            className="w-full bg-[#fdfbf7] text-[#342e29] py-3 lg:py-4 uppercase tracking-[0.2em] text-[10px] lg:text-xs font-medium hover:bg-[#ffc083] transition-colors duration-500 flex items-center justify-center gap-3 group"
                                        >
                                            <span>Book my 10% Trial Here</span>
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                        </div>
                    </div>

                    <AnimatePresence>
                        {showRequestForm && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                                className="fixed inset-0 z-[140] flex items-center justify-center bg-[#1a1816]/80 p-4 backdrop-blur-md"
                            >
                                <button
                                    type="button"
                                    onClick={() => setShowRequestForm(false)}
                                    aria-label="Close stay request form"
                                    className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#fdfbf7] text-[#342e29] shadow-xl transition-colors hover:bg-[#ffc083] lg:right-8 lg:top-8"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                                <motion.div
                                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 16, scale: 0.98 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                    className="relative h-[92vh] w-full max-w-5xl overflow-hidden bg-[#342e29] shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
                                >
                                    <TrialStayRequestForm
                                        key={`${location.name}-ezee-booking-v3-${requestFormSession}`}
                                        locationName={location.name}
                                        locationSlug="blyton_coorg"
                                        onBack={() => setShowRequestForm(false)}
                                    />
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

function preloadDisplayImage(src: string): Promise<void> {
    return new Promise((resolve) => {
        const img = new window.Image()
        img.decoding = 'async'
        img.onload = () => {
            if ('decode' in img) {
                img.decode().then(() => resolve()).catch(() => resolve())
                return
            }

            resolve()
        }
        img.onerror = () => resolve()
        img.src = src
    })
}

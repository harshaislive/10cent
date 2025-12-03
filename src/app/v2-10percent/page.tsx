'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, useMotionTemplate } from 'framer-motion'
import { ArrowRight, ArrowDown, Menu, X, Wind, Mountain, Tent } from 'lucide-react'

// --- Data & Assets ---
const IMAGES = {
  hero: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg", 
  forest: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/3.jpg",
  office: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/1.jpg", 
}

// --- Utility Components ---

const NoiseOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-[60] opacity-[0.03] mix-blend-overlay">
    <svg className="w-full h-full">
      <filter id="noiseFilter">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noiseFilter)" />
    </svg>
  </div>
)

const CustomCursor = () => {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    }
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 border border-[#86312b] rounded-full pointer-events-none z-[70] mix-blend-difference hidden md:block"
      style={{ x: mouseX, y: mouseY }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    />
  );
}

const MagneticButton = ({ children, className = "", href = "#" }: { children: React.ReactNode, className?: string, href?: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.1, y: middleY * 0.1 });
  };

  const reset = () => setPosition({ x: 0, y: 0 });

  const { x, y } = position;

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-flex items-center justify-center px-8 py-4 uppercase tracking-widest text-sm font-medium border border-current transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.a>
  )
}

const RevealText = ({ text, className = "" }: { text: string, className?: string }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.div>
    </div>
  )
}

const SectionHeader = ({ number, title, subtitle, light = false }: { number: string, title: string, subtitle?: string, light?: boolean }) => (
  <div className={`flex flex-col gap-4 mb-12 md:mb-20 ${light ? 'text-[#fdfbf7]' : 'text-[#342e29]'}`}>
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center gap-4"
    >
      <span className={`text-xs font-bold tracking-[0.2em] uppercase py-1 px-2 border ${light ? 'border-[#fdfbf7]/30' : 'border-[#342e29]/30'}`}>
        Chapter {number}
      </span>
      <div className={`h-px flex-1 ${light ? 'bg-[#fdfbf7]/20' : 'bg-[#342e29]/20'}`} />
    </motion.div>
    <RevealText text={title} className="text-5xl md:text-7xl lg:text-8xl font-light leading-[0.9] tracking-tight font-arizona" />
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className={`max-w-md text-lg md:text-xl font-arizona italic opacity-80 ml-auto mr-0 md:mr-12 text-right`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
)

const StatCard = ({ number, label, description }: { number: string, label: string, description: string }) => {
  return (
    <div className="group relative p-8 border border-[#342e29]/10 hover:border-[#86312b] transition-colors duration-500 bg-[#fdfbf7]">
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#86312b]">
        <ArrowRight className="w-5 h-5 -rotate-45" />
      </div>
      <div className="overflow-hidden mb-2">
        <motion.h3 
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-6xl md:text-7xl font-light text-[#342e29] font-arizona group-hover:text-[#86312b] transition-colors"
        >
          {number}
        </motion.h3>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest mb-4 text-[#342e29]/60">{label}</p>
      <p className="text-lg font-arizona leading-relaxed text-[#342e29]/80">{description}</p>
    </div>
  )
}

// --- Main Page ---

export default function EditorialPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Navigation State
  const [isNavOpen, setIsNavOpen] = useState(false)

  return (
    <div ref={containerRef} className="bg-[#fdfbf7] text-[#342e29] font-arizona selection:bg-[#86312b] selection:text-white overflow-x-hidden cursor-none">
      <NoiseOverlay />
      <CustomCursor />

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#86312b] origin-left z-[80]" 
        style={{ scaleX }} 
      />

      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 w-full p-6 z-[70] flex justify-between items-center mix-blend-difference text-[#fdfbf7]">
        <div className="text-2xl font-bold tracking-tighter">BEFOREST</div>
        <button onClick={() => setIsNavOpen(!isNavOpen)} className="group flex items-center gap-2 uppercase text-xs tracking-widest hover:opacity-70 transition-opacity cursor-none">
          <span className="hidden md:block">Menu</span>
          <div className="w-8 h-8 flex items-center justify-center border border-current rounded-full group-hover:scale-110 transition-transform">
            {isNavOpen ? <X size={14} /> : <Menu size={14} />}
          </div>
        </button>
      </nav>

      {/* Hero Section - Editorial Cover Style */}
      <section className="relative min-h-[100svh] flex flex-col justify-end pb-12 px-4 md:px-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image 
              src={IMAGES.hero} 
              alt="Hero Background" 
              fill 
              className="object-cover brightness-[0.85]"
              priority
              quality={90}
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#342e29]/30 via-transparent to-[#342e29]/90 mix-blend-multiply" />
        </div>

        <div className="relative z-10 w-full max-w-[1800px] mx-auto">
          <div className="grid grid-cols-12 gap-4 text-[#fdfbf7]">
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <div className="overflow-hidden">
                <motion.h1 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[18vw] md:text-[14vw] leading-[0.8] tracking-tighter font-light mix-blend-overlay"
                >
                  10%
                </motion.h1>
              </div>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-light ml-2 md:ml-4 -mt-4 md:-mt-8"
              >
                <span className="italic font-serif">Club</span>
                <span className="block text-lg md:text-xl font-sans font-normal tracking-widest uppercase mt-4 opacity-80">
                  The Art of Return
                </span>
              </motion.div>
            </div>
            
            <div className="col-span-12 md:col-span-4 lg:col-span-3 flex flex-col justify-end items-start md:items-end gap-8 mt-12 md:mt-0">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="text-lg md:text-xl leading-relaxed text-left md:text-right opacity-90 max-w-[280px]"
              >
                30 nights a year.<br/>
                Your turn to pause,<br/>
                breathe, and return.
              </motion.p>
              
              <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 transition={{ delay: 1, type: "spring" }}
              >
                <a 
                  href="#manifesto"
                  className="w-24 h-24 rounded-full bg-[#86312b] text-[#fdfbf7] flex items-center justify-center group cursor-none hover:scale-110 transition-transform duration-300"
                >
                  <ArrowDown className="w-8 h-8 group-hover:animate-bounce" />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Intro - "The Problem" */}
      <section id="manifesto" className="relative py-24 md:py-40 px-6 md:px-12 max-w-[1800px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <div className="sticky top-32">
             <SectionHeader 
               number="01" 
               title="The Great Disconnect." 
               subtitle="We are a species in exile."
             />
             <div className="hidden md:block relative w-full aspect-[4/5] overflow-hidden mt-12 group">
                <Image 
                  src={IMAGES.office} 
                  alt="Urban Disconnect" 
                  fill 
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-105 group-hover:scale-100"
                />
             </div>
          </div>

          <div className="space-y-24 pt-12">
            <div className="prose prose-xl prose-headings:font-arizona prose-p:font-arizona text-[#342e29]/80">
              <p className="text-3xl md:text-4xl leading-tight text-[#342e29] mb-8">
                You are running a race with no finish line.
              </p>
              <p>
                We spend our days in boxes. We wake up in a box, travel in a box to work in a box. We stare at glowing boxes for hours, seeking connection, but finding only noise.
              </p>
              <p>
                The average urban professional spends less than 2% of their time outdoors. We have become tourists in our own home—planet Earth.
              </p>
              <p className="text-[#86312b] italic text-2xl pl-6 border-l-2 border-[#86312b]">
                "We are not meant to live this way. The anxiety you feel is not a disorder; it is a signal."
              </p>
            </div>

            <div className="grid gap-8">
               <StatCard 
                 number="27" 
                 label="Meetings" 
                 description="The number of times you sat in a room this quarter discussing work." 
               />
               <StatCard 
                 number="365" 
                 label="Days" 
                 description="Days passed this year. How many were truly yours?" 
               />
               <StatCard 
                 number="0" 
                 label="Silence" 
                 description="Moments of absolute silence in the last month." 
               />
            </div>
          </div>
        </div>
      </section>

      {/* The Solution - Full Width Parallax */}
      <section className="relative py-32 bg-[#344736] text-[#fdfbf7] overflow-hidden">
        <div className="absolute inset-0 opacity-20 mix-blend-soft-light">
          <Image src={IMAGES.forest} alt="Forest Texture" fill className="object-cover" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
           <SectionHeader 
             number="02" 
             title="The 10% Solution" 
             subtitle="A mathematical approach to happiness." 
             light
           />

           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
              {[
                { icon: Wind, title: "Cognitive Clarity", desc: "Nature restores attention and reduces mental fatigue." },
                { icon: Mountain, title: "Emotional Resilience", desc: "Wilderness builds grit and perspective." },
                { icon: Tent, title: "True Belonging", desc: "Reconnect with the ecosystem you are part of." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  viewport={{ once: true }}
                  className="border-t border-[#fdfbf7]/20 pt-8 hover:border-[#ffc083] transition-colors duration-500 group"
                >
                  <item.icon className="w-12 h-12 mb-6 text-[#ffc083] group-hover:scale-110 transition-transform duration-300" strokeWidth={1} />
                  <h3 className="text-3xl font-light mb-4">{item.title}</h3>
                  <p className="text-[#fdfbf7]/60 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
           </div>

           <div className="mt-32 flex flex-col items-center text-center">
              <p className="text-sm font-bold tracking-[0.3em] uppercase mb-8 text-[#fdfbf7]/50">The Commitment</p>
              <div className="relative">
                <motion.div 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute -inset-x-4 bottom-2 h-6 bg-[#ffc083]/20 -skew-x-12 origin-left"
                />
                <div className="text-[15vw] md:text-[12vw] leading-none font-light text-[#ffc083] mix-blend-screen relative z-10">
                  30 Days
                </div>
              </div>
              <p className="text-2xl md:text-4xl font-light max-w-2xl mt-8">
                In the wild. Every year. <br/>
                <span className="italic text-[#fdfbf7]/60">Not a vacation. A vocation.</span>
              </p>
           </div>
        </div>
      </section>

      {/* Image Gallery / Mood */}
      <section className="py-24 bg-[#fdfbf7] overflow-hidden">
        <div className="flex gap-4 md:gap-8 overflow-x-auto px-6 pb-12 snap-x scrollbar-hide">
           {[IMAGES.hero, IMAGES.forest, IMAGES.office].map((src, i) => (
             <motion.div 
               key={i} 
               initial={{ opacity: 0, x: 50 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: i * 0.1 }}
               viewport={{ once: true }}
               className="shrink-0 w-[85vw] md:w-[40vw] aspect-[3/4] relative snap-center group overflow-hidden cursor-none"
             >
                <Image 
                  src={src} 
                  alt={`Gallery ${i}`} 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
             </motion.div>
           ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#342e29] text-[#fdfbf7] py-32 px-6 md:px-12 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-[#86312b]/10 skew-x-12 transform origin-top-right" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
           <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mb-12">
             Return to the wild.
           </h2>
           <p className="text-xl md:text-2xl font-light opacity-70 mb-16 max-w-2xl mx-auto">
             We are curating a tribe of individuals ready to reclaim their 10%. Applications are open for the next cohort.
           </p>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <MagneticButton className="bg-[#fdfbf7] text-[#342e29] hover:bg-[#ffc083] border-transparent w-full md:w-auto cursor-none">
               Apply for Membership
             </MagneticButton>
             <MagneticButton className="text-[#fdfbf7] hover:bg-[#fdfbf7] hover:text-[#342e29] w-full md:w-auto cursor-none">
               Read the Manifesto
             </MagneticButton>
           </div>

           <p className="mt-12 text-xs tracking-widest opacity-30 uppercase">
             Beforest 10% Club &copy; 2025
           </p>
        </div>
      </section>

    </div>
  )
}
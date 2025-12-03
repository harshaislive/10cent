'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowDown, Menu, X, Wind, Mountain, Tent, Clock, Battery, Map, XCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Widget } from '@typeform/embed-react'

// --- Data & Assets ---
const IMAGES = {
  hero: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg", 
  forest: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/3.jpg",
  office: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/1.jpg", 
  founder: "/PBR_7935.jpg",
  founderAlt: "/PBR_4601.jpg",
  logo: "/23-Beforest-Black-with-Tagline.png",
  locations: {
    poomaale: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/2.png",
    hammiyala: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/4.jpg",
    hyderabad: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/3.jpg"
  }
}

const TYPEFORM_ID = 'moe6bb'

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

const MagneticButton = ({ children, className = "", onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => {
  const ref = useRef<HTMLButtonElement>(null);
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
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-flex items-center justify-center px-8 py-4 uppercase tracking-widest text-sm font-medium border border-current transition-colors duration-300 ${className}`}
    >
      {children}
    </motion.button>
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

const StatCard = ({ number, label, description, light = false }: { number: string, label: string, description: string, light?: boolean }) => {
  return (
    <div className={`group relative p-8 border transition-colors duration-500 ${light ? 'border-[#fdfbf7]/20 hover:border-[#fdfbf7]' : 'border-[#342e29]/10 hover:border-[#86312b] bg-[#fdfbf7]'}`}>
      <div className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity ${light ? 'text-[#fdfbf7]' : 'text-[#86312b]'}`}>
        <ArrowRight className="w-5 h-5 -rotate-45" />
      </div>
      <div className="overflow-hidden mb-2">
        <motion.h3 
          initial={{ y: "100%" }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`text-6xl md:text-7xl font-light font-arizona transition-colors ${light ? 'text-[#fdfbf7]' : 'text-[#342e29] group-hover:text-[#86312b]'}`}
        >
          {number}
        </motion.h3>
      </div>
      <p className={`text-xs font-bold uppercase tracking-widest mb-4 ${light ? 'text-[#fdfbf7]/60' : 'text-[#342e29]/60'}`}>{label}</p>
      <p className={`text-lg font-arizona leading-relaxed ${light ? 'text-[#fdfbf7]/80' : 'text-[#342e29]/80'}`}>{description}</p>
    </div>
  )
}

// --- Manifesto Modal Component ---

const ManifestoModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState<'filter' | 'reveal' | 'form'>('filter')
  const [holdProgress, setHoldProgress] = useState(0)
  const holdInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setStep('filter')
      setHoldProgress(0)
    }
  }, [isOpen])

  const startHold = () => {
    if (holdInterval.current) clearInterval(holdInterval.current)
    holdInterval.current = setInterval(() => {
      setHoldProgress(prev => {
        if (prev >= 100) {
          clearInterval(holdInterval.current!)
          setStep('reveal')
          return 100
        }
        return prev + 2
      })
    }, 20)
  }

  const endHold = () => {
    if (holdInterval.current) clearInterval(holdInterval.current)
    if (holdProgress < 100) setHoldProgress(0)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-[#342e29] text-[#fdfbf7] flex items-center justify-center overflow-hidden"
        >
          {/* Background Texture */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
          
          {/* Close Button */}
          <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:rotate-90 transition-transform duration-300 z-50">
            <XCircle className="w-8 h-8 opacity-50 hover:opacity-100" />
          </button>

          {/* STEP 1: THE FILTER */}
          {step === 'filter' && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="max-w-2xl px-6 text-center relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-light mb-8 font-arizona leading-tight">
                This is not a vacation package. <br/>
                <span className="text-[#86312b] italic">It is a vocation.</span>
              </h2>
              <p className="text-xl opacity-70 mb-16 leading-relaxed font-arizona">
                You are about to enter a commitment to yourself. <br/>
                Wilderness requires patience, silence, and presence. <br/>
                Are you ready to disconnect to reconnect?
              </p>
              
              <div className="relative inline-block">
                <button 
                  onMouseDown={startHold}
                  onMouseUp={endHold}
                  onMouseLeave={endHold}
                  onTouchStart={startHold}
                  onTouchEnd={endHold}
                  className="relative overflow-hidden border border-[#fdfbf7] px-10 py-4 text-sm uppercase tracking-widest font-medium transition-all active:scale-95"
                >
                  <span className="relative z-10 mix-blend-difference">Hold to Acknowledge</span>
                  <div 
                    className="absolute inset-0 bg-[#fdfbf7] z-0 origin-left" 
                    style={{ width: `${holdProgress}%` }} 
                  />
                </button>
                <p className="text-xs opacity-40 mt-4 tracking-widest uppercase">Hold for 1 second</p>
              </div>
            </motion.div>
          )}

          {/* STEP 2: THE REVEAL (PRICING) */}
          {step === 'reveal' && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="max-w-4xl w-full px-6 relative z-10"
            >
              <div className="grid md:grid-cols-2 gap-12 items-center">
                 <div className="space-y-12 border-r border-[#fdfbf7]/10 pr-12">
                    <div className="space-y-2">
                       <p className="text-xs uppercase tracking-[0.3em] opacity-50">The Protocol</p>
                       <h3 className="text-5xl font-light">30 Nights</h3>
                       <p className="opacity-60 font-arizona">Every year. For introspection.</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs uppercase tracking-[0.3em] opacity-50">The Duration</p>
                       <h3 className="text-5xl font-light">10 Years</h3>
                       <p className="opacity-60 font-arizona">A decade of wilderness access.</p>
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs uppercase tracking-[0.3em] opacity-50">The Landscapes</p>
                       <h3 className="text-5xl font-light">All Collectives</h3>
                       <p className="opacity-60 font-arizona">Poomaale, Hammiyala, Hyderabad & more.</p>
                    </div>
                 </div>

                 <div className="space-y-8 pl-4">
                    <h2 className="text-3xl font-light font-arizona">The Investment</h2>
                    <div className="text-6xl md:text-7xl font-light text-[#ffc083]">
                      ₹17.6 L
                      <span className="text-xl md:text-2xl ml-2 opacity-50 block mt-2 text-[#fdfbf7]">All inclusive for 10 years</span>
                    </div>
                    <p className="opacity-70 leading-relaxed font-arizona border-l-2 border-[#86312b] pl-4">
                       "Not a second home. A second chance—to slow down, and reconnect."
                    </p>
                    
                    <button 
                      onClick={() => setStep('form')}
                      className="mt-8 w-full bg-[#fdfbf7] text-[#342e29] py-4 uppercase tracking-widest text-sm font-bold hover:bg-[#ffc083] transition-colors"
                    >
                      I Accept the Protocol
                    </button>
                 </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: THE FORM */}
          {step === 'form' && (
             <motion.div 
               initial={{ y: 50, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="w-full h-full max-w-5xl max-h-[90vh] bg-white rounded-xl overflow-hidden shadow-2xl relative"
             >
                <Widget id={TYPEFORM_ID} className="w-full h-full" />
             </motion.div>
          )}

        </motion.div>
      )}
    </AnimatePresence>
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

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div ref={containerRef} className="bg-[#fdfbf7] text-[#342e29] font-arizona selection:bg-[#86312b] selection:text-white overflow-x-hidden cursor-none">
      <NoiseOverlay />
      <CustomCursor />
      
      <ManifestoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-[#86312b] origin-left z-[80]" 
        style={{ scaleX }} 
      />

      {/* Navigation Overlay */}
      <nav className="fixed top-0 left-0 w-full p-6 z-[70] flex justify-between items-center mix-blend-difference text-[#fdfbf7]">
        <div className="w-32 md:w-40 relative h-12 grayscale brightness-200 contrast-200">
             <Image 
               src={IMAGES.logo} 
               alt="Beforest" 
               fill 
               className="object-contain invert"
             />
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group flex items-center gap-2 uppercase text-xs tracking-widest hover:opacity-70 transition-opacity cursor-none border border-current px-6 py-3 rounded-full hover:bg-[#fdfbf7] hover:text-[#342e29] transition-all duration-300"
        >
          <span className="hidden md:block">Join the Club</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </nav>

      {/* Hero Section */}
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
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-24 h-24 rounded-full bg-[#86312b] text-[#fdfbf7] flex items-center justify-center group cursor-none hover:scale-110 transition-transform duration-300"
                >
                  <ArrowDown className="w-8 h-8 group-hover:animate-bounce" />
                </button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
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
              
              <div className="bg-[#342e29]/5 p-8 rounded-xl my-12 not-prose">
                <h3 className="text-xl uppercase tracking-widest font-bold mb-6 text-[#86312b]">The Urban Trap</h3>
                <ul className="space-y-4">
                   <li className="flex items-center gap-4">
                     <div className="w-2 h-2 bg-[#342e29] rounded-full" />
                     <span className="text-lg font-arizona">25 meetings. 47 emails. 3 Zoom calls that should have been emails.</span>
                   </li>
                   <li className="flex items-center gap-4">
                     <div className="w-2 h-2 bg-[#342e29] rounded-full" />
                     <span className="text-lg font-arizona">Your calendar is full, but your clarity is empty.</span>
                   </li>
                   <li className="flex items-center gap-4">
                     <div className="w-2 h-2 bg-[#342e29] rounded-full" />
                     <span className="text-lg font-arizona">Optimizing everything except what matters most.</span>
                   </li>
                </ul>
              </div>

              <p className="text-[#86312b] italic text-2xl pl-6 border-l-2 border-[#86312b]">
                "We are not meant to live this way. The anxiety you feel is not a disorder; it is a signal."
              </p>
            </div>

            <div className="grid gap-8">
               <StatCard 
                 number="78%" 
                 label="Burnout" 
                 description="Of professionals report feeling chronic exhaustion." 
               />
               <StatCard 
                 number="400%" 
                 label="Screen Time" 
                 description="Increase in digital consumption over just 5 years." 
               />
            </div>
          </div>
        </div>
      </section>

      {/* The Founder */}
      <section className="py-32 bg-[#fdfbf7] relative border-t border-[#342e29]/10">
         <div className="max-w-[1800px] mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
               <div className="md:col-span-5 relative aspect-[3/4] md:aspect-[4/5] group overflow-hidden">
                  <Image 
                    src={IMAGES.founder}
                    alt="Sunith Reddy"
                    fill
                    className="object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                  <Image 
                    src={IMAGES.founderAlt}
                    alt="Sunith Reddy in Wilderness"
                    fill
                    className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 scale-105"
                  />
                  <div className="absolute bottom-6 left-6 bg-[#fdfbf7]/90 backdrop-blur-sm px-4 py-2 text-xs uppercase tracking-widest text-[#342e29]">
                     Sunith Reddy, Founder
                  </div>
               </div>

               <div className="md:col-span-7 space-y-12">
                  <h2 className="text-4xl md:text-6xl lg:text-7xl font-light leading-tight text-[#342e29]">
                    "When you stop running, you start seeing."
                  </h2>
                  <div className="space-y-8 text-lg md:text-xl font-arizona font-light leading-relaxed text-[#342e29]/80 max-w-2xl">
                    <p>
                      It took stepping into the wilderness for me to realise that slowing down isn't the absence of ambition — it's the foundation for clarity.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-[#342e29]/10 pt-8">
                     <div>
                        <h4 className="text-3xl font-light text-[#86312b]">8+ Years</h4>
                        <p className="text-xs uppercase tracking-widest mt-2 opacity-60">Building Communities</p>
                     </div>
                     <div>
                        <h4 className="text-3xl font-light text-[#86312b]">1000+ Acres</h4>
                        <p className="text-xs uppercase tracking-widest mt-2 opacity-60">Under Regeneration</p>
                     </div>
                     <div>
                        <h4 className="text-3xl font-light text-[#86312b]">6 Collectives</h4>
                        <p className="text-xs uppercase tracking-widest mt-2 opacity-60">Established</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* NEW SECTION: The Solution (Philosophy in Numbers) */}
      <section className="py-32 bg-[#342e29] text-[#fdfbf7]">
         <div className="max-w-[1800px] mx-auto px-6 md:px-12">
             <SectionHeader 
               number="02"
               title="The 10% Solution."
               subtitle="A mathematical approach to happiness."
               light
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 text-center md:text-left">
               <div className="p-8 border border-[#fdfbf7]/10 hover:bg-[#fdfbf7]/5 transition-colors">
                  <div className="text-[120px] font-light leading-none text-[#ffc083]">30</div>
                  <p className="text-xl uppercase tracking-widest mb-2">Nights a Year</p>
                  <p className="opacity-60">Enough time to reset your circadian rhythm.</p>
               </div>
               <div className="p-8 border border-[#fdfbf7]/10 hover:bg-[#fdfbf7]/5 transition-colors">
                  <div className="text-[120px] font-light leading-none text-[#ffc083]">10</div>
                  <p className="text-xl uppercase tracking-widest mb-2">Years</p>
                  <p className="opacity-60">A decade of guaranteed wilderness access.</p>
               </div>
               <div className="p-8 border border-[#fdfbf7]/10 hover:bg-[#fdfbf7]/5 transition-colors">
                  <div className="text-[120px] font-light leading-none text-[#ffc083]">0</div>
                  <p className="text-xl uppercase tracking-widest mb-2">Hassle</p>
                  <p className="opacity-60">No ownership headaches. Just pure belonging.</p>
               </div>
            </div>
         </div>
      </section>

      {/* NEW SECTION: Where You'll Stay (Locations) */}
      <section className="py-32 bg-[#fdfbf7]">
        <div className="max-w-[1800px] mx-auto px-6 md:px-12">
           <SectionHeader 
             number="03" 
             title="The Sanctuaries."
             subtitle="Across India's wildest landscapes."
           />
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
             {[
               { name: "Poomaale", desc: "Coffee, Cardamom & Mist. A rainforest collective in Coorg.", img: IMAGES.locations.poomaale },
               { name: "Hammiyala", desc: "High altitude grasslands. Where the wind speaks louder than words.", img: IMAGES.locations.hammiyala },
               { name: "Hyderabad", desc: "The Deccan Plateau. Ancient rocks and scrub forests close to home.", img: IMAGES.locations.hyderabad }
             ].map((loc, i) => (
               <div key={i} className="group cursor-none">
                 <div className="aspect-[4/3] relative overflow-hidden mb-6">
                   <Image 
                     src={loc.img} 
                     alt={loc.name} 
                     fill 
                     className="object-cover transition-transform duration-700 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                 </div>
                 <h3 className="text-3xl font-light mb-2 group-hover:text-[#86312b] transition-colors">{loc.name}</h3>
                 <p className="text-[#342e29]/60 font-arizona">{loc.desc}</p>
               </div>
             ))}
           </div>
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
             Applications are open for the next cohort.
           </p>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-6">
             <MagneticButton onClick={() => setIsModalOpen(true)} className="bg-[#fdfbf7] text-[#342e29] hover:bg-[#ffc083] border-transparent w-full md:w-auto cursor-none">
               Apply for Membership
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
import { TypewriterVariation } from '../headings'
import { imagePresets } from '@/utils/supabaseImage'

export interface HeroContent extends TypewriterVariation {
  imageDesktop: string
  imageMobile: string
}

// Local optimized WebP images
const baseDesktopUrls = [
  "/hero-1.webp",
  "/hero-2.webp",
  "/hero-3.webp",
  "/hero-4.webp",
  "/hero-5.webp"
]

const baseMobileUrls = [
  "/hero-1.webp",
  "/hero-2.webp",
  "/hero-3.webp",
  "/hero-4.webp",
  "/hero-5.webp"
]

export const headlineVariations: HeroContent[] = [
  {
    id: 'meetings',
    mainText: "27 meetings this quarter.",
    subText: "How many with yourself?",
    imageDesktop: imagePresets.heroDesktop(baseDesktopUrls[0]),
    imageMobile: imagePresets.heroMobile(baseMobileUrls[0])
  },
  {
    id: 'days',
    mainText: "365 days this year.",
    subText: "How many for yourself?",
    imageDesktop: imagePresets.heroDesktop(baseDesktopUrls[1]),
    imageMobile: imagePresets.heroMobile(baseMobileUrls[1])
  },
  {
    id: 'weekends',
    mainText: "52 weekends this year.",
    subText: "How many in wilderness?",
    imageDesktop: imagePresets.heroDesktop(baseDesktopUrls[2]),
    imageMobile: imagePresets.heroMobile(baseMobileUrls[2])
  },
  {
    id: 'notifications',
    mainText: "A million notifications.",
    subText: "How many moments of silence?",
    imageDesktop: imagePresets.heroDesktop(baseDesktopUrls[3]),
    imageMobile: imagePresets.heroMobile(baseMobileUrls[3])
  },
  {
    id: 'hustle',
    mainText: "12 months of hustle.",
    subText: "How many of pause?",
    imageDesktop: imagePresets.heroDesktop(baseDesktopUrls[4]),
    imageMobile: imagePresets.heroMobile(baseMobileUrls[4])
  }
]

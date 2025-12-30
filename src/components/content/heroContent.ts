import { TypewriterVariation } from '../headings'
import { imagePresets } from '@/utils/supabaseImage'

export interface HeroContent extends TypewriterVariation {
  imageDesktop: string
  imageMobile: string
}

// Base Supabase URLs - optimization applied via presets
const baseDesktopUrls = [
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/1.jpg",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/2.png",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/3.jpg",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/4.jpg",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg"
]

const baseMobileUrls = [
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/1.png",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/2.JPG",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/3.jpg",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/4.jpg",
  "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/5.jpg"
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

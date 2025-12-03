import { TypewriterVariation } from '../headings'

export interface HeroContent extends TypewriterVariation {
  imageDesktop: string
  imageMobile: string
}

export const headlineVariations: HeroContent[] = [
  {
    id: 'meetings',
    mainText: "27 meetings this quarter.",
    subText: "How many with yourself?",
    imageDesktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/1.jpg",
    imageMobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/1.png"
  },
  {
    id: 'days',
    mainText: "365 days this year.",
    subText: "How many for yourself?",
    imageDesktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/2.png",
    imageMobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/2.JPG"
  },
  {
    id: 'weekends',
    mainText: "52 weekends this year.",
    subText: "How many in wilderness?",
    imageDesktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/3.jpg",
    imageMobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/3.jpg"
  },
  {
    id: 'notifications',
    mainText: "A million notifications.",
    subText: "How many moments of silence?",
    imageDesktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/4.jpg",
    imageMobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/4.jpg"
  },
  {
    id: 'hustle',
    mainText: "12 months of hustle.",
    subText: "How many of pause?",
    imageDesktop: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/desktop/5.jpg",
    imageMobile: "https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/10cent_hero_images/mobile/5.jpg"
  }
]
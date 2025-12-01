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
    imageDesktop: "/meetings.png",
    imageMobile: "/meetings_m.png"
  },
  {
    id: 'days',
    mainText: "365 days this year.",
    subText: "How many for yourself?",
    imageDesktop: "/days.png",
    imageMobile: "/days_m.png"
  },
  {
    id: 'weekends',
    mainText: "52 weekends this year.",
    subText: "How many in wilderness?",
    imageDesktop: "/weekends.png",
    imageMobile: "/weekends_m.png"
  },
  {
    id: 'notifications',
    mainText: "A million notifications.",
    subText: "How many moments of silence?",
    imageDesktop: "/notifications.png",
    imageMobile: "/notifications_m.png"
  },
  {
    id: 'hustle',
    mainText: "12 months of hustle.",
    subText: "How many of pause?",
    imageDesktop: "/hustle.png",
    imageMobile: "/hustle_m.png"
  }
]
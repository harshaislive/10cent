import { MOTIVES, type IPlace, type IPreferences } from './model'

// Curated editorial content, independent of booking inventory and commercial allowances.
// Photography provenance is recorded in public/images/envision/sources.json.
interface IScene { image: string; alt: string; detail: string }
const ROOT = '/images/envision/'
const SCENES: Record<string, IScene[]> = {
  poomaale2: [{ image: 'poomaale2-path.webp', alt: 'An earth track through trees at Poomaale 2', detail: 'Next to Poomaale 1.0, this is another part of Coorg to get to know. Coffee, cardamom and rainforest share the landscape.' }],
  mumbai: [{ image: 'mumbai-land.webp', alt: 'A path through open green land at the Mumbai Collective', detail: 'A farming collective beyond the city. Picture a few days with more attention on the land and less on the next appointment.' }],
  poomaale: [
    { image: 'poomaale-canopy.webp', alt: 'A stream beneath the forest canopy at Poomaale', detail: 'Beneath the canopy, there is a smaller world to notice. Water, roots and the shapes of leaves.' },
    { image: 'poomaale-river.webp', alt: 'Water and forest in the Poomaale landscape', detail: 'Follow the water with your eyes. Imagine leaving an afternoon open to get to know this landscape.' },
  ],
  hammiyala: [
    { image: 'hammiyala-wide.webp', alt: 'An open view of the Hammiyala landscape', detail: 'At Hammiyala, coffee agroforestry, native forest and high-altitude grasslands form different parts of the same landscape.' },
    { image: 'hammiyala-stream.webp', alt: 'A shaded stream in the Hammiyala forest', detail: 'There is another scale to this place beneath the trees. A stream, a patch of shade, a reason to slow down.' },
  ],
  hyderabad: [{ image: 'hyderabad-land.webp', alt: 'The landscape at Beforest Hyderabad', detail: 'The Deccan landscape brings hills, valleys and ancient rock into view. Restoration gives you another reason to return and notice what changes.' }],
  bhopal: [{ image: 'ratapani-land.webp', alt: 'Trees and open land at the Bhopal Collective near Ratapani', detail: 'Near Ratapani, formerly quarried land is being restored. Imagine becoming familiar with a place while its next chapter takes shape.' }],
}

const MOMENTS: Record<string, string[]> = {
  'family-time': ['An afternoon together, with no need to fill every hour.', 'A shared walk. Something small you all stop to notice.', 'Time to hear a story without looking at the clock.'],
  quiet: ['A little time outside that belongs entirely to you.', 'Leave part of the day unplanned. See what holds your attention.', 'Bring a book, or simply give yourself time to look around.'],
  'couple-time': ['An unhurried conversation, somewhere different.', 'A few days to share the same pace.', 'Leave an afternoon open for the two of you.'],
  explore: ['Time to look closely, ask questions and get to know the land.', 'Notice the smaller details you might have walked past before.', 'A different corner of the landscape to be curious about.'],
  return: ['A first visit to a place that could become familiar.', 'Return with something you remember and something still to discover.', 'Notice what has changed since the last time you were here.'],
}

export function visitExperience(place: IPlace, preferences: IPreferences, index: number, occurrence: number) {
  const scenes = SCENES[place.id] || []
  const scene = scenes[occurrence]
  const motive = preferences.motives[index % Math.max(1, preferences.motives.length)]
  const moments = MOMENTS[motive] || ['Time outside, at your own pace.', 'A few days with room to notice the landscape.', 'Another visit to look forward to.']
  return {
    // When the archive is exhausted, show an editorial return chapter instead of recycling a photo.
    image: scene ? ROOT + scene.image : occurrence === 0 && !scenes.length ? place.image : null,
    alt: scene?.alt || `${place.name}, ${place.region}`,
    detail: scene?.detail || (occurrence === 0 ? place.story : `You chose to return to ${place.name}. This visit leaves room to revisit what caught your attention, and notice what is different.`),
    moment: moments[Math.floor(index / Math.max(1, preferences.motives.length)) % moments.length],
    reason: MOTIVES.find(item => item.id === motive)?.label || 'Time outside',
    heading: occurrence ? 'A place becoming familiar.' : place.headline,
  }
}

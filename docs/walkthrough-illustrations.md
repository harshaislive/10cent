# Walkthrough illustrations

Harsha requested GPT Image illustrations added to `/10percent-life`, with mobile-first presentation.

Created 5 October 2026 using the built-in GPT Image tool. Three symbolic editorial illustrations share earth, rich red and warm peach colours, with small deep-blue accents. No text, logos, people or invented Beforest buildings. Actual landscape photographs remain the source for the places shown.

| Asset | Placement | Mobile height | Desktop height |
| --- | --- | --- | --- |
| `living-land-v1.webp` | Below the living-land story | 155px | 200px |
| `return-through-seasons-v1.webp` | Between the return story and membership explanation | 145px | 210px |
| `picture-your-year-v1.webp` | At the top of the illustrative year preview | 130px | 170px |

Production assets are in `public/illustrations/walkthrough/`. All originals are 1536 × 1024 RGBA PNGs. Alpha transparency was verified. Sharp encodes proportional 1200px WebPs with alpha preserved; there is no compositing, cropping or visual editing. Next Image serves smaller responsive versions, with lazy loading and explicit dimensions. A local 390px check selected 384px image sources for the first two illustrations. Artwork has descriptive illustration alt text, distinguishing it from actual landscape photos.

Original PNGs, exact prompts and the conversion register are preserved at `D:/AI Apps/10cent_funnel_interakt_mailchimp/design/illustrations/2026-10-05/`. The prompt set is also versioned beside this note.

Type checks and the production build passed. Browser checks at 320px and 390px found no horizontal overflow; all three illustrations loaded. Desktop at 1440px was reviewed. FAQ expansion passed, and no relevant console errors/warnings were captured. Envision links and hero rotation are unchanged.

Proof images: `C:/Users/harsh/.codex/visualizations/2026/10/05/golden-thread/illustration-mobile-land.png`, `illustration-mobile-return.png`, `illustration-mobile-year.png` and `illustration-desktop-land.png`. Publication evidence is maintained in the parent rollout note.

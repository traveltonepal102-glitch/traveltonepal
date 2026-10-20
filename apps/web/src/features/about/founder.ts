/**
 * The founder, for the story card and "Speak to an expert" on trek pages and the About page's story.
 * Text from the website design; the [BRACKETED] parts wait for the owner's details. Moves to Payload
 * in the CMS phase.
 */
export const FOUNDER = {
  name: "Sujan Sherpa",
  shortName: "Sujan",
  role: "Founder and lead trek director",
  storyTeaser:
    "Born and raised in [HOME VILLAGE / REGION] in the mountains of Nepal, our founder grew up walking Himalayan trails with the elders of his village. That lifelong respect for the mountains became the foundation of Travel To Nepal.",
  /** About page "Our story", one string per paragraph. */
  story: [
    "[Founder story, paragraph 1: where Sujan grew up, how he started walking the trails with village elders, and his first years as a guide.]",
    "[Paragraph 2: why he started Travel To Nepal in [YEAR]: to cut out foreign middlemen, pay guides and porters fairly, and give trekkers an honest local contact from the first message to the last day.]",
  ],
  quote: "[A short quote from Sujan about why he looks after every trekker personally.]",
  languages: ["English", "Nepali", "Sherpa"],
} as const;

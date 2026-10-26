import { REGIONS } from "@/features/regions/regions";

import type { TravelGuide } from "./types";

const AUTHOR = "[Author name]";

/** For guides that cover every region, e.g. permits region by region. */
const EVERY_REGION = REGIONS.map((region) => region.slug);

/**
 * Test data: guides like the Travel guides page shows (the design's demo list), for the list, filter and
 * related-guide tests. The website itself reads the published guides from the database (guidesRepository).
 */
export const TRAVEL_GUIDES: readonly TravelGuide[] = [
  {
    slug: "best-time-to-trek-langtang",
    title: "Best time to trek Langtang: a month-by-month guide",
    shortTitle: "Best time to trek",
    regionSlugs: ["langtang"],
    excerpt:
      "Spring flowers or clear autumn skies? What each month is really like on the trail, and which we recommend.",
    topic: "best-time",
    image: { src: "/images/langtang-glacier-peaks.jpg", alt: "Snow-covered peaks above the Langtang glacier" },
    publishedOn: "2026-10-06",
    readMinutes: 8,
    author: AUTHOR,
    isFeatured: true,
  },
  {
    slug: "langtang-valley-trek-cost",
    title: "Langtang Valley Trek cost: what you really pay",
    shortTitle: "What a trek really costs",
    regionSlugs: ["langtang"],
    excerpt: "Permits, guide, teahouses, food and transport, and how to keep the budget in check.",
    topic: "planning",
    image: { src: "/images/langtang-khola-river.jpg", alt: "The Langtang Khola river running through the forested valley" },
    publishedOn: "2026-09-24",
    readMinutes: 9,
    author: AUTHOR,
  },
  {
    slug: "do-you-need-a-guide-to-trek-in-nepal",
    title: "Do you need a guide to trek in Nepal? The rules explained",
    shortTitle: "Do you need a guide in Nepal?",
    regionSlugs: [],
    excerpt: "What changed in 2023, which areas need a licensed guide, and what a guide really does.",
    topic: "planning",
    image: { src: "/images/trekkers-on-trail.jpg", alt: "Trekkers and their guide walking up the Langtang valley trail" },
    publishedOn: "2026-09-10",
    readMinutes: 6,
    author: AUTHOR,
  },
  {
    slug: "nepal-trekking-permits-by-region",
    title: "Nepal trekking permits by region: what you need and what it costs",
    shortTitle: "Trekking permits by region",
    regionSlugs: EVERY_REGION,
    excerpt: "National park, TIMS and restricted-area permits for each region, and how we arrange them.",
    topic: "planning",
    image: { src: "/images/tamang-heritage-village.jpg", alt: "Terraced village on the hillside above the Langtang trail" },
    publishedOn: "2026-08-27",
    readMinutes: 7,
    author: AUTHOR,
  },
  {
    slug: "altitude-sickness-signs-and-prevention",
    title: "Altitude sickness on a Nepal trek: signs and prevention",
    shortTitle: "Altitude sickness: signs and prevention",
    regionSlugs: [],
    excerpt: "How acclimatization works, the warning signs to know, and when to turn back.",
    topic: "health",
    image: { src: "/images/langtang-peaks.jpg", alt: "Snow-covered boulders below Langtang Lirung, seen from Tserko Ri" },
    publishedOn: "2026-08-13",
    readMinutes: 10,
    author: AUTHOR,
  },
  {
    slug: "packing-list-for-teahouse-treks",
    title: "Packing list for teahouse treks in Nepal",
    shortTitle: "Packing list for teahouse treks",
    regionSlugs: [],
    excerpt: "What to bring, what to leave at home, and the layers that keep you warm above 4,000 m.",
    topic: "gear",
    image: { src: "/images/kyanjin-gompa-prayer-wheels.jpg", alt: "Prayer wheels at Kyanjin Gompa" },
    publishedOn: "2026-07-30",
    readMinutes: 8,
    author: AUTHOR,
  },
  {
    slug: "nepal-visa-for-trekkers",
    title: "Nepal visa for trekkers: getting one on arrival",
    shortTitle: "Nepal visa for trekkers",
    regionSlugs: [],
    excerpt: "Which visa to get, what it costs, and what to have ready at Kathmandu airport.",
    topic: "planning",
    image: { src: "/images/kyanjin-gompa-chorten.jpg", alt: "Stone chorten above Kyanjin Gompa in the Langtang valley" },
    publishedOn: "2026-07-16",
    readMinutes: 5,
    author: AUTHOR,
  },
  {
    slug: "best-time-to-trek-in-nepal",
    title: "Best time to trek in Nepal, month by month",
    shortTitle: "Best time to trek in Nepal",
    regionSlugs: EVERY_REGION,
    excerpt: "Weather, crowds and trail conditions in every season, and which region suits which month.",
    topic: "best-time",
    image: { src: "/images/langtang-glacier-peaks.jpg", alt: "Snow-covered peaks above the Langtang glacier" },
    publishedOn: "2026-07-02",
    readMinutes: 7,
    author: AUTHOR,
  },
  {
    slug: "how-to-prepare-for-altitude",
    title: "How to prepare for altitude: training and acclimatization",
    shortTitle: "How to prepare for altitude",
    regionSlugs: [],
    excerpt: "Training, acclimatization and the warning signs to know.",
    topic: "health",
    image: { src: "/images/langtang-khola-river.jpg", alt: "The Langtang Khola river running through the valley" },
    publishedOn: "2026-06-18",
    readMinutes: 7,
    author: AUTHOR,
  },
  {
    slug: "trekking-gear-to-rent-in-kathmandu",
    title: "Trekking gear to rent or buy in Kathmandu",
    shortTitle: "Gear to rent in Kathmandu",
    regionSlugs: [],
    excerpt: "Down jackets, sleeping bags and poles: what is worth renting in Thamel and what to bring from home.",
    topic: "gear",
    image: { src: "/images/trekkers-on-trail.jpg", alt: "Trekkers and their guide walking up the Langtang valley trail" },
    publishedOn: "2026-06-04",
    readMinutes: 6,
    author: AUTHOR,
  },
];

/** "Start here" reading order for a first trek in Nepal (slugs of TRAVEL_GUIDES). */
export const START_HERE_SLUGS: readonly string[] = [
  "do-you-need-a-guide-to-trek-in-nepal",
  "nepal-trekking-permits-by-region",
  "best-time-to-trek-langtang",
  "altitude-sickness-signs-and-prevention",
  "langtang-valley-trek-cost",
  "packing-list-for-teahouse-treks",
];

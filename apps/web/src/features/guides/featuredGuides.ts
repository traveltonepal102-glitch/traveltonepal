import type { GuideSummary } from "./types";

/**
 * Guides shown on the home page: the first is the big featured card.
 * Demo values from the website design until travel guides come from Payload (CMS phase).
 */
export const FEATURED_GUIDES: readonly [GuideSummary, ...GuideSummary[]] = [
  {
    slug: "best-time-to-trek-in-nepal",
    title: "Best time to trek in Nepal, month by month",
    excerpt: "Weather, crowds and trail conditions in every season, and which region suits which month.",
    tag: "Planning",
    tagIcon: "wb_sunny",
    image: { src: "/images/langtang-glacier-peaks.jpg", alt: "Snow-covered peaks above the Langtang glacier" },
  },
  {
    slug: "nepal-trekking-permits",
    title: "Nepal trekking permits explained",
    excerpt: "Which permits each region needs and how we arrange them.",
    tag: "Permits",
    tagIcon: "description",
    image: { src: "/images/tamang-heritage-village.jpg", alt: "Terraced village on the hillside above the Langtang trail" },
  },
  {
    slug: "how-to-prepare-for-altitude",
    title: "How to prepare for altitude",
    excerpt: "Training, acclimatization and the warning signs to know.",
    tag: "Health",
    tagIcon: "medical_services",
    image: { src: "/images/langtang-khola-river.jpg", alt: "The Langtang Khola river running through the valley" },
  },
];

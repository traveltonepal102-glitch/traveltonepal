import type { TrekSummary } from "./types";

/**
 * Popular treks, shown in the header menu and on the 404 page.
 * Demo values from the website design until treks come from Payload (CMS phase).
 */
export const POPULAR_TREKS: readonly TrekSummary[] = [
  {
    slug: "everest-base-camp",
    name: "Everest Base Camp Trek",
    region: "Everest",
    days: 14,
    maxAltitudeM: 5545,
    difficulty: "Challenging",
    priceFromUsd: 1000,
  },
  {
    slug: "annapurna-circuit",
    name: "Annapurna Circuit",
    region: "Annapurna",
    days: 16,
    maxAltitudeM: 5416,
    difficulty: "Challenging",
    priceFromUsd: 1150,
  },
  {
    slug: "langtang-valley",
    name: "Langtang Valley Trek",
    region: "Langtang",
    days: 10,
    maxAltitudeM: 4773,
    difficulty: "Moderate",
    priceFromUsd: 890,
    image: { src: "/images/kyanjin-gompa-chorten.jpg", alt: "Stone chorten above Kyanjin Gompa" },
  },
  {
    slug: "manaslu-circuit",
    name: "Manaslu Circuit",
    region: "Manaslu",
    days: 15,
    maxAltitudeM: 5106,
    difficulty: "Challenging",
    priceFromUsd: 1280,
  },
];

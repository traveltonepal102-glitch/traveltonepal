import type { TrekSummary } from "./types";

/**
 * Popular treks, in the home page's order: the home "Treks trekkers book first" section shows all,
 * the header menu the first 4, the 404 page the first 3.
 * Demo values from the website design until treks come from Payload (CMS phase).
 */
export const POPULAR_TREKS: readonly TrekSummary[] = [
  {
    slug: "langtang-valley",
    name: "Langtang Valley Trek",
    region: "Langtang",
    days: 10,
    maxAltitudeM: 4773,
    difficulty: "Moderate",
    priceFromUsd: 890,
    tags: ["classic"],
    image: { src: "/images/kyanjin-gompa-chorten.jpg", alt: "Stone chorten above Kyanjin Gompa in the Langtang valley" },
  },
  {
    slug: "everest-base-camp",
    name: "Everest Base Camp Trek",
    region: "Everest",
    days: 14,
    maxAltitudeM: 5545,
    difficulty: "Challenging",
    priceFromUsd: 1000,
    tags: ["classic"],
  },
  {
    slug: "annapurna-circuit",
    name: "Annapurna Circuit Trek",
    region: "Annapurna",
    days: 16,
    maxAltitudeM: 5416,
    difficulty: "Challenging",
    priceFromUsd: 1150,
    tags: ["classic"],
  },
  {
    slug: "manaslu-circuit",
    name: "Manaslu Circuit Trek",
    region: "Manaslu",
    days: 15,
    maxAltitudeM: 5106,
    difficulty: "Challenging",
    priceFromUsd: 1280,
    tags: ["off-the-beaten-path"],
  },
  {
    slug: "annapurna-base-camp",
    name: "Annapurna Base Camp Trek",
    region: "Annapurna",
    days: 11,
    maxAltitudeM: 4130,
    difficulty: "Moderate",
    tags: ["classic"],
  },
  {
    slug: "mardi-himal",
    name: "Mardi Himal Trek",
    region: "Mardi Himal",
    days: 7,
    maxAltitudeM: 4500,
    difficulty: "Moderate",
    tags: ["off-the-beaten-path"],
  },
];

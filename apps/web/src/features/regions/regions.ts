import type { SiteImageSource } from "@/lib/images";

/** A trekking region, as the header menu, the trek finder and the home region tiles need it. */
export type RegionSummary = {
  slug: string;
  name: string;
  /** Highest point trekkers reach in the region. */
  maxAltitudeM: number;
  /** One line for the featured home tile. */
  tagline?: string;
  image?: SiteImageSource;
};

/** The nine regions. Demo values from the website design until regions come from Payload (CMS phase). */
export const REGIONS: readonly RegionSummary[] = [
  {
    slug: "everest",
    name: "Everest",
    maxAltitudeM: 5545,
    tagline: "Sherpa villages, Namche Bazaar, Tengboche Monastery and the trail to Everest Base Camp.",
  },
  { slug: "annapurna", name: "Annapurna", maxAltitudeM: 5416 },
  { slug: "manaslu", name: "Manaslu", maxAltitudeM: 5106 },
  {
    slug: "langtang",
    name: "Langtang",
    maxAltitudeM: 4984,
    image: { src: "/images/langtang-peaks.jpg", alt: "Snow-covered boulders below Langtang Lirung, seen from Tserko Ri" },
  },
  { slug: "mardi-himal", name: "Mardi Himal", maxAltitudeM: 4500 },
  { slug: "kanchenjunga", name: "Kanchenjunga", maxAltitudeM: 5143 },
  { slug: "nar-phu", name: "Nar Phu", maxAltitudeM: 5320 },
  { slug: "pikey-peak", name: "Pikey Peak", maxAltitudeM: 4065 },
  {
    slug: "tamang-heritage-trail",
    name: "Tamang Heritage Trail",
    maxAltitudeM: 3165,
    image: { src: "/images/tamang-heritage-village.jpg", alt: "Village house on a hillside along the Tamang Heritage Trail" },
  },
];

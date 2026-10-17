/** A trekking region, as the header menu and the trek finder need it. */
export type RegionSummary = {
  slug: string;
  name: string;
  /** Highest point trekkers reach in the region. */
  maxAltitudeM: number;
  image?: string;
};

/** The nine regions. Demo values from the website design until regions come from Payload (CMS phase). */
export const REGIONS: readonly RegionSummary[] = [
  { slug: "everest", name: "Everest", maxAltitudeM: 5545 },
  { slug: "annapurna", name: "Annapurna", maxAltitudeM: 5416 },
  { slug: "manaslu", name: "Manaslu", maxAltitudeM: 5106 },
  { slug: "langtang", name: "Langtang", maxAltitudeM: 4984, image: "/images/langtang-peaks.jpg" },
  { slug: "mardi-himal", name: "Mardi Himal", maxAltitudeM: 4500 },
  { slug: "kanchenjunga", name: "Kanchenjunga", maxAltitudeM: 5143 },
  { slug: "nar-phu", name: "Nar Phu", maxAltitudeM: 5320 },
  { slug: "pikey-peak", name: "Pikey Peak", maxAltitudeM: 4065 },
  {
    slug: "tamang-heritage-trail",
    name: "Tamang Heritage Trail",
    maxAltitudeM: 3165,
    image: "/images/tamang-heritage-village.jpg",
  },
];

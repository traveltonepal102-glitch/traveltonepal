/** How good a month is for trekking in a region. */
export type MonthRating = "best" | "possible" | "avoid";

export type RegionDifficulty = "Easy" | "Easy–moderate" | "Moderate" | "Easy–challenging" | "Challenging" | "Strenuous";

/**
 * The facts every region shares across the site (Regions page, region page): one place, so the pages
 * cannot disagree. Demo values from the website design until regions come from Payload (CMS phase).
 */
export type RegionOverview = {
  slug: string;
  /** Short name where space is tight, e.g. "Tamang Heritage". */
  shortName?: string;
  /** District or area, e.g. "Rasuwa". */
  district: string;
  /** Map pin, in degrees. */
  location: { lat: number; lon: number };
  /** e.g. "7–12 days" (the region's treks and custom routes). */
  trekLength: string;
  difficulty: RegionDifficulty;
  access: { short: string; long: string; isFlight: boolean };
  permits: string;
  /** One or two words, e.g. "Close to Kathmandu". */
  bestFor: string;
  summary: string;
  /** Jan–Dec, exactly 12 entries. */
  months: readonly MonthRating[];
};

const RATING_CODES = { g: "best", o: "possible", x: "avoid" } as const;

/** "ooggg xxx oggo" → 12 ratings, Jan–Dec (g best, o possible, x not ideal; spaces for reading only). */
export const monthsFromCode = (code: string): MonthRating[] =>
  [...code.replace(/ /g, "")].map((letter) => {
    const rating = RATING_CODES[letter as keyof typeof RATING_CODES];
    if (!rating) throw new Error(`Unknown month code "${letter}" in "${code}"`);
    return rating;
  });

/** West to east, the order of the numbered pins on the Regions map. */
export const REGION_OVERVIEWS: readonly RegionOverview[] = [
  {
    slug: "annapurna",
    district: "Gandaki",
    location: { lat: 28.62, lon: 83.9 },
    trekLength: "5–21 days",
    difficulty: "Easy–challenging",
    access: { short: "Pokhara", long: "Drive or fly to Pokhara", isFlight: false },
    permits: "ACAP + TIMS",
    bestFor: "Variety",
    summary:
      "The most varied region: rice terraces, rhododendron forest, the Annapurna Sanctuary and the high desert beyond Thorong La.",
    months: monthsFromCode("ooggg xxx oggo"),
  },
  {
    slug: "mardi-himal",
    district: "Gandaki",
    location: { lat: 28.42, lon: 83.85 },
    trekLength: "5–8 days",
    difficulty: "Moderate",
    access: { short: "Pokhara", long: "Short drive from Pokhara", isFlight: false },
    permits: "ACAP + TIMS",
    bestFor: "Short trek",
    summary: "A quiet ridge walk straight up towards Machapuchare, ideal when you only have a week.",
    months: monthsFromCode("ooggg xxx oggo"),
  },
  {
    slug: "nar-phu",
    district: "Manang",
    location: { lat: 28.78, lon: 84.2 },
    trekLength: "10–14 days",
    difficulty: "Challenging",
    access: { short: "Drive", long: "Drive to Koto via Besisahar", isFlight: false },
    permits: "Restricted area + ACAP",
    bestFor: "Hidden villages",
    summary: "Medieval stone villages and Tibetan culture in a hidden valley north of Annapurna, over the Kang La.",
    months: monthsFromCode("xxogg ooo gggx"),
  },
  {
    slug: "manaslu",
    district: "Gorkha",
    location: { lat: 28.55, lon: 84.58 },
    trekLength: "14–18 days",
    difficulty: "Challenging",
    access: { short: "Drive", long: "Drive to Soti Khola or Machha Khola", isFlight: false },
    permits: "Restricted area + MCAP + ACAP",
    bestFor: "Remote circuit",
    summary: "A wild circuit around the world's eighth-highest mountain, crossing the Larkya La, with far fewer trekkers.",
    months: monthsFromCode("xxggo xxx oggo"),
  },
  {
    slug: "tamang-heritage-trail",
    shortName: "Tamang Heritage",
    district: "Rasuwa",
    location: { lat: 28.18, lon: 85.25 },
    trekLength: "6–8 days",
    difficulty: "Easy",
    access: { short: "Drive", long: "Drive to Syabrubesi", isFlight: false },
    permits: "Langtang NP + TIMS",
    bestFor: "Culture",
    summary: "Village homestays, hot springs and Tamang traditions near the Tibet border. Gentle and cultural.",
    months: monthsFromCode("ooggo xxx oggg"),
  },
  {
    slug: "langtang",
    district: "Rasuwa",
    location: { lat: 28.21, lon: 85.56 },
    trekLength: "7–12 days",
    difficulty: "Moderate",
    access: { short: "Drive", long: "Drive to Syabrubesi (7–8 hrs)", isFlight: false },
    permits: "Langtang NP + TIMS",
    bestFor: "Close to Kathmandu",
    summary: "Glaciers, yak pastures and the monastery at Kyanjin Gompa, the closest big-mountain valley to Kathmandu.",
    months: monthsFromCode("ooggg xxx oggo"),
  },
  {
    slug: "pikey-peak",
    district: "Solukhumbu",
    location: { lat: 27.56, lon: 86.58 },
    trekLength: "5–8 days",
    difficulty: "Easy–moderate",
    access: { short: "Drive", long: "Drive towards Dhap / Phaplu", isFlight: false },
    permits: "[Confirm permits]",
    bestFor: "Everest views",
    summary: "A short trek in Sherpa country with one of the widest Himalayan panoramas, from Everest to Kanchenjunga.",
    months: monthsFromCode("ooggg xxx oggg"),
  },
  {
    slug: "everest",
    district: "Khumbu",
    location: { lat: 27.98, lon: 86.85 },
    trekLength: "12–16 days",
    difficulty: "Challenging",
    access: { short: "Fly to Lukla", long: "Flight to Lukla", isFlight: true },
    permits: "Sagarmatha NP + Khumbu local permit",
    bestFor: "Iconic peaks",
    summary: "Sherpa villages, monasteries and the classic walk to Everest Base Camp and Kala Patthar.",
    months: monthsFromCode("ooggg xxx oggo"),
  },
  {
    slug: "kanchenjunga",
    district: "Taplejung",
    location: { lat: 27.7, lon: 87.95 },
    trekLength: "20–25 days",
    difficulty: "Strenuous",
    access: { short: "Fly + drive", long: "Fly to Bhadrapur, drive to Taplejung", isFlight: true },
    permits: "Restricted area + KCAP",
    bestFor: "True wilderness",
    summary: "A long expedition-style trek in the far east to the base camps of the world's third-highest mountain.",
    months: monthsFromCode("xxogg xxx oggx"),
  },
];

export const getRegionOverview = (slug: string) => REGION_OVERVIEWS.find((overview) => overview.slug === slug);

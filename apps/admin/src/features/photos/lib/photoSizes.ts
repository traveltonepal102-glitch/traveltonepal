/**
 * The best size for each kind of place a photo goes, said next to every photo field and in the "Choose a photo"
 * window. Uploads keep the whole photo; the website fits each one into its box (object-cover), so a photo of another
 * shape is trimmed at the edges. Keep these in step with the website's boxes (apps/web).
 */
export const PHOTO_SIZES = {
  /** Page tops behind the heading (guide, region, trek, list pages, About, Contact, a region website's Home). */
  banner: {
    best: "2400 × 1350 px or larger, landscape (16:9)",
    note: "It fills the top of the page, so wide screens and phones trim the edges. Keep the main subject in the middle.",
  },
  /** Cards, galleries, guide photo sections, itinerary days, adventures. */
  landscape: {
    best: "1600 × 1067 px or larger, landscape (3:2)",
    note: "It is shown in wide boxes (16:9 to 4:3), so the edges may be trimmed a little. Keep the main subject in the middle.",
  },
  /** About page: the founder and "Flexible" photos. */
  tall: {
    best: "1200 × 1250 px or larger, about square",
    note: "It is shown in a box about as tall as it is wide. Keep the main subject in the middle.",
  },
  /** Authors, trekking guides, reviewers. */
  person: {
    best: "800 × 800 px or larger, square",
    note: "It is shown in a circle or a small square. Keep the face in the middle.",
  },
  /** "Photo when the link is shared": made into a 1200 × 630 picture (processPhoto's share.jpg). */
  share: {
    best: "1200 × 630 px or larger, landscape",
    note: "It is trimmed to 1200 × 630 for WhatsApp, Facebook and LinkedIn. Keep the main subject in the middle.",
  },
  /** A photo put into a text: shown whole in its own shape. */
  inText: {
    best: "1600 px wide or larger, any shape",
    note: "It is shown whole, in its own shape, never trimmed.",
  },
  /** Licence and certificate scans: shown whole and opened full size. */
  document: {
    best: "1600 px or larger on the long side, any shape",
    note: "It is shown whole, never trimmed, and visitors can open it full size.",
  },
} as const satisfies Record<string, { best: string; note: string }>;

export type PhotoSize = keyof typeof PHOTO_SIZES;

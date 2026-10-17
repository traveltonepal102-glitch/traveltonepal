export type TrekDifficulty = "Easy" | "Moderate" | "Challenging";

/** Character of a trek, used by the home page filter chips. */
export type TrekTag = "classic" | "off-the-beaten-path";

/** What a trek card or menu needs to show; the full trek comes from Payload later. */
export type TrekSummary = {
  slug: string;
  name: string;
  region: string;
  days: number;
  maxAltitudeM: number;
  difficulty: TrekDifficulty;
  /** Missing while the price is not set: cards show "Price on request". */
  priceFromUsd?: number;
  tags: readonly TrekTag[];
  image?: { src: string; alt: string };
};

export type TrekDifficulty = "Easy" | "Moderate" | "Challenging";

/** What a trek card or menu needs to show; the full trek comes from Payload later. */
export type TrekSummary = {
  slug: string;
  name: string;
  region: string;
  days: number;
  maxAltitudeM: number;
  difficulty: TrekDifficulty;
  priceFromUsd: number;
  image?: { src: string; alt: string };
};

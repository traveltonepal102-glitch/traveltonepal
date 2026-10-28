import type { Photo } from "@/features/photos/types";

/** What the adventure form edits: one card of the home page's custom adventures carousel. */
export type AdventureValues = {
  title: string;
  /** The orange tag on the photo, e.g. "Lamjung · Spring and autumn"; "" for none. */
  tag: string;
  summary: string;
  /** A library photo; the card shows on the website only with one. */
  photoId: string | null;
  /** What the photo shows; "" uses the title. */
  photoAlt: string;
  /** Place in the carousel, 1 first. */
  position: number;
  isShown: boolean;
};

export type Adventure = AdventureValues & { id: string; updatedAt: string; photo: Photo | null };

/** One "How it works" step. */
export type AdventureStep = { title: string; text: string };

/** The section's own words (one set for the home page). */
export type AdventureSectionValues = {
  eyebrow: string;
  heading: string;
  intro: string;
  /** The carousel's last card, "Something else in mind?". */
  askTitle: string;
  askText: string;
  stepsTitle: string;
  /** Always three. */
  steps: AdventureStep[];
  /** The yellow note under the steps; "" for none. */
  note: string;
};

import type { SiteImageSource } from "@/lib/images";

/** One custom adventure card (no page of its own: visitors ask about it on WhatsApp or by email). */
export type Adventure = {
  id: string;
  title: string;
  /** The orange tag on the photo, e.g. "Lamjung · Spring and autumn"; left out when blank. */
  tag?: string;
  summary: string;
  photo: SiteImageSource;
};

/** One "How it works" step. */
export type AdventureStep = { title: string; text: string };

/** The home page's custom adventures section, its words and cards as the admin saved them. */
export type AdventuresSection = {
  eyebrow: string;
  heading: string;
  intro: string;
  /** The carousel's last card, "Something else in mind?". */
  askTitle: string;
  askText: string;
  stepsTitle: string;
  steps: AdventureStep[];
  /** The yellow note under the steps; "" leaves it out. */
  note: string;
  /** In carousel order. */
  adventures: Adventure[];
};

import type { IconName } from "@ttn/ui/icon";

import type { GuideTopicId } from "./topics";

/** What a guide card needs; full travel guides come from Payload later. */
export type GuideSummary = {
  slug: string;
  title: string;
  excerpt: string;
  /** Topic chip, e.g. "Permits". */
  tag: string;
  tagIcon: IconName;
  image: { src: string; alt: string };
};

/** A guide on the Travel guides page: its topic (which gives the chip) and byline. */
export type TravelGuide = Omit<GuideSummary, "tag" | "tagIcon"> & {
  topic: GuideTopicId;
  /** For compact lists, e.g. "Do you need a guide in Nepal?". */
  shortTitle: string;
  /** Regions the guide is about (REGIONS slugs); empty for a Nepal-wide guide. */
  regionSlugs: readonly string[];
  /** ISO date, e.g. "2026-10-06". */
  publishedOn: string;
  readMinutes: number;
  author: string;
  /** Shown as the big featured story; without one the newest guide is featured. */
  isFeatured?: boolean;
};

import type { IconName } from "@ttn/ui/icon";

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

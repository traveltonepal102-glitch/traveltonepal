import type { IconName } from "@ttn/ui/icon";
import { isRichTextEmpty, richTextDocSchema } from "@ttn/ui/lib/richText";
import { z } from "zod";

import type { RegionFaqItem } from "./types";

/** The icons a "why trek here" card can have (the admin's WHY_POINT_ICONS); anything else shows the first. */
const WHY_POINT_ICONS = [
  "landscape",
  "mountain_flag",
  "temple_buddhist",
  "directions_walk",
  "hiking",
  "route",
  "cottage",
  "groups",
  "wb_sunny",
  "volunteer_activism",
] as const satisfies readonly IconName[];

const text = z.string().trim();

const whyPointSchema = z.object({
  icon: z.enum(WHY_POINT_ICONS).catch(WHY_POINT_ICONS[0]),
  title: text.min(1),
  text: text.catch(""),
});

const faqSchema = z.object({
  question: text.min(1),
  answer: richTextDocSchema.refine((doc) => !isRichTextEmpty(doc)),
});

const nearbyTrekSchema = z.object({ slug: z.string().min(1), label: text.catch(""), note: text.catch("") });

/**
 * A JSON list from the database, item by item: items that don't fit the schema are left out, so one broken
 * item never empties the whole section. Anything other than a list is an empty list.
 */
const listOf = <T>(value: unknown, item: z.ZodType<T>): T[] =>
  Array.isArray(value) ? value.flatMap((entry) => item.safeParse(entry).data ?? []) : [];

export type WhyPoint = z.infer<typeof whyPointSchema>;

export const readWhyPoints = (value: unknown): WhyPoint[] => listOf(value, whyPointSchema);

export const readFaqs = (value: unknown): RegionFaqItem[] => listOf(value, faqSchema);

export const readNearbyTreks = (value: unknown) => listOf(value, nearbyTrekSchema);

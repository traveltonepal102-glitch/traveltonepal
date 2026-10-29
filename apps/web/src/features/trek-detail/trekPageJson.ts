import type { IconName } from "@ttn/ui/icon";
import { EMPTY_RICH_TEXT, isRichTextEmpty, richTextDocSchema, richTextImages, richTextToPlainText } from "@ttn/ui/lib/richText";
import type { RichTextBlock, RichTextImage } from "@ttn/ui/lib/richText";
import { z } from "zod";

/** Icons each list may use (the admin's choices); anything else shows the list's first icon. */
const BADGE_ICONS = ["route", "nordic_walking", "health_and_safety", "landscape", "groups", "star"] as const satisfies readonly IconName[];
const PACKING_ICONS = ["apparel", "footprint", "backpack", "medical_services", "water_drop", "description"] as const satisfies readonly IconName[];
const KNOW_ICONS = [
  "wb_twilight",
  "cottage",
  "soup_kitchen",
  "emergency",
  "health_and_safety",
  "route",
  "description",
  "payments",
  "groups",
  "backpack",
] as const satisfies readonly IconName[];
const FAQ_ICONS = [
  "info",
  "calendar_month",
  "nordic_walking",
  "fitness_center",
  "wb_twilight",
  "description",
  "payments",
  "event",
  "route",
  "groups",
  "cottage",
  "restaurant",
  "medical_services",
  "backpack",
  "temple_buddhist",
] as const satisfies readonly IconName[];

const text = z.string().trim();
const optionalText = text.catch("");
const iconOf = <T extends readonly [string, ...string[]]>(icons: T) => z.enum(icons).catch(icons[0]);

/**
 * A JSON list from the database, item by item: items that don't fit the schema are left out, so one broken
 * item never empties the whole section. Anything other than a list is an empty list.
 */
const listOf = <T>(value: unknown, item: z.ZodType<T>): T[] =>
  Array.isArray(value) ? value.flatMap((entry) => item.safeParse(entry).data ?? []) : [];

/** Rich text as plain paragraphs (one per paragraph, heading or list), blank ones left out. */
/** The photos added in a text (they show under it). */
export const photosOf = (value: unknown): RichTextImage[] => richTextImages(richTextDocSchema.safeParse(value).data?.content ?? []);

export const paragraphsOf = (value: unknown): string[] => {
  const doc = richTextDocSchema.safeParse(value).data;
  if (!doc) return [];
  return doc.content.flatMap((block) => richTextToPlainText({ type: "doc", content: [block] }).trim() || []);
};

const pointSchema = z.object({ title: text.min(1), text: optionalText });

const photoBadgeSchema = z.object({ label: text.min(1), icon: iconOf(BADGE_ICONS), tone: z.enum(["brand", "green"]).catch("brand") });

const coverSchema = z.object({
  cover_id: z.string().min(1),
  cover_width: z.number(),
  cover_height: z.number(),
  cover_variant_widths: z.array(z.number()),
  cover_placeholder: z.string().catch(""),
  cover_place: z.string().catch(""),
});

const daySchema = z.object({
  place: optionalText,
  title: text.min(1),
  subtitle: optionalText,
  duration: optionalText,
  altitude_m: z.number().int(),
  sleep_altitude_m: z.number().int().nullable().catch(null),
  is_high_point: z.boolean().catch(false),
  description: z.unknown(),
  photo: coverSchema.nullable().catch(null),
});

const groupPriceSchema = z.object({
  label: text.min(1),
  short_label: text.min(1),
  price_usd: z.number().int().positive(),
  team: optionalText,
  is_default: z.boolean().catch(false),
});

const packingGroupSchema = z.object({ title: text.min(1), icon: iconOf(PACKING_ICONS), items: z.array(z.unknown()).catch([]) });

const knowTopicSchema = z.object({
  title: text.min(1),
  icon: iconOf(KNOW_ICONS),
  body: z.unknown(),
  note: optionalText,
  photo: coverSchema.nullable().catch(null),
});

const faqGroupSchema = z.object({ title: text.min(1), icon: iconOf(FAQ_ICONS), items: z.array(z.unknown()).catch([]) });

const faqItemSchema = z.object({ question: text.min(1), answer: z.unknown() });

export type TrekDayRow = z.infer<typeof daySchema>;

export const readPoints = (value: unknown) => listOf(value, pointSchema);
export const readPhotoBadges = (value: unknown) => listOf(value, photoBadgeSchema);
export const readDays = (value: unknown) => listOf(value, daySchema);
export const readGroupPrices = (value: unknown) => listOf(value, groupPriceSchema);

export const readPackingGroups = (value: unknown) =>
  listOf(value, packingGroupSchema).flatMap((group) => {
    const items = readPoints(group.items);
    return items.length ? [{ title: group.title, icon: group.icon, items }] : [];
  });

/** A text without its photos, also inside lists (they show under it). */
const withoutPhotos = (blocks: readonly RichTextBlock[]): RichTextBlock[] =>
  blocks.flatMap((block): RichTextBlock[] => {
    if (block.type === "image") return [];
    if (block.type !== "bulletList" && block.type !== "orderedList") return [block];
    const items = block.content.flatMap((item) => {
      const content = withoutPhotos(item.content);
      return content.length ? [{ ...item, content }] : [];
    });
    return items.length ? [{ ...block, content: items }] : [];
  });

/**
 * Field guide topics with their photo row: the text as written (its photos apart, shown under it); a note's own
 * leading "*" is dropped (the page adds one).
 */
export const readKnowTopics = (value: unknown) =>
  listOf(value, knowTopicSchema).flatMap((topic) => {
    const { content } = richTextDocSchema.safeParse(topic.body).data ?? EMPTY_RICH_TEXT;
    const body = { type: "doc" as const, content: withoutPhotos(content) };
    const textPhotos = richTextImages(content);
    const note = topic.note.replace(/^\*+\s*/, "");
    if (isRichTextEmpty(body) && !textPhotos.length && !note) return [];
    return [{ title: topic.title, icon: topic.icon, body, textPhotos, ...(note ? { note } : {}), photo: topic.photo }];
  });

/** Question topics; a question shows only with an answer. */
export const readFaqGroups = (value: unknown) =>
  listOf(value, faqGroupSchema).flatMap((group) => {
    const items = listOf(group.items, faqItemSchema).flatMap((item) => {
      const answer = paragraphsOf(item.answer).join("\n\n");
      return answer ? [{ question: item.question, answer, photos: photosOf(item.answer) }] : [];
    });
    return items.length ? [{ title: group.title, icon: group.icon, items }] : [];
  });

import type { IconName } from "@ttn/ui/icon";
import { isRichTextEmpty, richTextDocSchema } from "@ttn/ui/lib/richText";
import { z } from "zod";

import type { IconTone } from "@/components/shared/iconTones";

/** Key fact icons and their colours (the admin's FACT_ICONS); an unknown icon shows the first. */
const FACT_TONES = {
  wb_sunny: "green",
  water_drop: "brand",
  altitude: "saffron",
  wb_twilight: "navy",
  calendar_month: "brand",
  schedule: "navy",
  payments: "green",
  hiking: "saffron",
  landscape: "green",
  route: "brand",
  groups: "navy",
  description: "brand",
} as const satisfies Record<string, IconTone> & Partial<Record<IconName, IconTone>>;
const FACT_ICONS = Object.keys(FACT_TONES) as [keyof typeof FACT_TONES, ...(keyof typeof FACT_TONES)[]];

/** The admin's crowd levels, as the month table says them. */
const CROWDS = { "very-low": "Very low", low: "Low", medium: "Medium", busy: "Busy", busiest: "Busiest" } as const;

const text = z.string().trim().catch("");
const doc = richTextDocSchema.refine((value) => !isRichTextEmpty(value));

/**
 * A JSON list from the database, item by item: items that don't fit are left out, so one broken item never
 * empties the whole list. Anything other than a list is an empty list.
 */
const listOf = <T>(value: unknown, item: z.ZodType<T>): T[] =>
  Array.isArray(value) ? value.flatMap((entry) => item.safeParse(entry).data ?? []) : [];

export const coverSchema = z.object({
  cover_id: z.string().min(1),
  cover_width: z.number(),
  cover_height: z.number(),
  cover_variant_widths: z.array(z.number()),
  cover_placeholder: z.string().catch(""),
  cover_place: z.string().catch(""),
});

const personSchema = z.object({ name: z.string().trim().min(1), role: text, quote: text, photo: coverSchema.nullable().catch(null) });

const dayRowSchema = z.object({
  place: text,
  high_place: text,
  title: z.string().trim().min(1),
  subtitle: text,
  duration: text,
  altitude_m: z.number().int(),
  sleep_altitude_m: z.number().int().nullable().catch(null),
  is_high_point: z.boolean().catch(false),
  day_number: z.number().int().positive(),
  description: z.unknown(),
});

/** A section as web_travel_guide_pages sends it; `content` and `settings` are read per kind (guidePageRows). */
const sectionSchema = z.object({
  type: z.string(),
  settings: z.record(z.string(), z.unknown()).catch({}),
  content: z.record(z.string(), z.unknown()).catch({}),
  trek_slug: z.string().nullable().catch(null),
  trek_slugs: z.array(z.string()).catch([]),
  guides: z.array(z.unknown()).catch([]),
  photos: z.array(z.unknown()).catch([]),
  days: z.array(z.unknown()).catch([]),
});

const authorSchema = z.object({
  kind: z.enum(["office", "guide", "guest"]).catch("guest"),
  name: z.string().trim().min(1),
  job_title: text,
  bio: text,
  photo: coverSchema.nullable().catch(null),
});

const factSchema = z.object({ icon: z.enum(FACT_ICONS).catch(FACT_ICONS[0]), label: z.string().trim().min(1), value: z.string().trim().min(1) });

const monthNoteSchema = z.object({ onTheTrail: text, crowds: z.string().catch("") });

export type CoverRow = z.infer<typeof coverSchema>;
export type PersonRow = z.infer<typeof personSchema>;
export type DayRow = z.infer<typeof dayRowSchema>;
export type SectionRow = z.infer<typeof sectionSchema>;

export const readSections = (value: unknown) => listOf(value, sectionSchema);
export const readPeople = (value: unknown) => listOf(value, personSchema);
export const readPhotos = (value: unknown) => listOf(value, coverSchema);
export const readDays = (value: unknown) => listOf(value, dayRowSchema);
export const readAuthor = (value: unknown) => authorSchema.safeParse(value).data;
export const readChecker = (value: unknown) => personSchema.omit({ quote: true }).safeParse(value).data;

export const readFacts = (value: unknown) => listOf(value, factSchema).map((fact) => ({ ...fact, tone: FACT_TONES[fact.icon] }));

/** Jan–Dec notes, the crowd level in words; anything but 12 months is none. */
export const readMonthNotes = (value: unknown) => {
  const notes = listOf(value, monthNoteSchema);
  if (notes.length !== 12) return undefined;
  return notes.map((note) => ({ onTheTrail: note.onTheTrail, crowds: CROWDS[note.crowds as keyof typeof CROWDS] ?? "" }));
};

/** Readers for a section's own fields; a missing or wrong field reads as empty. */
export const field = {
  text: (record: Record<string, unknown>, key: string) => text.parse(record[key]),
  doc: (record: Record<string, unknown>, key: string) => doc.safeParse(record[key]).data,
  texts: (record: Record<string, unknown>, key: string) => listOf(record[key], z.string().trim().min(1)),
  /** A table row's cells, empty ones kept in their place. */
  cells: (record: Record<string, unknown>, key: string) => listOf(record[key], text),
  // Not listOf: its flatMap would flatten the rows into one.
  cellRows: (record: Record<string, unknown>, key: string): string[][] => {
    const rows = record[key];
    return Array.isArray(rows) ? rows.map((row) => listOf(row, text)) : [];
  },
  costRows: (record: Record<string, unknown>) => listOf(record.rows, z.object({ item: z.string().trim().min(1), price: text })),
  faqItems: (record: Record<string, unknown>) =>
    listOf(record.items, z.object({ question: z.string().trim().min(1), answer: doc })).map((item) => ({ question: item.question, answer: item.answer })),
};

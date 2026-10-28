import { z } from "zod";

import { listOf } from "@/lib/jsonList";

import type { AboutBelief, AboutHonest, AboutListen, AboutSafety, TitledText } from "./types";

/**
 * The four beliefs and the safety band as saved in Pages › About (`content`), read leniently: a missing part is
 * empty and an empty item is left out, so a half-filled page still shows what it has.
 */
export const text = z.string().trim().catch("");

/** Paragraphs typed with an empty line between them. */
export const paragraphsOf = (value: string) =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const titledSchema = z.object({ title: text, text });

/** The items with a title (or text), in order. */
export const titledList = (value: unknown): TitledText[] => listOf(value, titledSchema).filter((item) => item.title || item.text);

const objectSchema = z.record(z.string(), z.unknown()).catch({});

/** A saved section object, or an empty one. */
export const sectionObject = (value: unknown): Record<string, unknown> => objectSchema.parse(value);

const read = (section: Record<string, unknown>, key: string) => text.parse(section[key]);

export const beliefOf = (section: Record<string, unknown>): AboutBelief => ({
  eyebrow: read(section, "eyebrow"),
  heading: read(section, "heading"),
  paragraphs: paragraphsOf(read(section, "body")),
  quote: read(section, "quote"),
  card: { title: read(section, "cardTitle"), text: read(section, "cardText"), link: read(section, "cardLink") },
});

export const listenOf = (value: unknown): AboutListen => {
  const section = sectionObject(value);
  // The three steps keep their places: each has its own part (questions, the "your …" list, the example).
  const steps = Array.from({ length: 3 }, (_, index) => titledSchema.catch({ title: "", text: "" }).parse(Array.isArray(section.steps) ? section.steps[index] : undefined));
  return {
    ...beliefOf(section),
    steps,
    questions: listOf(section.questions, text).filter(Boolean),
    understand: listOf(section.understand, z.object({ label: text, value: text })).filter((item) => item.label || item.value),
    understandNote: read(section, "understandNote"),
    example: read(section, "example"),
  };
};

export const honestOf = (value: unknown): AboutHonest => {
  const section = sectionObject(value);
  return {
    ...beliefOf(section),
    adviceHeading: read(section, "adviceHeading"),
    advice: listOf(section.advice, z.object({ quote: text, who: text })).filter((item) => item.quote),
    points: titledList(section.points),
  };
};

export const safetyOf = (value: unknown): AboutSafety => {
  const section = sectionObject(value);
  return { eyebrow: read(section, "eyebrow"), heading: read(section, "heading"), facts: titledList(section.facts) };
};

/** A field of a saved section, trimmed ("" when missing). */
export const fieldOf = read;

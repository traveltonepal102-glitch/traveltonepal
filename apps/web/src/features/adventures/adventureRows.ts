import { z } from "zod";

import { coverImage } from "@/lib/images";
import type { WebAdventureRow, WebAdventureSectionRow } from "@/lib/supabase/database.types";

import type { Adventure, AdventuresSection, AdventureStep } from "./types";

/** "How it works" as saved; a step without a title is left out, anything unreadable gives no steps. */
const stepsSchema = z
  .array(z.object({ title: z.string().catch(""), text: z.string().catch("") }).catch({ title: "", text: "" }))
  .catch([]);

const toSteps = (value: unknown): AdventureStep[] =>
  stepsSchema
    .parse(value)
    .map((step) => ({ title: step.title.trim(), text: step.text.trim() }))
    .filter((step) => step.title);

/** A web_adventures row as its card shows it; null without a usable photo (the card needs one). */
export const toAdventure = (row: WebAdventureRow, photosBaseUrl: string): Adventure | null => {
  const photo = coverImage(row, photosBaseUrl, row.title, row.photo_alt.trim() || row.title);
  if (!photo) return null;
  return { id: row.id, title: row.title.trim(), tag: row.tag.trim() || undefined, summary: row.summary.trim(), photo };
};

/** The section with its cards in carousel order (position, then title); null when its row is missing. */
export const toAdventuresSection = (
  section: WebAdventureSectionRow | null,
  rows: readonly WebAdventureRow[],
  photosBaseUrl: string,
): AdventuresSection | null => {
  if (!section) return null;
  const adventures = [...rows]
    .sort((a, b) => a.position - b.position || a.title.localeCompare(b.title))
    .map((row) => toAdventure(row, photosBaseUrl))
    .filter((adventure) => adventure !== null);

  return {
    eyebrow: section.eyebrow.trim(),
    heading: section.heading.trim(),
    intro: section.intro.trim(),
    askTitle: section.ask_title.trim(),
    askText: section.ask_text.trim(),
    stepsTitle: section.steps_title.trim(),
    steps: toSteps(section.steps),
    note: section.note.trim(),
    adventures,
  };
};

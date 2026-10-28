import { z } from "zod";

import { EMPTY_RICH_TEXT, isRichTextEmpty, richTextDocSchema } from "@/lib/richText/richText";
import type { RichTextDoc } from "@/lib/richText/richText";

import type { AboutPageValues } from "../aboutTypes";
import { ABOUT_PHOTO_SLOT_COUNT, ABOUT_ROWS as ROWS } from "../constants";
import type { SitePage } from "../types";

/**
 * The About page's saved `content` as the form's values, and back. Lenient: a missing or broken part becomes empty
 * and every fixed list gets its full number of rows, so an old or hand-edited row still opens in the editor.
 */
const text = z.string().catch("");

/** Exactly `count` items: unreadable ones become `empty`, missing ones are added. */
const fixed = <T>(item: z.ZodType<T>, count: number, empty: T) =>
  z
    .array(z.unknown())
    .catch([])
    .transform((items) => Array.from({ length: count }, (_, index) => item.safeParse(items[index]).data ?? empty));

const EMPTY_TITLED = { title: "", text: "" };
const titled = z.object({ title: text, text });
const titledRows = (count: number) => fixed(titled, count, EMPTY_TITLED);

const belief = { eyebrow: text, heading: text, body: text, quote: text, cardTitle: text, cardText: text, cardLink: text };

/** A section's object, or every field empty when it is missing. */
const section = <Shape extends z.ZodRawShape>(shape: Shape) => {
  const schema = z.object(shape);
  return schema.catch(() => schema.parse({}));
};

const aboutFields = z.object({
  trekkersGuided: text,
  statValue: text,
  statLabel: text,
  safetyLead: text,
  safetyText: text,
  listen: section({
    ...belief,
    steps: titledRows(ROWS.listenSteps),
    questions: fixed(text, ROWS.questions, ""),
    understand: fixed(z.object({ label: text, value: text }), ROWS.understand, { label: "", value: "" }),
    understandNote: text,
    example: text,
  }),
  honest: section({
    ...belief,
    adviceHeading: text,
    advice: fixed(z.object({ quote: text, who: text }), ROWS.advice, { quote: "", who: "" }),
    points: titledRows(ROWS.honestPoints),
  }),
  flexible: section({ ...belief, quoteNote: text, photoCaption: text, stagesHeading: text, stages: titledRows(ROWS.stages), limitsLead: text, limitsText: text }),
  openMind: section({
    ...belief,
    more: text,
    quoteNote: text,
    places: titledRows(ROWS.places),
    inviteHeading: text,
    invites: titledRows(ROWS.invites),
    inviteNote: text,
  }),
  safety: section({ eyebrow: text, heading: text, facts: titledRows(ROWS.safetyFacts) }),
  storyHeading: text,
  storyText: z.unknown().optional(),
  storyTeaser: text,
  quote: text,
  founderOrigin: text,
  goals: titledRows(ROWS.goals),
  voiceEyebrow: text,
  voiceHeading: text,
  voiceText: text,
  promises: z
    .array(z.unknown())
    .catch([])
    .transform((items) => items.flatMap((entry) => z.object({ icon: text, title: text, text }).safeParse(entry).data ?? [])),
  teamHeading: text,
  teamIntro: text,
  licencesHeading: text,
  licencesIntro: text,
});
const aboutContent = aboutFields.catch(() => aboutFields.parse({}));

/** A rich text document, or plain paragraphs saved before it became one. */
const toRichText = (value: unknown): RichTextDoc => {
  if (typeof value === "string") {
    const paragraphs = value.split(/\n\s*\n/).map((paragraph) => paragraph.trim()).filter(Boolean);
    return paragraphs.length ? { type: "doc", content: paragraphs.map((paragraph) => ({ type: "paragraph", content: [{ type: "text", text: paragraph }] })) } : EMPTY_RICH_TEXT;
  }
  const doc = richTextDocSchema.safeParse(value);
  return doc.success && !isRichTextEmpty(doc.data) ? doc.data : EMPTY_RICH_TEXT;
};

export const toAboutValues = (page: SitePage): AboutPageValues => {
  const { storyText, ...content } = aboutContent.parse(page.content ?? {});
  return {
    ...page.top,
    ...content,
    storyText: toRichText(storyText),
    founderAuthorId: page.founderAuthorId,
    photoIds: Array.from({ length: ABOUT_PHOTO_SLOT_COUNT }, (_, index) => page.photoSlots[index]?.id ?? null),
  };
};

/** The About form's values as the page's saved `content` (the website reads these keys; photos are saved apart). */
export const aboutContentOf = (values: AboutPageValues) => ({
  trekkersGuided: values.trekkersGuided,
  statValue: values.statValue,
  statLabel: values.statLabel,
  safetyLead: values.safetyLead,
  safetyText: values.safetyText,
  listen: values.listen,
  honest: values.honest,
  flexible: values.flexible,
  openMind: values.openMind,
  safety: values.safety,
  storyHeading: values.storyHeading,
  storyText: values.storyText,
  storyTeaser: values.storyTeaser,
  quote: values.quote,
  founderOrigin: values.founderOrigin,
  goals: values.goals,
  voiceEyebrow: values.voiceEyebrow,
  voiceHeading: values.voiceHeading,
  voiceText: values.voiceText,
  promises: values.promises,
  teamHeading: values.teamHeading,
  teamIntro: values.teamIntro,
  licencesHeading: values.licencesHeading,
  licencesIntro: values.licencesIntro,
});

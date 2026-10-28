import { z } from "zod";

import { readText, text } from "@/lib/forms/formFields";
import { richTextField } from "@/lib/richText/richText";

import { ABOUT_PHOTO_SLOT_COUNT, ABOUT_ROWS as ROWS, PAGE_LIMITS as LIMIT, PROMISE_ICONS, PROMISE_ROWS } from "../constants";
import type { AboutPageValues } from "../types";
import { optionalId, optionalRows, pageTopFields, readPageTop, readRows } from "./pageTopSchema";

const promise = z.object({
  icon: z.string().refine((icon) => PROMISE_ICONS.some((choice) => choice.value === icon), "Pick an icon."),
  title: text(LIMIT.promiseTitle),
  text: text(LIMIT.promiseText),
});

const titled = z.object({ title: text(LIMIT.itemTitle), text: text(LIMIT.itemText) });
/** Exactly `count` rows (the design's number); an empty one is left out on the website. */
const rows = <Row extends z.ZodType>(row: Row, count: number) => z.array(row).length(count);

const belief = {
  eyebrow: text(LIMIT.beliefEyebrow),
  heading: text(LIMIT.beliefHeading),
  body: text(LIMIT.beliefBody),
  quote: text(LIMIT.beliefQuote),
  cardTitle: text(LIMIT.cardTitle),
  cardText: text(LIMIT.cardText),
  cardLink: text(LIMIT.cardLink),
};

/** Pages › About, checked on the server before saving. Field names are the paths ("listen.steps.0.title"). */
export const aboutPageSchema = z.object({
  ...pageTopFields,
  trekkersGuided: text(LIMIT.trekkersGuided),
  statValue: text(LIMIT.statValue),
  statLabel: text(LIMIT.statLabel),
  safetyLead: text(LIMIT.safetyLine),
  safetyText: text(LIMIT.safetyLine),
  listen: z.object({
    ...belief,
    steps: rows(titled, ROWS.listenSteps),
    questions: rows(text(LIMIT.itemTitle), ROWS.questions),
    understand: rows(z.object({ label: text(LIMIT.itemLabel), value: text(LIMIT.itemLabel) }), ROWS.understand),
    understandNote: text(LIMIT.note),
    example: text(LIMIT.note),
  }),
  honest: z.object({
    ...belief,
    adviceHeading: text(LIMIT.beliefHeading),
    advice: rows(z.object({ quote: text(LIMIT.itemText), who: text(LIMIT.itemTitle) }), ROWS.advice),
    points: rows(titled, ROWS.honestPoints),
  }),
  flexible: z.object({
    ...belief,
    quoteNote: text(LIMIT.quoteNote),
    photoCaption: text(LIMIT.itemTitle),
    stagesHeading: text(LIMIT.beliefHeading),
    stages: rows(titled, ROWS.stages),
    limitsLead: text(LIMIT.itemTitle),
    limitsText: text(LIMIT.note),
  }),
  openMind: z.object({
    ...belief,
    more: text(LIMIT.beliefBody),
    quoteNote: text(LIMIT.quoteNote),
    places: rows(titled, ROWS.places),
    inviteHeading: text(LIMIT.beliefHeading),
    invites: rows(titled, ROWS.invites),
    inviteNote: text(LIMIT.note),
  }),
  safety: z.object({ eyebrow: text(LIMIT.beliefEyebrow), heading: text(LIMIT.beliefHeading), facts: rows(titled, ROWS.safetyFacts) }),
  storyHeading: text(LIMIT.beliefHeading),
  storyText: richTextField(LIMIT.storyText),
  storyTeaser: text(LIMIT.storyTeaser),
  quote: text(LIMIT.quote),
  founderAuthorId: optionalId,
  founderOrigin: text(LIMIT.founderOrigin),
  goals: rows(titled, ROWS.goals),
  voiceEyebrow: text(LIMIT.beliefEyebrow),
  voiceHeading: text(LIMIT.beliefHeading),
  voiceText: text(LIMIT.beliefBody),
  photoIds: z.array(optionalId).length(ABOUT_PHOTO_SLOT_COUNT),
  promises: optionalRows(promise, PROMISE_ROWS, "Give the promise a title, or clear its text."),
  teamHeading: text(LIMIT.sectionHeading),
  teamIntro: text(LIMIT.sectionIntro),
  licencesHeading: text(LIMIT.sectionHeading),
  licencesIntro: text(LIMIT.sectionIntro),
}) satisfies z.ZodType<AboutPageValues, unknown>;

/** `count` rows of `keys`, sent as "<base>.<row>.<key>". */
const readFixedRows = <Key extends string>(formData: FormData, base: string, count: number, keys: readonly Key[]) =>
  Array.from({ length: count }, (_, row) => Object.fromEntries(keys.map((key) => [key, readText(formData, `${base}.${row}.${key}`)])) as Record<Key, string>);

/** `count` single lines, sent as "<base>.<row>". */
const readLines = (formData: FormData, base: string, count: number) => Array.from({ length: count }, (_, row) => readText(formData, `${base}.${row}`));

const readFields = <Key extends string>(formData: FormData, base: string, keys: readonly Key[]) =>
  Object.fromEntries(keys.map((key) => [key, readText(formData, `${base}.${key}`)])) as Record<Key, string>;

const BELIEF_KEYS = ["eyebrow", "heading", "body", "quote", "cardTitle", "cardText", "cardLink"] as const;
const TITLED = ["title", "text"] as const;

/** The About form's FormData as the schema expects it. */
export const readAboutForm = (formData: FormData) => ({
  ...readPageTop(formData),
  trekkersGuided: readText(formData, "trekkersGuided"),
  statValue: readText(formData, "statValue"),
  statLabel: readText(formData, "statLabel"),
  safetyLead: readText(formData, "safetyLead"),
  safetyText: readText(formData, "safetyText"),
  listen: {
    ...readFields(formData, "listen", [...BELIEF_KEYS, "understandNote", "example"]),
    steps: readFixedRows(formData, "listen.steps", ROWS.listenSteps, TITLED),
    questions: readLines(formData, "listen.questions", ROWS.questions),
    understand: readFixedRows(formData, "listen.understand", ROWS.understand, ["label", "value"]),
  },
  honest: {
    ...readFields(formData, "honest", [...BELIEF_KEYS, "adviceHeading"]),
    advice: readFixedRows(formData, "honest.advice", ROWS.advice, ["quote", "who"]),
    points: readFixedRows(formData, "honest.points", ROWS.honestPoints, TITLED),
  },
  flexible: {
    ...readFields(formData, "flexible", [...BELIEF_KEYS, "quoteNote", "photoCaption", "stagesHeading", "limitsLead", "limitsText"]),
    stages: readFixedRows(formData, "flexible.stages", ROWS.stages, TITLED),
  },
  openMind: {
    ...readFields(formData, "openMind", [...BELIEF_KEYS, "more", "quoteNote", "inviteHeading", "inviteNote"]),
    places: readFixedRows(formData, "openMind.places", ROWS.places, TITLED),
    invites: readFixedRows(formData, "openMind.invites", ROWS.invites, TITLED),
  },
  safety: { ...readFields(formData, "safety", ["eyebrow", "heading"]), facts: readFixedRows(formData, "safety.facts", ROWS.safetyFacts, TITLED) },
  storyHeading: readText(formData, "storyHeading"),
  storyText: readText(formData, "storyText"),
  storyTeaser: readText(formData, "storyTeaser"),
  quote: readText(formData, "quote"),
  founderAuthorId: readText(formData, "founderAuthorId"),
  founderOrigin: readText(formData, "founderOrigin"),
  goals: readFixedRows(formData, "goals", ROWS.goals, TITLED),
  voiceEyebrow: readText(formData, "voiceEyebrow"),
  voiceHeading: readText(formData, "voiceHeading"),
  voiceText: readText(formData, "voiceText"),
  photoIds: readLines(formData, "photoIds", ABOUT_PHOTO_SLOT_COUNT),
  promises: readRows(formData, "promise", ["icon", "title", "text"] as const),
  teamHeading: readText(formData, "teamHeading"),
  teamIntro: readText(formData, "teamIntro"),
  licencesHeading: readText(formData, "licencesHeading"),
  licencesIntro: readText(formData, "licencesIntro"),
});

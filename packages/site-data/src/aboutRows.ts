import { photoAltText } from "@ttn/ui/lib/photos";
import { z } from "zod";

import type { SiteImageSource } from "./images";
import { listOf } from "./jsonList";

/** A short title with a line of text (steps, goals, facts…). Empty ones are left out. */
export type TitledText = { title: string; text: string };

/** One of the four beliefs: its card in the overview, and its own section (design: About.dc.html). */
export type AboutBelief = {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  quote: string;
  card: { title: string; text: string; link: string };
};

export type AboutListen = AboutBelief & {
  /** Always three (listen, understand, suggest), each shown when it has a title. */
  steps: TitledText[];
  questions: string[];
  understand: { label: string; value: string }[];
  understandNote: string;
  example: string;
};

export type AboutHonest = AboutBelief & { adviceHeading: string; advice: { quote: string; who: string }[]; points: TitledText[] };

export type AboutFlexible = AboutBelief & {
  quoteNote: string;
  photo?: SiteImageSource;
  photoCaption: string;
  stagesHeading: string;
  stages: TitledText[];
  limits: { lead: string; text: string };
};

export type AboutPlace = TitledText & { photo: SiteImageSource };

export type AboutOpenMind = AboutBelief & {
  more: string[];
  quoteNote: string;
  /** Only the villages with a photo. */
  places: AboutPlace[];
  inviteHeading: string;
  invites: TitledText[];
  inviteNote: string;
};

export type AboutSafety = { eyebrow: string; heading: string; facts: TitledText[] };

/**
 * The four beliefs and the safety band as saved in Pages › About (`content`), read leniently: a missing part is
 * empty and an empty item is left out, so a half-filled page still shows what it has.
 */
export const text = z.string().trim().catch("");

/** Paragraphs of a short text typed in a plain text box: each line is one (an Enter starts a new paragraph). */
export const linesOf = (value: string) =>
  value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

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

const pagePhotoSchema = z.object({
  id: z.string().min(1),
  variant_widths: z.array(z.number()).min(1),
  file_name: z.string().nullable().catch(null),
  placeholder: z.string().nullable().catch(null),
  place: z.string().nullable().catch(null),
  position: z.number().int(),
});

/** The page's photos by place (site_page_photos.position): 1 the founder, 2 "flexible", 3–5 the villages. */
export const PHOTO_PLACES = { founder: 1, flexible: 2, places: [3, 4, 5] } as const;

/** A function giving the photo at a place, described by `alt` (or by where it was taken). */
export const photosByPlace = (value: unknown, photosBaseUrl: string, siteName: string) => {
  const photos = listOf(value, pagePhotoSchema);
  return (position: number, alt: string): SiteImageSource | undefined => {
    const photo = photos.find((item) => item.position === position);
    if (!photo) return undefined;
    return {
      src: `${photosBaseUrl}/${photo.id}`,
      alt: alt || photoAltText({ place: photo.place ?? "" }, siteName),
      variantWidths: photo.variant_widths,
      fileName: photo.file_name || undefined,
      placeholder: photo.placeholder || undefined,
    };
  };
};

export type PhotoAt = ReturnType<typeof photosByPlace>;

export const flexibleOf = (value: unknown, photoAt: PhotoAt): AboutFlexible => {
  const section = sectionObject(value);
  const photoCaption = fieldOf(section, "photoCaption");
  return {
    ...beliefOf(section),
    quoteNote: fieldOf(section, "quoteNote"),
    photo: photoAt(PHOTO_PLACES.flexible, photoCaption),
    photoCaption,
    stagesHeading: fieldOf(section, "stagesHeading"),
    stages: titledList(section.stages),
    limits: { lead: fieldOf(section, "limitsLead"), text: fieldOf(section, "limitsText") },
  };
};

export const openMindOf = (value: unknown, photoAt: PhotoAt): AboutOpenMind => {
  const section = sectionObject(value);
  const places = listOf(section.places, z.object({ title: text, text }).catch({ title: "", text: "" }));
  return {
    ...beliefOf(section),
    more: paragraphsOf(fieldOf(section, "more")),
    quoteNote: fieldOf(section, "quoteNote"),
    // A village shows with its photo only (the photo places follow the villages' order).
    places: PHOTO_PLACES.places.flatMap((position, index) => {
      const place = places[index];
      const photo = place?.title ? photoAt(position, `${place.title}: ${place.text}`) : undefined;
      return place && photo ? [{ ...place, photo }] : [];
    }),
    inviteHeading: fieldOf(section, "inviteHeading"),
    invites: titledList(section.invites),
    inviteNote: fieldOf(section, "inviteNote"),
  };
};

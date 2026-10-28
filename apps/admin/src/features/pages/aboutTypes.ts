import type { RichTextDoc } from "@/lib/richText/richText";

import type { PageTopValues, PromiseValues } from "./types";

/** A short title with a line of text (steps, goals, facts…). */
export type TitledText = { title: string; text: string };

/**
 * One of the four beliefs (design: About.dc.html): its card in the overview under the top of the page, and its own
 * section further down. `body`: paragraphs, separated by an empty line.
 */
export type AboutBelief = {
  eyebrow: string;
  heading: string;
  body: string;
  quote: string;
  cardTitle: string;
  cardText: string;
  cardLink: string;
};

/** 01 "We listen first": three steps (listen, understand, suggest), each with its own part. */
export type AboutListen = AboutBelief & {
  steps: TitledText[];
  questions: string[];
  understand: { label: string; value: string }[];
  understandNote: string;
  example: string;
};

/** 02 "Honest and proactive": advice we give, and when we tell you. */
export type AboutHonest = AboutBelief & {
  adviceHeading: string;
  advice: { quote: string; who: string }[];
  points: TitledText[];
};

/** 03 "Private and flexible": a photo, the stages of a trek and where flexibility stops. */
export type AboutFlexible = AboutBelief & {
  quoteNote: string;
  photoCaption: string;
  stagesHeading: string;
  stages: TitledText[];
  limitsLead: string;
  limitsText: string;
};

/** 04 "An open mind": more text, three villages with photos, how we invite you in and the closing quote. */
export type AboutOpenMind = AboutBelief & {
  more: string;
  quoteNote: string;
  places: TitledText[];
  inviteHeading: string;
  invites: TitledText[];
  inviteNote: string;
};

/** "The one rule above all four": safety. */
export type AboutSafety = { eyebrow: string; heading: string; facts: TitledText[] };

/** Pages › About (the team is not here: it comes from Authors and Trekking guides). */
export type AboutPageValues = PageTopValues & {
  trekkersGuided: string;
  /** The fourth number under the heading, e.g. "All" · "Guides from their own valleys". */
  statValue: string;
  statLabel: string;
  /** The line under the four beliefs' cards: "All four rest on one rule:" "your safety comes first." */
  safetyLead: string;
  safetyText: string;
  listen: AboutListen;
  honest: AboutHonest;
  flexible: AboutFlexible;
  openMind: AboutOpenMind;
  safety: AboutSafety;
  storyHeading: string;
  /** Why the founder started the company, before the three goals. */
  storyText: RichTextDoc;
  /** The short version on every trek page. */
  storyTeaser: string;
  /** "Our voice"'s quote, by the founder. */
  quote: string;
  /** An office author: the founder (name and job title), also on trek pages. */
  founderAuthorId: string | null;
  /** Under the founder's name, e.g. "From Tanahun, near the Annapurna region". */
  founderOrigin: string;
  goals: TitledText[];
  voiceEyebrow: string;
  voiceHeading: string;
  voiceText: string;
  /** The page's photos by place (ABOUT_PHOTO_SLOTS); null for an empty place. */
  photoIds: (string | null)[];
  /** Not on the About page: every trek page's "Why book your trek with us". */
  promises: PromiseValues[];
  teamHeading: string;
  teamIntro: string;
  licencesHeading: string;
  licencesIntro: string;
};

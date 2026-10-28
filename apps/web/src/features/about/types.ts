import type { IconName } from "@ttn/ui/icon";
import type { RichTextDoc } from "@ttn/ui/lib/richText";

import type { IconTone } from "@/components/shared/iconTones";
import type { SitePageTop } from "@/features/site-pages/types";
import type { SiteImageSource } from "@/lib/images";

/** Not on the About page: every trek page's "Why book your trek with us" (kept in Pages › About). */
export type AboutPromise = { icon: IconName; tone: IconTone; title: string; text: string };

/** The founder, an office author picked in Pages › About (name and job title come from Authors). */
export type Founder = {
  name: string;
  /** First name, e.g. "Ask Sujan on WhatsApp". */
  shortName: string;
  role: string;
  /** Their author photo (round, on trek pages), with their consent. */
  photo?: SiteImageSource;
};

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

/** The About page as saved in the admin's Pages › About. */
export type AboutPageContent = {
  top: SitePageTop;
  /** Hero stat, e.g. "50+"; "" leaves the stat out. */
  trekkersGuided: string;
  /** The fourth hero stat, e.g. "All" · "Guides from their own valleys". */
  stat?: { value: string; label: string };
  /** Under the four beliefs' cards: "All four rest on one rule:" "your safety comes first." */
  safetyLine: { lead: string; text: string };
  listen: AboutListen;
  honest: AboutHonest;
  flexible: AboutFlexible;
  openMind: AboutOpenMind;
  safety: AboutSafety;
  story: {
    heading: string;
    /** Short version on every trek page ("Our heritage and roots"). */
    teaser: string;
    body: RichTextDoc;
    /** "Our voice"'s quote, by the founder. */
    quote: string;
    /** Under the founder's name, e.g. "From Tanahun, near the Annapurna region". */
    origin: string;
    photo?: SiteImageSource;
    goals: TitledText[];
    voice: { eyebrow: string; heading: string; paragraphs: string[] };
  };
  founder?: Founder;
  /** Every trek page's "Why book your trek with us" (not shown on the About page). */
  promises: AboutPromise[];
  /** The sections' headings and the lines under them, as typed in Pages › About ("" uses the design's wording). */
  headings: Record<"team" | "licences", SectionHeading>;
};

export type SectionHeading = { title: string; text: string };

export type TeamGroup = "office" | "guides";

/** One card in "Our guides and team". */
export type TeamMember = {
  id: string;
  name: string;
  role: string;
  place: string;
  languages: readonly string[];
  group: TeamGroup;
  photo?: SiteImageSource;
};

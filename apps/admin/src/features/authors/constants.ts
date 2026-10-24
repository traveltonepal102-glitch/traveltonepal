import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { AuthorKind, AuthorLanguage, AuthorValues } from "./types";

export const AUTHORS_PATH = ADMIN_SECTIONS.authors.href;
/** The list with an author's edit panel open (the panel lives on the list, as in the design). */
export const authorPath = (authorId: string) => `${AUTHORS_PATH}?author=${authorId}`;
export const NEW_AUTHOR_PATH = authorPath("new");

/** The admin edits English for now; the German text comes later (author_translations.locale). */
export const AUTHOR_LOCALE = "en";

/** Hard limits, the same as the database checks (supabase/migrations/20261024250000_authors.sql). */
export const AUTHOR_LIMITS = {
  name: 80,
  jobTitle: 80,
  bio: 300,
  topic: 40,
  link: 300,
} as const;

export const MAX_TOPICS = 10;
export const MAX_PROFILE_LINKS = 5;

/** "Who is this author?" (design order), with what each kind means. */
export const AUTHOR_KINDS: { value: AuthorKind; label: string; hint: string }[] = [
  { value: "office", label: "Office team", hint: "Works at Travel To Nepal. Gets the blue tick next to the name." },
  { value: "guide", label: "Trekking guide", hint: "Gets the blue tick. Their articles do not need a second check." },
  {
    value: "guest",
    label: "Guest writer",
    hint: "No blue tick. Every guest article must be checked by one of your trekking guides before it can be published.",
  },
];

export const AUTHOR_KIND_VALUES = ["office", "guide", "guest"] as const satisfies readonly AuthorKind[];

export const AUTHOR_LANGUAGES: { value: AuthorLanguage; label: string }[] = [
  { value: "en", label: "English" },
  { value: "de", label: "German" },
];

export const AUTHOR_LANGUAGE_VALUES = ["en", "de"] as const satisfies readonly AuthorLanguage[];

/** Offered while typing a topic; any other topic can be typed. */
export const TOPIC_SUGGESTIONS = ["Planning & permits", "Seasons & weather", "Health & altitude", "Gear & packing", "Food & teahouses", "Culture & festivals"];

/** A new author before anything is typed. */
export const EMPTY_AUTHOR_VALUES: AuthorValues = {
  kind: "office",
  guideId: null,
  name: "",
  photoConsent: false,
  jobTitle: "",
  writesIn: ["en"],
  topics: [],
  bio: "",
  profileLinks: [],
  showAuthorBox: true,
  showOnAbout: false,
};

import type { Photo } from "@/features/photos/types";
import type { AuthorKindValue } from "@/lib/supabase/database.types";

/** Office team, a trekking guide (photo, name and bio from Trekking guides) or a guest writer. */
export type AuthorKind = AuthorKindValue;

/** The travel guide languages an author can be picked on. */
export type AuthorLanguage = "en" | "de";

/** Everything the author form saves (one language for the text). */
export type AuthorValues = {
  kind: AuthorKind;
  /** Only for kind "guide". */
  guideId: string | null;
  /** Not for kind "guide" (theirs comes from Trekking guides). */
  name: string;
  /** The person agreed that we show their photo and name. */
  photoConsent: boolean;
  /** Under the name in the byline. */
  jobTitle: string;
  writesIn: AuthorLanguage[];
  /** Suggests the author first in the travel guide editor; never on the website. */
  topics: string[];
  /** The author box under the article (not for kind "guide"). */
  bio: string;
  /** For Google only; the first is the main link. */
  profileLinks: string[];
  showAuthorBox: boolean;
  /** Office team only. */
  showOnAbout: boolean;
};

export type Author = AuthorValues & {
  id: string;
  photo: Photo | null;
  updatedAt: string;
};

/** What the form's Save sends (checked by authorSchema). */
export type AuthorFormValues = AuthorValues & { photoId: string | null };

/** A trekking guide as the author form offers them (and where a guide author's photo, name and bio come from). */
export type AuthorGuide = {
  id: string;
  name: string;
  photo: Photo | null;
  bio: string;
  /** The guide agreed to be shown (needed to be picked). */
  hasConsent: boolean;
};

/** An author as the website shows them: a guide author's photo, name and bio come from their guide. */
export type AuthorPerson = { name: string; photo: Photo | null; bio: string };

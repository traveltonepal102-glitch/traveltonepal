import { AUTHOR_KINDS } from "../constants";
import type { Author, AuthorGuide, AuthorKind, AuthorLanguage, AuthorPerson, AuthorValues } from "../types";

/** Office team and trekking guides get the blue tick next to their name; guest writers don't. */
export const isVerified = (kind: AuthorKind) => kind !== "guest";

export const kindLabel = (kind: AuthorKind) => AUTHOR_KINDS.find((option) => option.value === kind)?.label ?? kind;

/** The author as the website shows them: a guide author's photo, name and bio come from their guide. */
export const authorPerson = (
  author: Pick<AuthorValues, "kind" | "guideId" | "name" | "bio"> & { photo: AuthorPerson["photo"] },
  guides: AuthorGuide[],
): AuthorPerson => {
  if (author.kind !== "guide") return { name: author.name, photo: author.photo, bio: author.bio };
  const guide = guides.find((item) => item.id === author.guideId);
  return { name: guide?.name ?? "", photo: guide?.photo ?? null, bio: guide?.bio ?? "" };
};

/** "Pemba" from "Pemba Tamang", for "More guides by Pemba". */
export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

export type AuthorFilters = { query: string; kind: AuthorKind | ""; language: AuthorLanguage | "" };

export const NO_AUTHOR_FILTERS: AuthorFilters = { query: "", kind: "", language: "" };

/**
 * The authors matching the search (name, job title or topic), the kind and the language they write in, A–Z by
 * the name shown (a guide author's comes from their guide).
 */
export const filterAuthors = (authors: Author[], guides: AuthorGuide[], { query, kind, language }: AuthorFilters) => {
  const words = query.trim().toLowerCase();
  return authors
    .map((author) => ({ author, name: authorPerson(author, guides).name }))
    .filter(
      ({ author, name }) =>
        (!words || [name, author.jobTitle, ...author.topics].some((text) => text.toLowerCase().includes(words))) &&
        (!kind || author.kind === kind) &&
        (!language || author.writesIn.includes(language)),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(({ author }) => author);
};

import { AUTHOR_KIND_VALUES } from "../constants";
import { readAuthorForm } from "../schemas/authorSchema";
import type { AuthorKind, AuthorValues } from "../types";

/** What the byline and author box preview need from the form while it is being typed (the photo comes from its field). */
export type AuthorDraft = Pick<AuthorValues, "kind" | "guideId" | "name" | "jobTitle" | "bio" | "showAuthorBox">;

const isKind = (value: string): value is AuthorKind => (AUTHOR_KIND_VALUES as readonly string[]).includes(value);

/** The form as typed so far, read leniently for the preview. Never used to save. */
export const draftFromAuthorForm = (formData: FormData): AuthorDraft => {
  const raw = readAuthorForm(formData);
  return {
    kind: isKind(raw.kind) ? raw.kind : "office",
    guideId: raw.guideId || null,
    name: raw.name.trim(),
    jobTitle: raw.jobTitle.trim(),
    bio: raw.bio.trim(),
    showAuthorBox: raw.showAuthorBox === "on",
  };
};

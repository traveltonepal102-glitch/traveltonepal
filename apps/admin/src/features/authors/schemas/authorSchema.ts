import { z } from "zod";

import { readList, readText, requiredText, text } from "@/lib/forms/formFields";
import { normalizeHref } from "@/lib/richText/richText";

import { AUTHOR_KIND_VALUES, AUTHOR_LANGUAGE_VALUES, AUTHOR_LIMITS as LIMIT, MAX_PROFILE_LINKS, MAX_TOPICS } from "../constants";
import type { AuthorFormValues } from "../types";

const isOn = z.string().transform((value) => value === "on");

const isWebAddress = (value: string) => {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) && url.hostname.includes(".");
  } catch {
    return false;
  }
};

/** A profile link as pasted ("linkedin.com/in/…" gets https://); "" for an empty row. */
const linkField = z
  .string()
  .trim()
  .max(LIMIT.link, `Use ${LIMIT.link} characters or fewer.`)
  .transform(normalizeHref)
  .refine((value) => !value || isWebAddress(value), "Paste a full web address, e.g. https://www.linkedin.com/in/…");

/** Topics as typed: each once (ignoring case), up to 10. */
const topicsField = z
  .array(text(LIMIT.topic))
  .transform((topics) => topics.filter((topic, index) => topic && topics.findIndex((other) => other.toLowerCase() === topic.toLowerCase()) === index))
  .refine((topics) => topics.length <= MAX_TOPICS, `Up to ${MAX_TOPICS} topics.`);

const optionalId = (message: string) =>
  z
    .string()
    .transform((value) => value || null)
    .pipe(z.uuid(message).nullable());

/**
 * The author form (read with readAuthorForm). Checked again on the server before saving. A trekking guide
 * author keeps only what the guide record doesn't have; the others need a name and their consent.
 */
export const authorSchema = z
  .object({
    kind: z.enum(AUTHOR_KIND_VALUES, "Pick who this author is."),
    guideId: optionalId("Pick the trekking guide from the list."),
    name: text(LIMIT.name),
    photoConsent: isOn,
    jobTitle: requiredText(LIMIT.jobTitle, "Enter the job title shown under the name."),
    writesIn: z
      .array(z.enum(AUTHOR_LANGUAGE_VALUES, "Pick English or German."))
      .transform((languages) => [...new Set(languages)])
      .refine((languages) => languages.length > 0, "Pick the language they write in."),
    topics: topicsField,
    bio: text(LIMIT.bio),
    profileLinks: z.array(linkField).max(MAX_PROFILE_LINKS, `Up to ${MAX_PROFILE_LINKS} links.`),
    /** The main link's row number in profileLinks. */
    mainLink: z.string(),
    showAuthorBox: isOn,
    showOnAbout: isOn,
    photoId: optionalId("The photo couldn't be read. Reload the page and try again."),
  })
  .superRefine((author, context) => {
    const issue = (path: string, message: string) => context.addIssue({ code: "custom", path: [path], message });
    if (author.kind === "guide") {
      if (!author.guideId) issue("guideId", "Pick the trekking guide.");
      return;
    }
    if (!author.name) issue("name", "Enter the author's full name.");
    if (!author.photoConsent) issue("photoConsent", "Tick this once they have agreed: their name and photo show on every travel guide they write.");
  })
  .transform(({ mainLink, ...author }): AuthorFormValues => {
    const main = author.profileLinks[Number(mainLink)] ?? "";
    const links = [main, ...author.profileLinks].filter((link, index, all) => link && all.indexOf(link) === index);
    const isGuide = author.kind === "guide";
    return {
      ...author,
      guideId: isGuide ? author.guideId : null,
      // A guide author's photo, name, bio and links come from Trekking guides.
      name: isGuide ? "" : author.name,
      photoId: isGuide ? null : author.photoId,
      photoConsent: isGuide ? false : author.photoConsent,
      bio: isGuide ? "" : author.bio,
      profileLinks: isGuide ? [] : links,
      showOnAbout: author.kind === "office" && author.showOnAbout,
    };
  }) satisfies z.ZodType<AuthorFormValues, unknown>;

/** The author form's FormData as the schema expects it. */
export const readAuthorForm = (formData: FormData) => ({
  kind: readText(formData, "kind"),
  guideId: readText(formData, "guideId"),
  name: readText(formData, "name"),
  photoConsent: readText(formData, "photoConsent"),
  jobTitle: readText(formData, "jobTitle"),
  writesIn: readList(formData, "writesIn"),
  topics: readList(formData, "topic"),
  bio: readText(formData, "bio"),
  profileLinks: readList(formData, "profileLink"),
  mainLink: readText(formData, "mainLink"),
  showAuthorBox: readText(formData, "showAuthorBox"),
  showOnAbout: readText(formData, "showOnAbout"),
  photoId: readText(formData, "photoId"),
});

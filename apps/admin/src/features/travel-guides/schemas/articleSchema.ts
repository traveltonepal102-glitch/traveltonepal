import { z } from "zod";

import { calendarDate, readList, readTexts, requiredText, slugField, text } from "@/lib/forms/formFields";
import { canonicalPathField } from "@/lib/seo/canonicalPath";

import { ARTICLE_LIMITS as LIMIT, ARTICLE_STATUS_VALUES, ARTICLE_TOPIC_VALUES, FACT_ICON_VALUES, MAX_FACTS, MAX_RELATED } from "../constants";
import type { ArticleFormValues } from "../types";
import { monthsField } from "./monthsSchema";
import { sectionsField } from "./sectionsSchema";

const isOn = z.string().transform((value) => value === "on");

const optionalId = (message: string) =>
  z
    .string()
    .transform((value) => value || null)
    .pipe(z.uuid(message).nullable());

const idList = (message: string) => z.array(z.uuid(message)).transform((ids) => [...new Set(ids)]);

/** A key fact needs its label and value; an empty row is dropped. Errors keep the row's number. */
const factsField = z
  .array(
    z
      .object({ icon: z.enum(FACT_ICON_VALUES, "Pick an icon."), label: text(LIMIT.factLabel), value: text(LIMIT.factValue) })
      .refine((fact) => Boolean(fact.label) === Boolean(fact.value), { message: "Write the label and the value, or remove this fact.", path: ["value"] }),
  )
  .transform((facts) => facts.filter((fact) => fact.label))
  .refine((facts) => facts.length <= MAX_FACTS, `Up to ${MAX_FACTS} key facts.`);

/**
 * The travel guide form (read with readArticleForm). Checked again on the server before saving. Publishing
 * also needs what a live guide shows: the intro, the card text, the photo with its description, the author
 * and at least one section.
 */
export const articleSchema = z
  .object({
    title: requiredText(LIMIT.title, "Write the title."),
    intro: text(LIMIT.intro),
    cardText: text(LIMIT.cardText),
    coverPhotoId: optionalId("The photo couldn't be read. Reload the page and try again."),
    coverAlt: text(LIMIT.coverAlt),
    photoTrekId: optionalId("Pick the trek from the list."),
    highlightTag: text(LIMIT.highlightTag),
    updatedLine: text(LIMIT.updatedLine),
    facts: factsField,
    siteRegionId: optionalId("Pick the website from the list."),
    alsoOnMainSite: isOn,
    topic: z.enum(ARTICLE_TOPIC_VALUES, "Pick the topic."),
    slug: slugField("best-time-to-trek-langtang"),
    status: z.enum(ARTICLE_STATUS_VALUES, "Pick the status."),
    publishMode: z.enum(["now", "date"], "Pick when it goes live."),
    publishedOn: z.union([z.literal("").transform(() => null), calendarDate]),
    isBigUpdate: isOn,
    isFeatured: isOn,
    startHerePosition: z
      .string()
      .refine((value) => /^[1-6]?$/.test(value), "Pick a number from the list.")
      .transform((value) => (value ? Number(value) : null)),
    authorId: optionalId("Pick the author from the list."),
    checkerGuideId: optionalId("Pick the guide from the list."),
    mainTrekId: optionalId("Pick the trek from the list."),
    regionIds: idList("Pick the regions from the list."),
    relatedIds: idList("Pick the guides from the list.").refine((ids) => ids.length <= MAX_RELATED, `Pick up to ${MAX_RELATED} guides.`),
    sections: sectionsField,
    months: monthsField,
    seoKeyword: text(LIMIT.seoKeyword),
    seoTitle: text(LIMIT.seoTitle),
    seoDescription: text(LIMIT.seoDescription),
    sharePhotoId: optionalId("The photo couldn't be read. Reload the page and try again."),
    canonicalPath: canonicalPathField,
    hideFromGoogle: isOn,
  })
  .superRefine((article, context) => {
    const issue = (path: string, message: string) => context.addIssue({ code: "custom", path: [path], message });
    if (article.publishMode === "date" && !article.publishedOn) issue("publishedOn", "Pick the date it goes live.");
    if (article.status !== "published") return;
    if (!article.intro) issue("intro", "Write the intro before publishing.");
    if (!article.cardText) issue("cardText", "Write the card text before publishing.");
    if (!article.coverPhotoId) issue("coverPhotoId", "Add the photo before publishing.");
    else if (!article.coverAlt) issue("coverAlt", "Describe the photo before publishing.");
    if (!article.authorId) issue("authorId", "Pick who wrote it before publishing.");
    if (!article.sections.length) issue("sections", "Add at least one section to the article body before publishing.");
  })
  .transform((article): ArticleFormValues => ({
    ...article,
    alsoOnMainSite: article.alsoOnMainSite && article.siteRegionId !== null,
    // "As soon as I click Publish" keeps no chosen date (the database keeps the day it first went live).
    publishedOn: article.publishMode === "date" ? article.publishedOn : null,
  })) satisfies z.ZodType<ArticleFormValues, unknown>;

/** Key facts in FormData: factIcon, factLabel and factValue, one of each per row in order. */
const readFacts = (formData: FormData) => {
  const [labels, values] = ["factLabel", "factValue"].map((name) => readList(formData, name));
  return readList(formData, "factIcon").map((icon, index) => ({ icon, label: labels[index] ?? "", value: values[index] ?? "" }));
};

/** The travel guide form's FormData as the schema expects it ("sections": the article body as JSON). */
export const readArticleForm = (formData: FormData) => ({
  ...readTexts(formData, [
    "title",
    "intro",
    "cardText",
    "coverPhotoId",
    "coverAlt",
    "photoTrekId",
    "highlightTag",
    "updatedLine",
    "siteRegionId",
    "alsoOnMainSite",
    "topic",
    "slug",
    "status",
    "publishMode",
    "publishedOn",
    "isBigUpdate",
    "isFeatured",
    "startHerePosition",
    "authorId",
    "checkerGuideId",
    "mainTrekId",
    "seoKeyword",
    "seoTitle",
    "seoDescription",
    "sharePhotoId",
    "canonicalPath",
    "hideFromGoogle",
    "sections",
    "months",
  ]),
  facts: readFacts(formData),
  regionIds: readList(formData, "regionId"),
  relatedIds: readList(formData, "relatedId"),
});

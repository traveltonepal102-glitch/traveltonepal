import { z } from "zod";

import { optionalWholeNumber, readList, readText, requiredText, text } from "@/lib/forms/formFields";

import { GUIDE_BADGE_VALUES, GUIDE_CERTIFICATE_VALUES, GUIDE_LIMITS as LIMIT, MAX_LANGUAGES } from "../constants";
import type { TrekkingGuideFormValues } from "../types";

const isOn = z.string().transform((value) => value === "on");

/** "2027-03" (a month input) or "" for no end month. */
const monthField = (message: string) =>
  z
    .string()
    .trim()
    .refine((value) => !value || /^(20\d{2}|2100)-(0[1-9]|1[0-2])$/.test(value), message)
    .transform((value) => value || null);

/** Languages as typed: trimmed, each once (ignoring case), up to 10. */
const languagesField = z
  .array(text(LIMIT.language))
  .transform((languages) =>
    languages.filter((language, index) => language && languages.findIndex((other) => other.toLowerCase() === language.toLowerCase()) === index),
  )
  .refine((languages) => languages.length <= MAX_LANGUAGES, `Up to ${MAX_LANGUAGES} languages.`);

/**
 * The guide form (read with readGuideForm). Checked again on the server before saving. A guide shows on the
 * website only with their consent; an end month is kept only for a ticked certificate.
 */
export const guideSchema = z
  .object({
    name: requiredText(LIMIT.name, "Enter the guide's full name."),
    photoConsent: isOn,
    role: requiredText(LIMIT.role, "Enter the guide's role, e.g. Trek leader."),
    homeVillage: text(LIMIT.homeVillage),
    homeDistrict: text(LIMIT.homeDistrict),
    age: optionalWholeNumber({ min: 18, max: 90, label: "age" }),
    yearsGuiding: optionalWholeNumber({ min: 0, max: 60, label: "years guiding" }),
    badge: z.enum(GUIDE_BADGE_VALUES, "Pick the badge on the photo."),
    languages: languagesField,
    regionIds: z.array(z.uuid("Pick the regions from the list.")).transform((ids) => [...new Set(ids)]),
    licenceNumber: text(LIMIT.licenceNumber),
    licenceValidUntil: monthField("Pick the month the licence runs out."),
    certificates: z.array(z.enum(GUIDE_CERTIFICATE_VALUES, "Pick the training from the list.")).transform((items) => [...new Set(items)]),
    wfrValidUntil: monthField("Pick the month the WFR certificate runs out."),
    firstAidValidUntil: monthField("Pick the month the first aid certificate runs out."),
    bio: text(LIMIT.bio),
    quote: text(LIMIT.quote),
    showOnAbout: isOn,
    canLeadTreks: isOn,
    canFactCheck: isOn,
    photoId: z
      .string()
      .transform((value) => value || null)
      .pipe(z.uuid("The photo couldn't be read. Reload the page and try again.").nullable()),
  })
  .superRefine((guide, context) => {
    if (guide.photoConsent || !(guide.showOnAbout || guide.canLeadTreks || guide.canFactCheck)) return;
    context.addIssue({
      code: "custom",
      path: ["photoConsent"],
      message: "Tick this once the guide has agreed, or switch off every place this guide appears.",
    });
  })
  .transform((guide) => ({
    ...guide,
    wfrValidUntil: guide.certificates.includes("wfr") ? guide.wfrValidUntil : null,
    firstAidValidUntil: guide.certificates.includes("first_aid") ? guide.firstAidValidUntil : null,
  })) satisfies z.ZodType<TrekkingGuideFormValues, unknown>;

/** The guide form's FormData as the schema expects it. */
export const readGuideForm = (formData: FormData) => ({
  name: readText(formData, "name"),
  photoConsent: readText(formData, "photoConsent"),
  role: readText(formData, "role"),
  homeVillage: readText(formData, "homeVillage"),
  homeDistrict: readText(formData, "homeDistrict"),
  age: readText(formData, "age"),
  yearsGuiding: readText(formData, "yearsGuiding"),
  badge: readText(formData, "badge"),
  languages: readList(formData, "language"),
  regionIds: readList(formData, "regionId"),
  licenceNumber: readText(formData, "licenceNumber"),
  licenceValidUntil: readText(formData, "licenceValidUntil"),
  certificates: readList(formData, "certificate"),
  wfrValidUntil: readText(formData, "wfrValidUntil"),
  firstAidValidUntil: readText(formData, "firstAidValidUntil"),
  bio: readText(formData, "bio"),
  quote: readText(formData, "quote"),
  showOnAbout: readText(formData, "showOnAbout"),
  canLeadTreks: readText(formData, "canLeadTreks"),
  canFactCheck: readText(formData, "canFactCheck"),
  photoId: readText(formData, "photoId"),
});

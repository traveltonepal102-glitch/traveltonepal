import { z } from "zod";

import { optionalWholeNumber, readList, readText, requiredText, text } from "@/lib/forms/formFields";

import { GUIDE_LIMITS as LIMIT, MAX_LANGUAGES, SPECIALTY_ICON_VALUES } from "../constants";
import type { TrekkingGuideFormValues } from "../types";

const isOn = z.string().transform((value) => value === "on");

/** "2027-03" (a month input) or "" for no end month. */
const monthField = z
  .string()
  .trim()
  .refine((value) => !value || /^(20\d{2}|2100)-(0[1-9]|1[0-2])$/.test(value), "Pick the month the licence runs out.")
  .transform((value) => value || null);

/** Languages as typed: trimmed, each once (ignoring case), up to 10. */
const languagesField = z
  .array(text(LIMIT.language))
  .transform((languages) =>
    languages.filter((language, index) => language && languages.findIndex((other) => other.toLowerCase() === language.toLowerCase()) === index),
  )
  .refine((languages) => languages.length <= MAX_LANGUAGES, `Up to ${MAX_LANGUAGES} languages.`);

/** The guide form (read with readGuideForm). Checked again on the server before saving. */
export const guideSchema = z.object({
  name: requiredText(LIMIT.name, "Enter the guide's full name."),
  role: requiredText(LIMIT.role, "Enter the guide's role, e.g. Trek leader."),
  home: text(LIMIT.home),
  age: optionalWholeNumber({ min: 18, max: 90, label: "age" }),
  yearsGuiding: optionalWholeNumber({ min: 0, max: 60, label: "years guiding" }),
  specialty: text(LIMIT.specialty),
  specialtyIcon: z.enum(SPECIALTY_ICON_VALUES, "Pick an icon."),
  languages: languagesField,
  regionIds: z.array(z.uuid("Pick the regions from the list.")).transform((ids) => [...new Set(ids)]),
  licenceNumber: text(LIMIT.licenceNumber),
  licenceValidUntil: monthField,
  firstAid: z.enum(["wfr", "basic", "none"], "Pick the first aid training."),
  bio: text(LIMIT.bio),
  quote: text(LIMIT.quote),
  showOnAbout: isOn,
  canLeadTreks: isOn,
  canFactCheck: isOn,
  photoId: z
    .string()
    .transform((value) => value || null)
    .pipe(z.uuid("The photo couldn't be read. Reload the page and try again.").nullable()),
}) satisfies z.ZodType<TrekkingGuideFormValues, unknown>;

/** The guide form's FormData as the schema expects it. */
export const readGuideForm = (formData: FormData) => ({
  name: readText(formData, "name"),
  role: readText(formData, "role"),
  home: readText(formData, "home"),
  age: readText(formData, "age"),
  yearsGuiding: readText(formData, "yearsGuiding"),
  specialty: readText(formData, "specialty"),
  specialtyIcon: readText(formData, "specialtyIcon"),
  languages: readList(formData, "language"),
  regionIds: readList(formData, "regionId"),
  licenceNumber: readText(formData, "licenceNumber"),
  licenceValidUntil: readText(formData, "licenceValidUntil"),
  firstAid: readText(formData, "firstAid"),
  bio: readText(formData, "bio"),
  quote: readText(formData, "quote"),
  showOnAbout: readText(formData, "showOnAbout"),
  canLeadTreks: readText(formData, "canLeadTreks"),
  canFactCheck: readText(formData, "canFactCheck"),
  photoId: readText(formData, "photoId"),
});

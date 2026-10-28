import { z } from "zod";

import { optionalWholeNumber, readList, readText, text } from "@/lib/forms/formFields";

import { MAX_MEMBERSHIPS, MAX_REPLY_LANGUAGES, SETTINGS_LIMITS as LIMIT } from "../constants";
import type { SiteSettingsValues } from "../types";

const time = (label: string) => z.string().trim().regex(/^([01]\d|2[0-3]):[0-5]\d$/, `Pick the time the office ${label}.`);

/** A list of short texts, each once (ignoring case), up to `max`. */
const shortList = (max: number) =>
  z
    .array(text(LIMIT.item))
    .transform((items) => items.filter((item, index) => item && items.findIndex((other) => other.toLowerCase() === item.toLowerCase()) === index))
    .refine((items) => items.length <= max, `Up to ${max}.`);

/** A profile link: empty, or a full https:// address (the website links to it). */
const profileLink = z
  .string()
  .trim()
  .max(LIMIT.url, `Use ${LIMIT.url} characters or fewer.`)
  .transform((value) => (value && !/^https?:\/\//i.test(value) ? `https://${value}` : value.replace(/^http:\/\//i, "https://")))
  .refine((value) => {
    if (!value) return true;
    try {
      return new URL(value).hostname.includes(".");
    } catch {
      return false;
    }
  }, "Paste the full address of the profile, e.g. https://www.instagram.com/…");

const photoId = z
  .string()
  .transform((value) => value || null)
  .pipe(z.uuid("The photo couldn't be read. Reload the page and try again.").nullable());

/** The Site settings form (read with readSettingsForm). Checked again on the server before saving. */
export const settingsSchema = z
  .object({
    phoneCountryCode: z.string().trim().regex(/^\d{1,4}$/, "Enter the country code, digits only (977 for Nepal)."),
    phoneNumber: z
      .string()
      .transform((value) => value.replace(/[\s()-]/g, ""))
      .pipe(z.string().regex(/^\d{6,15}$/, "Enter the phone number, digits only, without the country code.")),
    email: z.email("Enter the office email address.").max(LIMIT.email),
    officeAddress: text(LIMIT.officeAddress).min(1, "Enter where the office is, e.g. Thamel, Kathmandu, Nepal."),
    officeDays: z
      .array(z.string().regex(/^[0-6]$/))
      .transform((days) => [...new Set(days.map(Number))].sort((a, b) => a - b))
      .refine((days) => days.length > 0, "Pick the days the office is open."),
    officeOpens: time("opens"),
    officeCloses: time("closes"),
    replyLanguages: shortList(MAX_REPLY_LANGUAGES),
    legalName: text(LIMIT.legalName),
    legalForm: text(LIMIT.legalForm),
    foundedYear: optionalWholeNumber({ min: 1950, max: 2100, label: "year" }),
    tourismRegistration: text(LIMIT.registration),
    tourismLicence: text(LIMIT.registration),
    companyRegistration: text(LIMIT.registration),
    panNumber: text(LIMIT.pan),
    taanNumber: text(LIMIT.taan),
    memberships: shortList(MAX_MEMBERSHIPS),
    staffInsurer: text(LIMIT.staffInsurer),
    paymentsNote: text(LIMIT.paymentsNote),
    certificatePhotoId: photoId,
    panCertificatePhotoId: photoId,
    facebookUrl: profileLink,
    instagramUrl: profileLink,
    youtubeUrl: profileLink,
    tripadvisorUrl: profileLink,
    googleBusinessUrl: profileLink,
    linkedinUrl: profileLink,
    googleReviewUrl: profileLink,
    sharePhotoId: photoId,
  })
  .superRefine((values, context) => {
    if (values.officeOpens < values.officeCloses) return;
    context.addIssue({ code: "custom", path: ["officeCloses"], message: "The office must close after it opens." });
  }) satisfies z.ZodType<SiteSettingsValues, unknown>;

/** The Site settings form's FormData as the schema expects it. */
export const readSettingsForm = (formData: FormData) => ({
  phoneCountryCode: readText(formData, "phoneCountryCode"),
  phoneNumber: readText(formData, "phoneNumber"),
  email: readText(formData, "email"),
  officeAddress: readText(formData, "officeAddress"),
  officeDays: readList(formData, "officeDay"),
  officeOpens: readText(formData, "officeOpens"),
  officeCloses: readText(formData, "officeCloses"),
  replyLanguages: readList(formData, "replyLanguage"),
  legalName: readText(formData, "legalName"),
  legalForm: readText(formData, "legalForm"),
  foundedYear: readText(formData, "foundedYear"),
  tourismRegistration: readText(formData, "tourismRegistration"),
  tourismLicence: readText(formData, "tourismLicence"),
  companyRegistration: readText(formData, "companyRegistration"),
  panNumber: readText(formData, "panNumber"),
  taanNumber: readText(formData, "taanNumber"),
  memberships: readList(formData, "membership"),
  staffInsurer: readText(formData, "staffInsurer"),
  paymentsNote: readText(formData, "paymentsNote"),
  certificatePhotoId: readText(formData, "certificatePhotoId"),
  panCertificatePhotoId: readText(formData, "panCertificatePhotoId"),
  facebookUrl: readText(formData, "facebookUrl"),
  instagramUrl: readText(formData, "instagramUrl"),
  youtubeUrl: readText(formData, "youtubeUrl"),
  tripadvisorUrl: readText(formData, "tripadvisorUrl"),
  googleBusinessUrl: readText(formData, "googleBusinessUrl"),
  linkedinUrl: readText(formData, "linkedinUrl"),
  googleReviewUrl: readText(formData, "googleReviewUrl"),
  sharePhotoId: readText(formData, "sharePhotoId"),
});

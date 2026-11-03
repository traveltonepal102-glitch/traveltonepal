import { z } from "zod";

import { readText, switchField } from "@/lib/forms/formFields";

import type { EditSiteValues } from "../types";
import { siteName, siteUrl } from "./siteFields";

/** A site's edit form (read with readEditSiteForm). A site goes live only with an address (the database checks the same). */
export const editSiteSchema = z
  .object({
    name: siteName,
    url: siteUrl,
    isLive: switchField,
  })
  .refine((values) => !values.isLive || values.url !== "", {
    path: ["url"],
    message: "Add the website's address before switching it live.",
  }) satisfies z.ZodType<EditSiteValues, unknown>;

/** The form's FormData as the schema expects it (an off switch sends nothing). */
export const readEditSiteForm = (formData: FormData) => ({
  name: readText(formData, "name"),
  url: readText(formData, "url"),
  isLive: readText(formData, "isLive"),
});

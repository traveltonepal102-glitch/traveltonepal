import { SITE_ID_PATTERN } from "@ttn/config/sites";
import { z } from "zod";

import { readText } from "@/lib/forms/formFields";

import { SITE_LIMITS as LIMIT } from "../constants";
import type { NewSiteValues } from "../types";
import { siteName, siteUrl } from "./siteFields";

const siteId = z
  .string()
  .trim()
  .toLowerCase()
  .min(2, "Use at least 2 characters.")
  .max(LIMIT.id, `Use ${LIMIT.id} characters or fewer.`)
  .regex(SITE_ID_PATTERN, "Use lowercase letters, numbers and single dashes, like manaslu.");

/** The "Add a site" form (read with readNewSiteForm). Checked again on the server before saving. */
export const newSiteSchema = z.object({
  name: siteName,
  id: siteId,
  regionId: z.uuid("Pick the region."),
  url: siteUrl,
}) satisfies z.ZodType<NewSiteValues, unknown>;

/** The form's FormData as the schema expects it. */
export const readNewSiteForm = (formData: FormData) => ({
  name: readText(formData, "name"),
  id: readText(formData, "id"),
  regionId: readText(formData, "regionId"),
  url: readText(formData, "url"),
});

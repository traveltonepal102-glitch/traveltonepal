import { z } from "zod";

import { requiredText } from "@/lib/forms/formFields";

import { SITE_LIMITS as LIMIT, SITE_URL_PATTERN } from "../constants";

/** The website's name, shared by "Add a site" and a site's edit form. */
export const siteName = requiredText(LIMIT.name, "Enter the website's name.");

/** "" (not set up yet) or the address without a path; a trailing slash is dropped. */
export const siteUrl = z
  .string()
  .trim()
  .toLowerCase()
  .transform((value) => value.replace(/\/+$/, ""))
  .refine((value) => value === "" || SITE_URL_PATTERN.test(value), "Use the address only, starting with https://, like https://manaslutrek.com.");

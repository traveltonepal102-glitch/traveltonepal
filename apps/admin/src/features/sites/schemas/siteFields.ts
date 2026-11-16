import { SITE_CURRENCIES, SITE_LANGUAGES } from "@ttn/config/siteLanguage";
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

/** The language the website's content is typed in. */
export const siteLanguage = z.enum(SITE_LANGUAGES, "Pick the website's language.");

/** The currency of the website's prices. */
export const siteCurrency = z.enum(SITE_CURRENCIES, "Pick the website's currency.");

import { z } from "zod";

/** "/", or lowercase parts joined by "/": the same pattern and length as the database's checks. */
const PATH_PATTERN = /^\/([a-z0-9-]+(\/[a-z0-9-]+)*)?$/;
export const CANONICAL_PATH_MAX = 200;

/**
 * "Canonical address" in a Google card: another page of this website, as the part after the domain
 * ("/treks/everest-base-camp"); "" when the page is its own main version. Spaces and a final "/" are dropped. A
 * full address is refused, so a page can never point at another website.
 */
export const canonicalPathField = z
  .string()
  .trim()
  .toLowerCase()
  .refine((value) => !/^[a-z]+:\/\/|^www\./.test(value), "Use only the part after the domain, e.g. /treks/everest-base-camp.")
  .transform((value) => (value.length > 1 ? value.replace(/\/+$/, "") : value))
  .refine((value) => value === "" || value.length <= CANONICAL_PATH_MAX, `Use ${CANONICAL_PATH_MAX} characters or fewer.`)
  .refine((value) => value === "" || PATH_PATTERN.test(value), "Start with / and use lowercase letters, numbers and dashes, e.g. /treks/everest-base-camp.");

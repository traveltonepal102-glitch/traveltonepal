import { ROUTES } from "@/lib/routes";

import { COOKIES } from "./content/cookies";
import { IMPRESSUM } from "./content/impressum";
import { PRIVACY } from "./content/privacy";
import { TERMS } from "./content/terms";
import type { LegalDoc, LegalSlug } from "./types";

/** The legal pages, in menu order. */
export const LEGAL_DOCS: readonly LegalDoc[] = [TERMS, PRIVACY, IMPRESSUM, COOKIES];

export const LEGAL_PATHS: Record<LegalSlug, string> = {
  terms: ROUTES.terms,
  privacy: ROUTES.privacy,
  impressum: ROUTES.impressum,
  cookies: ROUTES.cookies,
};

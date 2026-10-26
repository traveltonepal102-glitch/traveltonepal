import { ROUTES } from "@/lib/routes";

import type { IconName } from "@ttn/ui/icon";

import type { LegalSlug } from "./types";

/** The legal pages, in menu order, with their short name and icon. */
export const LEGAL_MENU: readonly { slug: LegalSlug; label: string; icon: IconName }[] = [
  { slug: "terms", label: "Terms and booking", icon: "description" },
  { slug: "privacy", label: "Privacy", icon: "lock" },
  { slug: "impressum", label: "Impressum", icon: "verified" },
  { slug: "cookies", label: "Cookie settings", icon: "tune" },
];

export const LEGAL_PATHS: Record<LegalSlug, string> = {
  terms: ROUTES.terms,
  privacy: ROUTES.privacy,
  impressum: ROUTES.impressum,
  cookies: ROUTES.cookies,
};

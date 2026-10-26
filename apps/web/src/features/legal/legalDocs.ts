import type { IconName } from "@ttn/ui/icon";

import { ROUTES } from "@/lib/routes";

import type { LegalSlug } from "./types";

/** The legal pages, in menu order, with their short name, icon and the owner's reminder while unchecked. */
export const LEGAL_MENU: readonly { slug: LegalSlug; label: string; icon: IconName; uncheckedNote: string }[] = [
  {
    slug: "terms",
    label: "Terms and booking",
    icon: "description",
    uncheckedNote: "Template text. Have these terms checked by a lawyer, including whether EU package travel rules apply to your bookings from Germany.",
  },
  { slug: "privacy", label: "Privacy", icon: "lock", uncheckedNote: "Template text. Have this policy checked by a data protection specialist before going live." },
  { slug: "impressum", label: "Impressum", icon: "verified", uncheckedNote: "Fill in every bracket with your real company details. The Impressum must be complete and reachable from every page." },
  { slug: "cookies", label: "Cookie settings", icon: "tune", uncheckedNote: "Check that the list matches what the website loads." },
];

export const LEGAL_PATHS: Record<LegalSlug, string> = {
  terms: ROUTES.terms,
  privacy: ROUTES.privacy,
  impressum: ROUTES.impressum,
  cookies: ROUTES.cookies,
};

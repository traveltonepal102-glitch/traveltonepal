import type { TrailIconName } from "@/components/ui/TrailIcon";
import { ROUTES } from "@/lib/routes";

import type { LegalSlug } from "./types";

type LegalMenuItem = {
  slug: LegalSlug;
  path: string;
  label: string;
  icon: TrailIconName;
  /** No search value: Google follows the page's links but doesn't list it, and it stays out of the sitemap. */
  isListed: boolean;
  uncheckedNote: string;
};

/** The legal pages, in menu order. */
export const LEGAL_PAGES: readonly LegalMenuItem[] = [
  { slug: "terms", path: ROUTES.terms, label: "Terms and booking", icon: "doc", isListed: true, uncheckedNote: "Template text. Have these terms checked by a lawyer, including whether EU package travel rules apply to your bookings." },
  { slug: "privacy", path: ROUTES.privacy, label: "Privacy", icon: "lock", isListed: true, uncheckedNote: "Template text. Have this policy checked by a data protection specialist before going live." },
  { slug: "impressum", path: ROUTES.impressum, label: "Impressum", icon: "shield", isListed: false, uncheckedNote: "Fill in every bracket with your real company details. The Impressum must be complete before going live." },
  { slug: "cookies", path: ROUTES.cookies, label: "Cookie settings", icon: "tag", isListed: false, uncheckedNote: "Check that the list matches what the website loads." },
];

export const legalPage = (slug: LegalSlug) => LEGAL_PAGES.find((page) => page.slug === slug) ?? LEGAL_PAGES[0];

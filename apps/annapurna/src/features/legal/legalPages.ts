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
  { slug: "terms", path: ROUTES.terms, label: "AGB", icon: "doc", isListed: true, uncheckedNote: "Mustertext. Lassen Sie diese AGB von einem Anwalt prüfen, auch ob das EU-Pauschalreiserecht für Ihre Buchungen gilt." },
  { slug: "privacy", path: ROUTES.privacy, label: "Datenschutz", icon: "lock", isListed: true, uncheckedNote: "Mustertext. Lassen Sie diese Datenschutzerklärung vor dem Start der Website von einer Fachperson für Datenschutz prüfen." },
  { slug: "impressum", path: ROUTES.impressum, label: "Impressum", icon: "shield", isListed: false, uncheckedNote: "Ersetzen Sie jede eckige Klammer durch Ihre echten Firmendaten. Das Impressum muss vor dem Start der Website vollständig sein." },
  { slug: "cookies", path: ROUTES.cookies, label: "Cookie-Einstellungen", icon: "tag", isListed: false, uncheckedNote: "Prüfen Sie, ob die Liste mit dem übereinstimmt, was die Website lädt." },
];

export const legalPage = (slug: LegalSlug) => LEGAL_PAGES.find((page) => page.slug === slug) ?? LEGAL_PAGES[0];

import { ABOUT_PATHS, REVIEWS_PATH } from "@/lib/navigation";
import { ROUTES } from "@/lib/routes";

/** Footer link lists, as in the website design (Footer.dc.html). */
export type FooterLink = { label: string; href: string };

export const COMPANY_LINKS: readonly FooterLink[] = [
  { label: "Our story", href: ABOUT_PATHS.story },
  { label: "Our guides", href: ABOUT_PATHS.team },
  { label: "Reviews", href: REVIEWS_PATH },
  { label: "Why travel with us", href: ABOUT_PATHS.whyUs },
  { label: "FAQ", href: ABOUT_PATHS.faq },
];

export const LEGAL_LINKS: readonly FooterLink[] = [
  { label: "Privacy", href: ROUTES.privacy },
  { label: "Terms & booking", href: ROUTES.terms },
  { label: "Impressum", href: ROUTES.impressum },
  { label: "Cookie settings", href: ROUTES.cookies },
];

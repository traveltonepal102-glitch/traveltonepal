import type { SiteImageSource } from "@ttn/site-data/images";

export type SiteLink = { label: string; href: string };

/** The website's own details from the admin's Settings. Blank ones are "" and left off the page. */
export type SiteSettings = {
  phoneDisplay: string;
  phoneDigits: string;
  email: string;
  officeAddress: string;
  officeHours: string;
  legalName: string;
  legalForm: string;
  licence: string;
  tourismRegistration: string;
  panNumber: string;
  memberships: string[];
  /** null until it is typed in Settings. */
  foundedYear: number | null;
  /** The website's own share picture's folder (1200×630), for pages without a photo of their own. */
  shareImageBase?: string;
  /** The registration certificate's scan. */
  certificate?: SiteImageSource;
  social: SiteLink[];
  googleProfileUrl: string;
  googleWriteUrl: string;
  /** For the copyright line (worked out in the cached read). */
  year: number;
};

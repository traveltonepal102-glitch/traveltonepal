import type { OfficeSchedule } from "@ttn/config/contact";
import type { SiteImageSource } from "@ttn/site-data/images";

export type SiteLink = { label: string; href: string };

/** The website's own details from the admin's Settings. Blank ones are "" and left off the page. */
export type SiteSettings = {
  phoneDisplay: string;
  phoneDigits: string;
  email: string;
  officeAddress: string;
  officeHours: string;
  /** For the time difference table. */
  schedule: OfficeSchedule;
  /** The office on Google Maps; "" when not set. */
  officeMap: { url: string; embedUrl: string };
  replyLanguages: string[];
  legalName: string;
  legalForm: string;
  licence: string;
  tourismRegistration: string;
  panNumber: string;
  staffInsurer: string;
  memberships: string[];
  /** null until it is typed in Settings. */
  foundedYear: number | null;
  /** The website's own share picture's folder (1200×630), for pages without a photo of their own. */
  shareImageBase?: string;
  /** The registration certificate's scan. */
  certificate?: SiteImageSource;
  panCertificate?: SiteImageSource;
  social: SiteLink[];
  googleProfileUrl: string;
  googleWriteUrl: string;
  /** For the copyright line (worked out in the cached read). */
  year: number;
};

import type { Photo } from "@/features/photos/types";

/** Site settings as the form shows and saves them (one row: site_settings). */
export type SiteSettingsValues = {
  // Contact details
  phoneCountryCode: string;
  /** Local number, digits only (WhatsApp uses the same number). */
  phoneNumber: string;
  email: string;
  officeAddress: string;
  /** 0 = Sunday … 6 = Saturday. */
  officeDays: number[];
  /** "HH:MM", Nepal time. */
  officeOpens: string;
  officeCloses: string;
  replyLanguages: string[];
  // Company and licences
  legalName: string;
  legalForm: string;
  foundedYear: number | null;
  tourismRegistration: string;
  tourismLicence: string;
  companyRegistration: string;
  panNumber: string;
  taanNumber: string;
  memberships: string[];
  staffInsurer: string;
  paymentsNote: string;
  certificatePhotoId: string | null;
  // Social and sharing
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  tripadvisorUrl: string;
  googleBusinessUrl: string;
  linkedinUrl: string;
  /** Where trekkers write a Google review (the website's /review leads here). */
  googleReviewUrl: string;
  sharePhotoId: string | null;
};

/** The saved settings with the photos they use and when they were last saved. */
export type SiteSettings = SiteSettingsValues & {
  certificatePhoto: Photo | null;
  sharePhoto: Photo | null;
  updatedAt: string;
};

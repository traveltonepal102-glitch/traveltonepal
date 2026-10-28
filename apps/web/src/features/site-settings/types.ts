import type { ContactDetails, OfficeSchedule } from "@ttn/config/contact";

import type { SiteImageSource } from "@/lib/images";

/** Company details and licences, as typed in Site settings; a blank one is left out wherever it would show. */
export type CompanyDetails = {
  legalName: string;
  legalForm: string;
  foundedYear?: number;
  tourismRegistration: string;
  tourismLicence: string;
  companyRegistration: string;
  panNumber: string;
  taanNumber: string;
  memberships: readonly string[];
  staffInsurer: string;
  paymentsNote: string;
  /** The trekking agency licence scan, opened full size. */
  certificate?: SiteImageSource;
  /** The PAN registration certificate scan, opened full size. */
  panCertificate?: SiteImageSource;
};

export type SocialNetwork = "facebook" | "instagram" | "youtube" | "linkedin" | "tripadvisor" | "google";

/** A social profile from Site settings; `label` is the network's name, e.g. "LinkedIn". */
export type SocialProfile = { network: SocialNetwork; label: string; url: string };

/** Everything from the admin's Site settings that pages show (siteSettingsRows). */
export type SiteSettings = {
  contact: ContactDetails;
  schedule: OfficeSchedule;
  replyLanguages: readonly string[];
  company: CompanyDetails;
  social: readonly SocialProfile[];
  /** Google reviews: where trekkers write one (/review leads there) and the profile with all of them; "" when not set. */
  googleReviews: { writeUrl: string; profileUrl: string };
  /** For shared links of pages without their own photo. */
  shareImage?: SiteImageSource;
};

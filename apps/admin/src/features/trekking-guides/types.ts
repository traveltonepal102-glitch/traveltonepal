import type { Photo } from "@/features/photos/types";
import type { GuideBadgeValue } from "@/lib/supabase/database.types";

/** The badge on the guide's photo: what they are best at (one per guide). */
export type GuideBadge = GuideBadgeValue;

/** Training in "Training and certificates" (the licence is its own field). */
export type GuideCertificate = "nathm" | "wfr" | "first_aid" | "nma" | "language";

/** Everything the guide form saves (one language for the text). The website's TrekGuide is made from it. */
export type TrekkingGuideValues = {
  name: string;
  /** The guide agreed that we show their photo and name; needed before they show anywhere. */
  photoConsent: boolean;
  role: string;
  homeVillage: string;
  homeDistrict: string;
  age: number | null;
  yearsGuiding: number | null;
  badge: GuideBadge;
  languages: string[];
  regionIds: string[];
  /** Admin only, never on the website. */
  licenceNumber: string;
  /** "YYYY-MM": the licence is valid to the end of that month. */
  licenceValidUntil: string | null;
  certificates: GuideCertificate[];
  /** "YYYY-MM", only with the certificate ticked. */
  wfrValidUntil: string | null;
  firstAidValidUntil: string | null;
  bio: string;
  /** A line in the guide's own words. */
  quote: string;
  showOnAbout: boolean;
  canLeadTreks: boolean;
  canFactCheck: boolean;
};

export type TrekkingGuide = TrekkingGuideValues & {
  id: string;
  photo: Photo | null;
  /** The treks the guide is on, A–Z. */
  treks: { id: string; name: string }[];
  updatedAt: string;
};

/** What the form's Save sends (checked by guideSchema). */
export type TrekkingGuideFormValues = TrekkingGuideValues & { photoId: string | null };

export type LicenceStatus = "none" | "valid" | "expired";

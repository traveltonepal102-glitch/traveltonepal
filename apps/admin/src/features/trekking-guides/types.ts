import type { IconName } from "@ttn/ui/icon";

import type { Photo } from "@/features/photos/types";
import type { FirstAidLevel } from "@/lib/supabase/database.types";

export type FirstAid = FirstAidLevel;

/** Icon of the specialty printed on the guide's photo (the database checks the same names). */
export type SpecialtyIcon = Extract<IconName, "mountain_flag" | "temple_buddhist" | "person" | "medical_services" | "hiking" | "groups" | "landscape">;

/** Everything the guide form saves (one language for the text). The website's TrekGuide is made from it. */
export type TrekkingGuideValues = {
  name: string;
  role: string;
  /** Home village and district, e.g. "Briddim, Rasuwa". */
  home: string;
  age: number | null;
  yearsGuiding: number | null;
  /** On the photo, e.g. "Langtang local". */
  specialty: string;
  specialtyIcon: SpecialtyIcon;
  languages: string[];
  regionIds: string[];
  /** Admin only, never on the website. */
  licenceNumber: string;
  /** "YYYY-MM": the licence is valid to the end of that month. */
  licenceValidUntil: string | null;
  firstAid: FirstAid;
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

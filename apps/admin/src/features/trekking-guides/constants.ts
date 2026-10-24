import type { IconName } from "@ttn/ui/icon";

import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { GuideBadge, GuideCertificate, TrekkingGuideValues } from "./types";

export const TREKKING_GUIDES_PATH = ADMIN_SECTIONS.trekkingGuides.href;
/** The list with a guide's edit panel open (the panel lives on the list, as in the design). */
export const guidePath = (guideId: string) => `${TREKKING_GUIDES_PATH}?guide=${guideId}`;
export const NEW_GUIDE_PATH = guidePath("new");

/** The admin edits English for now; the German text comes later (trekking_guide_translations.locale). */
export const GUIDE_LOCALE = "en";

/** Hard limits, the same as the database checks (supabase/migrations/20261024170000_trekking_guides.sql). */
export const GUIDE_LIMITS = {
  name: 80,
  role: 80,
  homeVillage: 60,
  homeDistrict: 60,
  bio: 300,
  quote: 200,
  licenceNumber: 40,
  language: 30,
} as const;

export const MAX_LANGUAGES = 10;

/** "Badge on the photo" (design order). `label` is printed on the photo; "local" prints "<first region> local". */
export const GUIDE_BADGES: { value: GuideBadge; label: string; icon: IconName }[] = [
  { value: "local", label: "Local to the region", icon: "mountain_flag" },
  { value: "culture", label: "Culture guide", icon: "temple_buddhist" },
  { value: "solo", label: "Solo trekkers", icon: "person" },
  { value: "rescue", label: "Rescue trained", icon: "medical_services" },
  { value: "family", label: "Family treks", icon: "family_restroom" },
  { value: "photo", label: "Photography", icon: "image" },
];

export const GUIDE_BADGE_VALUES = ["local", "culture", "solo", "rescue", "family", "photo"] as const satisfies readonly GuideBadge[];

/** The licence as the card names it ("Cert:" line); it comes from a valid licence number, not the checklist. */
export const LICENCE_LABEL = { label: "Trekking guide licence (Department of Tourism)", short: "Govt. licence" } as const;

/**
 * "Training and certificates" (design order). `short` makes the card's "Cert:" line; `hasEndMonth` asks when it
 * runs out (an expired one no longer counts on the card).
 */
export const GUIDE_CERTIFICATES: { value: GuideCertificate; label: string; short: string; hasEndMonth: boolean }[] = [
  { value: "nathm", label: "Trekking guide training (NATHM)", short: "NATHM trained", hasEndMonth: false },
  { value: "wfr", label: "Wilderness First Responder (WFR)", short: "WFR", hasEndMonth: true },
  { value: "first_aid", label: "Basic first aid", short: "First aid", hasEndMonth: true },
  { value: "nma", label: "Mountaineering course (NMA)", short: "NMA", hasEndMonth: false },
  { value: "language", label: "Language certificate", short: "Language cert.", hasEndMonth: false },
];

export const GUIDE_CERTIFICATE_VALUES = ["nathm", "wfr", "first_aid", "nma", "language"] as const satisfies readonly GuideCertificate[];

/** Offered while typing a language; any other language can be typed. */
export const LANGUAGE_SUGGESTIONS = [
  "English",
  "Nepali",
  "German",
  "French",
  "Spanish",
  "Italian",
  "Chinese",
  "Japanese",
  "Hindi",
  "Tamang",
  "Sherpa",
  "Gurung",
  "Limbu",
  "Magar",
  "Newari",
];

/** A new guide before anything is typed (English and Nepali, as most guides speak both). */
export const EMPTY_GUIDE_VALUES: TrekkingGuideValues = {
  name: "",
  photoConsent: false,
  role: "",
  homeVillage: "",
  homeDistrict: "",
  age: null,
  yearsGuiding: null,
  badge: "local",
  languages: ["English", "Nepali"],
  regionIds: [],
  licenceNumber: "",
  licenceValidUntil: null,
  certificates: [],
  wfrValidUntil: null,
  firstAidValidUntil: null,
  bio: "",
  quote: "",
  showOnAbout: true,
  canLeadTreks: true,
  canFactCheck: false,
};

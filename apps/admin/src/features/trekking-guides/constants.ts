import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { FirstAid, SpecialtyIcon, TrekkingGuideValues } from "./types";

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
  home: 80,
  specialty: 30,
  bio: 300,
  quote: 200,
  licenceNumber: 40,
  language: 30,
} as const;

export const MAX_LANGUAGES = 10;

export const SPECIALTY_ICONS: { value: SpecialtyIcon; label: string }[] = [
  { value: "mountain_flag", label: "Mountain" },
  { value: "temple_buddhist", label: "Culture" },
  { value: "person", label: "Person" },
  { value: "medical_services", label: "First aid" },
  { value: "hiking", label: "Hiker" },
  { value: "groups", label: "Group" },
  { value: "landscape", label: "Landscape" },
];

export const SPECIALTY_ICON_VALUES = [
  "mountain_flag",
  "temple_buddhist",
  "person",
  "medical_services",
  "hiking",
  "groups",
  "landscape",
] as const satisfies readonly SpecialtyIcon[];

/** First aid training. `badge` is what the website prints on the photo (with a valid licence: "Licensed"). */
export const FIRST_AID_OPTIONS: { value: FirstAid; label: string; badge: string }[] = [
  { value: "wfr", label: "Wilderness First Responder", badge: "WFR certified" },
  { value: "basic", label: "Basic first aid", badge: "First aid" },
  { value: "none", label: "None yet", badge: "" },
];

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
  role: "",
  home: "",
  age: null,
  yearsGuiding: null,
  specialty: "",
  specialtyIcon: "mountain_flag",
  languages: ["English", "Nepali"],
  regionIds: [],
  licenceNumber: "",
  licenceValidUntil: null,
  firstAid: "none",
  bio: "",
  quote: "",
  showOnAbout: true,
  canLeadTreks: true,
  canFactCheck: false,
};

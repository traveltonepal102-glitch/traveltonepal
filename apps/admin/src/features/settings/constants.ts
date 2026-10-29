import { ADMIN_SECTIONS } from "@/features/shell/navigation";

import type { SiteSettingsValues } from "./types";

export const SETTINGS_PATH = ADMIN_SECTIONS.settings.href;

/** Hard limits, the same as the database checks (supabase/migrations/20261026120000_site_settings.sql). */
export const SETTINGS_LIMITS = {
  email: 120,
  officeAddress: 200,
  legalName: 120,
  legalForm: 80,
  registration: 60,
  pan: 40,
  taan: 40,
  item: 60,
  staffInsurer: 120,
  paymentsNote: 160,
  url: 300,
  /** Google's "Embed a map" code as pasted (the iframe), and the address kept from it. */
  mapEmbedCode: 2000,
  mapEmbedUrl: 1000,
} as const;

export const MAX_REPLY_LANGUAGES = 10;
export const MAX_MEMBERSHIPS = 10;

/** Office days in week order (0 = Sunday), as Nepal's working week starts. */
export const WEEKDAYS = [
  { value: "0", label: "Sun" },
  { value: "1", label: "Mon" },
  { value: "2", label: "Tue" },
  { value: "3", label: "Wed" },
  { value: "4", label: "Thu" },
  { value: "5", label: "Fri" },
  { value: "6", label: "Sat" },
];

/** Offered while typing a reply language or a membership; any other text works too. */
export const LANGUAGE_SUGGESTIONS = ["English", "Nepali", "German", "Hindi", "French", "Spanish", "Chinese", "Japanese"];
export const MEMBERSHIP_SUGGESTIONS = ["TAAN", "NMA", "Nepal Tourism Board", "KEEP", "PATA"];

/** The social profiles the footer and Google's business details link to. */
export const SOCIAL_FIELDS: { key: keyof Pick<SiteSettingsValues, "facebookUrl" | "instagramUrl" | "youtubeUrl" | "tripadvisorUrl" | "googleBusinessUrl" | "linkedinUrl">; label: string; placeholder: string }[] = [
  { key: "facebookUrl", label: "Facebook", placeholder: "https://www.facebook.com/…" },
  { key: "instagramUrl", label: "Instagram", placeholder: "https://www.instagram.com/…" },
  { key: "youtubeUrl", label: "YouTube", placeholder: "https://www.youtube.com/@…" },
  { key: "tripadvisorUrl", label: "Tripadvisor", placeholder: "https://www.tripadvisor.com/…" },
  { key: "googleBusinessUrl", label: "Google Business profile", placeholder: "https://g.page/…" },
  { key: "linkedinUrl", label: "LinkedIn", placeholder: "https://www.linkedin.com/company/…" },
];

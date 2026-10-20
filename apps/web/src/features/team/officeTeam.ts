import { FOUNDER } from "@/features/about/founder";

export type OfficeMember = {
  id: string;
  name: string;
  role: string;
  place: string;
  languages: readonly string[];
};

/**
 * The Kathmandu office team (the guides are in GUIDES). PLACEHOLDERS from the website design: every
 * [BRACKETED] value waits for the real person's details and photo, with their consent.
 */
export const OFFICE_TEAM: readonly OfficeMember[] = [
  { id: "founder", name: FOUNDER.name, role: FOUNDER.role, place: "Kathmandu", languages: FOUNDER.languages },
  { id: "operations", name: "[Name]", role: "Operations and safety", place: "Kathmandu", languages: ["English", "Nepali"] },
  { id: "trip-planner", name: "[Name]", role: "Trip planner (WhatsApp)", place: "Kathmandu", languages: ["English", "German", "Nepali"] },
];

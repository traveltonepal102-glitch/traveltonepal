import type { TrekGuide } from "./types";

/**
 * The guiding team. PLACEHOLDERS from the website design: every [BRACKETED] value waits for the real
 * guide's details and photo (with their consent) before launch. Moves to Payload in the CMS phase.
 */
export const GUIDES: readonly TrekGuide[] = [
  {
    id: "senior-trek-leader",
    name: "[Guide name]",
    role: "Senior trek leader",
    home: "[Village], Rasuwa",
    experience: "[38] yrs · [16]+ yrs exp",
    specialty: { label: "Langtang local", icon: "mountain_flag" },
    certBadge: "WFR certified",
    quote: "[A short line from the guide about keeping trekkers safe on this route.]",
    certifications: "[Trekking guide licence, wilderness first responder]",
    languages: ["English", "Nepali", "Tamang", "[German]"],
  },
  {
    id: "culture-specialist",
    name: "[Guide name]",
    role: "Trek and culture specialist",
    home: "[Village], Langtang",
    experience: "[34] yrs · [12]+ yrs exp",
    specialty: { label: "Culture guide", icon: "temple_buddhist" },
    certBadge: "Licensed",
    quote: "[What they love to show trekkers: monasteries, villages, viewpoints.]",
    certifications: "[Trekking guide licence]",
    languages: ["English", "Nepali", "Tamang"],
  },
  {
    id: "solo-trekker-lead",
    name: "[Guide name]",
    role: "Lead guide for solo trekkers",
    home: "[Village], Rasuwa",
    experience: "[31] yrs · [9]+ yrs exp",
    specialty: { label: "Solo trekkers", icon: "person" },
    certBadge: "First aid",
    quote: "[A short line about pacing and supporting solo travellers.]",
    certifications: "[Wilderness first aid]",
    languages: ["English", "Nepali", "[French]"],
  },
  {
    id: "safety-lead",
    name: "[Guide name]",
    role: "Safety lead",
    home: "[Village], Rasuwa",
    experience: "[42] yrs · [20]+ yrs exp",
    specialty: { label: "Rescue trained", icon: "medical_services" },
    certBadge: "WFR certified",
    quote: "[A short line about altitude checks and emergency planning.]",
    certifications: "[Advanced first aid and rescue]",
    languages: ["English", "Nepali"],
  },
];

/** The guides with these ids, in the given order; unknown ids are skipped. */
export const getGuides = (ids: readonly string[]): TrekGuide[] =>
  ids.flatMap((id) => GUIDES.find((guide) => guide.id === id) ?? []);

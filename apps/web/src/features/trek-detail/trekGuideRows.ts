import type { IconName } from "@ttn/ui/icon";

import type { TrekGuide } from "@/features/team/types";
import { coverImage } from "@/lib/images";
import { firstText } from "@/lib/rowText";
import type { WebTrekGuideRow } from "@/lib/supabase/database.types";

/** The badge on the guide's photo (the admin's "Badge on the photo"); "local" names the trek's region. */
const specialtyOf = (badge: WebTrekGuideRow["badge"], regionName: string): TrekGuide["specialty"] => {
  const specialties: Record<WebTrekGuideRow["badge"], { label: string; icon: IconName }> = {
    local: { label: `${regionName} local`, icon: "mountain_flag" },
    culture: { label: "Culture guide", icon: "temple_buddhist" },
    solo: { label: "Solo trekkers", icon: "person" },
    rescue: { label: "Rescue trained", icon: "medical_services" },
    family: { label: "Family treks", icon: "family_restroom" },
    photo: { label: "Photography", icon: "image" },
  };
  return specialties[badge];
};

/** The green tag on the photo: the strongest qualification that is valid today. */
const certBadgeOf = (row: WebTrekGuideRow) => {
  if (row.has_wfr) return "WFR certified";
  if (row.has_first_aid) return "First aid";
  if (row.is_licensed) return "Licensed";
  if (row.other_certificates.includes("nathm")) return "NATHM trained";
  return "Local guide";
};

const CERTIFICATE_NAMES: Record<string, string> = {
  nathm: "trekking guide training (NATHM)",
  nma: "mountaineering course (NMA)",
  language: "language certificate",
};

/** The "Cert:" line: what is valid today, in plain words. */
const certificationsOf = (row: WebTrekGuideRow) => {
  const names = [
    row.is_licensed && "trekking guide licence",
    row.has_wfr && "wilderness first responder",
    row.has_first_aid && "first aid",
    ...row.other_certificates.map((certificate) => CERTIFICATE_NAMES[certificate]),
  ].filter((name): name is string => Boolean(name));
  if (!names.length) return "Local trekking guide";
  const text = names.join(", ");
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** The web_trek_guides rows of one trek as "Meet your trek guide" cards, in the admin's order. */
export const toTrekGuides = (rows: readonly WebTrekGuideRow[], regionName: string, photosBaseUrl: string): TrekGuide[] =>
  rows
    .toSorted((a, b) => a.position - b.position)
    .flatMap((row): TrekGuide[] => {
      const name = firstText(row.name);
      const role = firstText(row.role);
      if (!name || !role) return [];
      return [
        {
          id: row.id,
          name,
          role,
          home: [row.home_village, row.home_district].flatMap((part) => firstText(part) ?? []).join(", ") || regionName,
          experience: row.years_guiding ? `${row.years_guiding}+ yrs guiding` : "",
          specialty: specialtyOf(row.badge, regionName),
          certBadge: certBadgeOf(row),
          quote: firstText(row.quote) ?? "",
          certifications: certificationsOf(row),
          languages: row.languages.flatMap((language) => firstText(language) ?? []),
          // A portrait: its image text is the guide's name, not where it was taken.
          photo: coverImage(row, photosBaseUrl, name, name),
        },
      ];
    });

import { coverImage } from "@ttn/site-data/images";
import type { WebTrekGuideRow, WebTrekPageRow } from "@ttn/site-data/database.types";
import { googleMapLinks } from "@ttn/site-data/googleMapLinks";
import { certBadgeOf, certificationsOf } from "@ttn/site-data/guideCredentials";
import { firstText } from "@ttn/site-data/rowText";
import { readKnowTopics, readPoints } from "@ttn/site-data/trekPageJson";

import type { HomeTrek } from "./types";

/** The words on a guide's photo (the admin's "Badge on the photo"); "local" names the trek's region. */
const badgeOf = (badge: WebTrekGuideRow["badge"], region: string) =>
  ({ local: `${region.replace(/\s+region$/i, "")} local`, culture: "Culture guide", solo: "Solo trekkers", rescue: "Rescue trained", family: "Family treks", photo: "Photography" })[badge];

/** The trek's guides in the admin's order; one without a name or role is left out. */
export const toHomeGuideTeam = (rows: readonly WebTrekGuideRow[], region: string, photosBaseUrl: string): HomeTrek["guides"]["team"] =>
  rows
    .toSorted((a, b) => a.position - b.position)
    .flatMap((row) => {
      const name = firstText(row.name);
      const role = firstText(row.role);
      if (!name || !role) return [];
      return [
        {
          id: row.id,
          name,
          role,
          home: [row.home_village, row.home_district].flatMap((part) => firstText(part) ?? []).join(", ") || region,
          experience: row.years_guiding ? `${row.years_guiding}+ years guiding` : "",
          badge: badgeOf(row.badge, region),
          certBadge: certBadgeOf(row),
          quote: firstText(row.quote) ?? "",
          certifications: certificationsOf(row),
          languages: row.languages.flatMap((language) => firstText(language) ?? []),
          // A portrait: its image text is the guide's name, not where it was taken.
          photo: coverImage(row, photosBaseUrl, name, name),
        },
      ];
    });

/** The map from its My Maps id, else the place; null when the trek has neither. */
export const toHomeRouteMap = (page: WebTrekPageRow, pdfUrl: string | undefined, shortName: string): HomeTrek["routeMap"] => {
  const myMapsId = page.my_maps_id?.trim() || undefined;
  const place = page.map_place?.trim() ?? "";
  if (!myMapsId && !place) return null;
  return { heading: firstText(page.route_map_heading) ?? `${shortName} route map`, pdfUrl, ...googleMapLinks({ place, myMapsId }) };
};

/** What meals cost and how they work on the trail; null when the trek says nothing about it. */
export const toHomeMeals = (page: WebTrekPageRow): HomeTrek["meals"] => {
  const trailTips = readPoints(page.meal_trail_tips);
  const teahouseNotes = readPoints(page.meal_teahouse_notes);
  const { meal_budget_min_usd: min, meal_budget_max_usd: max } = page;
  const budget = min && max ? { min, max } : null;
  return budget || trailTips.length || teahouseNotes.length ? { budget, trailTips, teahouseNotes } : null;
};

/** The field guide's topics, each with its photo when it has one. */
export const toHomeFieldGuide = (page: WebTrekPageRow, trekName: string, photosBaseUrl: string): HomeTrek["fieldGuide"] => ({
  heading: firstText(page.know_heading) ?? `${trekName} guide: best season, facilities and safety`,
  intro: page.know_intro.trim(),
  topics: readKnowTopics(page.know_topics).map(({ title, body, note, photo }) => ({
    title,
    body,
    note,
    photo: photo ? coverImage(photo, photosBaseUrl, title) : undefined,
  })),
});

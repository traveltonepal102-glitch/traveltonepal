import { toSiteCurrency } from "@ttn/config/siteLanguage";
import { coverImage } from "@ttn/site-data/images";
import type { WebTrekGuideRow, WebTrekPageRow } from "@ttn/site-data/database.types";
import { googleMapLinks } from "@ttn/site-data/googleMapLinks";
import { certBadgeOf, certificationsOf } from "@ttn/site-data/guideCredentials";
import { firstText } from "@ttn/site-data/rowText";
import { readKnowTopics, readPoints } from "@ttn/site-data/trekPageJson";
import { toRichTextDoc } from "@ttn/ui/lib/richText";

import type { HomeTrek } from "./types";
import { SITE_LANGUAGE } from "@/lib/site";

/** The words on a guide's photo (the admin's "Badge on the photo"); "local" names the trek's region, without the word "Region". */
const badgeOf = (badge: WebTrekGuideRow["badge"], region: string) =>
  ({ local: `aus der Region ${region.replace(/[\s-]+region$/i, "").replace(/^region\s+/i, "")}`, culture: "Kulturguide", solo: "Für Alleinreisende", rescue: "Rettungsausbildung", family: "Familientreks", photo: "Fotografie" })[badge];

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
          experience: row.years_guiding ? `${row.years_guiding}+ Jahre als Guide` : "",
          badge: badgeOf(row.badge, region),
          certBadge: certBadgeOf(row, SITE_LANGUAGE),
          quote: firstText(row.quote) ?? "",
          certifications: certificationsOf(row, SITE_LANGUAGE),
          languages: row.languages.flatMap((language) => firstText(language) ?? []),
          // A portrait: its image text is the guide's name, not where it was taken.
          photo: coverImage(row, photosBaseUrl, name, name),
        },
      ];
    });

/** The map from its My Maps id, else the place; null when the trek has neither. */
type RouteFiles = { pdfUrl?: string; gpxUrl?: string };

export const toHomeRouteMap = (page: WebTrekPageRow, files: RouteFiles, shortName: string): HomeTrek["routeMap"] => {
  const myMapsId = page.my_maps_id?.trim() || undefined;
  const place = page.map_place?.trim() ?? "";
  if (!myMapsId && !place) return null;
  return { heading: firstText(page.route_map_heading) ?? `Routenkarte ${shortName}`, line: toRichTextDoc(page.route_map_line), ...files, ...googleMapLinks({ place, myMapsId }) };
};

/** What meals cost and how they work on the trail; null when the trek says nothing about it. */
export const toHomeMeals = (page: WebTrekPageRow): HomeTrek["meals"] => {
  const trailTips = readPoints(page.meal_trail_tips);
  const teahouseNotes = readPoints(page.meal_teahouse_notes);
  const { meal_budget_min: min, meal_budget_max: max } = page;
  const budget = min && max ? { min, max, currency: toSiteCurrency(page.currency) } : null;
  return budget || trailTips.length || teahouseNotes.length ? { budget, trailTips, teahouseNotes } : null;
};

/** The field guide's topics, each with its photo when it has one. */
export const toHomeFieldGuide = (page: WebTrekPageRow, trekName: string, photosBaseUrl: string): HomeTrek["fieldGuide"] => ({
  heading: firstText(page.know_heading) ?? `${trekName}: beste Reisezeit, Versorgung und Sicherheit`,
  intro: page.know_intro.trim(),
  topics: readKnowTopics(page.know_topics).map(({ title, body, note, photo }) => ({
    title,
    body,
    note,
    photo: photo ? coverImage(photo, photosBaseUrl, title) : undefined,
  })),
});

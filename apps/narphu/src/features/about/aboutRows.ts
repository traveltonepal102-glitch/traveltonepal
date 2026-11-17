import { PHOTO_PLACES, fieldOf, flexibleOf, honestOf, listenOf, openMindOf, paragraphsOf, photosByPlace, safetyOf, sectionObject, titledList } from "@ttn/site-data/aboutRows";
import type { WebAboutTeamRow, WebSitePageRow } from "@ttn/site-data/database.types";
import { coverImage } from "@ttn/site-data/images";
import { readPageRichText } from "@ttn/site-data/pageRichText";

import { toSitePageTop } from "@/features/site-pages/sitePageRows";
import { SITE_NAME } from "@/lib/site";

import type { AboutContent, TeamMember } from "./types";

/** The web_site_pages row of the About page, as the page shows it; broken or empty items are left out. */
export const toAboutContent = (row: WebSitePageRow, photosBaseUrl: string): AboutContent => {
  const content = sectionObject(row.content);
  const field = (key: string) => fieldOf(content, key);
  const photoAt = photosByPlace(row.story_photos, photosBaseUrl, SITE_NAME);
  const founderName = row.founder_name?.trim();
  const founderRole = row.founder_role?.trim() ?? "";
  const statValue = field("statValue");
  const statLabel = field("statLabel");

  return {
    top: toSitePageTop(row, photosBaseUrl, `${SITE_NAME}'s team`),
    trekkersGuided: field("trekkersGuided"),
    trekkingRegions: field("trekkingRegions"),
    stat: statValue && statLabel ? { value: statValue, label: statLabel } : undefined,
    safetyLine: { lead: field("safetyLead"), text: field("safetyText") },
    listen: listenOf(content.listen),
    honest: honestOf(content.honest),
    flexible: flexibleOf(content.flexible, photoAt),
    openMind: openMindOf(content.openMind, photoAt),
    safety: safetyOf(content.safety),
    story: {
      heading: field("storyHeading"),
      body: readPageRichText(content.storyText ?? content.story),
      quote: field("quote"),
      origin: field("founderOrigin"),
      photo: photoAt(PHOTO_PLACES.founder, founderName ? `${founderName}, ${founderRole || `founder of ${SITE_NAME}`}` : ""),
      goals: titledList(content.goals),
      voice: { eyebrow: field("voiceEyebrow"), heading: field("voiceHeading"), paragraphs: paragraphsOf(field("voiceText")) },
    },
    founder: founderName ? { name: founderName, role: founderRole } : undefined,
    headings: {
      team: { title: field("teamHeading"), text: field("teamIntro") },
      licences: { title: field("licencesHeading"), text: field("licencesIntro") },
    },
  };
};

/**
 * The team this website shows: the office, and only the guides who lead its own treks (the people are shared by all the
 * websites, and a Sherpa from Everest doesn't lead a Manaslu trek). The office first, then the most experienced.
 */
export const toTeam = (rows: readonly WebAboutTeamRow[], ownGuideIds: ReadonlySet<string>, photosBaseUrl: string): TeamMember[] =>
  rows
    .filter((row) => row.team_group === "office" || ownGuideIds.has(row.id))
    .toSorted((a, b) => a.sort_group - b.sort_group || b.years_guiding - a.years_guiding || a.name.localeCompare(b.name))
    .map((row) => ({ id: row.id, name: row.name, role: row.role, place: row.place, languages: row.languages, group: row.team_group, photo: coverImage(row, photosBaseUrl, row.name, row.name) }));

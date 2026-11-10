import { isIconName } from "@ttn/ui/icon";
import { z } from "zod";

import type { IconTone } from "@/components/shared/iconTones";
import { readPageRichText } from "@/features/site-pages/pageRichText";
import { toSitePageTop } from "@/features/site-pages/sitePageRows";
import { coverImage } from "@/lib/images";
import { listOf } from "@/lib/jsonList";
import type { WebAboutTeamRow, WebSitePageRow } from "@/lib/supabase/database.types";
import { SITE_NAME } from "@/lib/site";

import { PHOTO_PLACES, fieldOf, flexibleOf, honestOf, linesOf, listenOf, openMindOf, paragraphsOf, photosByPlace, safetyOf, sectionObject, text, titledList } from "./aboutBeliefRows";
import type { AboutPageContent, Founder, TeamMember } from "./types";

const promiseSchema = z.object({ icon: z.string().catch(""), title: z.string().trim().min(1), text });
/** The promises take their icon tile colours from their place in the row (the design's order). */
const PROMISE_TONES: readonly IconTone[] = ["brand", "saffron", "green", "navy", "green", "saffron"];
const MAX_PROMISES = 6;

const founderOf = (row: WebSitePageRow, photosBaseUrl: string): Founder | undefined => {
  const name = row.founder_name?.trim();
  if (!name) return undefined;
  const photo = row.founder_photo_id && row.founder_photo_variant_widths?.length
    ? {
        src: `${photosBaseUrl}/${row.founder_photo_id}`,
        alt: name,
        variantWidths: row.founder_photo_variant_widths,
        fileName: row.founder_photo_file_name || undefined,
        placeholder: row.founder_photo_placeholder || undefined,
      }
    : undefined;
  return { name, shortName: name.split(/\s+/)[0] ?? name, role: row.founder_role?.trim() ?? "", photo };
};

/** The web_site_pages row of the About page, as the page shows it; broken or empty items are left out. */
export const toAboutPage = (row: WebSitePageRow, photosBaseUrl: string): AboutPageContent => {
  const content = sectionObject(row.content);
  const field = (key: string) => fieldOf(content, key);
  const photoAt = photosByPlace(row.story_photos, photosBaseUrl, SITE_NAME);
  const founder = founderOf(row, photosBaseUrl);
  const statValue = field("statValue");
  const statLabel = field("statLabel");

  return {
    top: toSitePageTop(row, photosBaseUrl, `${SITE_NAME}'s team`),
    trekkersGuided: field("trekkersGuided"),
    stat: statValue && statLabel ? { value: statValue, label: statLabel } : undefined,
    safetyLine: { lead: field("safetyLead"), text: field("safetyText") },
    listen: listenOf(content.listen),
    honest: honestOf(content.honest),
    flexible: flexibleOf(content.flexible, photoAt),
    openMind: openMindOf(content.openMind, photoAt),
    safety: safetyOf(content.safety),
    story: {
      heading: field("storyHeading"),
      teaser: linesOf(field("storyTeaser")),
      body: readPageRichText(content.storyText ?? content.story),
      quote: field("quote"),
      origin: field("founderOrigin"),
      photo: photoAt(PHOTO_PLACES.founder, founder ? `${founder.name}, ${founder.role || `founder of ${SITE_NAME}`}` : ""),
      goals: titledList(content.goals),
      voice: { eyebrow: field("voiceEyebrow"), heading: field("voiceHeading"), paragraphs: paragraphsOf(field("voiceText")) },
    },
    founder,
    promises: listOf(content.promises, promiseSchema)
      .slice(0, MAX_PROMISES)
      .map((promise, index) => ({
        title: promise.title,
        text: promise.text,
        icon: isIconName(promise.icon) ? promise.icon : "verified",
        tone: PROMISE_TONES[index % PROMISE_TONES.length],
      })),
    headings: {
      team: { title: field("teamHeading"), text: field("teamIntro") },
      licences: { title: field("licencesHeading"), text: field("licencesIntro") },
    },
  };
};

/** The web_about_team rows as team cards: the office first, then the guides, the most experienced first. */
export const toAboutTeam = (rows: readonly WebAboutTeamRow[], photosBaseUrl: string): TeamMember[] =>
  [...rows]
    .sort((a, b) => a.sort_group - b.sort_group || b.years_guiding - a.years_guiding || a.name.localeCompare(b.name))
    .map((row) => ({
      id: row.id,
      name: row.name,
      role: row.role,
      place: row.place,
      languages: row.languages,
      group: row.team_group,
      photo: coverImage(row, photosBaseUrl, row.name, row.name),
    }));

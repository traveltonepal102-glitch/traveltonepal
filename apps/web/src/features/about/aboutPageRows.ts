import { isIconName } from "@ttn/ui/icon";
import type { IconName } from "@ttn/ui/icon";
import { photoAltText } from "@ttn/ui/lib/photos";
import { z } from "zod";

import type { IconTone } from "@/components/shared/iconTones";
import { readPageRichText } from "@/features/site-pages/pageRichText";
import { toSitePageTop } from "@/features/site-pages/sitePageRows";
import type { SiteImageSource } from "@/lib/images";
import { coverImage } from "@/lib/images";
import { listOf } from "@/lib/jsonList";
import type { WebAboutTeamRow, WebSitePageRow } from "@/lib/supabase/database.types";
import { SITE_NAME } from "@/lib/site";

import type { AboutPageContent, Founder, TeamMember } from "./types";

const text = z.string().trim().catch("");

const contentSchema = z.object({
  trekkersGuided: text,
  storyHeading: text,
  storyTeaser: text,
  storyText: z.unknown().optional(),
  story: z.unknown().optional(),
  quote: text,
  promisesHeading: text,
  promisesIntro: text,
  teamHeading: text,
  teamIntro: text,
  reviewsHeading: text,
  licencesHeading: text,
  licencesIntro: text,
  milestones: z.unknown().optional(),
  promises: z.unknown().optional(),
});

const milestoneSchema = z.object({ year: text, title: z.string().trim().min(1), text });
const promiseSchema = z.object({ icon: z.string().catch(""), title: z.string().trim().min(1), text });
const storyPhotoSchema = z.object({ id: z.string().min(1), variant_widths: z.array(z.number()).min(1), placeholder: z.string().nullable().catch(null), place: z.string().nullable().catch(null) });

/** Milestones and promises take their icon tile colours from their place in the row (the design's order). */
const MILESTONE_STYLES: readonly { icon: IconName; tone: IconTone }[] = [
  { icon: "flag", tone: "saffron" },
  { icon: "verified", tone: "green" },
  { icon: "landscape", tone: "brand" },
  { icon: "groups", tone: "navy" },
];
const PROMISE_TONES: readonly IconTone[] = ["brand", "saffron", "green", "navy", "green", "saffron"];

const MAX_MILESTONES = 4;
const MAX_PROMISES = 6;

const founderOf = (row: WebSitePageRow, photosBaseUrl: string): Founder | undefined => {
  const name = row.founder_name?.trim();
  if (!name) return undefined;
  const photo = row.founder_photo_id && row.founder_photo_variant_widths?.length
    ? { src: `${photosBaseUrl}/${row.founder_photo_id}`, alt: name, variantWidths: row.founder_photo_variant_widths, placeholder: row.founder_photo_placeholder || undefined }
    : undefined;
  return { name, shortName: name.split(/\s+/)[0] ?? name, role: row.founder_role?.trim() ?? "", photo };
};

const storyPhotosOf = (value: unknown, photosBaseUrl: string): SiteImageSource[] =>
  listOf(value, storyPhotoSchema).map((photo) => ({
    src: `${photosBaseUrl}/${photo.id}`,
    alt: photoAltText({ place: photo.place ?? "" }, SITE_NAME),
    variantWidths: photo.variant_widths,
    placeholder: photo.placeholder || undefined,
  }));

/** The web_site_pages row of the About page, as the page shows it; broken or empty items are left out. */
export const toAboutPage = (row: WebSitePageRow, photosBaseUrl: string): AboutPageContent => {
  const content = contentSchema.catch(contentSchema.parse({})).parse(row.content ?? {});
  return {
    top: toSitePageTop(row, photosBaseUrl, `${SITE_NAME}'s team`),
    trekkersGuided: content.trekkersGuided,
    story: {
      heading: content.storyHeading,
      teaser: content.storyTeaser,
      body: readPageRichText(content.storyText ?? content.story),
      quote: content.quote,
      photos: storyPhotosOf(row.story_photos, photosBaseUrl),
    },
    founder: founderOf(row, photosBaseUrl),
    milestones: listOf(content.milestones, milestoneSchema)
      .slice(0, MAX_MILESTONES)
      .map((milestone, index) => ({ ...milestone, ...MILESTONE_STYLES[index % MILESTONE_STYLES.length] })),
    promises: listOf(content.promises, promiseSchema)
      .slice(0, MAX_PROMISES)
      .map((promise, index) => ({
        title: promise.title,
        text: promise.text,
        icon: isIconName(promise.icon) ? promise.icon : "verified",
        tone: PROMISE_TONES[index % PROMISE_TONES.length],
      })),
    headings: {
      promises: { title: content.promisesHeading, text: content.promisesIntro },
      team: { title: content.teamHeading, text: content.teamIntro },
      reviews: { title: content.reviewsHeading, text: "" },
      licences: { title: content.licencesHeading, text: content.licencesIntro },
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

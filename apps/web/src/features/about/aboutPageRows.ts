import { isIconName } from "@ttn/ui/icon";
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

import { beliefOf, fieldOf, honestOf, listenOf, paragraphsOf, safetyOf, sectionObject, text, titledList } from "./aboutBeliefRows";
import type { AboutFlexible, AboutOpenMind, AboutPageContent, Founder, TeamMember } from "./types";

const promiseSchema = z.object({ icon: z.string().catch(""), title: z.string().trim().min(1), text });
const pagePhotoSchema = z.object({
  id: z.string().min(1),
  variant_widths: z.array(z.number()).min(1),
  file_name: z.string().nullable().catch(null),
  placeholder: z.string().nullable().catch(null),
  place: z.string().nullable().catch(null),
  position: z.number().int(),
});

/** The page's photos by place (site_page_photos.position): 1 the founder, 2 "flexible", 3–5 the villages. */
const PHOTO_PLACES = { founder: 1, flexible: 2, places: [3, 4, 5] } as const;

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

/** A function giving the photo at a place, described by `alt` (or by where it was taken). */
const photosByPlace = (value: unknown, photosBaseUrl: string) => {
  const photos = listOf(value, pagePhotoSchema);
  return (position: number, alt: string): SiteImageSource | undefined => {
    const photo = photos.find((item) => item.position === position);
    if (!photo) return undefined;
    return {
      src: `${photosBaseUrl}/${photo.id}`,
      alt: alt || photoAltText({ place: photo.place ?? "" }, SITE_NAME),
      variantWidths: photo.variant_widths,
      fileName: photo.file_name || undefined,
      placeholder: photo.placeholder || undefined,
    };
  };
};

type PhotoAt = ReturnType<typeof photosByPlace>;

const flexibleOf = (value: unknown, photoAt: PhotoAt): AboutFlexible => {
  const section = sectionObject(value);
  const photoCaption = fieldOf(section, "photoCaption");
  return {
    ...beliefOf(section),
    quoteNote: fieldOf(section, "quoteNote"),
    photo: photoAt(PHOTO_PLACES.flexible, photoCaption),
    photoCaption,
    stagesHeading: fieldOf(section, "stagesHeading"),
    stages: titledList(section.stages),
    limits: { lead: fieldOf(section, "limitsLead"), text: fieldOf(section, "limitsText") },
  };
};

const openMindOf = (value: unknown, photoAt: PhotoAt): AboutOpenMind => {
  const section = sectionObject(value);
  const places = listOf(section.places, z.object({ title: text, text }).catch({ title: "", text: "" }));
  return {
    ...beliefOf(section),
    more: paragraphsOf(fieldOf(section, "more")),
    quoteNote: fieldOf(section, "quoteNote"),
    // A village shows with its photo only (the photo places follow the villages' order).
    places: PHOTO_PLACES.places.flatMap((position, index) => {
      const place = places[index];
      const photo = place?.title ? photoAt(position, `${place.title}: ${place.text}`) : undefined;
      return place && photo ? [{ ...place, photo }] : [];
    }),
    inviteHeading: fieldOf(section, "inviteHeading"),
    invites: titledList(section.invites),
    inviteNote: fieldOf(section, "inviteNote"),
  };
};

/** The web_site_pages row of the About page, as the page shows it; broken or empty items are left out. */
export const toAboutPage = (row: WebSitePageRow, photosBaseUrl: string): AboutPageContent => {
  const content = sectionObject(row.content);
  const field = (key: string) => fieldOf(content, key);
  const photoAt = photosByPlace(row.story_photos, photosBaseUrl);
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
      teaser: field("storyTeaser"),
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
